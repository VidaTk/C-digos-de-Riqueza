const RAZONES = [
  {
    icono: "🔍",
    titulo: "No paras de prospectar pero sin resultados",
    descripcion:
      "Hablas con tu lista de contactos y cuando esa lista se agota, no hay nuevos contactos. Y conseguir nuevos no es fácil.",
  },
  {
    icono: "🎤",
    titulo: "Tu presentación no despierta decisión",
    descripcion:
      "Haces presentaciones de una hora que confunden en lugar de aclarar. La gente se va sin saber qué hacer y nunca vuelve.",
  },
  {
    icono: "⚙️",
    titulo: "No tienes un sistema para duplicarte",
    descripcion:
      "Tú eres el sistema. Los nuevos líderes no aprenden a vender; solo aprenden a venderte a ti. Cuando te vas, todo colapsa.",
  },
];

export default function RootCauses() {
  return (
    <section className="bg-navy/[0.03] px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-heading text-center text-navy">
          3 razones por las que tu equipo no duplica
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {RAZONES.map((razon, i) => (
            <div
              key={razon.titulo}
              className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl" aria-hidden>
                {razon.icono}
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-navy">
                Razón {i + 1}: {razon.titulo}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/75">
                {razon.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
