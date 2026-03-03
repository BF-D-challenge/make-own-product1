import { execFile } from "child_process";
import { promisify } from "util";
import { createClient } from "@supabase/supabase-js";
import { generateSMSMessage } from "@/lib/anthropic";

const execFileAsync = promisify(execFile);

// ── Supabase admin client (service role, bypasses RLS) ───────────────────────
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createClient(url, key);
}

// ── iMessage via AppleScript ─────────────────────────────────────────────────
// Works only on macOS with Messages.app signed into iMessage.
// On Vercel (Linux) this path is skipped — swap for Twilio/CoolSMS when deploying.

function escapeAppleScript(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function sendIMessage(to: string, body: string): Promise<void> {
  const script = [
    'tell application "Messages"',
    "  set targetService to 1st account whose service type = iMessage",
    `  set targetBuddy to participant "${escapeAppleScript(to)}" of targetService`,
    `  send "${escapeAppleScript(body)}" to targetBuddy`,
    "end tell",
  ].join("\n");

  await execFileAsync("osascript", ["-e", script]);
}

// ── CoolSMS ──────────────────────────────────────────────────────────────────
import { createHmac, randomBytes } from "crypto";

function coolsmsAuthHeader(): string {
  const apiKey = process.env.COOLSMS_API_KEY!;
  const apiSecret = process.env.COOLSMS_API_SECRET!;
  const date = new Date().toISOString();
  const salt = randomBytes(8).toString("hex"); // 16자 hex
  const signature = createHmac("sha256", apiSecret)
    .update(date + salt)
    .digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

export async function sendViaCoolSMS(to: string, body: string): Promise<void> {
  const from = process.env.COOLSMS_SENDER_NUMBER;
  if (!process.env.COOLSMS_API_KEY || !process.env.COOLSMS_API_SECRET || !from) {
    throw new Error("CoolSMS credentials not configured");
  }

  // CoolSMS: SMS ≤ 90 bytes (한글 45자), 초과 시 LMS
  const byteLen = Buffer.byteLength(body, "utf8");
  const type = byteLen <= 90 ? "SMS" : "LMS";

  const res = await fetch("https://api.coolsms.co.kr/messages/v4/send", {
    method: "POST",
    headers: {
      Authorization: coolsmsAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: { to, from, text: body, type } }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`CoolSMS error: ${err.errorCode} ${err.errorMessage}`);
  }
}

// ── Public types ─────────────────────────────────────────────────────────────
export interface SendSMSParams {
  workflowId: string;
  recipientPhone: string; // phone number or iMessage email
  messagePrompt: string;
}

export interface SendSMSResult {
  success: boolean;
  message: string;
  sid?: string;
  error?: string;
}

/**
 * Core pipeline:
 * 1. Generate a personalized message with Claude (Haiku)
 * 2. Send via iMessage (macOS) — or Twilio when deploying to Linux/Vercel
 * 3. Log result to Supabase message_logs
 * 4. Update workflow.last_sent_at on success
 */
export async function generateAndSendSMS({
  workflowId,
  recipientPhone,
  messagePrompt,
}: SendSMSParams): Promise<SendSMSResult> {
  const supabase = getSupabaseAdmin();
  let messageBody = "";
  let status: "sent" | "failed" = "failed";
  let errorMsg: string | undefined;

  try {
    // Step 1 — Generate with Claude
    messageBody = await generateSMSMessage(messagePrompt);

    // Step 2 — Send (CoolSMS on Vercel, iMessage on macOS)
    const hasCoolSMS = !!(process.env.COOLSMS_API_KEY && process.env.COOLSMS_SENDER_NUMBER);
    if (hasCoolSMS) {
      await sendViaCoolSMS(recipientPhone, messageBody);
    } else if (process.platform === "darwin") {
      await sendIMessage(recipientPhone, messageBody);
    } else {
      throw new Error("No SMS provider configured. Set COOLSMS env vars.");
    }

    status = "sent";
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[send-message] Failed for ${recipientPhone}:`, errorMsg);
  }

  // Step 3 — Log to Supabase (always, even on failure)
  await supabase.from("message_logs").insert({
    workflow_id: workflowId,
    recipient: recipientPhone,
    message_body: messageBody,
    status,
    sent_at: new Date().toISOString(),
  });

  // Step 4 — Update last_sent_at on success
  if (status === "sent") {
    await supabase
      .from("workflows")
      .update({ last_sent_at: new Date().toISOString() })
      .eq("id", workflowId);
  }

  return { success: status === "sent", message: messageBody, error: errorMsg };
}
