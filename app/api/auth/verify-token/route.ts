import { NextRequest, NextResponse } from "next/server";
import { createVerifyToken, validateVerifyToken } from "@/lib/verifyToken";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone) {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }
  const token = createVerifyToken(phone);
  return NextResponse.json({ token });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }
  const result = validateVerifyToken(token);
  if (!result) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
  return NextResponse.json({ phone: result.phone });
}
