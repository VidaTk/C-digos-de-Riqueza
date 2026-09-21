import { decodeBase64Url, encodeBase64Url, sign, verify } from "./crypto";
import { SESSION_MAX_AGE_SECONDS, SESSION_SECRET } from "./env";

type SessionPayload = {
  iat: number; // issued at (epoch seconds)
  exp: number; // expires at (epoch seconds)
};

export async function createSessionToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { iat: now, exp: now + SESSION_MAX_AGE_SECONDS };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = await sign(encodedPayload, SESSION_SECRET);
  return `${encodedPayload}.${signature}`;
}

export async function isSessionTokenValid(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const validSignature = await verify(encodedPayload, signature, SESSION_SECRET);
  if (!validSignature) return false;

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" && payload.exp > now;
  } catch {
    return false;
  }
}
