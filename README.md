# Códigos de Riqueza — Backoffice

Plataforma de backoffice para el sistema multinivel de "Los Códigos de Riqueza en el Multinivel".
Gestiona registro de aprendices, comisiones de 2 niveles, membresías y reportes para el equipo.

**Este repositorio es privado y no debe publicarse ni compartirse fuera del equipo del proyecto.**

## Estado actual (Semana 1 del cronograma)

Construido y probado en esta sesión:

- Esquema de base de datos completo (Prisma / PostgreSQL) — ver `server/prisma/schema.prisma`.
- Registro de usuarios con generación automática de enlace de promotor (`?p=codigo`).
- Login con JWT, roles `aprendiz` / `admin`.
- Motor de cálculo de comisiones:
  - Nivel 1 (directa): 25%, escalando a 30% en Curso **desde la venta #3** del mes calendario (confirmado con el cliente).
  - Nivel 2: se paga únicamente al referidor directo del promotor (no transitivo).
  - Liberación de comisiones a 10 días de la venta, vía cron diario (6:00 AM hora CDMX).
- Endpoint de carga manual de ventas (solo admin) y dashboard del aprendiz (`GET /dashboard/me`).
- Seed de catálogo de productos (Libro, Curso, Curso con descuento, Asesoría) y umbrales de rango/XP.

Validado localmente end-to-end: registro con referido → login → venta → comisión nivel 1 y 2 →
dashboard reflejando los montos correctos, y control de acceso (401/403) funcionando.

**Pendiente (ver `docs/decisiones.md` y el cronograma original):**
- Integración real de pagos (Stripe **y** MercadoPago) para la membresía.
- Exportación CSV para Skool.
- Frontend (React) — dashboards de aprendiz y admin.
- Endpoint de retiros y reporte de comisiones semanal (jueves mediodía).
- Descarga de datos del mes en Excel.

## Stack

- **Backend**: Node.js + Express + TypeScript, Prisma ORM.
- **Base de datos**: PostgreSQL (recomendado: Neon o Supabase para compatibilidad serverless con Vercel).
- **Frontend** (próximo paso): React + Vite + TypeScript.
- **Hosting**: Vercel.

## Setup local

```bash
cd server
cp .env.example .env   # completa DATABASE_URL, JWT_SECRET, etc.
npm install
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev             # http://localhost:4000
```

### Variables de entorno clave (`server/.env`)

Ver `server/.env.example` para la lista completa. Nunca se commitea `.env` real (está en `.gitignore`).

## Estructura

```
server/
  prisma/schema.prisma     # modelo de datos completo
  prisma/seed.ts           # catálogo de productos + umbrales de rango
  src/routes/               # auth, dashboard, sales
  src/services/             # motor de comisiones
  src/middleware/           # requireAuth, requireAdmin
client/                     # (pendiente) frontend React
docs/decisiones.md          # decisiones de negocio confirmadas con el cliente
```

## Seguridad

- Contraseñas con bcrypt (12 rounds), sesiones vía JWT.
- Cada aprendiz solo puede ver `/dashboard/me` (sus propios datos); rutas de admin protegidas por rol.
- CURP y CLABE se almacenan en texto plano por ahora — **antes de producción** hay que evaluar cifrado en reposo para estos campos.
