import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";
import { sendViaTwilio, sendViaCoolSMS } from "@/lib/sms";
import { createVerifyToken } from "@/lib/verifyToken";
import { BFD_SYSTEM_PROMPT } from "@/lib/prompts";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function sendSMS(to: string, body: string): Promise<void> {
  if (process.env.TWILIO_ACCOUNT_SID) return sendViaTwilio(to, body);
  return sendViaCoolSMS(to, body);
}

// Twilio sends application/x-www-form-urlencoded; CoolSMS sends JSON
export async function POST(req: NextRequest) {
  try {
    let from: string;
    let body: string;

    const raw = await req.text();
    const params = new URLSearchParams(raw);
    if (params.has("From")) {
      // Twilio: application/x-www-form-urlencoded
      from = params.get("From") ?? "";
      body = params.get("Body") ?? "";
    } else {
      // CoolSMS: JSON
      const data = JSON.parse(raw);
      from = data.from as string;
      body = data.text as string;
    }

    if (!from || !body?.trim()) {
      return new NextResponse("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Onboarding trigger: "안녕 베프디" → send verify link
    const normalized = body.trim().replace(/\s/g, "");
    if (normalized.includes("안녕베프디")) {
      const token = createVerifyToken(from);
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000");
      const verifyUrl = `${siteUrl}/verify?token=${token}`;
      const welcomeMsg = `안녕! 나 베프디야 😊\n아래 링크를 눌러서 구글로 로그인하면 바로 시작할 수 있어!\n${verifyUrl}`;
      await sendSMS(from, welcomeMsg);
      return new NextResponse("<Response></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    const supabase = getSupabaseAdmin();

    // Load last 10 turns for this phone number
    const { data: logs } = await supabase
      .from("chat_logs")
      .select("role, content")
      .eq("user_id", from)
      .order("created_at", { ascending: false })
      .limit(10);

    const history = (logs ?? []).reverse().map((r) => ({
      role: r.role as "user" | "assistant",
      content: r.content,
    }));

    // Generate reply with Claude
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: BFD_SYSTEM_PROMPT + "\nSMS라 1-3문장으로 짧게.",
      messages: [...history, { role: "user", content: body.trim() }],
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    await sendSMS(from, reply);

    // Log conversation to Supabase
    await supabase.from("chat_logs").insert([
      { user_id: from, role: "user", content: body.trim() },
      { user_id: from, role: "assistant", content: reply },
    ]);

    return new NextResponse("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("[POST /api/sms/incoming]", err);
    return new NextResponse("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
