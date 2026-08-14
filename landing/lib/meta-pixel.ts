declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

export function trackPageView() {
  fbq("track", "PageView");
}

export function trackViewContent() {
  fbq("track", "ViewContent");
}

export function trackScrollProgreso(porcentaje: 25 | 50 | 75) {
  fbq("trackCustom", "ScrollProgreso", { porcentaje });
}

export function trackLead() {
  fbq("track", "Lead");
}

export function trackRegistroExitoso() {
  fbq("trackCustom", "RegistroExitoso");
}
