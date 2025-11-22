import { Hero } from "../components/Hero";
import { Section } from "../components/Section";
import { FeatureCard } from "../components/FeatureCard";
import { aboutText } from "../content/about";
import { benefits } from "../content/benefits";
import { offers } from "../content/offers";
import { OfferCard } from "../components/OfferCard";
import { useCart } from "../context/CartContext";
import { QuestionForm } from "../components/QuestionForm";

export function Home() {
  const { addItem } = useCart();

  const handleAddOffer = (title: string, price: string) => {
    const numeric = Number(
      price.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".")
    );
    addItem({ id: `offer-${title}`, name: title, price: Number.isFinite(numeric) ? numeric : 0 });
  };

  return (
    <>

      <Hero
        kicker="Orgánico y no psicoactivo"
        title="CBD de alta concentración diseñado en la región"
        subtitle="Aceites y cremas elaborados con estándares de laboratorio, trazabilidad total y cultivos ecológicos de Argentina y Uruguay."
        ctaPrimary={{ label: "Ver productos", href: "/productos" }}
        ctaSecondary={{ label: "Saber sobre CBD", href: "/cbd" }}
      />

      <Section
        kicker="Respaldo"
        title="Calidad que se siente y se comprueba"
        subtitle="Cuidamos la cadena completa: cultivo, extracción, testeo y empaque. Todo medido para entregarte un CBD estable y sin sorpresas."
        id="respaldo"
        variant="respaldo"
      >
        <div className="stat-bar">
          <div className="stat">
            <span className="label">Años de experiencia</span>
            <span className="value">10+</span>
          </div>
          <div className="stat">
            <span className="label">Tests por lote</span>
            <span className="value">3</span>
          </div>
          <div className="stat">
            <span className="label">THC</span>
            <span className="value">0%</span>
          </div>
          <div className="stat">
            <span className="label">Origen</span>
            <span className="value">AR / UY</span>
          </div>
        </div>
      </Section>

      <Section
        kicker="Mascotas"
        title="Sweet Leaf Pet"
        subtitle="Aceite específico para perros y gatos con 8 mg/ml de CBD, dosificador y respaldo veterinario."
        id="pet"
        variant="pet"
      >
        <div className="pet-layout card">
          <div className="pet-media">
            <img src="/img/pet.jpeg" alt="Sweet Leaf Pet" loading="lazy" />
          </div>
          <div className="stack">
            <p>
              Nuestra línea Pet acompaña a mascotas con dolores crónicos,
              trastornos emocionales y cuadros de epilepsia idiopática. El
              extracto, libre de transgénicos, gluten, azúcares y pesticidas,
              se formula para entregar una experiencia calmante y segura.
            </p>
            <ul className="pet-benefits">
              <li>Alivio en articulaciones y huesos doloridos</li>
              <li>Control de irritabilidad y agresividad en gatos</li>
              <li>Disminución de frecuencia e intensidad de convulsiones</li>
              <li>Reducción de procesos inflamatorios (artritis, IBD)</li>
              <li>Apoyo en situaciones de estrés o ansiedad</li>
            </ul>
            <div className="pill">100% natural y dosificación precisa</div>
          </div>
        </div>
      </Section>

      <Section
        kicker="Quiénes somos"
        title="Sweet Leaf Río de La Plata"
        subtitle="Productos honestos, procesos cuidados y educación responsable sobre el impacto medicinal del cannabis."
        id="quienes"
        variant="about"
      >
        <div className="card stack">
          <p>{aboutText}</p>
          <div className="pill" aria-hidden>
            Calidad asegurada • No psicoactivos
          </div>
        </div>
      </Section>

      <Section
        kicker="Ofertas activas"
        title="Si estás listo, hoy hay bonus"
        subtitle="Combos pensados para iniciar o mejorar tu rutina con envío y extras incluidos."
        id="ofertas"
        variant="offers"
      >
        <div className="grid scrollable-x">
          {offers.map((offer) => (
            <OfferCard key={offer.id} {...offer} onAdd={handleAddOffer} />
          ))}
        </div>
      </Section>

      <Section
        kicker="Beneficios"
        title="El CBD que te acompaña en tu rutina"
        subtitle="Propiedades significativas respaldadas por evidencia emergente y una comunidad creciente de usuarios."
        id="beneficios"
        variant="benefits"
      >
        <div className="grid scrollable-x">
          {benefits.map((item) => (
            <FeatureCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Section>

      <Section
        kicker="Calidad certificada"
        title="IACA Laboratorios"
        subtitle="Trabajamos junto a uno de los primeros laboratorios autorizados del país para controlar aceites, extractos y flores de cannabis."
        id="iaca"
        variant="iaca"
      >
        <div className="card stack">
          <p>
            El equipo de IACA valida cada lote con métodos HPLC para conocer con
            precisión la presencia de cannabinoides y asegurar un uso terapéutico
            efectivo. Además, ofrece controles microbiológicos, metales pesados
            y perfiles de terpenos para brindarte trazabilidad completa.
          </p>
          <div className="iaca-grid">
            <div className="iaca-block">
              <h3>Cuantificación de cannabinoides</h3>
              <p className="muted">
                THC, THCA, CBD, CBDA y CBN mediante HPLC para aceites y extractos.
              </p>
            </div>
            <div className="iaca-block">
              <h3>Análisis microbiológico</h3>
              <ul>
                <li>Bacterias aerobias y enterobacterias</li>
                <li>Hongos y levaduras</li>
                <li>Salmonella, Listeria, E. Coli</li>
              </ul>
            </div>
            <div className="iaca-block">
              <h3>Metales pesados</h3>
              <ul>
                <li>Arsénico y Plomo</li>
                <li>Cadmio y Mercurio</li>
              </ul>
            </div>
            <div className="iaca-block">
              <h3>Perfil de terpenos</h3>
              <p className="muted">
                Determinación cromatográfica en flores secas para conocer el
                impacto aromático y terapéutico de cada variedad.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        kicker="Consultas"
        title="Hablemos por WhatsApp"
        subtitle="Contanos tus dudas o qué buscás. Sumamos tu carrito en el mensaje para agilizar la respuesta."
        id="contacto"
        variant="contact"
      >
        <QuestionForm />
      </Section>
    </>
  );
}
