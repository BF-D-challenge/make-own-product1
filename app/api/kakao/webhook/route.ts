import { NextRequest, NextResponse, after } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { createClient } from "@supabase/supabase-js";
import {
  buildSimpleTextResponse,
  verifyKakaoSignature,
  type KakaoWebhookPayload,
} from "@/lib/kakao";
import { BFD_SYSTEM_PROMPT } from "@/lib/prompts";
import type Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const SYSTEM_PROMPT = BFD_SYSTEM_PROMPT + "\n카카오톡 채팅이니까 1-4문장으로 짧게.";

const HISTORY_LIMIT = 20;
const MAX_TOKENS = 400;

/** Claude 호출 + 저장 + (콜백 모드 시) callbackUrl로 응답 전송 */
async function processReply(
  utterance: string,
  kakaoUserId: string,
  payload: KakaoWebhookPayload,
  callbackUrl?: string
): Promise<string> {
  const supabase = getSupabaseAdmin();

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

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [...history, { role: "user", content: utterance }],
  });

  const reply =
    response.content[0].type === "text" ? response.content[0].text : "";

  // 콜백 모드: callbackUrl로 최종 응답 전송
  if (callbackUrl) {
    await fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildSimpleTextResponse(reply)),
    });
  }

  // 대화 저장 (fire-and-forget)
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
      if (error) console.error("[kakao/webhook] 대화 저장 실패:", error.message);
    });

  return reply;
}

export async function POST(req: NextRequest) {
  // 1. Raw body
  const rawBody = await req.text();

  // 2. 서명 검증
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
  const callbackUrl = payload.userRequest?.params?.callbackUrl;

  if (!utterance || !kakaoUserId) {
    return NextResponse.json(buildSimpleTextResponse("..."), { status: 200 });
  }

  // 4. 콜백 모드 (AI 챗봇 전환 ON): 즉시 응답 후 after()로 비동기 처리
  if (callbackUrl) {
    after(async () => {
      try {
        await processReply(utterance, kakaoUserId, payload, callbackUrl);
      } catch (err) {
        console.error("[kakao/webhook] callback 처리 실패:", err);
        await fetch(callbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            buildSimpleTextResponse("버벅이고 있어 😅 다시 말해줄 수 있어?")
          ),
        });
      }
    });

    return NextResponse.json(
      {
        version: "2.0",
        useCallback: true,
        template: {
          outputs: [{ simpleText: { text: "잠깐만! 생각하는 중이야 🤔" } }],
        },
      },
      { status: 200 }
    );
  }

  // 5. 일반 모드 (AI 챗봇 전환 OFF): 동기 처리
  try {
    const reply = await processReply(utterance, kakaoUserId, payload);
    return NextResponse.json(buildSimpleTextResponse(reply), { status: 200 });
  } catch (err) {
    console.error("[kakao/webhook]", err);
    return NextResponse.json(
      buildSimpleTextResponse("잠깐, 나 지금 좀 버벅이고 있어 😅 다시 말해줄 수 있어?"),
      { status: 200 }
    );
  }
}
