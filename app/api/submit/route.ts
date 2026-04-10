import { NextRequest, NextResponse } from "next/server";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyaPA7AmuqAB0gQwdmnAVvL5ke7GG2jCYHawdxOeVOnUK6SUx57zbCZ4A5gmvVW6mzFjQ/exec";

export async function POST(request: NextRequest) {
  const data = await request.json();

  // Use GET with query params — more reliable than POST with GAS
  const params = new URLSearchParams({
    hotelName: data.hotelName ?? "",
    ownerName: data.ownerName ?? "",
    phone: data.phone ?? "",
  });
  const url = `${GAS_URL}?${params.toString()}`;

  try {
    const res = await fetch(url, { redirect: "follow" });
    console.log("[api/submit] GAS GET status:", res.status);
    const text = await res.text();
    console.log("[api/submit] GAS response:", text);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e), url }, { status: 500 });
  }
}
