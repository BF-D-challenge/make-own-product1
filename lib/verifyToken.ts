import { createHmac } from "crypto";

const SECRET = process.env.COOLSMS_API_SECRET!;
const EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export function createVerifyToken(phone: string): string {
  const payload = Buffer.from(
    JSON.stringify({ phone, exp: Date.now() + EXPIRY_MS })
  ).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function validateVerifyToken(token: string): { phone: string } | null {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const payload = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);
    const expectedSig = createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");
    if (sig !== expectedSig) return null;
    const { phone, exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    );
    if (Date.now() > exp) return null;
    return { phone };
  } catch {
    return null;
  }
}
