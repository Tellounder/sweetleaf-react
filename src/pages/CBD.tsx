import { Section } from "../components/Section";
import { FeatureCard } from "../components/FeatureCard";
import { useDesignBlocks } from "../context/DesignContentContext";

export function CBDPage() {
  const { blocks } = useDesignBlocks();
  const introBlock = blocks["cbd.intro"];
  const benefitsBlock = blocks["cbd.benefits"];
  const faqBlock = blocks["cbd.faq"];
  const showIntro =
    (introBlock.display ?? true) && introBlock.__meta.isPublished;
  const showBenefits =
    (benefitsBlock.display ?? true) && benefitsBlock.__meta.isPublished;
  const showFaq = (faqBlock.display ?? true) && faqBlock.__meta.isPublished;

  return (
    <>
      {showIntro && (
        <Section
          kicker={introBlock.kicker}
          title={introBlock.title}
          subtitle={introBlock.subtitle}
          variant="cbd-intro"
          id="cbd"
        >
          <div className="grid">
            {introBlock.cards.map((card, index) => (
              <div className="card stack" key={`cbd-card-${index}`}>
                <h3>{card.title}</h3>
                {card.paragraphs.map((paragraph, idx) => (
                  <p className="muted" key={`cbd-card-${index}-${idx}`}>
                    {paragraph}
                  </p>
                ))}
                {card.pill && <div className="pill">{card.pill}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {showBenefits && (
        <Section
          kicker={benefitsBlock.kicker}
          title={benefitsBlock.title}
          subtitle={benefitsBlock.subtitle}
          variant="cbd-benefits"
          id="propiedades"
        >
          <div className="grid">
            {benefitsBlock.benefits.map((item) => (
              <FeatureCard
                key={item.title}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </Section>
      )}

      {showFaq && (
        <Section
          kicker={faqBlock.kicker}
          title={faqBlock.title}
          subtitle={faqBlock.subtitle}
          id="faq-cbd"
        >
          <div className="grid">
            {faqBlock.cards.map((card) => (
              <div className="card stack" key={card.title}>
                <h3>{card.title}</h3>
                <p className="muted">{card.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
