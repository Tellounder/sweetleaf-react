# Sweet Leaf Río de La Plata – Versión 1

Sitio responsive basado en Vite + React + TypeScript para la marca Sweet Leaf. El objetivo es ofrecer una experiencia mobile-first que integre catálogo, beneficios, programas especiales (Pet, IACA) y contacto inmediato por WhatsApp.

## Arquitectura

- **Vite + React + TypeScript** para un desarrollo rápido y tipado estricto.
- **React Router** para secciones internas (`/`, `/productos`, `/cbd`, `/pet`, `/iaca`).
- **Contexto de carrito** (`CartContext`) con modal de checkout y redirección a WhatsApp.
- **Componentes reutilizables** (`Hero`, `Section`, `HighlightsBar`, `OfferCard`, `ProductCard`…).  
- **Firebase Hosting** listo para deploy (configuración incluida en `firebase.json`).

## Estilos y diseño

- Mobile first con tokens en `src/styles/tokens.css`.
- Gradientes animados, glows, glassmorphism y microinteracciones.
- Carrusel superior de “highlights” dependiente de la ruta actual.
- Mini-header flotante + botón de carrito flotante que acompañan el scroll.

## Rutas principales

| Ruta        | Contenido                                                                 |
|-------------|----------------------------------------------------------------------------|
| `/`         | Hero principal, carrusel de highlights, secciones Respaldo/Pet/Quienes/Ofertas/Beneficios/IACA. |
| `/productos`| Catálogo y detalles de logística, pagos y programa mayorista.              |
| `/cbd`      | Información educativa, beneficios, usos responsables.                      |
| `/pet`      | Línea mascotas con guía de dosis, FAQs y contacto.                         |
| `/iaca`     | Información del laboratorio aliado y procesos de control.                  |

## Scripts

```bash
npm install        # instala dependencias
npm run dev        # entorno local (Vite)
npm run build      # build de producción
npm run preview    # vista previa del build
npm run sync:design # sube el fallback actual al CMS (usa API key del admin)
```

`npm run sync:design` lee `src/content/designFallback.ts`, llama al backend (`VITE_API_BASE_URL`) y crea/publica cada bloque con la API key definida en `.env.local` (`SYNC_API_KEY` o `API_KEY`). Ideal para inicializar una base nueva antes de entrar al admin.

## Variables de entorno clave

Crear un archivo `.env.local` (ya contemplado en el repo) con las credenciales de Supabase que permiten subir assets desde el constructor `/admin`:

```
VITE_SUPABASE_URL=https://xdghzptxuapxlwviwgxi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZ2h6cHR4dWFweGx3dml3Z3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDExMjMsImV4cCI6MjA3OTgxNzEyM30.bhXw2lk-f1ZDw1zJoMBZ-j-AjBjmd5MfNZXh25nIEKE
VITE_SUPABASE_BUCKET=sweetleaf-assets
VITE_API_BASE_URL=http://localhost:3000/api
# opcional para npm run sync:design
SYNC_API_KEY=local-dev-api-key
```

> Recordá crear el bucket `sweetleaf-assets` en Supabase Storage (o ajustar el nombre en las variables) y usar la **service_role** en el backend Nest.

## Flujo para publicar (ejemplo GitHub)

```bash
git init
git add -A
git commit -m "Version 1"
git branch -M main
git remote add origin https://github.com/Tellounder/sweetleaf-react.git
git push -u origin main
```

> Reemplazá la URL del remoto por la que corresponda a tu cuenta.  
> Para deploy en Firebase: `npm run build` y luego `firebase deploy` (ya configurado).*** End Patch
