import { app } from "../src/app";

// Entrypoint serverless de Vercel: exporta la app de Express directamente,
// @vercel/node la sirve como una función Node normal (sin app.listen()).
// El vercel.json de esta carpeta reescribe TODAS las rutas hacia acá para
// que Express reciba la URL original (/auth/login, /dashboard/me, etc.)
export default app;
