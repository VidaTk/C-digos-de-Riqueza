import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin, requireAuth } from "../middleware/requireAuth";
import { registerSale } from "../services/commissionEngine";

export const salesRouter = Router();

const registerSaleSchema = z
  .object({
    productCode: z.enum(["libro", "curso", "curso_con_descuento", "asesoria"]),
    buyerName: z.string().min(2),
    buyerEmail: z.string().email().optional(),
    buyerPhone: z.string().optional(),
    promoterId: z.string().uuid().optional(),
    promoterEmail: z.string().email().optional(),
    saleDate: z.coerce.date(),
    grossAmount: z.number().positive(),
    notes: z.string().optional(),
  })
  .refine((data) => data.promoterId || data.promoterEmail, {
    message: "Debes indicar promoterId o promoterEmail",
    path: ["promoterEmail"],
  });

// Carga manual de una venta por el admin (Fase 1/2 del MVP: el libro/curso/asesoría
// se venden fuera de la plataforma y aquí solo se registra quién vendió y a quién).
// El admin puede identificar al promotor por email (más práctico) o por id.
salesRouter.post("/", requireAuth, requireAdmin, async (req, res) => {
  const parsed = registerSaleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { promoterEmail, ...data } = parsed.data;
  let promoterId = data.promoterId;

  if (!promoterId && promoterEmail) {
    const promoter = await prisma.user.findUnique({ where: { email: promoterEmail } });
    if (!promoter) {
      return res.status(404).json({ error: `No existe ningún aprendiz con el email ${promoterEmail}` });
    }
    promoterId = promoter.id;
  }

  const sale = await registerSale({ ...data, promoterId: promoterId!, enteredByAdminId: req.auth!.userId });
  res.status(201).json(sale);
});

// Últimas transacciones de toda la plataforma, con filtros básicos (Fase 3).
salesRouter.get("/", requireAuth, requireAdmin, async (req, res) => {
  const { estadoMx, product, month } = req.query as { estadoMx?: string; product?: string; month?: string };

  const where: Record<string, unknown> = {};
  if (product) where.product = { code: product };
  if (estadoMx) where.promoter = { estadoMx };
  if (month) {
    const [year, monthNum] = month.split("-").map(Number);
    where.saleDate = {
      gte: new Date(Date.UTC(year, monthNum - 1, 1)),
      lt: new Date(Date.UTC(year, monthNum, 1)),
    };
  }

  const sales = await prisma.sale.findMany({
    where,
    include: { product: true, promoter: { select: { name: true, promoterCode: true } } },
    orderBy: { saleDate: "desc" },
    take: 50,
  });

  res.json(sales);
});
