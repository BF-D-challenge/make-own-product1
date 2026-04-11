import { NextRequest, NextResponse } from "next/server";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyaPA7AmuqAB0gQwdmnAVvL5ke7GG2jCYHawdxOeVOnUK6SUx57zbCZ4A5gmvVW6mzFjQ/exec";

export async function POST(request: NextRequest) {
  const data: { hotelName: string; ownerName: string; email: string } = await request.json();

  try {
    await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
      redirect: "follow",
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
