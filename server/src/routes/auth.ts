import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { hashPassword, signToken, verifyPassword } from "../utils/auth";
import { generatePromoterCode } from "../utils/promoterCode";

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  estadoMx: z.string().min(2),
  curp: z.string().length(18),
  bankName: z.string().min(2),
  clabe: z.string().length(18),
  password: z.string().min(8),
  referredByPromoterCode: z.string().optional(), // viene del ?p= del enlace
});

// Crea el usuario en estado "vencido" (sin membresía activa todavía).
// La activación de membresía ocurre al confirmarse el pago (ver routes/payments.ts).
authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return res.status(409).json({ error: "Ya existe una cuenta con ese email" });
  }

  let referredById: string | undefined;
  if (data.referredByPromoterCode) {
    const referrer = await prisma.user.findUnique({
      where: { promoterCode: data.referredByPromoterCode },
    });
    referredById = referrer?.id;
  }

  const passwordHash = await hashPassword(data.password);
  const promoterCode = await generatePromoterCode(data.name);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      estadoMx: data.estadoMx,
      curp: data.curp,
      bankName: data.bankName,
      clabe: data.clabe,
      passwordHash,
      promoterCode,
      referredById,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, promoterCode: user.promoterCode },
  });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ error: "Email o contraseña incorrectos" });
  }

  const token = signToken({ userId: user.id, role: user.role });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, promoterCode: user.promoterCode, role: user.role },
  });
});
