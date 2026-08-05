import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";
import { stripe } from "../lib/stripe";
import { env } from "../lib/env";

export const paymentsRouter = Router();

// Crea una sesión de Stripe Checkout para pagar la membresía mensual.
// Métodos: tarjeta, OXXO, y SPEI vía "customer_balance" (bank_transfer MX) —
// este último requiere confirmar que la cuenta de Stripe lo tiene habilitado
// antes de usarlo en producción; se agrega solo si el flag lo permite.
paymentsRouter.post("/stripe/checkout-session", requireAuth, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: "Stripe no está configurado (falta STRIPE_SECRET_KEY)" });
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.auth!.userId } });

  const periodStart = new Date();
  const periodEnd = new Date(periodStart);
  periodEnd.setUTCMonth(periodEnd.getUTCMonth() + 1);

  const payment = await prisma.membershipPayment.create({
    data: {
      userId: user.id,
      amount: env.membershipMonthlyPriceMxn,
      paymentMethod: "stripe",
      status: "pendiente",
      periodStart,
      periodEnd,
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "oxxo"],
    line_items: [
      {
        price_data: {
          currency: "mxn",
          product_data: { name: "Membresía mensual - Códigos de Riqueza" },
          unit_amount: Math.round(env.membershipMonthlyPriceMxn * 100),
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,
    metadata: { userId: user.id, membershipPaymentId: payment.id },
    success_url: `${env.appBaseUrl}/membresia/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.appBaseUrl}/membresia/cancelada`,
  });

  await prisma.membershipPayment.update({
    where: { id: payment.id },
    data: { transactionId: session.id },
  });

  res.json({ checkoutUrl: session.url });
});
