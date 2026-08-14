import { oferta } from "@/config/oferta";

export default function OfferSection() {
  return (
    <section className="bg-gold-light/40 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border-2 border-gold bg-white p-8 shadow-lg sm:p-10">
        <p className="text-center font-heading text-sm font-bold uppercase tracking-wide text-gold-dark">
          A los que se registren hoy tengo sorpresas
        </p>

        <h2 className="mt-3 text-center font-heading text-2xl font-extrabold text-navy sm:text-3xl">
          Cupón especial para la {oferta.nombre}
        </h2>

        <p className="mt-4 text-center text-navy/80">
          Quien asista al webinar recibirá un cupón especial para comprar la{" "}
          <strong>{oferta.nombre}</strong> del {oferta.fecha} por{" "}
          <strong>${oferta.precioOferta} MXN</strong> (precio normal: $
          {oferta.precioNormal} MXN).
        </p>

        <ul className="mx-auto mt-6 max-w-md space-y-2">
          {oferta.incluye.map((item) => (
            <li key={item} className="flex items-start gap-2 text-navy/85">
              <span aria-hidden className="text-gold-dark">
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-xl bg-navy p-6 text-center text-white">
          <p className="text-sm text-white/70">Total de valor: más de ${oferta.valorTotal} MXN</p>
          <p className="mt-1 font-heading text-3xl font-extrabold text-gold">
            Tú pagas: ${oferta.precioOferta} MXN
          </p>
        </div>

        <p className="mt-6 text-center text-sm font-semibold text-navy/70">
          Pero solo aplica para quien se registre ahora al webinar.
        </p>
      </div>
    </section>
  );
}
