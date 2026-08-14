import { NextResponse } from "next/server";
import { validarRegistro, esValido, type NivelNegocio } from "@/lib/validation";
import type { UtmParams } from "@/lib/utm";

interface RegisterRequestBody {
  nombre: string;
  correo: string;
  whatsapp: string;
  nivel: NivelNegocio | "";
  origen?: string;
  utm?: UtmParams;
}

export async function POST(request: Request) {
  let body: RegisterRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const { nombre, correo, whatsapp, nivel } = body;
  const errors = validarRegistro({ nombre, correo, whatsapp, nivel });

  if (!esValido(errors)) {
    return NextResponse.json(
      { error: "Revisa los datos del formulario.", errors },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL no está configurada.");
    return NextResponse.json(
      { error: "El registro no está disponible en este momento. Intenta más tarde." },
      { status: 500 }
    );
  }

  const payload = {
    nombre: nombre.trim(),
    correo: correo.trim(),
    whatsapp: whatsapp.replace(/\D/g, ""),
    nivel,
    origen: body.origen ?? "desconocido",
    fecha_registro: new Date().toISOString(),
    ...body.utm,
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Google Apps Script respondió ${res.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando registro a Google Sheets:", err);
    return NextResponse.json(
      { error: "No pudimos guardar tu registro. Intenta de nuevo en un momento." },
      { status: 502 }
    );
  }
}
