import "dotenv/config";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { put } from "@vercel/blob";
import { AUDIOS } from "../lib/audioContent";

const LOCAL_AUDIO_DIR = join(process.cwd(), "local-audio");

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "Falta BLOB_READ_WRITE_TOKEN.\n" +
        "En el dashboard de Vercel: Storage → tu Blob store → pestaña .env.local → copia el" +
        " token a soltar-audio-site/.env.local"
    );
    process.exit(1);
  }

  let uploaded = 0;

  for (const audio of AUDIOS) {
    const localPath = join(LOCAL_AUDIO_DIR, `${audio.id}.mp3`);
    if (!existsSync(localPath)) {
      console.log(`⏭  ${audio.id}: no se encontró ${localPath}, se omite.`);
      continue;
    }

    const file = readFileSync(localPath);
    const result = await put(audio.blobPathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: "audio/mpeg",
    });

    uploaded += 1;
    console.log(`✅ ${audio.id} → ${result.pathname} (${(file.length / 1024 / 1024).toFixed(1)} MB)`);
  }

  if (uploaded === 0) {
    console.log(
      `\nNada que subir. Crea la carpeta "local-audio/" (junto a package.json) y coloca ahí` +
        ` los archivos: ${AUDIOS.map((a) => `${a.id}.mp3`).join(", ")}`
    );
  } else {
    console.log(`\nListo: ${uploaded} audio(s) subido(s) a Vercel Blob.`);
  }
}

main().catch((error) => {
  console.error("Error subiendo audios:", error);
  process.exit(1);
});
