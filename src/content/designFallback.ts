import { products } from "./products";
import { aboutText } from "./about";
import { offers } from "./offers";
import { benefits as benefitCards } from "./benefits";
import { cbdBenefitsDetail, cbdIntro } from "./cbd";

export type HeroHomeContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  backgroundImages?: string[];
  customImages?: string[];
  useSystemImages?: boolean;
  maxImages?: number;
};

export type RespaldoStat = {
  label: string;
  value: string;
};

export type RespaldoSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  stats: RespaldoStat[];
};

export type CatalogProduct = {
  id: string;
  name: string;
  price: string;
  suggested: string;
  description: string;
  image: string;
};

export type CatalogSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  products: CatalogProduct[];
};

export type LogisticsSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  bullets: string[];
  pill: string;
};

export type PaymentOption = {
  title: string;
  description: string;
};

export type PaymentsSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  options: PaymentOption[];
};

export type WholesaleSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  paragraph: string;
  bullets: string[];
};

export type HomeHeroPetContent = {
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  pill: string;
  image: string;
};

export type HomePetSectionContent = {
  display?: boolean;
  hero: HomeHeroPetContent;
};

export type HomeAboutSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  text: string;
  pill: string;
};

export type OfferCardContent = {
  id: string;
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  tag: string;
  bonus: string;
};

export type HomeOffersSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  offers: OfferCardContent[];
};

export type BenefitCardContent = {
  title: string;
  description: string;
};

export type HomeBenefitsSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  benefits: BenefitCardContent[];
};

export type IacaBlockContent = {
  title: string;
  description?: string;
  bullets?: string[];
};

export type HomeIacaSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  intro: string;
  blocks: IacaBlockContent[];
};

export type HomeContactSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
};

export type CbdIntroCard = {
  title: string;
  paragraphs: string[];
  pill?: string;
};

export type CbdIntroSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  cards: CbdIntroCard[];
};

export type CbdBenefitsSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  benefits: BenefitCardContent[];
};

export type CbdFaqCard = {
  title: string;
  text: string;
};

export type CbdFaqSectionContent = {
  display?: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  cards: CbdFaqCard[];
};

export type PetBenefit = {
  title: string;
  description: string;
};

export type PetDoseRow = {
  weight: string;
  dose: string;
};

export type PetFaq = {
  title: string;
  text: string;
};

export type PetSectionContent = {
  display?: boolean;
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    bulletPoints: string[];
    image: string;
    pill: string;
  };
  benefits: PetBenefit[];
  doseGuide: PetDoseRow[];
  doseNote: string;
  faqs: PetFaq[];
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
  };
};

export type HeaderLink = {
  label: string;
  href: string;
  type?: "route" | "anchor" | "external";
};

export type HeaderMiniAction = HeaderLink & {
  icon?: string;
  behavior?: "scrollTop";
};

export type HeaderContent = {
  display?: boolean;
  brandTitle: string;
  brandSubtitle?: string;
  whatsappLink: string;
  navLinks: HeaderLink[];
  miniLinks: HeaderMiniAction[];
  backgroundImage?: string;
  useSystemBackground?: boolean;
};

