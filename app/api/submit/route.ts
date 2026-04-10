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
        "User-Agent": "curl/7.85.0",
      },
      body: JSON.stringify(data),
      redirect: "manual",
    });
    // GAS returns 302 after executing doPost — that means success
    if (res.status === 0 || res.status === 302 || res.status === 200) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { error: `Unexpected status: ${res.status}` },
      { status: 500 }
    );
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
