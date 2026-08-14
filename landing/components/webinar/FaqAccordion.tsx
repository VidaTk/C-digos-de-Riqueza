"use client";

import { useState } from "react";

const FAQS = [
  {
    pregunta: "¿Cuándo es exactamente?",
    respuesta: "20 de agosto a las 7 pm CDMX. Dura 60 minutos.",
  },
  {
    pregunta: "¿Cuánto cuesta?",
    respuesta: "Gratis. Solo necesitas registrarte.",
  },
  {
    pregunta: "¿Me van a vender cosas en el webinar?",
    respuesta:
      "Sí. Te voy a hacer una oferta al final. Pero es una oferta real, no un truco.",
  },
  {
    pregunta: "¿Sirve si apenas estoy empezando?",
    respuesta:
      "Sí. De hecho, si apenas empiezas, esto te ahorra 2-3 años de errores.",
  },
  {
    pregunta: "¿Qué necesito para asistir?",
    respuesta: "Solo tu correo y WhatsApp. Te mando el link el día antes.",
  },
  {
    pregunta: "¿Puedo compartir el webinar con mis amigos?",
    respuesta: "Sí, pero cada persona necesita registrarse con su correo.",
  },
];

export default function FaqAccordion() {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section className="bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="section-heading text-center text-navy">Preguntas frecuentes</h2>

        <div className="mt-8 divide-y divide-navy/10 rounded-xl border border-navy/10">
          {FAQS.map((faq, i) => {
            const abiertaAhora = abierta === i;
            return (
              <div key={faq.pregunta}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setAbierta(abiertaAhora ? null : i)}
                    aria-expanded={abiertaAhora}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading font-semibold text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-dark"
                  >
                    <span>{faq.pregunta}</span>
                    <span aria-hidden className="shrink-0 text-gold-dark">
                      {abiertaAhora ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {abiertaAhora && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className="px-5 pb-4 text-navy/75"
                  >
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
