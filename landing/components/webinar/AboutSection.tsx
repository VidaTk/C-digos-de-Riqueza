export default function AboutSection() {
  return (
    <section className="bg-navy/[0.03] px-6 py-16 sm:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="section-heading text-navy">
          Hablo desde la experiencia, no desde la teoría
        </h2>

        <div
          aria-hidden
          className="mt-8 flex h-28 w-28 items-center justify-center rounded-full bg-navy font-heading text-3xl font-bold text-gold"
        >
          YSLP
        </div>

        <p className="mt-6 text-lg leading-relaxed text-navy/80">
          Llevo 25 años en redes de mercadeo y venta directa en México y LATAM.
          Formé equipos, implementé estrategias comerciales para empresas del
          sector, y ahora escribo sobre esto porque hay conversaciones que
          nadie quiere tener.
        </p>

        <p className="mt-6 font-heading text-lg font-bold text-navy">
          Mi promesa: si aplicas lo que ves en el webinar, en 90 días tu
          equipo funciona diferente.
        </p>
      </div>
    </section>
  );
}
