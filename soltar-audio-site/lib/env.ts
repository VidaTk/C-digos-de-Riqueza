function required(name: string, devFallback?: string): string {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV !== "production" && devFallback) return devFallback;
  throw new Error(`Falta la variable de entorno ${name}. Revisa .env.example.`);
}

export const SITE_PASSWORD = required("SITE_PASSWORD", "SoltarSep21");
export const SESSION_SECRET = required("SESSION_SECRET", "dev-session-secret-change-me");
export const STREAM_SECRET = required("STREAM_SECRET", "dev-stream-secret-change-me");

export const SESSION_COOKIE_NAME = "soltar_session";
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 días
// La URL firmada de streaming vive unas horas: suficiente para escuchar y
// adelantar/atrasar sin interrupciones, pero nunca es un link permanente.
export const STREAM_URL_TTL_SECONDS = 6 * 60 * 60;
