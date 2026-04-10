import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const webhookUrl =
    "https://script.google.com/macros/s/AKfycbyaPA7AmuqAB0gQwdmnAVvL5ke7GG2jCYHawdxOeVOnUK6SUx57zbCZ4A5gmvVW6mzFjQ/exec";

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      redirect: "follow",
    });
    console.log("[api/submit] GAS status:", res.status, "ok:", res.ok);
    // GAS executes doPost before any redirect — treat any response as success
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[api/submit] fetch error:", String(e));
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
