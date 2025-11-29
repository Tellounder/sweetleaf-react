import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { designFallback } from "../src/content/designFallback";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

loadEnv({ path: path.join(projectRoot, ".env.local"), override: true });
loadEnv({ path: path.join(projectRoot, ".env"), override: true });

const baseUrl =
  process.env.SYNC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  process.env.VITE_API_BASE_URL ??
  "http://localhost:3000/api";

const apiKey =
  process.env.SYNC_API_KEY ??
  process.env.API_KEY ??
  process.env.VITE_API_KEY ??
  process.env.VITE_ADMIN_API_KEY;

if (!apiKey) {
  console.error(
    "Faltan credenciales. Definí SYNC_API_KEY o API_KEY en tu entorno (.env.local).",
  );
  process.exit(1);
}

async function upsertBlock(blockKey: string, content: Record<string, unknown>) {
  const response = await fetch(`${baseUrl}/design/blocks/${blockKey}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      label: blockKey,
      content,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(
      `PUT ${blockKey} falló (${response.status}): ${payload ?? "sin detalle"}`,
    );
  }
}

async function publishBlock(blockKey: string, content: { display?: boolean }) {
  const response = await fetch(`${baseUrl}/publish-status/${blockKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      isPublished: content.display !== false,
      bumpVersion: true,
      publishedBy: "sync-script",
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(
      `PATCH ${blockKey} falló (${response.status}): ${payload ?? "sin detalle"}`,
    );
  }
}

async function main() {
  const entries = Object.entries(designFallback);
  console.log(
    `Sincronizando ${entries.length} bloques con ${baseUrl} usando ${process.env.NODE_ENV ?? "local"} env`,
  );

  for (const [blockKey, content] of entries) {
    try {
      console.log(`→ ${blockKey}`);
      await upsertBlock(blockKey, content);
      await publishBlock(blockKey, content as { display?: boolean });
      console.log(`   listo`);
    } catch (error) {
      console.error(`   ⚠️  Error en ${blockKey}:`, error);
      process.exitCode = 1;
      break;
    }
  }

  if (process.exitCode === 0 || process.exitCode === undefined) {
    console.log("✅ Bloques sincronizados.");
  } else {
    console.log("La sincronización se detuvo por errores.");
  }
}

main();
