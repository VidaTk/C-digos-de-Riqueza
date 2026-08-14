import { capacidad } from "@/config/oferta";

export default function FinalCta() {
  return (
    <section className="bg-diagonal-navy px-6 py-16 text-center text-white sm:py-20">
      <div className="mx-auto max-w-xl">
        <h2 className="section-heading text-white">¿Ya estás listo?</h2>

        <a href="#registro" className="btn-cta mt-8">
          Asegurar mi lugar ahora
        </a>

        <p className="mt-4 text-sm text-white/70">
          Capacidad limitada · Únicamente {capacidad.restantes} lugares disponibles
        </p>
      </div>
    </section>
  );
}
