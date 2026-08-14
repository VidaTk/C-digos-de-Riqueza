"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import {
  esValido,
  validarRegistro,
  type NivelNegocio,
  type RegistroErrors,
} from "@/lib/validation";
import { leerUtmDesdeUrl } from "@/lib/utm";
import { trackLead } from "@/lib/meta-pixel";

type Estado = "idle" | "loading" | "success" | "error";

export interface RegisterFormProps {
  /** Identifica en qué parte de la página vive este formulario (para analítica/UTM interno). */
  ubicacion: "hero" | "problema" | "final";
  titulo?: string;
}

const NIVELES: { value: NivelNegocio; label: string }[] = [
  { value: "empresario", label: "Soy empresario de multinivel" },
  { value: "empezando", label: "Estoy empezando" },
  { value: "dirige_empresa", label: "Dirijo una empresa" },
];

export default function RegisterForm({ ubicacion, titulo }: RegisterFormProps) {
  const router = useRouter();
  const formId = useId();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nivel, setNivel] = useState<NivelNegocio | "">("");
  const [errors, setErrors] = useState<RegistroErrors>({});
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMensaje, setErrorMensaje] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const input = { nombre, correo, whatsapp, nivel };
    const validation = validarRegistro(input);
    setErrors(validation);

    if (!esValido(validation)) return;

    setEstado("loading");
    setErrorMensaje("");
    trackLead();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          correo: correo.trim(),
          whatsapp: whatsapp.replace(/\D/g, ""),
          nivel,
          origen: ubicacion,
          utm: leerUtmDesdeUrl(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo completar el registro.");
      }

      setEstado("success");
      router.push("/gracias");
    } catch (err) {
      setEstado("error");
      setErrorMensaje(
        err instanceof Error
          ? err.message
          : "Algo salió mal. Intenta de nuevo en un momento."
      );
    }
  }

  const disabled = estado === "loading" || estado === "success";

  return (
    <div className="mx-auto w-full max-w-[600px] rounded-2xl border border-navy/10 bg-white p-6 shadow-lg sm:p-8">
      <h3 className="section-heading text-navy text-2xl sm:text-3xl">
        {titulo ?? "Asegura tu lugar — regístrate gratis"}
      </h3>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor={`${formId}-nombre`} className="mb-1 block text-sm font-semibold text-navy">
            Tu nombre
          </label>
          <input
            id={`${formId}-nombre`}
            name="nombre"
            type="text"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={disabled}
            required
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? `${formId}-nombre-error` : undefined}
            className="w-full rounded-md border border-navy/20 px-4 py-3 text-navy focus:border-gold-dark focus:outline-none focus:ring-2 focus:ring-gold-dark/40"
          />
          {errors.nombre && (
            <p id={`${formId}-nombre-error`} className="mt-1 text-sm text-red-600">
              {errors.nombre}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-correo`} className="mb-1 block text-sm font-semibold text-navy">
            Tu correo
          </label>
          <input
            id={`${formId}-correo`}
            name="correo"
            type="email"
            autoComplete="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={disabled}
            required
            aria-invalid={Boolean(errors.correo)}
            aria-describedby={errors.correo ? `${formId}-correo-error` : undefined}
            className="w-full rounded-md border border-navy/20 px-4 py-3 text-navy focus:border-gold-dark focus:outline-none focus:ring-2 focus:ring-gold-dark/40"
          />
          {errors.correo && (
            <p id={`${formId}-correo-error`} className="mt-1 text-sm text-red-600">
              {errors.correo}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-whatsapp`} className="mb-1 block text-sm font-semibold text-navy">
            Tu WhatsApp
          </label>
          <input
            id={`${formId}-whatsapp`}
            name="whatsapp"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="5512345678"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            disabled={disabled}
            required
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? `${formId}-whatsapp-error` : undefined}
            className="w-full rounded-md border border-navy/20 px-4 py-3 text-navy focus:border-gold-dark focus:outline-none focus:ring-2 focus:ring-gold-dark/40"
          />
          {errors.whatsapp && (
            <p id={`${formId}-whatsapp-error`} className="mt-1 text-sm text-red-600">
              {errors.whatsapp}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-nivel`} className="mb-1 block text-sm font-semibold text-navy">
            ¿Cómo te describes?
          </label>
          <select
            id={`${formId}-nivel`}
            name="nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value as NivelNegocio)}
            disabled={disabled}
            required
            aria-invalid={Boolean(errors.nivel)}
            aria-describedby={errors.nivel ? `${formId}-nivel-error` : undefined}
            className="w-full rounded-md border border-navy/20 bg-white px-4 py-3 text-navy focus:border-gold-dark focus:outline-none focus:ring-2 focus:ring-gold-dark/40"
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {NIVELES.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
          {errors.nivel && (
            <p id={`${formId}-nivel-error`} className="mt-1 text-sm text-red-600">
              {errors.nivel}
            </p>
          )}
        </div>

        {estado === "error" && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMensaje}
          </p>
        )}

        <button type="submit" disabled={disabled} className="btn-cta w-full">
          {estado === "loading"
            ? "Un momento..."
            : estado === "success"
            ? "¡Te registraste! Mira tu email."
            : "Registrarme al webinar"}
        </button>

        <p className="text-center text-xs text-navy/60">
          La capacidad es limitada. Te confirmaremos tu lugar por email en máximo 2 horas.
        </p>
      </form>
    </div>
  );
}
