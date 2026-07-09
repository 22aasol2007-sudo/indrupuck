// Утилиты сессии на основе подписанного HMAC-токена (Web Crypto).
// Совместимо и с Edge (proxy), и с Node (API routes).

const enc = new TextEncoder();

function getSecret(): string {
  return process.env.CRM_SECRET || "insecure-dev-secret-change-me";
}

function b64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToB64(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function b64(s: string): string {
  return bytesToB64(enc.encode(s));
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionData {
  id: number;
  role: string;
  email: string;
}

export async function createToken(data: SessionData): Promise<string> {
  const payload = b64(JSON.stringify(data));
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${bytesToB64(new Uint8Array(sig))}`;
}

export async function verifyToken(token?: string): Promise<boolean> {
  if (!token) return false;
  const [payload, sigB64] = token.split(".");
  if (!payload || !sigB64) return false;
  try {
    const key = await getKey();
    const sig = b64ToBytes(sigB64);
    return await crypto.subtle.verify("HMAC", key, sig, enc.encode(payload));
  } catch {
    return false;
  }
}

export async function getSession(token?: string): Promise<SessionData | null> {
  if (!token) return null;
  const [payload, sigB64] = token.split(".");
  if (!payload || !sigB64) return null;
  try {
    const key = await getKey();
    const sig = b64ToBytes(sigB64);
    const ok = await crypto.subtle.verify("HMAC", key, sig, enc.encode(payload));
    if (!ok) return null;
    return JSON.parse(atob(payload)) as SessionData;
  } catch {
    return null;
  }
}
