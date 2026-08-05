import cron from "node-cron";
import { app } from "./app";
import { env } from "./lib/env";
import { releaseMaturedCommissions } from "./services/commissionEngine";

// Entrypoint SOLO para desarrollo local (`npm run dev` / `npm start`).
// En Vercel se usa api/index.ts en su lugar — ahí no corre este cron porque
// las funciones serverless no mantienen procesos vivos; ese caso se resuelve
// con un Vercel Cron Job pegándole a un endpoint (pendiente, ver README).

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
