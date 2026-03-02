import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], userId = "demo-user" } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Build message history for Claude (last 20 turns for context)
    const messages: ChatMessage[] = [
      ...history.slice(-20),
      { role: "user", content: message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system:
        "You are BF.D — a warm, thoughtful AI best friend. You are caring, funny, and genuinely interested in the user's life. " +
        "Keep responses conversational and natural, like texting with a close friend. " +
        "Be supportive, ask follow-up questions, and remember context from the conversation. " +
        "Respond in the same language the user uses (Korean or English).",
      messages,
    });

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Log to Supabase
    const supabase = getSupabaseAdmin();
    await supabase.from("chat_logs").insert([
      { user_id: userId, role: "user", content: message },
      { user_id: userId, role: "assistant", content: assistantMessage },
    ]);

    return NextResponse.json({ message: assistantMessage });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Internal server error";
    console.error("[POST /api/chat]", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
