import { customAlphabet } from "nanoid";
import { prisma } from "../lib/prisma";

const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
const suffix = customAlphabet(alphabet, 4);

const DIACRITICS_REGEX = new RegExp("[̀-ͯ]", "g");

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20);
}

// Genera un promoter_code único tipo "antonio_xyz" a partir del nombre.
export async function generatePromoterCode(name: string): Promise<string> {
  const base = slugify(name) || "aprendiz";

  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = attempt === 0 ? base : `${base}_${suffix()}`;
    const existing = await prisma.user.findUnique({ where: { promoterCode: candidate } });
    if (!existing) return candidate;
  }

  throw new Error("No se pudo generar un promoter_code único, intenta de nuevo");
}
