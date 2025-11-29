import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useDesignBlocks } from "../context/DesignContentContext";
import { HeaderBuilder } from "../components/admin/HeaderBuilder";
import { HeroBuilder } from "../components/admin/HeroBuilder";
import { RespaldoBuilder } from "../components/admin/RespaldoBuilder";
import { ProductsBuilder } from "../components/admin/ProductsBuilder";
import { LogisticsBuilder } from "../components/admin/LogisticsBuilder";
import { PaymentsBuilder } from "../components/admin/PaymentsBuilder";
import { WholesaleBuilder } from "../components/admin/WholesaleBuilder";
import { PetBuilder } from "../components/admin/PetBuilder";
import { HomePetBuilder } from "../components/admin/HomePetBuilder";
import { HomeAboutBuilder } from "../components/admin/HomeAboutBuilder";
import { HomeOffersBuilder } from "../components/admin/HomeOffersBuilder";
import { HomeBenefitsBuilder } from "../components/admin/HomeBenefitsBuilder";
import { HomeIacaBuilder } from "../components/admin/HomeIacaBuilder";
import { HomeContactBuilder } from "../components/admin/HomeContactBuilder";
import { CbdIntroBuilder } from "../components/admin/CbdIntroBuilder";
import { CbdBenefitsBuilder } from "../components/admin/CbdBenefitsBuilder";
import { CbdFaqBuilder } from "../components/admin/CbdFaqBuilder";
type SectionConfig = {
  id: string;
  label: string;
  render: () => ReactNode;
};

type SidebarSection = {
  id: SectionId;
  label: string;
  description: string;
  anchors: { id: string; label: string }[];
};

type SectionId = "home" | "productos" | "pet" | "cbd" | "global";

const FIRST_PANEL_BY_SECTION: Record<SectionId, string> = {
  home: "home-hero",
  productos: "products-catalog",
  pet: "pet-builder",
  cbd: "cbd-intro",
  global: "global-header",
};

import type {
  HeaderContent,
  HeroHomeContent,
  RespaldoSectionContent,
  CatalogSectionContent,
  LogisticsSectionContent,
  PaymentsSectionContent,
  WholesaleSectionContent,
  PetSectionContent,
  HomePetSectionContent,
  HomeAboutSectionContent,
  HomeOffersSectionContent,
  HomeBenefitsSectionContent,
  HomeIacaSectionContent,
  HomeContactSectionContent,
  CbdIntroSectionContent,
  CbdBenefitsSectionContent,
  CbdFaqSectionContent,
} from "../content/designFallback";

