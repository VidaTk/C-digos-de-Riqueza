import { AudioPlayer } from "@/components/AudioPlayer";
import { LogoutButton } from "@/components/LogoutButton";
import { AUDIOS } from "@/lib/audioContent";

export default function HomePage() {
  return (
    <main className="page">
      <header className="page-header">
        <h1 className="page-title">Soltar</h1>
        <p className="page-subtitle">
          Un espacio de acompañamiento para tu proceso de duelo — Ely González
        </p>
      </header>

      <section className="audio-list">
        {AUDIOS.map((audio) => (
          <AudioPlayer key={audio.id} id={audio.id} title={audio.title} subtitle={audio.subtitle} />
        ))}
      </section>

      <footer className="page-footer">
        <LogoutButton />
      </footer>
    </main>
  );
}
