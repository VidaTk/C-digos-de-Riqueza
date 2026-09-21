import { decodeBase64Url, encodeBase64Url, sign, verify } from "./crypto";
import { STREAM_SECRET, STREAM_URL_TTL_SECONDS } from "./env";

type StreamPayload = {
  id: string;
  exp: number;
};

/**
 * Token de corta duración que autoriza UNA descarga/stream de un audio
 * puntual vía /api/stream/[id]. El cliente nunca ve la URL real de
 * Vercel Blob — solo este token, atado al id del audio y con expiración.
 */
export async function createStreamToken(id: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + STREAM_URL_TTL_SECONDS;
  const payload: StreamPayload = { id, exp };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = await sign(encodedPayload, STREAM_SECRET);
  return `${encodedPayload}.${signature}`;
}

export async function isStreamTokenValid(token: string | null, expectedId: string): Promise<boolean> {
  if (!token) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const validSignature = await verify(encodedPayload, signature, STREAM_SECRET);
  if (!validSignature) return false;

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as StreamPayload;
    const now = Math.floor(Date.now() / 1000);
    return payload.id === expectedId && payload.exp > now;
  } catch {
    return false;
  }
}
