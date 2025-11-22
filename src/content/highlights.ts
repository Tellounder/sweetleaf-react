export type HighlightItem = {
  href: string;
  title: string;
  caption?: string;
  icon?: string;
};

export const highlightsByRoute: Record<string, HighlightItem[]> = {
  home: [
    { href: "/productos", title: "Packs", caption: "-15%", icon: "fa-boxes-stacked" },
    { href: "/cbd", title: "CBD", caption: "¿Qué es?", icon: "fa-cannabis" },
    { href: "#ofertas", title: "Nuevos", caption: "Lotes", icon: "fa-star" },
    { href: "#beneficios", title: "Top", caption: "Rutina", icon: "fa-chart-line" },
    { href: "#contacto", title: "Dudas", caption: "Soporte", icon: "fa-comments" },
    { href: "/pet", title: "Pet", caption: "Mascotas", icon: "fa-paw" },
    { href: "/iaca", title: "IACA", caption: "Laboratorio", icon: "fa-flask" },
    { href: "/productos#envios", title: "Envíos", caption: "24h", icon: "fa-truck-fast" },
  ],
  productos: [
    { href: "#productos", title: "Catálogo", caption: "Line up", icon: "fa-tags" },
    { href: "#envios", title: "Envíos", caption: "24h", icon: "fa-truck" },
    { href: "#pagos", title: "Pagos", caption: "Cuotas", icon: "fa-credit-card" },
    { href: "#mayoristas", title: "Mayoristas", caption: "Pack 12", icon: "fa-people-carry" },
    { href: "/pet", title: "Pet", caption: "8 mg/ml", icon: "fa-paw" },
    { href: "/iaca", title: "IACA", caption: "Control", icon: "fa-microscope" },
  ],
  cbd: [
    { href: "#cbd", title: "Intro", caption: "Definición", icon: "fa-book-open" },
    { href: "#propiedades", title: "Beneficios", caption: "+ evid.", icon: "fa-heart-pulse" },
    { href: "#faq-cbd", title: "Uso", caption: "Dosis", icon: "fa-droplet" },
    { href: "/productos", title: "Tienda", caption: "Ver todo", icon: "fa-store" },
  ],
  pet: [
    { href: "#pet-inicio", title: "Pet", caption: "Presentación", icon: "fa-paw" },
    { href: "#beneficios-pet", title: "Beneficios", caption: "Rutina", icon: "fa-heart" },
    { href: "#dosis-pet", title: "Dosis", caption: "mg/kg", icon: "fa-ruler-vertical" },
    { href: "#faq-pet", title: "FAQs", caption: "Cuidados", icon: "fa-circle-question" },
    { href: "#contacto-pet", title: "Contacto", caption: "WhatsApp", icon: "fa-comments" },
  ],
  iaca: [
    { href: "#analisis", title: "Análisis", caption: "HPLC", icon: "fa-chart-line" },
    { href: "#micro", title: "Micro", caption: "Cultivos", icon: "fa-bacteria" },
    { href: "#metales", title: "Metales", caption: "4 trazas", icon: "fa-scale-balanced" },
    { href: "#terpenos", title: "Terpenos", caption: "Perfil", icon: "fa-seedling" },
    { href: "#contacto-lab", title: "Contacto", caption: "Turnos", icon: "fa-envelope-open-text" },
  ],
  default: [
    { href: "/", title: "Sweet Leaf", caption: "Home", icon: "fa-house" },
    { href: "/productos", title: "Tienda", caption: "Catálogo", icon: "fa-store" },
  ],
};

const routeKeyMap: Record<string, keyof typeof highlightsByRoute> = {
  "/": "home",
  "/productos": "productos",
  "/cbd": "cbd",
  "/pet": "pet",
  "/iaca": "iaca",
};

export function getHighlightsForPath(pathname: string): HighlightItem[] {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const key = routeKeyMap[normalized] ?? "default";
  return highlightsByRoute[key] ?? [];
}
