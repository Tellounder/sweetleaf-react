import { useLocation } from "react-router-dom";
import { useDesignBlocks } from "../context/DesignContentContext";

const keyMetadata = [
  { key: "hero.home", label: "Hero Home" },
  { key: "section.respaldo", label: "Respaldo" },
  { key: "catalog.products", label: "Catálogo" },
  { key: "section.logistics", label: "Logística" },
  { key: "section.pet", label: "Pet" },
] as const;

export function Footer() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const designContent = useDesignBlocks();

  if (isAdmin) {
    return <AdminFooter {...designContent} />;
  }

  return (
    <footer className="footer" id="contacto">
      <div className="container footer-grid">
        <div>
          <div className="brand-title">Sweet Leaf</div>
          <small>Río de La Plata</small>
          <p className="muted" style={{ marginTop: 8 }}>
            Aceites y cremas con cannabidiol orgánico de alta concentración.
          </p>
        </div>
        <div>
          <h4 style={{ fontSize: "1.1rem", marginBottom: 8 }}>Navegación</h4>
          <ul className="footer-nav">
            <li><a href="/">Inicio</a></li>
            <li><a href="/cbd">¿Qué es el CBD?</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: "1.1rem", marginBottom: 8 }}>Contacto</h4>
          <p className="muted">sweetleaf.rdp@gmail.com</p>
          <p className="muted">Instagram / Facebook</p>
          <p className="muted">WhatsApp: +54 11 2797 5134</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>sweetleaf.rdp © 2025 - Todos los derechos reservados</p>
        <small className="credits">
          Desarrollo{" "}
          <a href="https://instagram.com/tellounder" target="_blank" rel="noreferrer">
            Tellounder
          </a>
        </small>
      </div>
    </footer>
  );
}

type AdminFooterProps = ReturnType<typeof useDesignBlocks>;

function AdminFooter({ status, error, refresh, blocks }: AdminFooterProps) {
  return (
    <footer className="footer footer-admin">
      <div className="container admin-footer-grid">
        <div className="stack">
          <div>
            <p className="eyebrow">CMS Status</p>
            <h4>SweetLeaf Admin</h4>
            <p className="muted small">
              Estado: <strong className={`status-pill ${status}`}>{status}</strong>
              {error && <span className="status-error"> · {error}</span>}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={refresh}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sincronizando…" : "Refrescar bloques"}
          </button>
        </div>

        <div>
          <p className="eyebrow">Bloques principales</p>
          <ul className="admin-footer-list">
            {keyMetadata.map((item) => {
              const block = blocks[item.key];
              return (
                <li key={item.key}>
                  <span>{item.label}</span>
                  <span className="muted small">
                    {block.__meta.isPublished ? "Publicado" : "Oculto"} ·{" "}
                    {block.__meta.source === "remote" ? "CMS" : "Fallback"} · v
                    {block.__meta.version ?? 1}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Atajos útiles</p>
          <ul className="admin-footer-links">
            <li>
              <a href="https://render.com" target="_blank" rel="noreferrer">
                Render dashboard
              </a>
            </li>
            <li>
              <a href="https://app.supabase.com" target="_blank" rel="noreferrer">
                Supabase Storage
              </a>
            </li>
            <li>
              <a href="https://firebase.google.com/" target="_blank" rel="noreferrer">
                Firebase Hosting
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Modo admin · SweetLeaf CMS</p>
        <small className="credits">
          Última actualización {new Date().toLocaleString()}
        </small>
      </div>
    </footer>
  );
}
