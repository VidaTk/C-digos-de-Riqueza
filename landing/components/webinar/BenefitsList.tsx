const BENEFICIOS = [
  "Entender por qué tu equipo se estancó (y no es lo que crees)",
  "Ver el sistema paso a paso que funciona en cualquier empresa de multinivel",
  "Descubrir el orden correcto de las acciones (la mayoría comete errores aquí)",
  "Saber exactamente qué hacer el lunes cuando salgas del webinar",
];

export default function BenefitsList() {
  return (
    <section className="bg-navy/[0.03] px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="section-heading text-center text-navy">
          En 60 minutos en vivo, vas a:
        </h2>

        <ul className="mt-10 space-y-4">
          {BENEFICIOS.map((beneficio) => (
            <li key={beneficio} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy"
              >
                ✓
              </span>
              <span className="text-lg text-navy/85">{beneficio}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
