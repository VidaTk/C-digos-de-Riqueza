import { capacidad, webinar } from "@/config/oferta";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-diagonal-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_45%,rgba(212,175,55,0.18)_46%,rgba(212,175,55,0.18)_48%,transparent_49%)]"
      />
      <div className="relative mx-auto flex min-h-[560px] max-w-5xl flex-col items-center px-6 py-16 text-center sm:min-h-[640px] sm:py-24">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold sm:text-base">
          Dentro de 6 días, te muestro
        </p>

        <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
          Cómo construir un equipo que no dependa de ti
        </h1>

        <p className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl">
          En vivo. Gratis. Con estructura lista para implementar.
        </p>

        <a href="#registro" className="btn-cta mt-8">
          Apartar mi lugar ahora
        </a>

        <p className="mt-4 text-sm text-white/70">
          Capacidad limitada a {capacidad.total} asistentes · Quedan{" "}
          <span className="font-bold text-gold">{capacidad.restantes} lugares</span>
        </p>

        <p className="mt-8 text-xs uppercase tracking-wide text-white/60">
          Webinar en vivo · {webinar.fechaLegible} · {webinar.duracionMinutos} minutos
        </p>
      </div>
    </section>
  );
}
