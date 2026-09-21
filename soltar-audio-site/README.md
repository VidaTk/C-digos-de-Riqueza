# Soltar — sitio de audios (Ely González)

Sitio protegido con contraseña para alojar los 5 audios de duelo, en
`soltar.elygonzalez.com`. Next.js (App Router) + API routes serverless,
pensado para desplegarse en Vercel.

## Cómo funciona la protección

1. **Contraseña única** (`SITE_PASSWORD`): `POST /api/login` la valida
   (comparación en tiempo constante) y, si es correcta, entrega una cookie
   `httpOnly` firmada (HMAC) con 30 días de expiración. Sin registro, sin
   email.
2. **Middleware** (`middleware.ts`): protege todas las páginas — si no hay
   cookie de sesión válida, redirige a `/login`.
3. **Audio nunca expuesto como link directo**:
   - Los 5 mp3 viven en **Vercel Blob**, no en `/public` ni en el repo.
   - El navegador jamás recibe la URL real del blob. Al cargar la página,
     cada reproductor pide `GET /api/audio/[id]`, que primero verifica la
     cookie de sesión y luego devuelve una URL **firmada y temporal**
     (`/api/stream/[id]?token=...`, válida unas horas).
   - `GET /api/stream/[id]` vuelve a verificar la cookie de sesión **y** la
     firma/expiración del token en cada solicitud, y recién entonces hace
     de proxy hacia Vercel Blob (reenviando el header `Range` para poder
     adelantar/atrasar), transmitiendo los bytes — nunca una redirección a
     la URL real.
   - En el `<audio>` se usa `controlsList="nodownload"` y se bloquea el
     menú de clic derecho, como capa adicional.

   **Aclaración**: esto disuade la descarga casual (como en plataformas de
   cursos/membresías). No es cifrado a nivel de archivo — alguien con
   suficiente conocimiento técnico y una sesión activa podría capturar el
   audio mientras se reproduce. Es la protección estándar para este tipo de
   contenido.
4. **Acceso**: una vez ingresada la contraseña, la sesión dura 30 días (sin
   fecha de expiración del contenido en sí).

## Setup local

```bash
cd soltar-audio-site
npm install
cp .env.example .env.local
# completa SESSION_SECRET / STREAM_SECRET (openssl rand -hex 32) y,
# si vas a probar el streaming real, BLOB_READ_WRITE_TOKEN
npm run dev
```

Sin `BLOB_READ_WRITE_TOKEN` puedes probar login/sesión/diseño; el
streaming de audio real requiere el Blob store conectado.

## Subir los 5 audios a Vercel Blob

1. En el proyecto de Vercel: **Storage → Create Database → Blob** (una vez
   creado, Vercel inyecta `BLOB_READ_WRITE_TOKEN` automáticamente en el
   proyecto desplegado).
2. Para subirlos desde tu máquina: copia el token desde la pestaña
   **.env.local** del store a `soltar-audio-site/.env.local`.
3. Crea la carpeta `soltar-audio-site/local-audio/` (no se commitea) y
   coloca ahí los archivos con estos nombres exactos:
   `audio-1.mp3`, `audio-2.mp3`, `audio-3.mp3`, `audio-4.mp3`, `audio-5.mp3`.
4. Corre:
   ```bash
   npm run upload-audio
   ```
   Esto sube cada archivo a la ruta esperada dentro del Blob store
   (`audios/audio-1.mp3`, etc. — ver `lib/audioContent.ts`).

Para reemplazar un audio más adelante, basta con volver a correr el script
con el archivo nuevo (mismo nombre) — no requiere redeploy.

## Cargar los títulos y subtítulos reales

Edita `lib/audioContent.ts` y reemplaza los placeholders
(`Título 1` / `Subtítulo 1`, etc.) por el contenido real que pase Ely.

## Deploy en Vercel

Este repo ya tiene otros proyectos (`server/`, `client/`) desplegados cada
uno como un proyecto de Vercel independiente con distinto "Root Directory".
Sigue el mismo patrón:

1. **New Project** en Vercel → importa este repo → **Root Directory:**
   `soltar-audio-site`.
2. Variables de entorno del proyecto (Settings → Environment Variables):
   - `SITE_PASSWORD` = `SoltarSep21`
   - `SESSION_SECRET` = (genera uno único con `openssl rand -hex 32`)
   - `STREAM_SECRET` = (otro valor único, distinto del anterior)
   - `BLOB_READ_WRITE_TOKEN` se agrega solo al conectar el Blob store
     (paso siguiente).
3. **Storage → Create Database → Blob** dentro de este mismo proyecto de
   Vercel, y conéctalo. Luego corre `npm run upload-audio` (ver arriba)
   para subir los 5 audios.
4. **Settings → Domains** → agrega `soltar.elygonzalez.com` y sigue las
   instrucciones de DNS que muestra Vercel (un registro `CNAME` apuntando
   al dominio del proyecto, o los que indique el panel si el dominio raíz
   `elygonzalez.com` ya está en Vercel).

## Estructura

```
app/
  page.tsx              # lista de los 5 audios (protegida por middleware)
  login/page.tsx         # pantalla de contraseña
  api/login/route.ts     # valida contraseña, crea cookie de sesión
  api/logout/route.ts    # borra la cookie
  api/audio/[id]/route.ts   # emite URL de streaming firmada y temporal
  api/stream/[id]/route.ts  # proxy autenticado hacia Vercel Blob (con Range)
components/
  AudioPlayer.tsx         # reproductor HTML5 por audio
  LoginForm.tsx / LogoutButton.tsx
lib/
  session.ts / signedUrl.ts / crypto.ts   # firma HMAC (cookie + URLs)
  audioContent.ts         # títulos/subtítulos/rutas de los 5 audios
  blob.ts                 # resuelve la URL real en Vercel Blob (server-side)
  password.ts / env.ts
scripts/upload-audio.ts   # sube local-audio/*.mp3 a Vercel Blob
middleware.ts              # exige sesión válida para ver el sitio
```
