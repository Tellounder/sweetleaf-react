import { useEffect, useMemo, useState } from "react";

const DEFAULT_HERO_IMAGES = [
  "/img/2.webp",
  "/img/campo.webp",
  "/img/fondo.webp",
  "/img/1.webp",
  "/img/7.webp",
];

type HeroProps = {
  title: string;
  subtitle: string;
  kicker?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  backgroundImage?: string;
  backgroundImages?: string[];
};

export function Hero({
  title,
  subtitle,
  kicker,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  backgroundImages,
}: HeroProps) {
  const imageList = useMemo(() => {
    const list =
      backgroundImages && backgroundImages.length > 0
        ? backgroundImages
        : backgroundImage
        ? [backgroundImage]
        : DEFAULT_HERO_IMAGES;
    const filtered = list.filter(Boolean);
    return filtered.length ? Array.from(new Set(filtered)) : DEFAULT_HERO_IMAGES;
  }, [backgroundImage, backgroundImages]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    if (imageList.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 8000);
    return () => clearInterval(id);
  }, [imageList]);

  const currentBackground = imageList[currentIndex];

  return (
    <section className="section">
      <div className="container">
        <div className="hero">
          <div className="hero-glow one" aria-hidden />
          <div className="hero-glow two" aria-hidden />
          <div
            className="hero-media"
            style={{ backgroundImage: `url(${currentBackground})` }}
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
