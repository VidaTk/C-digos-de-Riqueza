import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="bg-navy/[0.03] px-6 py-16 sm:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="section-heading text-navy">
          Hablo desde la experiencia, no desde la teoría
        </h2>

        <Image
          src="/foto-perfil.jpg"
          alt="Fundador de Yo Soy Líder Profesional"
          width={160}
          height={160}
          className="mt-8 h-32 w-32 rounded-full border-4 border-gold object-cover sm:h-40 sm:w-40"
          priority={false}
        />

        <p className="mt-6 text-lg leading-relaxed text-navy/80">
          Soy Antonio Villanueva y llevo 25 años en redes de mercadeo y venta
          directa en México y LATAM. Formé equipos, implementé estrategias
          comerciales para empresas del sector, y ahora escribo sobre esto
          porque hay conversaciones que nadie quiere tener.
        </p>

        <p className="mt-6 font-heading text-lg font-bold text-navy">
          Mi promesa: si aplicas lo que ves en el webinar, en 90 días tu
          equipo funciona diferente.
        </p>
      </div>
    </section>
  );
}
