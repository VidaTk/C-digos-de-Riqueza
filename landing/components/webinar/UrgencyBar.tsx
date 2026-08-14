import Countdown from "./Countdown";
import { capacidad, webinar } from "@/config/oferta";

export default function UrgencyBar() {
  const ocupados = capacidad.total - capacidad.restantes;
  const porcentaje = Math.round((ocupados / capacidad.total) * 100);

  return (
    <section className="bg-navy px-6 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-heading text-2xl font-extrabold text-gold sm:text-3xl">
          ⏳ Quedan {capacidad.restantes} lugares de {capacidad.total}
        </p>

        <div
          className="mt-6 h-4 w-full overflow-hidden rounded-full bg-white/15"
          role="progressbar"
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Lugares ocupados"
        >
          <div
            className="h-full rounded-full bg-gold transition-all"
            style={{ width: `${porcentaje}%` }}
          />
        </div>

        <div className="mt-8">
          <Countdown />
        </div>

        <p className="mt-6 text-white/80">{webinar.fechaLegible}</p>
      </div>
    </section>
  );
}
