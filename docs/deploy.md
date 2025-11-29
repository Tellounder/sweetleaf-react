# SweetLeaf Frontend – Deploy Guide

## 1. Requisitos previos

- Repo actualizado (`main` o el branch que vayas a publicar).
- `.env.local` con:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SUPABASE_BUCKET`
  - `VITE_API_BASE_URL` (URL pública de la API Nest)
  - `SYNC_API_KEY` (la misma key que usás en `/admin`, opcional para `sync:design`)
- Node 20+ y npm 10+.

## 2. Inicializar contenido en la API (opcional)

Si tu API está vacía, podés cargar el fallback actual con:

```bash
SYNC_API_KEY=tu_api_key \
VITE_API_BASE_URL=https://tu-api/render/api \
npm run sync:design
```

Este script recorre `src/content/designFallback.ts`, sube cada bloque y lo marca como publicado.

## 3. Build local

```bash
npm install
npm run build
npm run preview   # verificación rápida
```

Si todo luce bien, podés subir `dist/` a cualquier hosting estático.

## 4. Deploy en Firebase Hosting (ejemplo)

1. `npm install -g firebase-tools`
2. `firebase login`
3. `firebase use <tu-proyecto>`
4. `npm run build`
5. `firebase deploy`

> `firebase.json` ya está configurado para publicar `dist`.

## 5. Deploy alternativo (Netlify / Vercel)

- **Comando de build**: `npm run build`
- **Directorio de salida**: `dist`
- Asegurate de definir las variables `VITE_*` y `SYNC_API_KEY` en el panel del proveedor.

## 6. Checklist final

- ✅ API responde en `GET /api/health`.
- ✅ `VITE_API_BASE_URL` apunta al dominio definitivo.
- ✅ `bucket sweetleaf-assets` existe y tiene políticas `INSERT/SELECT` para `anon`.
- ✅ `npm run sync:design` ejecutado (si necesitabas poblar contenido) o bloques creados manualmente desde el admin.
- ✅ `firebase deploy` (o equivalente) completado sin warnings críticos.
