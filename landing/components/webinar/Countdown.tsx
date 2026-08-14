"use client";

import { useEffect, useState } from "react";
import { calcularTiempoRestante, type TiempoRestante } from "@/lib/countdown";
import { webinar } from "@/config/oferta";

interface CountdownProps {
  variant?: "compact" | "full";
}

export default function Countdown({ variant = "full" }: CountdownProps) {
  const [tiempo, setTiempo] = useState<TiempoRestante | null>(null);

  useEffect(() => {
    setTiempo(calcularTiempoRestante(webinar.fechaISO));
    const interval = setInterval(() => {
      setTiempo(calcularTiempoRestante(webinar.fechaISO));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!tiempo) {
    return <span aria-hidden className="opacity-0">00:00:00</span>;
  }

  if (tiempo.terminado) {
    return (
      <a
        href="#registro"
        className="font-heading font-bold text-gold underline underline-offset-4"
      >
        El webinar comenzó. Haz clic aquí para unirte si aún tienes lugar.
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <p className="font-heading text-sm font-semibold sm:text-base">
        El webinar es en {tiempo.dias} días · {tiempo.horas} horas · {tiempo.minutos} minutos
      </p>
    );
  }

  const unidades = [
    { valor: tiempo.dias, etiqueta: "Días" },
    { valor: tiempo.horas, etiqueta: "Horas" },
    { valor: tiempo.minutos, etiqueta: "Min" },
    { valor: tiempo.segundos, etiqueta: "Seg" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4" role="timer" aria-live="polite">
      {unidades.map((u) => (
        <div
          key={u.etiqueta}
          className="flex w-16 flex-col items-center rounded-lg bg-navy px-2 py-3 text-white sm:w-20"
        >
          <span className="font-heading text-2xl font-extrabold tabular-nums sm:text-3xl">
            {String(u.valor).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-white/70 sm:text-xs">
            {u.etiqueta}
          </span>
        </div>
      ))}
    </div>
  );
}
