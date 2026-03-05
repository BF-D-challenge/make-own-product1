import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";
import { sendViaCoolSMS } from "@/lib/sms";
import { createVerifyToken } from "@/lib/verifyToken";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// CoolSMS sends JSON POST to this endpoint when a message is received
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // CoolSMS webhook payload: { from, text, type, ... }
    const from = data.from as string;
    const body = data.text as string;

    if (!from || !body?.trim()) {
      return NextResponse.json({ ok: true });
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
      await sendViaCoolSMS(from, welcomeMsg);
      return NextResponse.json({ ok: true });
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
      system:
        "You are BF.D — a warm, caring AI best friend. " +
        "You're texting via SMS so keep replies short (1-3 sentences). " +
        "Be natural, funny, and genuinely interested. " +
        "Respond in the same language the user uses (Korean or English).",
      messages: [...history, { role: "user", content: body.trim() }],
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Send reply via CoolSMS
    await sendViaCoolSMS(from, reply);

    // Log conversation to Supabase
    await supabase.from("chat_logs").insert([
      { user_id: from, role: "user", content: body.trim() },
      { user_id: from, role: "assistant", content: reply },
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/sms/incoming]", err);
    return NextResponse.json({ ok: true }); // always return 200 to CoolSMS
  }
}
