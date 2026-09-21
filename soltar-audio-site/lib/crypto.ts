/**
 * HMAC signing helpers built on Web Crypto (SubtleCrypto), which is
 * available both in the Edge runtime (middleware) and in the Node.js
 * runtime (API routes) — so session/URL signing logic is written once
 * and reused everywhere.
 */

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function sign(payload: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function verify(payload: string, signature: string, secret: string): Promise<boolean> {
  const key = await hmacKey(secret);
  try {
    return await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(signature) as BufferSource,
      new TextEncoder().encode(payload)
    );
  } catch {
    return false;
  }
}

export function encodeBase64Url(text: string): string {
  return base64UrlEncode(new TextEncoder().encode(text));
}

export function decodeBase64Url(value: string): string {
  return new TextDecoder().decode(base64UrlDecode(value));
}
