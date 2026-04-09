"use server";

type Result = { success: true } | { success: false; error: string };

export async function submitWaitlist(data: {
  hotelName: string;
  ownerName: string;
  phone: string;
}): Promise<Result> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return { success: false, error: "설정 오류가 발생했습니다." };
  }
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      redirect: "manual", // GAS returns 302 after running doPost — stop here
    });
    // 2xx = success, 3xx = GAS redirect after execution (also success)
    if (res.status >= 200 && res.status < 400) {
      return { success: true };
    }
    throw new Error(`HTTP ${res.status}`);
  } catch {
    return {
      success: false,
      error: "전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
