import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/env";
import { isPasswordCorrect } from "@/lib/password";
import { createSessionToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  let password: unknown;
  try {
    const body = await request.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (typeof password !== "string" || !isPasswordCorrect(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
