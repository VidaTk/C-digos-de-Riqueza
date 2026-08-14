const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/** Lee los parámetros UTM presentes en la URL actual (solo cliente). */
export function leerUtmDesdeUrl(): UtmParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utms: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utms[key] = value;
  }

  return utms;
}
