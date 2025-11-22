import { Section } from "../components/Section";
import { QuestionForm } from "../components/QuestionForm";

export function IacaPage() {
  return (
    <>
      <Section
        kicker="Laboratorio aliado"
        title="IACA Laboratorios"
        subtitle="Primeros en la región en auditar aceites, extractos y flores de cannabis medicinal."
        variant="iaca"
        id="analisis"
      >
        <div className="card stack">
          <p>
            Cada lote de Sweet Leaf se valida con cromatografía líquida de alta performance (HPLC)
            para cuantificar cannabinoides y asegurar resultados terapéuticos consistentes.
          </p>
          <div className="pill">Certificados digitales por número de lote</div>
        </div>
      </Section>

      <Section
        kicker="Microbiología"
        title="Controles de seguridad"
        subtitle="Evitamos contaminaciones desde el cultivo hasta el envasado."
        id="micro"
      >
        <div className="card stack">
          <ul className="muted">
            <li>Recuento de bacterias aerobias y enterobacterias.</li>
            <li>Detección de Salmonella, Listeria y Escherichia coli.</li>
            <li>Ensayos de hongos, levaduras y micotoxinas.</li>
          </ul>
          <p className="muted">
            Estos análisis garantizan que los productos sean seguros incluso para pacientes
            inmunocomprometidos.
          </p>
        </div>
      </Section>

      <Section
        kicker="Metales pesados"
        title="Cuatro metales bajo control"
        subtitle="El cannabis acumula metales según el suelo; por eso analizamos cada partida."
        id="metales"
      >
        <div className="grid">
          {["Arsénico", "Plomo", "Cadmio", "Mercurio"].map((metal) => (
            <div key={metal} className="card stack">
              <h3>{metal}</h3>
              <p className="muted">Límites acorde a normativa internacional.</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker="Perfil terpénico"
        title="Caracterización aromática y terapéutica"
        subtitle="Determinamos la distribución porcentual de terpenos en flores secas."
        id="terpenos"
      >
        <div className="card stack">
          <p>
            El cromatógrafo gaseoso acoplado a espectrometría de masas nos permite informar cómo se
            combinan mirceno, limoneno, beta-cariofileno y otros terpenos claves.
          </p>
          <p className="muted">
            Con esta data diseñamos perfiles sensoriales y potencial sinérgico con los cannabinoides.
          </p>
        </div>
      </Section>

      <Section
        kicker="Contacto"
        title="Solicitá tu análisis"
        subtitle="Coordinamos turnos para productores, médicos y asociaciones civiles."
        id="contacto-lab"
        variant="contact"
      >
        <QuestionForm />
      </Section>
    </>
  );
}
