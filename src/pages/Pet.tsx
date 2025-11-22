import { Section } from "../components/Section";
import { FeatureCard } from "../components/FeatureCard";
import { QuestionForm } from "../components/QuestionForm";

const petBenefits = [
  {
    title: "Bienestar articular",
    description:
      "Reduce inflamación en caderas, columna y articulaciones, ideal para mascotas senior o con displasia.",
  },
  {
    title: "Gestión del ánimo",
    description:
      "Disminuye la ansiedad por separación y modula respuestas ante ruidos o viajes.",
  },
  {
    title: "Apoyo neurológico",
    description:
      "Casos de epilepsia idiopática muestran menor frecuencia de convulsiones bajo supervisión veterinaria.",
  },
];

const doseGuide = [
  { weight: "Hasta 5 kg", dose: "1-2 gotas cada 12 h" },
  { weight: "5 a 15 kg", dose: "3-4 gotas cada 12 h" },
  { weight: "> 15 kg", dose: "5-8 gotas cada 12 h" },
];

const petFaqs = [
  {
    title: "¿Cuándo veo resultados?",
    text: "En dolores agudos se percibe en minutos; en cuadros crónicos recomendamos sostener 10 a 14 días.",
  },
  {
    title: "¿Pueden tomarlo gatos?",
    text: "Sí. Ajustamos con pipeta milimetrada y monitoreamos cambios en apetito y ánimo.",
  },
  {
    title: "¿Necesito receta?",
    text: "No es obligatoria, pero trabajamos con veterinarios aliados para acompañar cada caso clínico.",
  },
];

export function PetPage() {
  return (
    <>
      <Section
        kicker="Mascotas"
        title="Sweet Leaf Pet"
        subtitle="Aceite de CBD full spectrum 8 mg/ml con pipeta dosificadora, pensado para perros y gatos."
        variant="pet"
        id="pet-inicio"
      >
        <div className="pet-layout card">
          <div className="pet-media">
            <img src="/img/pet.jpeg" alt="Sweet Leaf Pet" loading="lazy" />
          </div>
          <div className="stack">
            <p>
              Trabajamos fórmulas específicas libres de transgénicos, gluten y azúcares. Cada lote se
              controla para asegurar potencia constante y ausencia de pesticidas.
            </p>
            <ul className="pet-benefits">
              <li>Alivio de dolores crónicos y procesos inflamatorios.</li>
              <li>Modulación de estrés, agresividad o hipersensibilidad.</li>
              <li>Soporte en epilepsia idiopática y recuperación post quirúrgica.</li>
            </ul>
            <div className="pill">Incluye guía de uso personalizada</div>
          </div>
        </div>
      </Section>

      <Section
        kicker="Beneficios"
        title="Resultados observados en mascotas"
        id="beneficios-pet"
      >
        <div className="grid scrollable-x">
          {petBenefits.map((benefit) => (
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
              {doseGuide.map((row) => (
                <tr key={row.weight}>
                  <td>{row.weight}</td>
                  <td>{row.dose}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted">
            Administrar directamente en la boca o sobre alimento húmedo. Incrementar gradualmente 1 gota
            por semana si no se observa respuesta.
          </p>
        </div>
      </Section>

      <Section kicker="FAQs" title="Preguntas frecuentes" id="faq-pet">
        <div className="grid">
          {petFaqs.map((faq) => (
            <div key={faq.title} className="card stack">
              <h3>{faq.title}</h3>
              <p className="muted">{faq.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker="Contacto"
        title="Asesoramiento inmediato"
        subtitle="Te ayudamos a definir dosis y seguimiento con nuestro equipo veterinario aliado."
        id="contacto-pet"
        variant="contact"
      >
        <QuestionForm />
      </Section>
    </>
  );
}
