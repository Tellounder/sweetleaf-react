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
```

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
