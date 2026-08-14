const CASOS = [
  {
    iniciales: "MR",
    nombre: "María Rodríguez",
    ciudad: "Guadalajara, MX",
    resultado: "De 4 personas activas a 19 en 7 meses",
    detalle: "Mi cheque se triplicó. Cambié la forma en que prospectaba, no cuánto trabajaba.",
  },
  {
    iniciales: "JC",
    nombre: "Javier Castillo",
    ciudad: "Bogotá, CO",
    resultado: "Subió de rango en 6 meses",
    detalle:
      "Estaba estancado en el mismo rango hacía 3 años. Implementé los 4 códigos y todo cambió.",
  },
  {
    iniciales: "LP",
    nombre: "Lucía Paredes",
    ciudad: "Lima, PE",
    resultado: "Entra gente nueva cada semana",
    detalle: "Mi equipo no crecía. Cambié el sistema de prospección y ahora es constante.",
  },
];

export default function ResultsSection() {
  return (
    <section className="bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-heading text-center text-navy">Resultados reales</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CASOS.map((caso) => (
            <figure
              key={caso.nombre}
              className="flex flex-col rounded-xl border border-navy/10 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-navy font-heading text-sm font-bold text-white"
                >
                  {caso.iniciales}
                </div>
                <figcaption>
                  <p className="font-heading text-sm font-bold text-navy">{caso.nombre}</p>
                  <p className="text-xs text-navy/60">{caso.ciudad}</p>
                </figcaption>
              </div>

              <p className="mt-4 font-heading text-base font-bold text-gold-dark">
                Resultado: {caso.resultado}
              </p>
              <blockquote className="mt-2 text-sm leading-relaxed text-navy/75">
                “{caso.detalle}”
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
