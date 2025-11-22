import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const menuLinks = [
  { to: "/", label: "Inicio" },
  { to: "#quienes", label: "Nosotros" },
  { to: "/productos", label: "Tienda" },
  { to: "#contacto", label: "Contacto" },
];

export function Header() {
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

  const whatsappLink =
    "https://wa.me/541127975134?text=Hola%20Sweet%20Leaf%20R%C3%ADo%20de%20La%20Plata,%20quiero%20realizar%20una%20consulta.";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <>
      <header ref={headerRef} className={`header-bar ${open ? "is-open" : ""}`}>
        <div className="header-inner container">
          <a className="brand" href="/">
            <span className="brand-title">Sweet Leaf</span>
            <small>Río de La Plata</small>
          </a>
          <nav className="primary-nav" aria-label="Secciones principales">
            {menuLinks.map((link) =>
              link.to.startsWith("#") ? (
                <a key={link.label} href={link.to}>
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>
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
            {menuLinks.map((link) =>
              link.to.startsWith("#") ? (
                <a
                  key={`drawer-${link.label}`}
                  href={link.to}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={`drawer-${link.to}`}
                  to={link.to}
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>
        </div>
      </div>
      <div
        className={`mini-header ${
          compactBar && !open ? "is-visible" : ""
        }`}
      >
        <div className="mini-actions">
          <button type="button" className="mini-link" onClick={scrollToTop}>
            <i className="fa-solid fa-house" aria-hidden />
            <span>Inicio</span>
          </button>
          <NavLink to="/productos" className="mini-link">
            <i className="fa-solid fa-store" aria-hidden />
            <span>Tienda</span>
          </NavLink>
          <a className="mini-link" href="#contacto">
            <i className="fa-solid fa-envelope" aria-hidden />
            <span>Contacto</span>
          </a>
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
    </>
  );
}
