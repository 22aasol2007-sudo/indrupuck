export const CRM_SESSION_COOKIE = "crm_session";
export const CRM_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const defaultAdminEmail = "22aasol2007@gmail.com";

export type CrmRole = "admin" | "manager";

export interface CrmSession {
  email: string;
  role: CrmRole;
  name?: string;
  exp: number;
}

export function getCrmAdminEmail() {
  return process.env.CRM_EMAIL || defaultAdminEmail;
}

export function getCrmSecret() {
  return process.env.CRM_SECRET || "";
}

function base64UrlEncode(input: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  return btoa(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(input: string) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }

  return atob(padded);
}

async function hmacSha256(message: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const bytes = Array.from(new Uint8Array(signature));
  const raw = String.fromCharCode(...bytes);
  return base64UrlEncode(raw);
}

export async function createCrmSessionToken(
  email: string,
  secret: string,
  role: CrmRole = "admin",
  name?: string
) {
  const payload = base64UrlEncode(
    JSON.stringify({
      email,
      role,
      name,
      exp: Math.floor(Date.now() / 1000) + CRM_SESSION_MAX_AGE,
    })
  );
  const signature = await hmacSha256(payload, secret);
  return `${payload}.${signature}`;
}

export async function getCrmSession(token: string | undefined, secret: string) {
  if (!token || !secret || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = await hmacSha256(payload, secret);
  if (signature !== expectedSignature) return null;

  try {
    const data = JSON.parse(base64UrlDecode(payload)) as Partial<CrmSession>;
    if (!data.email || !data.exp) return null;
    if (data.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      email: data.email,
      role: data.role === "manager" ? "manager" : "admin",
      name: data.name,
      exp: data.exp,
    } satisfies CrmSession;
  } catch {
    return null;
  }
}

export async function verifyCrmSessionToken(token: string | undefined, secret: string) {
  return Boolean(await getCrmSession(token, secret));
}
