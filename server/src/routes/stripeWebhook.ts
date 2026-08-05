import { RequestHandler } from "express";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";
import { env } from "../lib/env";

// IMPORTANTE: esta ruta se monta en index.ts con express.raw() ANTES del
// express.json() global — Stripe exige el body sin parsear para verificar
// la firma. Si se monta después de express.json(), la verificación falla.
export const stripeWebhookHandler: RequestHandler = async (req, res) => {
  if (!stripe || !env.stripeWebhookSecret) {
    return res.status(503).send("Stripe no está configurado");
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).send("Falta el header stripe-signature");
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
  } catch (err) {
    return res.status(400).send(`Firma inválida: ${(err as Error).message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        await activateMembership(session);
      }
      break;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await markPaymentFailed(session);
      break;
    }
  }

  res.json({ received: true });
};

// Idempotente: si ya se procesó este pago (status ya es "pagado"), no repite
// la activación — necesario porque Stripe puede reintentar el mismo evento.
async function activateMembership(session: Stripe.Checkout.Session) {
  const membershipPaymentId = session.metadata?.membershipPaymentId;
  if (!membershipPaymentId) return;

  const payment = await prisma.membershipPayment.findUnique({ where: { id: membershipPaymentId } });
  if (!payment || payment.status === "pagado") return;

  await prisma.$transaction([
    prisma.membershipPayment.update({
      where: { id: membershipPaymentId },
      data: { status: "pagado", transactionId: session.id },
    }),
    prisma.user.update({
      where: { id: payment.userId },
      data: { membershipStatus: "activo", membershipExpiresAt: payment.periodEnd },
    }),
  ]);
}

async function markPaymentFailed(session: Stripe.Checkout.Session) {
  const membershipPaymentId = session.metadata?.membershipPaymentId;
  if (!membershipPaymentId) return;
  await prisma.membershipPayment.updateMany({
    where: { id: membershipPaymentId, status: "pendiente" },
    data: { status: "fallido" },
  });
}
