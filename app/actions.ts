'use server'

export async function submitWaitlist(data: { hotelName: string; ownerName: string; email: string }) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    return { success: false, error: "Vercel 환경변수(GOOGLE_SHEET_WEBHOOK_URL)가 없습니다." };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    });

    // 🚨 핵심: 구글이 돌려준 대답(텍스트)을 까보고 에러면 프론트로 보냅니다.
    const responseText = await response.text();

    if (responseText.includes("Error") || responseText.includes("Exception")) {
      return { success: false, error: responseText };
    }

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: "구글 시트 전송 실패 (상태코드: " + response.status + ")" };
    }
  } catch (error: any) {
    return { success: false, error: error.message || "네트워크 통신 에러" };
  }
}