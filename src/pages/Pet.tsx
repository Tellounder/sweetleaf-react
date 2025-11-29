import { Section } from "../components/Section";
import { FeatureCard } from "../components/FeatureCard";
import { QuestionForm } from "../components/QuestionForm";
import { useDesignBlocks } from "../context/DesignContentContext";

export function PetPage() {
  const { blocks } = useDesignBlocks();
  const petBlock = blocks["section.pet"];
  const showPet = petBlock.__meta.isPublished;

  if (!showPet) {
    return null;
  }

  return (
    <>
      <Section
        kicker={petBlock.hero.kicker}
        title={petBlock.hero.title}
        subtitle={petBlock.hero.subtitle}
        variant="pet"
        id="pet-inicio"
      >
        <div className="pet-layout card">
          <div className="pet-media">
            <img
              src={petBlock.hero.image}
              alt={petBlock.hero.title}
              loading="lazy"
            />
          </div>
          <div className="stack">
            <p>{petBlock.hero.description}</p>
            <ul className="pet-benefits">
              {petBlock.hero.bulletPoints.map((point, index) => (
                <li key={`pet-hero-point-${index}`}>{point}</li>
              ))}
            </ul>
            <div className="pill">{petBlock.hero.pill}</div>
          </div>
        </div>
      </Section>

      <Section
        kicker="Beneficios"
        title="Resultados observados en mascotas"
        id="beneficios-pet"
      >
        <div className="grid scrollable-x">
          {petBlock.benefits.map((benefit) => (
            <FeatureCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </Section>

      <Section
        kicker="Dosificación"
        title="Guía orientativa"
        subtitle="Ajustamos siempre junto al profesional tratante, pero este cuadro ayuda a comenzar."
        id="dosis-pet"
      >
        <div className="card stack">
          <table className="dose-table">
            <thead>
              <tr>
                <th>Peso</th>
                <th>Dosis sugerida</th>
              </tr>
            </thead>
            <tbody>
              {petBlock.doseGuide.map((row) => (
                <tr key={row.weight}>
                  <td>{row.weight}</td>
                  <td>{row.dose}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted">{petBlock.doseNote}</p>
        </div>
      </Section>

      <Section kicker="FAQs" title="Preguntas frecuentes" id="faq-pet">
        <div className="grid">
          {petBlock.faqs.map((faq) => (
            <div key={faq.title} className="card stack">
              <h3>{faq.title}</h3>
              <p className="muted">{faq.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker={petBlock.contact.kicker}
        title={petBlock.contact.title}
        subtitle={petBlock.contact.subtitle}
        id="contacto-pet"
        variant="contact"
      >
        <QuestionForm />
      </Section>
    </>
  );
}
