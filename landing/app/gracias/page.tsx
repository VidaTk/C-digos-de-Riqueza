import type { Metadata } from "next";
import Link from "next/link";
import { webinar } from "@/config/oferta";
import RegistroExitosoTracker from "@/components/RegistroExitosoTracker";

export const metadata: Metadata = {
  title: "¡Registro confirmado! | Yo Soy Líder Profesional",
  description: "Tu lugar para el webinar está en proceso de confirmación.",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-diagonal-navy px-6 py-20 text-center text-white">
      <RegistroExitosoTracker />
      <span aria-hidden className="text-5xl">
        ✅
      </span>

      <h1 className="mt-6 font-heading text-3xl font-extrabold sm:text-4xl">
        ¡Tu registro fue recibido!
      </h1>

      <p className="mt-4 max-w-md text-lg text-white/85">
        Te confirmaremos tu lugar por email en máximo 2 horas. Revisa tu
        bandeja de entrada (y spam, por si acaso).
      </p>

      <div className="mt-8 rounded-xl border border-white/20 bg-white/5 px-6 py-4">
        <p className="font-heading font-semibold text-gold">{webinar.fechaLegible}</p>
        <p className="text-sm text-white/70">Duración: {webinar.duracionMinutos} minutos</p>
      </div>

      <p className="mt-8 text-sm text-white/60">
        Mientras tanto, guarda este horario en tu calendario para no perdértelo.
      </p>

      <Link
        href="/webinar"
        className="mt-10 text-sm font-semibold text-gold underline underline-offset-4"
      >
        Volver a la página del webinar
      </Link>
    </main>
  );
}
