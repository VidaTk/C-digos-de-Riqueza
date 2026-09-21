import { NextRequest, NextResponse } from "next/server";
import { findAudioById } from "@/lib/audioContent";
import { resolveAudioBlobUrl } from "@/lib/blob";
import { SESSION_COOKIE_NAME } from "@/lib/env";
import { isSessionTokenValid } from "@/lib/session";
import { isStreamTokenValid } from "@/lib/signedUrl";

const PASSTHROUGH_HEADERS = ["content-type", "content-length", "content-range", "accept-ranges"];

/**
 * Transmite el audio real proxeando la respuesta de Vercel Blob (server-side),
 * reenviando el header Range para permitir adelantar/atrasar. La sesión se
 * verifica de nuevo aquí (además del token firmado), y la URL real del blob
 * jamás se le entrega al navegador.
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

  const streamToken = request.nextUrl.searchParams.get("token");
  const hasValidStreamToken = await isStreamTokenValid(streamToken, audio.id);
  if (!hasValidStreamToken) {
    return NextResponse.json({ error: "Enlace expirado, recarga la página" }, { status: 401 });
  }

  let blobUrl: string | null;
  try {
    blobUrl = await resolveAudioBlobUrl(audio.id);
  } catch (error) {
    console.error(`No se pudo resolver el blob de "${audio.id}":`, error);
    return NextResponse.json({ error: "Audio no disponible en este momento" }, { status: 503 });
  }
  if (!blobUrl) {
    return NextResponse.json({ error: "Este audio todavía no está disponible" }, { status: 404 });
  }

  const range = request.headers.get("range");
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(blobUrl, {
      headers: range ? { range } : undefined,
      cache: "no-store",
    });
  } catch (error) {
    console.error(`No se pudo leer el audio "${audio.id}" desde Blob:`, error);
    return NextResponse.json({ error: "No se pudo leer el audio" }, { status: 502 });
  }

  if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
    return NextResponse.json({ error: "No se pudo leer el audio" }, { status: 502 });
  }

  const headers = new Headers();
  for (const header of PASSTHROUGH_HEADERS) {
    const value = upstreamResponse.headers.get(header);
    if (value) headers.set(header, value);
  }
  if (!headers.has("accept-ranges")) headers.set("accept-ranges", "bytes");
  headers.set("content-disposition", "inline");
  headers.set("cache-control", "no-store, private");

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
}
