import { list } from "@vercel/blob";
import { findAudioById } from "./audioContent";

type CacheEntry = { url: string; cachedAt: number };

const urlCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Resuelve la URL real (y no adivinable) del blob en Vercel Blob a partir
 * del id de audio. Esta URL NUNCA se envía al cliente — solo se usa en el
 * servidor para leer los bytes y transmitirlos vía /api/stream/[id].
 */
export async function resolveAudioBlobUrl(id: string): Promise<string | null> {
  const audio = findAudioById(id);
  if (!audio) return null;

  const cached = urlCache.get(id);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.url;
  }

  const { blobs } = await list({ prefix: audio.blobPathname, limit: 1 });
  const match = blobs.find((blob) => blob.pathname === audio.blobPathname);
  if (!match) return null;

  urlCache.set(id, { url: match.url, cachedAt: Date.now() });
  return match.url;
}
