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
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      redirect: "follow",
    });
    // GAS always writes data before redirecting — treat any response as success
    return { success: true };
  } catch {
    return {
      success: false,
      error: "전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
