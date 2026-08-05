import cors from "cors";
import express from "express";
import cron from "node-cron";
import { env } from "./lib/env";
import { authRouter } from "./routes/auth";
import { dashboardRouter } from "./routes/dashboard";
import { paymentsRouter } from "./routes/payments";
import { salesRouter } from "./routes/sales";
import { stripeWebhookHandler } from "./routes/stripeWebhook";
import { releaseMaturedCommissions } from "./services/commissionEngine";

const app = express();

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

// Libera comisiones maduras (10 días) todos los días a las 06:00 hora CDMX.
cron.schedule(
  "0 6 * * *",
  async () => {
    const released = await releaseMaturedCommissions();
    console.log(`[cron] comisiones liberadas: ${released}`);
  },
  { timezone: "America/Mexico_City" },
);

app.listen(env.port, () => {
  console.log(`Servidor escuchando en http://localhost:${env.port}`);
});
