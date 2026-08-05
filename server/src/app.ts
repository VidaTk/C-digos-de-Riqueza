import cors from "cors";
import express from "express";
import { env } from "./lib/env";
import { authRouter } from "./routes/auth";
import { dashboardRouter } from "./routes/dashboard";
import { paymentsRouter } from "./routes/payments";
import { salesRouter } from "./routes/sales";
import { stripeWebhookHandler } from "./routes/stripeWebhook";

// App de Express sin app.listen() — la comparten el entrypoint local
// (src/index.ts) y el entrypoint serverless de Vercel (api/index.ts).
export const app = express();

app.use(cors({ origin: env.corsOrigin }));

// Debe ir ANTES de express.json(): Stripe necesita el body sin parsear para
// verificar la firma del webhook.
app.post("/payments/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/sales", salesRouter);
app.use("/payments", paymentsRouter);
