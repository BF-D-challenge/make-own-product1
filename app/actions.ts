"use server";

type Result = { success: true } | { success: false; error: string };

export async function submitWaitlist(data: {
  hotelName: string;
  ownerName: string;
  phone: string;
}): Promise<Result> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  console.log("[submitWaitlist] webhookUrl:", webhookUrl ? "SET" : "NOT SET");

  if (!webhookUrl) {
    return { success: false, error: "설정 오류가 발생했습니다." };
  }
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      redirect: "follow",
    });
    console.log("[submitWaitlist] response status:", res.status, "type:", res.type);
    return { success: true };
  } catch (e) {
    console.error("[submitWaitlist] fetch error:", e);
    return {
      success: false,
      error: "전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
    };
  }
}
