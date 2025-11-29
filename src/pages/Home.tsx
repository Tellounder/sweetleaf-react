import { Hero } from "../components/Hero";
import { Section } from "../components/Section";
import { FeatureCard } from "../components/FeatureCard";
import { OfferCard } from "../components/OfferCard";
import { useCart } from "../context/CartContext";
import { QuestionForm } from "../components/QuestionForm";
import { parsePrice } from "../utils/price";
import { useDesignBlocks } from "../context/DesignContentContext";
import { buildHeroImages } from "../utils/heroImages";

export function Home() {
  const { addItem } = useCart();
  const { blocks } = useDesignBlocks();
  const heroContent = blocks["hero.home"];
  const heroDisplay = heroContent.display ?? true;
  const showHero = heroContent.__meta.isPublished && heroDisplay;
  const heroImages = buildHeroImages({
    systemImages: heroContent.backgroundImages,
    customImages: heroContent.customImages,
    useSystemImages: heroContent.useSystemImages,
    maxImages: heroContent.maxImages,
  });
  const respaldoBlock = blocks["section.respaldo"];
  const homePetBlock = blocks["home.pet"];
  const showHomePet =
    (homePetBlock.display ?? true) && homePetBlock.__meta.isPublished;
  const homeAboutBlock = blocks["home.about"];
  const showHomeAbout =
    (homeAboutBlock.display ?? true) && homeAboutBlock.__meta.isPublished;
  const homeOffersBlock = blocks["home.offers"];
  const showHomeOffers =
    (homeOffersBlock.display ?? true) && homeOffersBlock.__meta.isPublished;
  const homeBenefitsBlock = blocks["home.benefits"];
  const showHomeBenefits =
    (homeBenefitsBlock.display ?? true) && homeBenefitsBlock.__meta.isPublished;
  const homeIacaBlock = blocks["home.iaca"];
  const showHomeIaca =
    (homeIacaBlock.display ?? true) && homeIacaBlock.__meta.isPublished;
  const homeContactBlock = blocks["home.contact"];
  const showHomeContact =
    (homeContactBlock.display ?? true) && homeContactBlock.__meta.isPublished;
  const showRespaldo =
    (respaldoBlock.display ?? true) && respaldoBlock.__meta.isPublished;

  const handleAddOffer = (title: string, price: string) => {
    addItem({ id: `offer-${title}`, name: title, price: parsePrice(price) });
  };

  return (
    <>
      {showHero && (
        <Hero
          kicker={heroContent.kicker}
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          ctaPrimary={heroContent.ctaPrimary}
          ctaSecondary={heroContent.ctaSecondary}
          backgroundImages={heroImages.length ? heroImages : heroContent.backgroundImages}
        />
      )}

      {showRespaldo && (
        <Section
          kicker={respaldoBlock.kicker}
          title={respaldoBlock.title}
          subtitle={respaldoBlock.subtitle}
          id="respaldo"
          variant="respaldo"
        >
          <div className="stat-bar">
            {respaldoBlock.stats.map((stat) => (
              <div className="stat" key={`${stat.label}-${stat.value}`}>
                <span className="label">{stat.label}</span>
                <span className="value">{stat.value}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {showHomePet && (
        <Section
          kicker={homePetBlock.hero.kicker}
          title={homePetBlock.hero.title}
          subtitle={homePetBlock.hero.subtitle}
          id="pet"
          variant="pet"
        >
          <div className="pet-layout card">
            <div className="pet-media">
              <img
                src={homePetBlock.hero.image}
                alt={homePetBlock.hero.title}
                loading="lazy"
              />
            </div>
            <div className="stack">
              <p>{homePetBlock.hero.description}</p>
              <ul className="pet-benefits">
                {homePetBlock.hero.bulletPoints.map((point, index) => (
                  <li key={`home-pet-point-${index}`}>{point}</li>
                ))}
              </ul>
              <div className="pill">{homePetBlock.hero.pill}</div>
            </div>
          </div>
        </Section>
      )}

      {showHomeAbout && (
        <Section
          kicker={homeAboutBlock.kicker}
          title={homeAboutBlock.title}
          subtitle={homeAboutBlock.subtitle}
          id="quienes"
          variant="about"
        >
          <div className="card stack">
            <p>{homeAboutBlock.text}</p>
            <div className="pill" aria-hidden>
              {homeAboutBlock.pill}
            </div>
          </div>
        </Section>
      )}

      {showHomeOffers && (
        <Section
          kicker={homeOffersBlock.kicker}
          title={homeOffersBlock.title}
          subtitle={homeOffersBlock.subtitle}
          id="ofertas"
          variant="offers"
        >
          <div className="grid scrollable-x">
            {homeOffersBlock.offers.map((offer) => (
              <OfferCard key={offer.id} {...offer} onAdd={handleAddOffer} />
            ))}
          </div>
        </Section>
      )}

      {showHomeBenefits && (
        <Section
          kicker={homeBenefitsBlock.kicker}
          title={homeBenefitsBlock.title}
          subtitle={homeBenefitsBlock.subtitle}
          id="beneficios"
          variant="benefits"
        >
          <div className="grid scrollable-x">
            {homeBenefitsBlock.benefits.map((item) => (
              <FeatureCard
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Section>
      )}

      {showHomeIaca && (
        <Section
          kicker={homeIacaBlock.kicker}
          title={homeIacaBlock.title}
          subtitle={homeIacaBlock.subtitle}
          id="iaca"
          variant="iaca"
        >
          <div className="card stack">
            <p>{homeIacaBlock.intro}</p>
            <div className="iaca-grid">
              {homeIacaBlock.blocks.map((block, index) => (
                <div className="iaca-block" key={`iaca-block-${index}`}>
                  <h3>{block.title}</h3>
                  {block.description && (
                    <p className="muted">{block.description}</p>
                  )}
                  {block.bullets && (
                    <ul>
                      {block.bullets.map((item, idx) => (
                        <li key={`iaca-${index}-bullet-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {showHomeContact && (
        <Section
          kicker={homeContactBlock.kicker}
          title={homeContactBlock.title}
          subtitle={homeContactBlock.subtitle}
          id="contacto"
          variant="contact"
        >
          <QuestionForm />
        </Section>
      )}
    </>
  );
}