export const designFallback = {
  "hero.home": {
    display: true,
    kicker: "Orgánico y no psicoactivo",
    title: "CBD de alta concentración diseñado en la región",
    subtitle:
      "Aceites y cremas elaborados con estándares de laboratorio, trazabilidad total y cultivos ecológicos de Argentina y Uruguay.",
    ctaPrimary: { label: "Ver productos", href: "/productos" },
    ctaSecondary: { label: "Saber sobre CBD", href: "/cbd" },
    backgroundImages: [
      "/img/2.webp",
      "/img/campo.webp",
      "/img/fondo.webp",
      "/img/1.webp",
      "/img/7.webp",
    ],
    customImages: [],
    useSystemImages: true,
    maxImages: 10,
} satisfies HeroHomeContent,
  "header.main": {
    display: true,
    brandTitle: "Sweet Leaf",
    brandSubtitle: "Río de La Plata",
    whatsappLink:
      "https://wa.me/541127975134?text=Hola%20Sweet%20Leaf%20R%C3%ADo%20de%20La%20Plata,%20quiero%20realizar%20una%20consulta.",
    navLinks: [
      { label: "Inicio", href: "/", type: "route" },
      { label: "Nosotros", href: "#quienes", type: "anchor" },
      { label: "Tienda", href: "/productos", type: "route" },
      { label: "Contacto", href: "#contacto", type: "anchor" },
    ],
    miniLinks: [
      { label: "Inicio", href: "/", icon: "fa-house", behavior: "scrollTop" },
      { label: "Tienda", href: "/productos", icon: "fa-store", type: "route" },
      { label: "Contacto", href: "#contacto", icon: "fa-envelope", type: "anchor" },
    ],
    backgroundImage: "/img/principal.webp",
    useSystemBackground: true,
  } satisfies HeaderContent,
  "section.respaldo": {
    display: true,
    kicker: "Respaldo",
    title: "Calidad que se siente y se comprueba",
    subtitle:
      "Cuidamos la cadena completa: cultivo, extracción, testeo y empaque. Todo medido para entregarte un CBD estable y sin sorpresas.",
    stats: [
      { label: "Años de experiencia", value: "10+" },
      { label: "Tests por lote", value: "3" },
      { label: "THC", value: "0%" },
      { label: "Origen", value: "AR / UY" },
    ],
  } satisfies RespaldoSectionContent,
  "catalog.products": {
    display: true,
    kicker: "Catálogo",
    title: "Productos 100% naturales",
    subtitle:
      "CBD orgánico de máxima concentración, formulado para bienestar cotidiano.",
    products: products,
  } satisfies CatalogSectionContent,
  "section.logistics": {
    display: true,
    kicker: "Logística",
    title: "Envíos en 24 horas a todo el país",
    subtitle:
      "Despachamos en 24 horas por correo o transporte, con embalaje cuidado para que llegue perfecto.",
    bullets: [
      "Envíos express en CABA y GBA en menos de 12 horas.",
      "Interior del país con tracking en tiempo real y seguro incluido.",
      "Pick-up concertado para profesionales o ventas mayoristas.",
    ],
    pill: "Seguimiento automático • Embalaje discreto",
  } satisfies LogisticsSectionContent,
  "section.payments": {
    display: true,
    kicker: "Pagos",
    title: "Cuotas y medios disponibles",
    subtitle:
      "Elegí el medio que mejor se adapte: tarjetas, transferencias o links de pago.",
    options: [
      {
        title: "Tarjetas",
        description: "Hasta 3 cuotas sin interés en bancos seleccionados.",
      },
      {
        title: "Transferencia",
        description: "5% off abonando por transferencia o cuenta DNI.",
      },
      {
        title: "Links de pago",
        description: "Enviamos link directo y factura digital.",
      },
    ],
  } satisfies PaymentsSectionContent,
  "section.wholesale": {
    display: true,
    kicker: "Profesionales",
    title: "Programa mayorista",
    subtitle:
      "Acompañamos a clínicas, terapeutas y distribuidores con stock asegurado.",
    paragraph:
      "Packs desde 12 unidades, fichas técnicas personalizadas y soporte para onboarding de pacientes.",
    bullets: [
      "Listados exclusivos con márgenes sugeridos.",
      "Entrega escalonada o almacenaje sin costo.",
      "Acompañamiento comercial y materiales de marca.",
    ],
  } satisfies WholesaleSectionContent,
  "home.pet": {
    display: true,
    hero: {
      kicker: "Mascotas",
      title: "Sweet Leaf Pet",
      subtitle:
        "Aceite específico para perros y gatos con 8 mg/ml de CBD, dosificador y respaldo veterinario.",
      description:
        "Nuestra línea Pet acompaña a mascotas con dolores crónicos, trastornos emocionales y cuadros de epilepsia idiopática. El extracto se formula para entregar una experiencia calmante y segura.",
      bulletPoints: [
        "Alivio en articulaciones y huesos doloridos",
        "Control de irritabilidad y agresividad en gatos",
        "Disminución de frecuencia e intensidad de convulsiones",
        "Reducción de procesos inflamatorios (artritis, IBD)",
        "Apoyo en situaciones de estrés o ansiedad",
      ],
      pill: "100% natural y dosificación precisa",
      image: "/img/pet.webp",
    },
  } satisfies HomePetSectionContent,
  "home.about": {
    display: true,
    kicker: "Quiénes somos",
    title: "Sweet Leaf Río de La Plata",
    subtitle:
      "Productos honestos, procesos cuidados y educación responsable sobre el impacto medicinal del cannabis.",
    text: aboutText,
    pill: "Calidad asegurada • No psicoactivos",
  } satisfies HomeAboutSectionContent,
  "home.offers": {
    display: true,
    kicker: "Ofertas activas",
    title: "Si estás listo, hoy hay bonus",
    subtitle: "Combos pensados para iniciar o mejorar tu rutina con envío y extras incluidos.",
    offers: offers,
  } satisfies HomeOffersSectionContent,
  "home.benefits": {
    display: true,
    kicker: "Beneficios",
    title: "El CBD que te acompaña en tu rutina",
    subtitle:
      "Propiedades significativas respaldadas por evidencia emergente y una comunidad creciente de usuarios.",
    benefits: benefitCards,
  } satisfies HomeBenefitsSectionContent,
  "home.iaca": {
    display: true,
    kicker: "Calidad certificada",
    title: "IACA Laboratorios",
    subtitle:
      "Trabajamos junto a uno de los primeros laboratorios autorizados del país para controlar aceites, extractos y flores de cannabis.",
    intro:
      "El equipo de IACA valida cada lote con métodos HPLC para conocer con precisión la presencia de cannabinoides y asegurar un uso terapéutico efectivo.",
    blocks: [
      {
        title: "Cuantificación de cannabinoides",
        description: "THC, THCA, CBD, CBDA y CBN mediante HPLC para aceites y extractos.",
      },
      {
        title: "Análisis microbiológico",
        bullets: ["Bacterias aerobias y enterobacterias", "Hongos y levaduras", "Salmonella, Listeria, E. Coli"],
      },
      {
        title: "Metales pesados",
        bullets: ["Arsénico y Plomo", "Cadmio y Mercurio"],
      },
      {
        title: "Perfil de terpenos",
        description:
          "Determinación cromatográfica en flores secas para conocer el impacto aromático y terapéutico de cada variedad.",
      },
    ],
  } satisfies HomeIacaSectionContent,
  "home.contact": {
    display: true,
    kicker: "Consultas",
    title: "Hablemos por WhatsApp",
    subtitle: "Contanos tus dudas o qué buscás. Sumamos tu carrito en el mensaje para agilizar la respuesta.",
  } satisfies HomeContactSectionContent,
  "cbd.intro": {
    display: true,
    kicker: "Conocimiento",
    title: "¿Qué es el CBD?",
    subtitle: cbdIntro,
    cards: [
      {
        title: "Impacto medicinal",
        paragraphs: [cbdBenefitsDetail],
        pill: "No psicoactivo • Trazable",
      },
      {
        title: "Cómo lo elaboramos",
        paragraphs: [
          "Partimos de cultivos ecológicos y seleccionamos biomasa rica en CBD. Utilizamos extracción cuidada, filtrado y controles de potencia que garantizan pureza y concentración consistente.",
          "Cada lote es testeado y envasado con buenas prácticas de manufactura.",
        ],
      },
    ],
  } satisfies CbdIntroSectionContent,
  "cbd.benefits": {
    display: true,
    kicker: "Beneficios",
    title: "Propiedades más citadas",
    subtitle:
      "Los ensayos clínicos siguen avanzando; estos son los usos con mayor tracción.",
    benefits: benefitCards,
  } satisfies CbdBenefitsSectionContent,
  "cbd.faq": {
    display: true,
    kicker: "Guía rápida",
    title: "Uso responsable y preguntas frecuentes",
    subtitle: "Recomendaciones para iniciar microdosis y coordinar con profesionales.",
    cards: [
      {
        title: "Dosis inicial",
        text: "Comenzar con 0,25 ml dos veces al día, sostener durante 5 días y ajustar según respuesta. Siempre consultar con el especialista tratante.",
      },
      {
        title: "Seguridad",
        text: "Nuestros aceites son libres de THC psicoactivo y cuentan con certificados de análisis por lote.",
      },
      {
        title: "Interacciones",
        text: "Evitar mezclar con fármacos sin supervisión médica y registrar cualquier cambio en el descanso, apetito o ánimo.",
      },
    ],
  } satisfies CbdFaqSectionContent,
  "section.pet": {
    hero: {
      kicker: "Mascotas",
      title: "Sweet Leaf Pet",
      subtitle:
        "Aceite de CBD full spectrum 8 mg/ml con pipeta dosificadora, pensado para perros y gatos.",
      description:
        "Trabajamos fórmulas específicas libres de transgénicos, gluten y azúcares. Cada lote se controla para asegurar potencia constante y ausencia de pesticidas.",
      bulletPoints: [
        "Alivio de dolores crónicos y procesos inflamatorios.",
        "Modulación de estrés, agresividad o hipersensibilidad.",
        "Soporte en epilepsia idiopática y recuperación post quirúrgica.",
      ],
      image: "/img/pet.webp",
      pill: "Incluye guía de uso personalizada",
    },
    benefits: [
      {
        title: "Bienestar articular",
        description:
          "Reduce inflamación en caderas, columna y articulaciones, ideal para mascotas senior o con displasia.",
      },
      {
        title: "Gestión del ánimo",
        description:
          "Disminuye la ansiedad por separación y modula respuestas ante ruidos o viajes.",
      },
      {
        title: "Apoyo neurológico",
        description:
          "Casos de epilepsia idiopática muestran menor frecuencia de convulsiones bajo supervisión veterinaria.",
      },
    ],
    doseGuide: [
      { weight: "Hasta 5 kg", dose: "1-2 gotas cada 12 h" },
      { weight: "5 a 15 kg", dose: "3-4 gotas cada 12 h" },
      { weight: "> 15 kg", dose: "5-8 gotas cada 12 h" },
    ],
    doseNote:
      "Administrar directamente en la boca o sobre alimento húmedo. Incrementar gradualmente 1 gota por semana si no se observa respuesta.",
    faqs: [
      {
        title: "¿Cuándo veo resultados?",
        text: "En dolores agudos se percibe en minutos; en cuadros crónicos recomendamos sostener 10 a 14 días.",
      },
      {
        title: "¿Pueden tomarlo gatos?",
        text: "Sí. Ajustamos con pipeta milimetrada y monitoreamos cambios en apetito y ánimo.",
      },
      {
        title: "¿Necesito receta?",
        text: "No es obligatoria, pero trabajamos con veterinarios aliados para acompañar cada caso clínico.",
      },
    ],
    contact: {
      kicker: "Contacto",
      title: "Asesoramiento inmediato",
      subtitle:
        "Te ayudamos a definir dosis y seguimiento con nuestro equipo veterinario aliado.",
    },
  } satisfies PetSectionContent,
};

export type DesignFallback = typeof designFallback;
