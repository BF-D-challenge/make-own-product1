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

    // Step 2 — Send
    const isMac = process.platform === "darwin";
    if (isMac) {
      await sendIMessage(recipientPhone, messageBody);
    } else {
      // TODO: replace with Twilio/CoolSMS for Vercel deployment
      throw new Error(
        "iMessage is only available on macOS. Configure Twilio for server deployment."
      );
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