function usePersistedKey(key: string, initial = "") {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initial;
    return localStorage.getItem(key) ?? initial;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function AdminPage() {
  const { blocks, status, error, apiBaseUrl, refresh } = useDesignBlocks();
  const headerBlock = blocks["header.main"];
  const heroBlock = blocks["hero.home"];
  const respaldoBlock = blocks["section.respaldo"];
  const catalogBlock = blocks["catalog.products"];
  const logisticsBlock = blocks["section.logistics"];
  const paymentsBlock = blocks["section.payments"];
  const wholesaleBlock = blocks["section.wholesale"];
  const petBlock = blocks["section.pet"];
  const homePetSectionBlock = blocks["home.pet"];
  const homeAboutSectionBlock = blocks["home.about"];
  const homeOffersBlock = blocks["home.offers"];
  const homeBenefitsBlock = blocks["home.benefits"];
  const homeIacaBlock = blocks["home.iaca"];
  const homeContactBlock = blocks["home.contact"];
  const cbdIntroBlock = blocks["cbd.intro"];
  const cbdBenefitsBlock = blocks["cbd.benefits"];
  const cbdFaqBlock = blocks["cbd.faq"];
  const [apiKey, setApiKey] = usePersistedKey("sweetleaf-admin-key", "");

  const apiReady = Boolean(apiBaseUrl && apiKey);

  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [openPanels, setOpenPanels] = useState<Record<string, string | null>>(
    {},
  );

  const apiWarning = useMemo(() => {
    if (status === "loading") return "Sincronizando bloques…";
    if (status === "error") return error ?? "No se pudo obtener el contenido.";
    if (!apiBaseUrl)
      return "Aún no hay API configurada. Se usan fallbacks locales.";
    if (!apiKey) return "Ingresá la API key para poder guardar cambios.";
    return null;
  }, [apiBaseUrl, apiKey, error, status]);

  const homeSectionsConfig: SectionConfig[] = [
    {
      id: "home-hero",
      label: "Hero principal",
      render: () => (
        <HeroBuilder
          block={heroBlock}
          onSave={(content) => updateBlock("hero.home", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("hero.home", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("hero.home", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "home-respaldo",
      label: "Respaldo",
      render: () => (
        <RespaldoBuilder
          block={respaldoBlock}
          onSave={(content) => updateBlock("section.respaldo", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("section.respaldo", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("section.respaldo", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "home-pet-preview",
      label: "Pet (home)",
      render: () => (
        <HomePetBuilder
          block={homePetSectionBlock}
          onSave={(content) => updateBlock("home.pet", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("home.pet", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("home.pet", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "home-about",
      label: "Quiénes somos",
      render: () => (
        <HomeAboutBuilder
          block={homeAboutSectionBlock}
          onSave={(content) => updateBlock("home.about", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("home.about", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("home.about", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "home-offers",
      label: "Ofertas",
      render: () => (
        <HomeOffersBuilder
          block={homeOffersBlock}
          onSave={(content) => updateBlock("home.offers", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("home.offers", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("home.offers", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "home-benefits",
      label: "Beneficios",
      render: () => (
        <HomeBenefitsBuilder
          block={homeBenefitsBlock}
          onSave={(content) => updateBlock("home.benefits", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("home.benefits", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("home.benefits", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "home-iaca",
      label: "IACA",
      render: () => (
        <HomeIacaBuilder
          block={homeIacaBlock}
          onSave={(content) => updateBlock("home.iaca", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("home.iaca", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("home.iaca", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "home-contact",
      label: "Contacto",
      render: () => (
        <HomeContactBuilder
          block={homeContactBlock}
          onSave={(content) => updateBlock("home.contact", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("home.contact", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("home.contact", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
  ];

  const productSectionsConfig: SectionConfig[] = [
    {
      id: "products-catalog",
      label: "Catálogo",
      render: () => (
        <ProductsBuilder
          block={catalogBlock}
          onSave={(content) => updateBlock("catalog.products", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("catalog.products", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("catalog.products", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "products-logistics",
      label: "Logística",
      render: () => (
        <LogisticsBuilder
          block={logisticsBlock}
          onSave={(content) => updateBlock("section.logistics", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("section.logistics", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("section.logistics", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "products-payments",
      label: "Pagos",
      render: () => (
        <PaymentsBuilder
          block={paymentsBlock}
          onSave={(content) => updateBlock("section.payments", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("section.payments", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("section.payments", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "products-wholesale",
      label: "Mayoristas",
      render: () => (
        <WholesaleBuilder
          block={wholesaleBlock}
          onSave={(content) => updateBlock("section.wholesale", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("section.wholesale", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("section.wholesale", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
  ];

  const petSectionsConfig: SectionConfig[] = [
    {
      id: "pet-builder",
      label: "Página Pet",
      render: () => (
        <PetBuilder
          block={petBlock}
          onSave={(content) => updateBlock("section.pet", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("section.pet", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("section.pet", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
  ];

  const cbdSectionsConfig: SectionConfig[] = [
    {
      id: "cbd-intro",
      label: "Intro educativo",
      render: () => (
        <CbdIntroBuilder
          block={cbdIntroBlock}
          onSave={(content) => updateBlock("cbd.intro", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("cbd.intro", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("cbd.intro", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "cbd-benefits",
      label: "Beneficios",
      render: () => (
        <CbdBenefitsBuilder
          block={cbdBenefitsBlock}
          onSave={(content) => updateBlock("cbd.benefits", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("cbd.benefits", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("cbd.benefits", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
    {
      id: "cbd-faq",
      label: "Preguntas frecuentes",
      render: () => (
        <CbdFaqBuilder
          block={cbdFaqBlock}
          onSave={(content) => updateBlock("cbd.faq", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("cbd.faq", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("cbd.faq", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
  ];

  const globalSectionsConfig: SectionConfig[] = [
    {
      id: "global-header",
      label: "Header principal",
      render: () => (
        <HeaderBuilder
          block={headerBlock}
          onSave={(content) => updateBlock("header.main", content)}
          onPublishToggle={(next) =>
            updatePublishStatus("header.main", { isPublished: next })
          }
          onBumpVersion={() =>
            updatePublishStatus("header.main", { bumpVersion: true })
          }
          apiReady={apiReady}
        />
      ),
    },
  ];

  const navSections: SidebarSection[] = [
    {
      id: "home",
      label: "Home",
      description: "Hero, métricas, ofertas, beneficios.",
      anchors: homeSectionsConfig.map(({ id, label }) => ({ id, label })),
    },
    {
      id: "productos",
      label: "Productos",
      description: "Catálogo, logística, pagos y mayoristas.",
      anchors: productSectionsConfig.map(({ id, label }) => ({ id, label })),
    },
    {
      id: "pet",
      label: "Pet",
      description: "Sección mascotas completa.",
      anchors: petSectionsConfig.map(({ id, label }) => ({ id, label })),
    },
    {
      id: "cbd",
      label: "CBD",
      description: "Contenido educativo y guía rápida.",
      anchors: cbdSectionsConfig.map(({ id, label }) => ({ id, label })),
    },
    {
      id: "global",
      label: "Global",
      description: "Header e imagen general del sitio.",
      anchors: globalSectionsConfig.map(({ id, label }) => ({ id, label })),
    },
  ];

  useEffect(() => {
    const firstPanel = FIRST_PANEL_BY_SECTION[activeSection] ?? null;
    setOpenPanels((prev) => ({
      ...prev,
      [activeSection]: firstPanel,
    }));
  }, [activeSection]);

  const toggleAccordion = (sectionGroup: string, accordionId: string) => {
    setOpenPanels((prev) => {
      const nextOpen =
        prev[sectionGroup] === accordionId ? null : accordionId;
      return { ...prev, [sectionGroup]: nextOpen };
    });
  };

  const renderSections = (sections: SectionConfig[], sectionGroup: string) => (
    <div className="stack gap-md">
      {sections.map((section) => (
        <AdminAccordion
          key={section.id}
          id={section.id}
          title={section.label}
          isOpen={openPanels[sectionGroup] === section.id}
          onToggle={() => toggleAccordion(sectionGroup, section.id)}
        >
          {section.render()}
        </AdminAccordion>
      ))}
    </div>
  );

  const callApi = async (path: string, init: RequestInit) => {
    if (!apiBaseUrl) {
      throw new Error("Falta configurar VITE_API_BASE_URL.");
    }
    if (!apiKey) {
      throw new Error("Ingresá la API key del CMS.");
    }
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        ...(init.headers || {}),
      },
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message ?? `Error ${response.status}`);
    }
    return response;
  };

  type EditableBlocks =
    | "hero.home"
    | "header.main"
    | "section.respaldo"
    | "catalog.products"
    | "section.logistics"
    | "section.payments"
    | "section.wholesale"
    | "section.pet"
    | "home.pet"
    | "home.about"
    | "home.offers"
    | "home.benefits"
    | "home.iaca"
    | "home.contact"
    | "cbd.intro"
    | "cbd.benefits"
    | "cbd.faq";

  const updateBlock = async (
    blockKey: EditableBlocks,
    content:
      | HeroHomeContent
      | HeaderContent
      | RespaldoSectionContent
      | CatalogSectionContent
      | LogisticsSectionContent
      | PaymentsSectionContent
      | WholesaleSectionContent
      | PetSectionContent
      | HomePetSectionContent
      | HomeAboutSectionContent
      | HomeOffersSectionContent
      | HomeBenefitsSectionContent
      | HomeIacaSectionContent
      | HomeContactSectionContent
      | CbdIntroSectionContent
      | CbdBenefitsSectionContent
      | CbdFaqSectionContent,
  ) => {
    await callApi(`/design/blocks/${blockKey}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
    await refresh();
  };

  const updatePublishStatus = async (
    blockKey: EditableBlocks,
    body: Record<string, unknown>,
  ) => {
    await callApi(`/publish-status/${blockKey}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    await refresh();
  };

  return (
    <div className="container admin-shell">
      <header className="stack gap-md">
        <div>
          <p className="eyebrow">Owner CMS</p>
          <h1>Constructor SweetLeaf</h1>
          <p className="muted">
            Editá hero y header exactamente como se muestran al público. Las
            imágenes nuevas se suben a Supabase y se publican cuando confirmás los cambios.
          </p>
        </div>

        <div className="admin-status card">
          <div>
            <label htmlFor="admin-api-key">API key</label>
            <input
              id="admin-api-key"
              type="password"
              className="admin-input"
              placeholder="Pegá la API key de Render"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="admin-api-url">API base URL</label>
            <input
              id="admin-api-url"
              className="admin-input"
              value={apiBaseUrl ?? "No configurado"}
              readOnly
            />
          </div>
        </div>

        {apiWarning && <div className="admin-alert">{apiWarning}</div>}
      </header>

      <div className="admin-layout">
        <AdminSidebarSections
          sections={navSections}
          activeSection={activeSection}
          onChange={setActiveSection}
          onOpenAnchor={(sectionId, anchorId) =>
            setOpenPanels((prev) => ({ ...prev, [sectionId]: anchorId }))
          }
        />

        <div className="admin-content">
          {activeSection === "home" &&
            renderSections(homeSectionsConfig, "home")}

          {activeSection === "global" &&
            renderSections(globalSectionsConfig, "global")}

          {activeSection === "productos" &&
            renderSections(productSectionsConfig, "productos")}

          {activeSection === "pet" && renderSections(petSectionsConfig, "pet")}

          {activeSection === "cbd" &&
            renderSections(cbdSectionsConfig, "cbd")}
        </div>
      </div>

      <AdminMobileDock
        onGoTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onRefresh={refresh}
        disabled={!apiReady}
      />
    </div>
  );
}

function AdminSidebarSections({
  sections,
  activeSection,
  onChange,
  onOpenAnchor,
}: {
  sections: SidebarSection[];
  activeSection: SectionId;
  onChange: (section: SectionId) => void;
  onOpenAnchor: (sectionId: SectionId, anchorId: string) => void;
}) {
  const handleAnchorClick = (sectionId: SectionId, anchorId: string) => {
    const scrollToAnchor = () => {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (sectionId !== activeSection) {
      onChange(sectionId);
      onOpenAnchor(sectionId, anchorId);
      setTimeout(scrollToAnchor, 80);
      return;
    }

    onOpenAnchor(sectionId, anchorId);
    scrollToAnchor();
  };

  return (
    <nav className="admin-wireframe">
      <p className="eyebrow">Secciones</p>
      <div className="admin-wireframe-scroll">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <article
              key={section.id}
              className={`admin-wireframe-card ${isActive ? "active" : ""}`}
            >
              <header className="admin-wireframe-head">
                <button
                  type="button"
                  className="admin-tab-button"
                  onClick={() => onChange(section.id)}
                >
                  {section.label}
                </button>
                <p className="muted small">{section.description}</p>
              </header>
              <div className="admin-wireframe-body">
                {section.anchors.map((anchor) => (
                  <button
                    key={anchor.id}
                    type="button"
                    className="admin-wireframe-block"
                    onClick={() => handleAnchorClick(section.id, anchor.id)}
                  >
                    <span className="admin-block-label">{anchor.label}</span>
                    <span className="admin-block-dot" />
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </nav>
  );
}

function AdminAccordion({
  id,
  title,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`admin-accordion ${isOpen ? "open" : ""}`}>
      <header className="admin-accordion-head">
        <button
          type="button"
          className="admin-accordion-toggle"
          onClick={onToggle}
        >
          <span>{title}</span>
          <span className="admin-accordion-icon">{isOpen ? "−" : "+"}</span>
        </button>
      </header>
      {isOpen && <div className="admin-accordion-body">{children}</div>}
    </section>
  );
}

function AdminMobileDock({
  onGoTop,
  onRefresh,
  disabled,
}: {
  onGoTop: () => void;
  onRefresh: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="admin-mobile-dock">
      <button type="button" className="admin-mobile-btn ghost" onClick={onGoTop}>
        Volver arriba
      </button>
      <button
        type="button"
        className="admin-mobile-btn primary"
        onClick={onRefresh}
        disabled={disabled}
      >
        Sincronizar
      </button>
    </div>
  );
}
