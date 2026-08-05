import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { code: "libro" },
    update: {},
    create: {
      code: "libro",
      name: "Libro físico",
      basePrice: 349,
      commissionL1Pct: 25,
      commissionL2Pct: 10,
    },
  });

  await prisma.product.upsert({
    where: { code: "curso" },
    update: {},
    create: {
      code: "curso",
      name: "Curso digital",
      basePrice: 2349,
      commissionL1Pct: 25,
      commissionL1PctTier2: 30,
      tier2MinMonthlySales: 3, // 30% aplica desde la venta #3 del mes en adelante
      commissionL2Pct: 10,
    },
  });

  await prisma.product.upsert({
    where: { code: "curso_con_descuento" },
    update: {},
    create: {
      code: "curso_con_descuento",
      name: "Curso digital (ya compró el libro)",
      basePrice: 1999,
      commissionL1Pct: 25,
      commissionL1PctTier2: 30,
      tier2MinMonthlySales: 3,
      commissionL2Pct: 10,
    },
  });

  await prisma.product.upsert({
    where: { code: "asesoria" },
    update: {},
    create: {
      code: "asesoria",
      name: "Asesoría",
      basePrice: 0, // precio variable, se captura por venta
      commissionL1Pct: 25,
      commissionL2Pct: 10,
    },
  });

  const ranks: { rankName: "Aprendiz" | "Hierro" | "Plata" | "Oro" | "Legendario"; xpRequired: number; sortOrder: number }[] = [
    { rankName: "Aprendiz", xpRequired: 0, sortOrder: 1 },
    { rankName: "Hierro", xpRequired: 500, sortOrder: 2 },
    { rankName: "Plata", xpRequired: 1500, sortOrder: 3 },
    { rankName: "Oro", xpRequired: 4000, sortOrder: 4 },
    { rankName: "Legendario", xpRequired: 10000, sortOrder: 5 },
  ];

  for (const rank of ranks) {
    await prisma.rankThreshold.upsert({
      where: { rankName: rank.rankName },
      update: rank,
      create: rank,
    });
  }

  console.log("Seed completado: productos y rangos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
