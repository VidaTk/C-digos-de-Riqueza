# Yo Soy Líder Profesional — Landing del Webinar

Landing de ventas para el webinar gratuito "Cómo construir un equipo que no
dependa de ti". Construida con Next.js 14 (App Router), TypeScript y
Tailwind CSS.

Este directorio es una app independiente dentro del monorepo (mismo patrón
que `client/` y `server/`): tiene su propio `package.json` y se despliega
como su propio proyecto de Vercel, con **Root Directory: `landing`**. No
forma parte de los workspaces de `server`/`client` ni depende de ellos.

```bash
cd landing
npm install
npm run dev   # http://localhost:3000
```

## Rutas

| Ruta | Qué es |
|---|---|
| `/webinar` | Landing principal de ventas. Aquí apuntan los anuncios de Meta. |
| `/` | Redirige a `/webinar`. |
| `/capitulo-1` | Página independiente del capítulo 1. |
| `/gracias` | Confirmación después de registrarse. |
| `/api/register` | Route Handler que valida y reenvía el registro a Google Sheets. |

## Correr en local

```bash
npm install
cp .env.local.example .env.local   # y llena las variables (ver abajo)
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Sin `.env.local`, el formulario sigue funcionando en la interfaz pero
`/api/register` devolverá un error controlado porque no hay
`GOOGLE_SHEETS_WEBHOOK_URL` configurada.

## Variables de entorno

Ver `.env.local.example`. Resumen:

- `GOOGLE_SHEETS_WEBHOOK_URL` — URL del Google Apps Script Web App que
  recibe los registros (instrucciones abajo).
- `NEXT_PUBLIC_META_PIXEL_ID` — ID del Pixel de Meta. Si se omite, el
  pixel simplemente no se carga (no rompe el sitio).
- `NEXT_PUBLIC_SITE_URL` — URL pública del sitio, usada en metadata y
  Open Graph.

## Configurar Google Apps Script (destino del formulario)

1. Crea una hoja de cálculo nueva en Google Sheets. En la primera fila,
   agrega las columnas: `nombre`, `correo`, `whatsapp`, `nivel`, `origen`,
   `fecha_registro`, `utm_source`, `utm_medium`, `utm_campaign`,
   `utm_term`, `utm_content`.
2. Abre **Extensiones → Apps Script**.
3. Reemplaza el contenido de `Código.gs` con algo como:

   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);

     sheet.appendRow([
       data.nombre,
       data.correo,
       data.whatsapp,
       data.nivel,
       data.origen,
       data.fecha_registro,
       data.utm_source || "",
       data.utm_medium || "",
       data.utm_campaign || "",
       data.utm_term || "",
       data.utm_content || "",
     ]);

     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

4. Haz clic en **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo (tu cuenta)**.
   - Quién tiene acceso: **Cualquier usuario**.
5. Copia la URL que termina en `/exec` y pégala en `GOOGLE_SHEETS_WEBHOOK_URL`
   (local: `.env.local`; producción: variables de entorno en Vercel).
6. Cada vez que edites el script, vuelve a implementar (**Gestionar
   implementaciones → editar → nueva versión**) para que el cambio se
   publique.

## Desplegar en Vercel

Este repositorio es un monorepo con varios proyectos independientes
(`server`, `client`, `landing`). Cada uno se despliega como su propio
proyecto de Vercel, apuntando a su propia carpeta.

1. En [vercel.com](https://vercel.com), **Add New → Project** y selecciona
   este repositorio.
2. En **Root Directory**, selecciona `landing`.
3. Framework preset: Next.js (detectado automático). No requiere build
   command especial.
4. En **Environment Variables**, agrega las mismas variables de
   `.env.local.example`.
5. Deploy. Vercel construye y publica automáticamente en cada push a la
   rama principal.
6. Configura el dominio final apuntando `/` (que redirige a `/webinar`)
   como la URL que usarás en los anuncios de Meta, o usa `/webinar`
   directamente en el anuncio.

## Pixel de Meta

Se carga vía `next/script` con estrategia `afterInteractive` en
`app/layout.tsx`, solo si `NEXT_PUBLIC_META_PIXEL_ID` está definida.

Eventos disparados:

- `PageView` — al cargar cualquier página.
- `ViewContent` — a los 15 segundos en `/webinar`.
- `ScrollProgreso` (evento personalizado) — al pasar 25%, 50% y 75% del
  scroll de la página (una sola vez cada umbral).
- `Lead` — al hacer clic en "Registrarme al webinar".
- `RegistroExitoso` (evento personalizado) — al llegar a `/gracias`.

## Configuración de la oferta

Todo lo relacionado a fechas, capacidad y precios vive en
`config/oferta.ts`: fecha y hora del webinar (con zona horaria de CDMX
embebida en el ISO string), capacidad total y lugares restantes, y los
detalles de la oferta especial. Está hardcoded para lanzar rápido, pero
centralizado para actualizarse fácilmente o conectarse a una fuente
dinámica más adelante.

## Estructura del proyecto

```
app/
  page.tsx                 → redirect a /webinar
  webinar/page.tsx          → landing principal
  capitulo-1/page.tsx       → página independiente
  gracias/page.tsx          → confirmación
  api/register/route.ts     → recibe el formulario, valida, reenvía a Sheets
  layout.tsx                → fonts, metadata, Meta Pixel
components/
  webinar/                  → las 12 secciones de la landing + formulario
  PixelEvents.tsx           → scroll tracking + ViewContent a los 15s
  RegistroExitosoTracker.tsx→ dispara RegistroExitoso en /gracias
config/oferta.ts            → fechas, capacidad, oferta
lib/                        → validación, UTMs, countdown, helpers de pixel
```
