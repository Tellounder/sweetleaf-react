import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDesignBlocks } from "../context/DesignContentContext";

type LinkType = "route" | "anchor" | "external";

function resolveLinkType(href: string, explicit?: LinkType) {
  if (explicit) return explicit;
  if (href.startsWith("/")) return "route";
  if (href.startsWith("http")) return "external";
  return "anchor";
}

const DEFAULT_HEADER_BG = "/img/principal.webp";

export function Header() {
  const location = useLocation();
  const { blocks } = useDesignBlocks();
  const headerContent = blocks["header.main"];
  const [open, setOpen] = useState(false);
  const [compactBar, setCompactBar] = useState(false);
  const [scrollThreshold, setScrollThreshold] = useState(260);
  const headerRef = useRef<HTMLElement>(null);

  // Cierra el menú al cambiar de ancho (ej. pasar a desktop)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 840 && open) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const syncThreshold = useCallback(() => {
    const height = headerRef.current?.getBoundingClientRect().height ?? 0;
    setScrollThreshold(Math.max(160, height + 40));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > scrollThreshold;
      setCompactBar(shouldShow);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollThreshold]);

  useEffect(() => {
    syncThreshold();
    window.addEventListener("resize", syncThreshold);
    return () => window.removeEventListener("resize", syncThreshold);
  }, [syncThreshold]);

  useEffect(() => {
    syncThreshold();
  }, [open, syncThreshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const headerDisplay = headerContent.display ?? true;
  const showHeader = headerContent.__meta.isPublished && headerDisplay;

  if (!showHeader) {
    return null;
  }

  const navLinks = headerContent.navLinks ?? [];
  const miniLinks = headerContent.miniLinks ?? [];
  const whatsappLink = headerContent.whatsappLink;
  const backgroundImage = useMemo(() => {
    const showSystem = headerContent.useSystemBackground ?? true;
    if (!showSystem) {
      return headerContent.backgroundImage || undefined;
    }
    return headerContent.backgroundImage ?? DEFAULT_HEADER_BG;
  }, [headerContent.backgroundImage, headerContent.useSystemBackground]);
  const isAdminRoute = location.pathname.startsWith("/admin");

  const renderNavLink = (link: (typeof navLinks)[number], context: string) => {
    const type = resolveLinkType(link.href, link.type);
    const key = `${context}-${link.label}`;
    if (type === "route") {
      return (
        <NavLink
          key={key}
          to={link.href}
          className={({ isActive }) => (isActive ? "active" : undefined)}
          onClick={() => setOpen(false)}
        >
          {link.label}
        </NavLink>
      );
    }
    return (
      <a
        key={key}
        href={link.href}
        target={type === "external" ? "_blank" : undefined}
        rel={type === "external" ? "noreferrer" : undefined}
        onClick={() => setOpen(false)}
      >
        {link.label}
      </a>
    );
  };

  const renderMiniLink = (link: (typeof miniLinks)[number], index: number) => {
    const type = resolveLinkType(link.href, link.type);
    const content = (
      <>
        {link.icon && <i className={`fa-solid ${link.icon}`} aria-hidden />}
        <span>{link.label}</span>
      </>
    );

    if (link.behavior === "scrollTop") {
      return (
        <button
          key={`mini-${index}`}
          type="button"
          className="mini-link"
          onClick={() => {
            scrollToTop();
            setOpen(false);
          }}
        >
          {content}
        </button>
      );
    }

    if (type === "route") {
      return (
        <NavLink
          key={`mini-${index}`}
          to={link.href}
          className="mini-link"
          onClick={() => setOpen(false)}
        >
          {content}
        </NavLink>
      );
    }

    return (
      <a
        key={`mini-${index}`}
        className="mini-link"
        href={link.href}
        target={type === "external" ? "_blank" : undefined}
        rel={type === "external" ? "noreferrer" : undefined}
        onClick={() => setOpen(false)}
      >
        {content}
      </a>
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`header-bar ${open ? "is-open" : ""}`}
        style={
          backgroundImage
            ? { backgroundImage: `url(${backgroundImage})` }
            : { backgroundImage: "none" }
        }
      >
        <div className="header-inner container">
          <a className="brand" href="/">
            <span className="brand-title">{headerContent.brandTitle}</span>
            {headerContent.brandSubtitle && (
              <small>{headerContent.brandSubtitle}</small>
            )}
          </a>
          
          <div className="header-actions">
            <button
              className="hamburger"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <i className="fa-solid fa-bars-staggered" aria-hidden />
            </button>
          </div>
        </div>
      </header>
      <div className={`nav-shell ${open ? "is-open" : ""}`}>
        <div className="container">
          <nav className="nav-menu" aria-label="Menú principal">
            {navLinks.map((link) => renderNavLink(link, "drawer"))}
          </nav>
        </div>
      </div>
      {!isAdminRoute && (
        <div
          className={`mini-header ${
            compactBar && !open ? "is-visible" : ""
          }`}
        >
          <div className="mini-actions">
            {miniLinks.map((link, index) => renderMiniLink(link, index))}
          </div>
          <a
            className="mini-cta"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-whatsapp" aria-hidden />
            <span>WhatsApp</span>
          </a>
        </div>
      )}
    </>
  );
}
