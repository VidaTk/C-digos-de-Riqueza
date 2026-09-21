"use client";

import { useEffect, useState } from "react";

type AudioPlayerProps = {
  id: string;
  title: string;
  subtitle: string;
};

export function AudioPlayer({ id, title, subtitle }: AudioPlayerProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSource() {
      try {
        const response = await fetch(`/api/audio/${id}`);
        if (!response.ok) throw new Error("No se pudo obtener el audio");
        const data = (await response.json()) as { streamUrl: string };
        if (!cancelled) setStreamUrl(data.streamUrl);
      } catch {
        if (!cancelled) setError("No pudimos cargar este audio. Recarga la página.");
      }
    }

    loadSource();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <article className="audio-card">
      <h2 className="audio-title">{title}</h2>
      <p className="audio-subtitle">{subtitle}</p>

      {streamUrl && (
        <audio
          controls
          controlsList="nodownload noplaybackrate"
          onContextMenu={(event) => event.preventDefault()}
          preload="none"
          className="audio-element"
          src={streamUrl}
        >
          Tu navegador no soporta audio HTML5.
        </audio>
      )}

      {!streamUrl && !error && <p className="audio-status">Preparando audio…</p>}
      {error && <p className="audio-status audio-status--error">{error}</p>}
    </article>
  );
}
