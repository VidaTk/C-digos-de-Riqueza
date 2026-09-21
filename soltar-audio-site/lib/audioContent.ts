export type AudioItem = {
  id: string;
  title: string;
  subtitle: string;
  /** Ruta (pathname) del archivo dentro del store de Vercel Blob. */
  blobPathname: string;
};

/**
 * Placeholders — Ely pasará los títulos, subtítulos y archivos reales.
 * `blobPathname` debe coincidir con la ruta usada al subir el audio
 * (ver scripts/upload-audio.ts).
 */
export const AUDIOS: AudioItem[] = [
  { id: "audio-1", title: "Título 1", subtitle: "Subtítulo 1", blobPathname: "audios/audio-1.mp3" },
  { id: "audio-2", title: "Título 2", subtitle: "Subtítulo 2", blobPathname: "audios/audio-2.mp3" },
  { id: "audio-3", title: "Título 3", subtitle: "Subtítulo 3", blobPathname: "audios/audio-3.mp3" },
  { id: "audio-4", title: "Título 4", subtitle: "Subtítulo 4", blobPathname: "audios/audio-4.mp3" },
  { id: "audio-5", title: "Título 5", subtitle: "Subtítulo 5", blobPathname: "audios/audio-5.mp3" },
];

export function findAudioById(id: string): AudioItem | undefined {
  return AUDIOS.find((audio) => audio.id === id);
}
