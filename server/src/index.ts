import cors from "cors";
import express from "express";
import cron from "node-cron";
import { env } from "./lib/env";
import { authRouter } from "./routes/auth";
import { dashboardRouter } from "./routes/dashboard";
import { salesRouter } from "./routes/sales";
import { releaseMaturedCommissions } from "./services/commissionEngine";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/sales", salesRouter);

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
