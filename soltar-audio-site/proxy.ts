import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/env";
import { isSessionTokenValid } from "./lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasValidSession = await isSessionTokenValid(token);

  if (!hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protege todas las páginas excepto /login y assets. Las API routes
  // (/api/*) validan la sesión por su cuenta y responden 401 en JSON.
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};
