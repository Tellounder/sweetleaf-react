export function Footer() {
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
