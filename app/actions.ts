'use server'

export async function submitWaitlist(data: { hotelName: string; ownerName: string; email: string }) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("환경변수 GOOGLE_SHEET_WEBHOOK_URL이 설정되지 않았습니다.");
    return { success: false };
  }

  try {
    // 해결 포인트: method를 POST로 강제하고, 데이터를 JSON으로 예쁘게 포장해서 보냅니다.
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // 구글 앱스 스크립트와의 통신 최적화
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("전송 에러:", error);
    return { success: false };
  }
}