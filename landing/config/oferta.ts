/**
 * Configuración central del webinar. Hardcoded por ahora — pensado para
 * moverse a un CMS o endpoint dinámico más adelante sin tocar componentes.
 */

export const webinar = {
  // ISO 8601 con offset explícito de CDMX (UTC-6, sin horario de verano).
  fechaISO: "2026-08-20T19:00:00-06:00",
  fechaLegible: "Hora: 7:00 pm (CDMX)",
  duracionMinutos: 60,
  zonaHoraria: "America/Mexico_City",
};

export const capacidad = {
  total: 500,
  restantes: 147,
};

export const oferta = {
  nombre: "Masterclass Los 4 Códigos de Riqueza",
  fecha: "24 de septiembre",
  precioNormal: 999,
  precioOferta: 499,
  valorTotal: 3000,
  moneda: "MXN",
  incluye: [
    "Libro físico con envío gratis",
    "Diagnóstico de tu negocio (valor $999)",
    "3 meses acceso a comunidad privada",
    "Grupo privado de WhatsApp",
  ],
};

export const marca = {
  nombre: "YO SOY LÍDER PROFESIONAL",
  autor: "25 años en redes de mercadeo y venta directa en México y LATAM",
};
