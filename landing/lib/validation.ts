export type NivelNegocio = "empresario" | "empezando" | "dirige_empresa";

export interface RegistroInput {
  nombre: string;
  correo: string;
  whatsapp: string;
  nivel: NivelNegocio | "";
}

export interface RegistroErrors {
  nombre?: string;
  correo?: string;
  whatsapp?: string;
  nivel?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

export function validarRegistro(input: RegistroInput): RegistroErrors {
  const errors: RegistroErrors = {};

  if (!input.nombre.trim() || input.nombre.trim().length < 2) {
    errors.nombre = "Escribe tu nombre completo.";
  }

  if (!EMAIL_REGEX.test(input.correo.trim())) {
    errors.correo = "Escribe un correo válido.";
  }

  const soloDigitos = input.whatsapp.replace(/\D/g, "");
  if (!PHONE_REGEX.test(soloDigitos)) {
    errors.whatsapp = "Escribe tu WhatsApp a 10 dígitos, sin guiones.";
  }

  if (!input.nivel) {
    errors.nivel = "Selecciona una opción.";
  }

  return errors;
}

export function esValido(errors: RegistroErrors): boolean {
  return Object.keys(errors).length === 0;
}
