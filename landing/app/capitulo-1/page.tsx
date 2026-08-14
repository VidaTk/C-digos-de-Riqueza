import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Capítulo 1: La Trampa del Emprendedor Aficionado | Yo Soy Líder Profesional",
  description:
    "Por qué tu ingreso depende 100% de ti y no hay escala posible — y qué hacer al respecto.",
};

export default function Capitulo1Page() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <p className="font-heading text-sm font-bold uppercase tracking-widest text-gold-dark">
        Capítulo 1
      </p>

      <h1 className="mt-3 font-heading text-3xl font-extrabold text-navy sm:text-4xl">
        La trampa del emprendedor aficionado
      </h1>

      <div className="mt-8 space-y-5 text-lg leading-relaxed text-navy/85">
        <p>
          Llevamos años en esto y aún no logramos lo que prometemos. Trabajas.
          Tu equipo crece. Pero en el momento que tú no vendes, todo se
          detiene.
        </p>
        <p>
          Tu ingreso depende 100% de ti. Y no hay escala posible. Hay un
          nombre para esto: la trampa del emprendedor aficionado.
        </p>
        <p>
          La diferencia entre quien construye un negocio que dura y quien se
          queda atrapado no es el esfuerzo — es el sistema. Y de eso hablo en
          el webinar en vivo.
        </p>
      </div>

      <div className="mt-12 rounded-xl border border-navy/10 bg-navy/[0.03] p-6 text-center">
        <p className="font-heading text-lg font-bold text-navy">
          ¿Quieres el sistema completo?
        </p>
        <p className="mt-2 text-navy/70">
          Te muestro los 4 Códigos de Riqueza en un webinar en vivo, gratis.
        </p>
        <Link href="/webinar" className="btn-cta mt-6">
          Ver detalles del webinar
        </Link>
      </div>
    </main>
  );
}
