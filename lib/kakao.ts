import { createHmac } from "crypto";

// ── Kakao i OpenBuilder Webhook Types ────────────────────────────────────────

export interface KakaoUser {
  id: string;
  type: "accountId" | "botUserKey";
  properties: Record<string, string>;
}

export interface KakaoUserRequest {
  timezone: string;
  params: Record<string, string>;
  block: { id: string; name: string };
  utterance: string;
  lang: string;
  user: KakaoUser;
}

export interface KakaoWebhookPayload {
  intent: { id: string; name: string };
  userRequest: KakaoUserRequest;
  bot: { id: string; name: string };
  action: {
    name: string;
    clientExtra: Record<string, unknown>;
    params: Record<string, string>;
    id: string;
    detailParams: Record<string, unknown>;
  };
}

// ── Response Builder ─────────────────────────────────────────────────────────

export interface KakaoSimpleTextResponse {
  version: "2.0";
  template: {
    outputs: Array<{ simpleText: { text: string } }>;
  };
}

/** 카카오 i 오픈빌더 simpleText 응답 생성 */
export function buildSimpleTextResponse(text: string): KakaoSimpleTextResponse {
  // 카카오 채팅 버블 최대 1000자
  const truncated = text.length > 1000 ? text.slice(0, 997) + "..." : text;
  return {
    version: "2.0",
    template: {
      outputs: [{ simpleText: { text: truncated } }],
    },
  };
}

// ── Signature Verification ───────────────────────────────────────────────────

/**
 * 카카오 OpenBuilder 웹훅 서명 검증
 * 헤더: X-Kakao-Signature (HMAC-SHA256, base64)
 *
 * KAKAO_CHANNEL_SECRET 환경변수가 없으면 검증 생략 (개발용)
 */
export function verifyKakaoSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const secret = process.env.KAKAO_CHANNEL_SECRET;

  // 시크릿이 설정되지 않은 경우 검증 생략 (개발 환경)
  if (!secret) return true;

  // 서명 헤더가 없으면 거부
  if (!signature) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  // timing-safe 비교
  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ── Proactive Message API (카카오 채널 메시지 발송) ─────────────────────────

export interface KakaoChannelMessagePayload {
  plusFriendId: string; // 채널 이름 (@ 포함, 예: @베프디)
  recipientList: Array<{
    uuid: string; // Kakao 유저 UUID (앱 유저 ID)
    templateMsg?: {
      ad_flag: boolean;
      msg: {
        text: string;
      };
    };
  }>;
}

/**
 * 카카오 채널 메시지 프로액티브 발송 (친구에게 메시지 보내기 API)
 * 채널 운영자 액세스 토큰 필요 (KAKAO_ADMIN_KEY)
 *
 * 주의: 이 API는 Kakao 채널 친구 관계가 있는 유저에게만 발송 가능
 */
export async function sendKakaoChannelMessage(
  userUuid: string,
  text: string
): Promise<void> {
  const adminKey = process.env.KAKAO_ADMIN_KEY;
  const channelId = process.env.KAKAO_CHANNEL_PLUS_FRIEND_ID;

  if (!adminKey || !channelId) {
    throw new Error(
      "KAKAO_ADMIN_KEY 또는 KAKAO_CHANNEL_PLUS_FRIEND_ID 환경변수가 설정되지 않았습니다"
    );
  }

  const res = await fetch(
    "https://kapi.kakao.com/v4/channel/message/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `KakaoAK ${adminKey}`,
      },
      body: JSON.stringify({
        plusFriendId: channelId,
        recipientList: [
          {
            uuid: userUuid,
            templateMsg: {
              ad_flag: false,
              msg: { text },
            },
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Kakao Channel API 오류 ${res.status}: ${body}`);
  }
}
