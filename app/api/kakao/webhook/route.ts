import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";
import {
  buildSimpleTextResponse,
  verifyKakaoSignature,
  type KakaoWebhookPayload,
} from "@/lib/kakao";
import type Anthropic from "@anthropic-ai/sdk";

// Vercel Edge에서도 Node.js crypto 사용 가능하도록 명시
export const runtime = "nodejs";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const SYSTEM_PROMPT =
  "You are BF.D — a warm, thoughtful AI best friend communicating via KakaoTalk. " +
  "Be caring, funny, and genuinely interested in the user's life. " +
  "Keep responses conversational and natural, like chatting with a close friend on KakaoTalk. " +
  "Be supportive, ask follow-up questions, and remember context from the conversation. " +
  "Respond in the same language the user uses (Korean or English). " +
  "Keep replies concise — 1 to 4 sentences is ideal for a chat context.";

const HISTORY_LIMIT = 20; // 불러올 최근 대화 턴 수
const MAX_TOKENS = 400;

export async function POST(req: NextRequest) {
  // 1. Raw body 읽기 (서명 검증에 필요)
  const rawBody = await req.text();

  // 2. 카카오 웹훅 서명 검증
  const signature = req.headers.get("X-Kakao-Signature");
  if (!verifyKakaoSignature(rawBody, signature)) {
    console.warn("[kakao/webhook] 서명 검증 실패");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. JSON 파싱
  let payload: KakaoWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const utterance = payload.userRequest?.utterance?.trim();
  const kakaoUserId = payload.userRequest?.user?.id;

  if (!utterance || !kakaoUserId) {
    // 빈 메시지 — 카카오 플랫폼에 정상 응답 반환
    return NextResponse.json(buildSimpleTextResponse("..."), { status: 200 });
  }

  const supabase = getSupabaseAdmin();

  try {
    // 4. 대화 히스토리 로드 (최근 N턴)
    const { data: logs, error: fetchError } = await supabase
      .from("kakao_conversations")
      .select("role, content")
      .eq("kakao_user_id", kakaoUserId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_LIMIT);

    if (fetchError) {
      console.error("[kakao/webhook] 히스토리 로드 실패:", fetchError.message);
    }

    const history: Anthropic.MessageParam[] = (logs ?? [])
      .reverse()
      .map((r) => ({
        role: r.role as "user" | "assistant",
        content: r.content as string,
      }));

    // 5. Claude API 호출
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [...history, { role: "user", content: utterance }],
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    // 6. 대화 로그 저장 (비동기, 응답 블로킹 없음)
    supabase
      .from("kakao_conversations")
      .insert([
        {
          kakao_user_id: kakaoUserId,
          kakao_user_type: payload.userRequest.user.type,
          role: "user",
          content: utterance,
          bot_id: payload.bot?.id ?? null,
        },
        {
          kakao_user_id: kakaoUserId,
          kakao_user_type: payload.userRequest.user.type,
          role: "assistant",
          content: reply,
          bot_id: payload.bot?.id ?? null,
        },
      ])
      .then(({ error }) => {
        if (error) {
          console.error("[kakao/webhook] 대화 저장 실패:", error.message);
        }
      });

    // 7. 카카오 OpenBuilder 응답 반환
    return NextResponse.json(buildSimpleTextResponse(reply), { status: 200 });
  } catch (err) {
    console.error("[kakao/webhook]", err);

    // 에러 시에도 카카오 포맷으로 응답 (서버 오류가 사용자에게 보임)
    return NextResponse.json(
      buildSimpleTextResponse("잠깐, 나 지금 좀 버벅이고 있어 😅 다시 말해줄 수 있어?"),
      { status: 200 }
    );
  }
}
