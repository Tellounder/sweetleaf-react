type HeroProps = {
  title: string;
  subtitle: string;
  kicker?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  backgroundImage?: string;
};

export function Hero({
  title,
  subtitle,
  kicker,
  ctaPrimary,
  ctaSecondary,
  backgroundImage = "/img/2.jpg",
}: HeroProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="hero">
          <div className="hero-glow one" aria-hidden />
          <div className="hero-glow two" aria-hidden />
          <div
            className="hero-media"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden
          />
          <div className="hero-content">
            {kicker && <span className="hero-kicker">{kicker}</span>}
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            <div className="hero-badges">
              <span className="badge-soft">0% THC • No psicoactivo</span>
              <span className="badge-soft">Trazabilidad de laboratorio</span>
              <span className="badge-live">
                <span className="ping" aria-hidden />
                Oferta activa
              </span>
            </div>
            <div className="hero-actions">
              {ctaPrimary && (
                <a className="btn btn-primary" href={ctaPrimary.href}>
                  {ctaPrimary.label}
                </a>
              )}
              {ctaSecondary && (
                <a className="btn btn-secondary" href={ctaSecondary.href}>
                  {ctaSecondary.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
