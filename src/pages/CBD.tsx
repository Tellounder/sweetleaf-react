import { Section } from "../components/Section";
import { benefits } from "../content/benefits";
import { cbdBenefitsDetail, cbdIntro } from "../content/cbd";
import { FeatureCard } from "../components/FeatureCard";

export function CBDPage() {
  return (
    <>
      <Section
        kicker="Conocimiento"
        title="¿Qué es el CBD?"
        subtitle={cbdIntro}
        variant="cbd-intro"
        id="cbd"
      >
        <div className="grid">
          <div className="card stack">
            <h3>Impacto medicinal</h3>
            <p className="muted">{cbdBenefitsDetail}</p>
            <div className="pill">No psicoactivo • Trazable</div>
          </div>
          <div className="card stack">
            <h3>Cómo lo elaboramos</h3>
            <p className="muted">
              Partimos de cultivos ecológicos y seleccionamos biomasa rica en
              CBD. Utilizamos extracción cuidada, filtrado y controles de
              potencia que garantizan pureza y concentración consistente.
            </p>
            <p className="muted">
              Cada lote es testeado y envasado con buenas prácticas de
              manufactura.
            </p>
          </div>
        </div>
      </Section>

      <Section
        kicker="Beneficios"
        title="Propiedades más citadas"
        subtitle="Los ensayos clínicos siguen avanzando; estos son los usos con mayor tracción."
        variant="cbd-benefits"
        id="propiedades"
      >
        <div className="grid">
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
        kicker="Guía rápida"
        title="Uso responsable y preguntas frecuentes"
        subtitle="Recomendaciones para iniciar microdosis y coordinar con profesionales."
        id="faq-cbd"
      >
        <div className="grid">
          <div className="card stack">
            <h3>Dosis inicial</h3>
            <p className="muted">
              Comenzar con 0,25 ml dos veces al día, sostener durante 5 días y ajustar según
              respuesta. Siempre consultar con el especialista tratante.
            </p>
          </div>
          <div className="card stack">
            <h3>Seguridad</h3>
            <p className="muted">
              Nuestros aceites son libres de THC psicoactivo y cuentan con certificados de
              análisis por lote.
            </p>
          </div>
          <div className="card stack">
            <h3>Interacciones</h3>
            <p className="muted">
              Evitar mezclar con fármacos sin supervisión médica y registrar cualquier cambio en
              el descanso, apetito o ánimo.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
