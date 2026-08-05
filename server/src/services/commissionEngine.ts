import { Prisma, ProductCode } from "@prisma/client";
import { prisma } from "../lib/prisma";

const COMMISSION_RELEASE_DAYS = 10;

interface RegisterSaleInput {
  productCode: ProductCode;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  promoterId: string;
  saleDate: Date;
  grossAmount: number;
  enteredByAdminId: string;
  notes?: string;
}

// Cuenta ventas CONFIRMADAS de este producto por este promotor en el mes de saleDate,
// sin incluir la venta que se está registrando ahora.
async function countConfirmedSalesThisMonth(
  promoterId: string,
  productId: string,
  saleDate: Date,
): Promise<number> {
  const monthStart = new Date(Date.UTC(saleDate.getUTCFullYear(), saleDate.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(saleDate.getUTCFullYear(), saleDate.getUTCMonth() + 1, 1));

  return prisma.sale.count({
    where: {
      promoterId,
      productId,
      status: "confirmada",
      saleDate: { gte: monthStart, lt: monthEnd },
    },
  });
}

// Registra una venta y calcula comisiones de nivel 1 y nivel 2.
// Nivel 1: el promotor directo. Tier alto (ej. 30% del Curso) aplica SOLO
// desde la venta #3 en adelante del mismo producto en el mes calendario.
// Nivel 2: solo se paga al referred_by del promotor (no transitivo, un solo nivel arriba).
export async function registerSale(input: RegisterSaleInput) {
  const product = await prisma.product.findUniqueOrThrow({ where: { code: input.productCode } });
  const promoter = await prisma.user.findUniqueOrThrow({ where: { id: input.promoterId } });

  let l1Pct = new Prisma.Decimal(product.commissionL1Pct);

  if (product.commissionL1PctTier2 && product.tier2MinMonthlySales) {
    const priorConfirmedThisMonth = await countConfirmedSalesThisMonth(
      promoter.id,
      product.id,
      input.saleDate,
    );
    // La venta actual sería la (priorConfirmedThisMonth + 1)-ésima del mes.
    if (priorConfirmedThisMonth + 1 >= product.tier2MinMonthlySales) {
      l1Pct = new Prisma.Decimal(product.commissionL1PctTier2);
    }
  }

  const grossAmount = new Prisma.Decimal(input.grossAmount);
  const commissionL1Amount = grossAmount.mul(l1Pct).div(100);

  const uplineId = promoter.referredById ?? null;
  const commissionL2Amount = uplineId ? grossAmount.mul(product.commissionL2Pct).div(100) : null;

  const releaseDate = new Date(input.saleDate);
  releaseDate.setUTCDate(releaseDate.getUTCDate() + COMMISSION_RELEASE_DAYS);

  return prisma.sale.create({
    data: {
      productId: product.id,
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      buyerPhone: input.buyerPhone,
      promoterId: promoter.id,
      uplineId: uplineId ?? undefined,
      saleDate: input.saleDate,
      grossAmount,
      commissionL1PctApplied: l1Pct,
      commissionL1Amount,
      commissionL2Amount: commissionL2Amount ?? undefined,
      status: "confirmada",
      commissionReleaseDate: releaseDate,
      commissionStatus: "bloqueada",
      enteredByAdminId: input.enteredByAdminId,
      notes: input.notes,
    },
  });
}

// Libera comisiones cuya fecha de liberación ya pasó y siguen confirmadas (no reembolsadas).
// Pensado para correr diariamente vía cron.
export async function releaseMaturedCommissions(referenceDate: Date = new Date()) {
  const result = await prisma.sale.updateMany({
    where: {
      status: "confirmada",
      commissionStatus: "bloqueada",
      commissionReleaseDate: { lte: referenceDate },
    },
    data: { commissionStatus: "liberada" },
  });
  return result.count;
}
