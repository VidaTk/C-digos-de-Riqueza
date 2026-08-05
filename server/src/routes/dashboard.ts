import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

export const dashboardRouter = Router();

function monthRange(offsetMonths: number, reference = new Date()) {
  const start = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + offsetMonths, 1));
  const end = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + offsetMonths + 1, 1));
  return { start, end };
}

function sumCommission(sales: { promoterId: string; uplineId: string | null; commissionL1Amount: unknown; commissionL2Amount: unknown }[], userId: string) {
  return sales.reduce((total, sale) => {
    let owed = 0;
    if (sale.promoterId === userId) owed += Number(sale.commissionL1Amount);
    if (sale.uplineId === userId) owed += Number(sale.commissionL2Amount ?? 0);
    return total + owed;
  }, 0);
}

// Dashboard del aprendiz autenticado: rango/XP, comisiones por periodo, red,
// ventas propias, comisiones de nivel 2 y últimas transacciones.
dashboardRouter.get("/me", requireAuth, async (req, res) => {
  const userId = req.auth!.userId;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { referrals: { select: { id: true, name: true } } },
  });

  const thisMonth = monthRange(0);
  const lastMonth = monthRange(-1);

  const [salesThisMonth, salesLastMonth, allRelevantSales, mySales, recentSales] = await Promise.all([
    prisma.sale.findMany({
      where: {
        OR: [{ promoterId: userId }, { uplineId: userId }],
        saleDate: { gte: thisMonth.start, lt: thisMonth.end },
        status: { not: "reembolsada" },
      },
      select: { promoterId: true, uplineId: true, commissionL1Amount: true, commissionL2Amount: true },
    }),
    prisma.sale.findMany({
      where: {
        OR: [{ promoterId: userId }, { uplineId: userId }],
        saleDate: { gte: lastMonth.start, lt: lastMonth.end },
        status: { not: "reembolsada" },
      },
      select: { promoterId: true, uplineId: true, commissionL1Amount: true, commissionL2Amount: true },
    }),
    prisma.sale.findMany({
      where: { OR: [{ promoterId: userId }, { uplineId: userId }], status: { not: "reembolsada" } },
      select: { promoterId: true, uplineId: true, commissionL1Amount: true, commissionL2Amount: true },
    }),
    prisma.sale.findMany({
      where: { promoterId: userId, status: { not: "reembolsada" } },
      include: { product: true },
    }),
    prisma.sale.findMany({
      where: { OR: [{ promoterId: userId }, { uplineId: userId }] },
      include: { product: true },
      orderBy: { saleDate: "desc" },
      take: 10,
    }),
  ]);

  const salesByProduct: Record<string, { count: number; amount: number }> = {};
  for (const sale of mySales) {
    const key = sale.product.code;
    salesByProduct[key] ??= { count: 0, amount: 0 };
    salesByProduct[key].count += 1;
    salesByProduct[key].amount += Number(sale.grossAmount);
  }

  const myLevel2Sales = await prisma.sale.findMany({
    where: { uplineId: userId, status: { not: "reembolsada" } },
    include: { product: true, promoter: { select: { name: true } } },
    orderBy: { saleDate: "desc" },
  });

  res.json({
    profile: {
      name: user.name,
      email: user.email,
      promoterCode: user.promoterCode,
      promoterLink: `${process.env.APP_BASE_URL ?? ""}/?p=${user.promoterCode}`,
      rank: user.rank,
      xp: user.xp,
      membershipStatus: user.membershipStatus,
    },
    commissions: {
      thisMonth: sumCommission(salesThisMonth, userId),
      lastMonth: sumCommission(salesLastMonth, userId),
      allTime: sumCommission(allRelevantSales, userId),
    },
    network: {
      totalDirectReferrals: user.referrals.length,
    },
    salesByProduct,
    level2Sales: myLevel2Sales.map((s) => ({
      buyerName: s.buyerName,
      productName: s.product.name,
      soldBy: s.promoter.name,
      saleDate: s.saleDate,
      myCommission: Number(s.commissionL2Amount ?? 0),
      commissionStatus: s.commissionStatus,
    })),
    recentTransactions: recentSales.map((s) => ({
      date: s.saleDate,
      product: s.product.name,
      grossAmount: Number(s.grossAmount),
      myCommission:
        s.promoterId === userId ? Number(s.commissionL1Amount) : Number(s.commissionL2Amount ?? 0),
      status: s.status,
      commissionStatus: s.commissionStatus,
    })),
  });
});
