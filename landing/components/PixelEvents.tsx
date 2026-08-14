"use client";

import { useEffect, useRef } from "react";
import { trackScrollProgreso, trackViewContent } from "@/lib/meta-pixel";

/**
 * Monta una sola vez en el layout raíz. Dispara ViewContent a los 15s en
 * página y ScrollProgreso en 25/50/75% — el público de scroll 75% es el
 * retargeting más caliente, por eso los umbrales se disparan una sola vez
 * cada uno (sin repetir el evento si el usuario sube y baja).
 */
export default function PixelEvents() {
  const disparados = useRef(new Set<number>());

  useEffect(() => {
    const timer = setTimeout(() => {
      trackViewContent();
    }, 15000);

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const porcentaje = (scrollTop / docHeight) * 100;

      for (const umbral of [25, 50, 75] as const) {
        if (porcentaje >= umbral && !disparados.current.has(umbral)) {
          disparados.current.add(umbral);
          trackScrollProgreso(umbral);
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
