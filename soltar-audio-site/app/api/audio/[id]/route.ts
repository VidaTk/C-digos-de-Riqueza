import { NextRequest, NextResponse } from "next/server";
import { findAudioById } from "@/lib/audioContent";
import { SESSION_COOKIE_NAME } from "@/lib/env";
import { isSessionTokenValid } from "@/lib/session";
import { createStreamToken } from "@/lib/signedUrl";

/**
 * Emite una URL de streaming firmada y de corta duración para un audio.
 * El cliente nunca conoce la ruta real del archivo — solo este endpoint
 * temporal, que además vuelve a validar la sesión en /api/stream/[id].
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasValidSession = await isSessionTokenValid(sessionToken);
  if (!hasValidSession) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const audio = findAudioById(id);
  if (!audio) {
    return NextResponse.json({ error: "Audio no encontrado" }, { status: 404 });
  }

  const token = await createStreamToken(audio.id);
  return NextResponse.json({
    streamUrl: `/api/stream/${audio.id}?token=${token}`,
  });
}
