import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "@/lib/types";

const COOKIE = "inv_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-invitation-secret-change-me",
);

export async function signSession(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret);
}

export async function readSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.id || !payload.email || !payload.role) return null;
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return readSessionToken(token);
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function isSuperadmin(user: SessionUser | null) {
  return user?.role === "SUPERADMIN";
}
