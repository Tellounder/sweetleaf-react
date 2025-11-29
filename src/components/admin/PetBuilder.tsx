import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  PetBenefit,
  PetDoseRow,
  PetFaq,
  PetSectionContent,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";
import { MediaUploader } from "./MediaUploader";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

type PetBuilderProps = {
  block: BlocksResult["section.pet"];
  onSave: (content: PetSectionContent) => Promise<void>;
  onPublishToggle: (nextPublished: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
};

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  heroDescription: 320,
  bullet: 90,
  pill: 80,
  benefitTitle: 60,
  benefitDescription: 160,
  doseWeight: 40,
  doseValue: 40,
  doseNote: 240,
  faqTitle: 90,
  faqText: 200,
  contactTitle: 90,
  contactSubtitle: 200,
};

const MAX_BULLETS = 4;
const MAX_BENEFITS = 4;
const MAX_DOSE_ROWS = 6;
const MAX_FAQS = 6;

export function PetBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: PetBuilderProps) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as PetSectionContent;
  }, [block]);

  const [draft, setDraft] = useState(() => ({
    hero: baseContent.hero,
    benefits: baseContent.benefits ?? [],
    doseGuide: baseContent.doseGuide ?? [],
    doseNote: baseContent.doseNote ?? "",
    faqs: baseContent.faqs ?? [],
    contact: baseContent.contact,
  }));

  useEffect(() => {
    setDraft({
      hero: baseContent.hero,
      benefits: baseContent.benefits ?? [],
      doseGuide: baseContent.doseGuide ?? [],
      doseNote: baseContent.doseNote ?? "",
      faqs: baseContent.faqs ?? [],
      contact: baseContent.contact,
    });
  }, [baseContent]);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [error, setError] = useState<string>();

  const heroErrors = {
    kicker: draft.hero.kicker.length > LIMITS.kicker,
    title: draft.hero.title.length > LIMITS.title,
    subtitle: draft.hero.subtitle.length > LIMITS.subtitle,
    description: draft.hero.description.length > LIMITS.heroDescription,
    pill: draft.hero.pill.length > LIMITS.pill,
    bullets: draft.hero.bulletPoints.map(
      (bullet) => bullet.length > LIMITS.bullet,
    ),
  };

  const benefitErrors = draft.benefits.map((benefit) => ({
    title: benefit.title.length > LIMITS.benefitTitle,
    description: benefit.description.length > LIMITS.benefitDescription,
  }));

  const doseErrors = draft.doseGuide.map((row) => ({
    weight: row.weight.length > LIMITS.doseWeight,
    dose: row.dose.length > LIMITS.doseValue,
  }));

  const faqErrors = draft.faqs.map((faq) => ({
    title: faq.title.length > LIMITS.faqTitle,
    text: faq.text.length > LIMITS.faqText,
  }));

  const contactErrors = {
    title: draft.contact.title.length > LIMITS.contactTitle,
    subtitle: draft.contact.subtitle.length > LIMITS.contactSubtitle,
  };

  const persist = async () => {
    if (!apiReady) {
      setError("Configurá API URL + API key para guardar cambios.");
      return;
    }
    if (
      heroErrors.kicker ||
      heroErrors.title ||
      heroErrors.subtitle ||
      heroErrors.description ||
      heroErrors.pill ||
      heroErrors.bullets.some(Boolean) ||
      benefitErrors.some((err) => err.title || err.description) ||
      doseErrors.some((err) => err.weight || err.dose) ||
      faqErrors.some((err) => err.title || err.text) ||
      contactErrors.title ||
      contactErrors.subtitle
    ) {
      setError("Revisá los límites de caracteres antes de guardar.");
      return;
    }
    if (!draft.benefits.length || !draft.doseGuide.length || !draft.faqs.length) {
      setError("Completá beneficios, guía y preguntas para publicar.");
      return;
    }

    const content: PetSectionContent = {
      ...baseContent,
      hero: draft.hero,
      benefits: draft.benefits,
      doseGuide: draft.doseGuide,
      doseNote: draft.doseNote,
      faqs: draft.faqs,
      contact: draft.contact,
    };

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(content);
      setFeedback("Sección Pet actualizada.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la sección Pet.",
      );
    } finally {
      setSaving(false);
    }
  };

  const publishToggle = async () => {
    if (!apiReady) {
      setError("Configurá API URL + API key para publicar.");
      return;
    }
    try {
      setPublishing(true);
      setFeedback(undefined);
      setError(undefined);
      await onPublishToggle(!block.__meta.isPublished);
      setFeedback(
        !block.__meta.isPublished
          ? "Sección Pet publicada."
          : "Sección Pet ocultada temporalmente.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el publish status.",
      );
    } finally {
      setPublishing(false);
    }
  };

  const bumpVersion = async () => {
    if (!apiReady) {
      setError("Configurá API URL + API key para actualizar versión.");
      return;
    }
    try {
      setPublishing(true);
      setFeedback(undefined);
      setError(undefined);
      await onBumpVersion();
      setFeedback("Versión de la sección Pet incrementada.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo incrementar la versión.",
      );
    } finally {
      setPublishing(false);
    }
  };

  const updateHero = (field: keyof PetSectionContent["hero"], value: string) => {
    setDraft((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updateBullet = (index: number, value: string) => {
    setDraft((prev) => {
      const next = [...prev.hero.bulletPoints];
      next[index] = value;
      return { ...prev, hero: { ...prev.hero, bulletPoints: next } };
    });
  };

  const addBullet = () => {
    if (draft.hero.bulletPoints.length >= MAX_BULLETS) return;
    setDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        bulletPoints: [...prev.hero.bulletPoints, ""],
      },
    }));
  };

  const removeBullet = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        bulletPoints: prev.hero.bulletPoints.filter((_, idx) => idx !== index),
      },
    }));
  };

  const updateBenefit = (
    index: number,
    field: keyof PetBenefit,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, idx) =>
        idx === index ? { ...benefit, [field]: value } : benefit,
      ),
    }));
  };

  const addBenefit = () => {
    if (draft.benefits.length >= MAX_BENEFITS) return;
    setDraft((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { title: "", description: "" }],
    }));
  };

  const removeBenefit = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== index),
    }));
  };

  const updateDose = (index: number, field: keyof PetDoseRow, value: string) => {
    setDraft((prev) => ({
      ...prev,
      doseGuide: prev.doseGuide.map((row, idx) =>
        idx === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addDoseRow = () => {
    if (draft.doseGuide.length >= MAX_DOSE_ROWS) return;
    setDraft((prev) => ({
      ...prev,
      doseGuide: [...prev.doseGuide, { weight: "", dose: "" }],
    }));
  };

  const removeDoseRow = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      doseGuide: prev.doseGuide.filter((_, idx) => idx !== index),
    }));
  };

  const updateFaq = (index: number, field: keyof PetFaq, value: string) => {
    setDraft((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, idx) =>
        idx === index ? { ...faq, [field]: value } : faq,
      ),
    }));
  };

  const addFaq = () => {
    if (draft.faqs.length >= MAX_FAQS) return;
    setDraft((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { title: "", text: "" }],
    }));
  };

  const removeFaq = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Pet</p>
          <h2>Wireframe línea mascotas</h2>
          <p className="muted">
            Controlá hero, beneficios, guía de dosis, FAQs y contacto. Todo refleja la vista pública de
            /pet.
          </p>
        </div>
        <div className="admin-meta">
          <span>
            Estado:{" "}
            <strong>{block.__meta.isPublished ? "Publicado" : "Oculto"}</strong>
          </span>
          <span>
            Versión: <strong>{block.__meta.version ?? "—"}</strong>
          </span>
        </div>
      </header>

      <div className="builder-form">
        <h3 className="admin-section-title">Hero y contenido principal</h3>
        <div className="builder-grid">
          <div className="stack">
            <Field
              label="Kicker"
              value={draft.hero.kicker}
              max={LIMITS.kicker}
              error={heroErrors.kicker}
              onChange={(value) => updateHero("kicker", value)}
            />
            <Field
              label="Título"
              value={draft.hero.title}
              max={LIMITS.title}
              error={heroErrors.title}
              onChange={(value) => updateHero("title", value)}
            />
            <Field
              label="Subtítulo"
              value={draft.hero.subtitle}
              max={LIMITS.subtitle}
              error={heroErrors.subtitle}
              onChange={(value) => updateHero("subtitle", value)}
            />
            <Field
              label="Descripción"
              value={draft.hero.description}
              max={LIMITS.heroDescription}
              error={heroErrors.description}
              multiline
              onChange={(value) => updateHero("description", value)}
            />
            <Field
              label="Texto del pill"
              value={draft.hero.pill}
              max={LIMITS.pill}
              error={heroErrors.pill}
              onChange={(value) => updateHero("pill", value)}
            />
            <div className="media-section">
              <div className="media-head">
                <div>
                  <h3>Bullets (máx. {MAX_BULLETS})</h3>
                  <p className="muted">Se muestran debajo del texto principal.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addBullet}
                  disabled={draft.hero.bulletPoints.length >= MAX_BULLETS}
                >
                  Agregar bullet
                </button>
              </div>
              <div className="stack">
                {draft.hero.bulletPoints.map((bullet, index) => (
                  <div className="stat-card" key={`bullet-${index}`}>
                    <div className="stat-card-head">
                      <span>#{index + 1}</span>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => removeBullet(index)}
                      >
                        Quitar
                      </button>
                    </div>
                    <Field
                      label="Texto"
                      value={bullet}
                      max={LIMITS.bullet}
                      error={heroErrors.bullets[index]}
                      onChange={(value) => updateBullet(index, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="stack">
            <MediaUploader
              label="Imagen del hero"
              description="Ideal 1200px+ en formato WEBP."
              folder="pet"
              value={draft.hero.image}
              onChange={(url) => updateHero("image", url)}
              onRemove={() => updateHero("image", "")}
              disabled={!apiReady}
            />
          </div>
        </div>

        <h3 className="admin-section-title">Beneficios</h3>
        <div className="media-section">
          <div className="media-head">
            <div>
              <h3>Cards (máx. {MAX_BENEFITS})</h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addBenefit}
              disabled={draft.benefits.length >= MAX_BENEFITS}
            >
              Agregar beneficio
            </button>
          </div>
          <div className="stack">
            {draft.benefits.map((benefit, index) => (
              <div className="stat-card" key={`benefit-${index}`}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeBenefit(index)}
                  >
                    Quitar
                  </button>
                </div>
                <Field
                  label="Título"
                  value={benefit.title}
                  max={LIMITS.benefitTitle}
                  error={benefitErrors[index]?.title}
                  onChange={(value) => updateBenefit(index, "title", value)}
                />
                <Field
                  label="Descripción"
                  value={benefit.description}
                  max={LIMITS.benefitDescription}
                  error={benefitErrors[index]?.description}
                  multiline
                  onChange={(value) =>
                    updateBenefit(index, "description", value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <h3 className="admin-section-title">Guía de dosis</h3>
        <div className="media-section">
          <div className="media-head">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addDoseRow}
              disabled={draft.doseGuide.length >= MAX_DOSE_ROWS}
            >
              Agregar fila
            </button>
          </div>
          <div className="stack">
            {draft.doseGuide.map((row, index) => (
              <div className="stat-card" key={`dose-${index}`}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeDoseRow(index)}
                  >
                    Quitar
                  </button>
                </div>
                <div className="cta-grid">
                  <Field
                    label="Peso"
                    value={row.weight}
                    max={LIMITS.doseWeight}
                    error={doseErrors[index]?.weight}
                    onChange={(value) => updateDose(index, "weight", value)}
                  />
                  <Field
                    label="Dosis"
                    value={row.dose}
                    max={LIMITS.doseValue}
                    error={doseErrors[index]?.dose}
                    onChange={(value) => updateDose(index, "dose", value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <Field
            label="Nota final"
            value={draft.doseNote}
            max={LIMITS.doseNote}
            error={draft.doseNote.length > LIMITS.doseNote}
            multiline
            onChange={(value) => setDraft((prev) => ({ ...prev, doseNote: value }))}
          />
        </div>

        <h3 className="admin-section-title">Preguntas frecuentes</h3>
        <div className="media-section">
          <div className="media-head">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addFaq}
              disabled={draft.faqs.length >= MAX_FAQS}
            >
              Agregar pregunta
            </button>
          </div>
          <div className="stack">
            {draft.faqs.map((faq, index) => (
              <div className="stat-card" key={`faq-${index}`}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeFaq(index)}
                  >
                    Quitar
                  </button>
                </div>
                <Field
                  label="Pregunta"
                  value={faq.title}
                  max={LIMITS.faqTitle}
                  error={faqErrors[index]?.title}
                  onChange={(value) => updateFaq(index, "title", value)}
                />
                <Field
                  label="Respuesta"
                  value={faq.text}
                  max={LIMITS.faqText}
                  error={faqErrors[index]?.text}
                  multiline
                  onChange={(value) => updateFaq(index, "text", value)}
                />
              </div>
            ))}
          </div>
        </div>

        <h3 className="admin-section-title">Contacto</h3>
        <Field
          label="Kicker"
          value={draft.contact.kicker}
          max={LIMITS.kicker}
          error={draft.contact.kicker.length > LIMITS.kicker}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              contact: { ...prev.contact, kicker: value },
            }))
          }
        />
        <Field
          label="Título"
          value={draft.contact.title}
          max={LIMITS.contactTitle}
          error={contactErrors.title}
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              contact: { ...prev.contact, title: value },
            }))
          }
        />
        <Field
          label="Subtítulo"
          value={draft.contact.subtitle}
          max={LIMITS.contactSubtitle}
          error={contactErrors.subtitle}
          multiline
          onChange={(value) =>
            setDraft((prev) => ({
              ...prev,
              contact: { ...prev.contact, subtitle: value },
            }))
          }
        />
      </div>

      <div className="admin-actions">
        {error && <span className="admin-error">{error}</span>}
        {feedback && !error && <span className="admin-success">{feedback}</span>}
        <div className="admin-action-row">
          <button
            type="button"
            className="btn btn-tertiary"
            onClick={bumpVersion}
            disabled={!apiReady || publishing}
          >
            {publishing ? "Actualizando…" : "Bumpear versión"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={publishToggle}
            disabled={!apiReady || publishing}
          >
            {block.__meta.isPublished
              ? publishing
                ? "Ocultando…"
                : "Ocultar"
              : publishing
              ? "Publicando…"
              : "Publicar"}
          </button>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={persist}
          disabled={
            !apiReady ||
            saving ||
            heroErrors.kicker ||
            heroErrors.title ||
            heroErrors.subtitle ||
            heroErrors.description ||
            heroErrors.pill ||
            heroErrors.bullets.some(Boolean) ||
            benefitErrors.some((err) => err.title || err.description) ||
            doseErrors.some((err) => err.weight || err.dose) ||
            faqErrors.some((err) => err.title || err.text) ||
            contactErrors.title ||
            contactErrors.subtitle ||
            draft.benefits.length === 0 ||
            draft.doseGuide.length === 0 ||
            draft.faqs.length === 0
          }
        >
          {saving ? "Guardando…" : "Guardar sección"}
        </button>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  max: number;
  error?: boolean;
  multiline?: boolean;
  onChange: (value: string) => void;
};

function Field({ label, value, max, error, multiline, onChange }: FieldProps) {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={max + 40}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={max + 40}
        />
      )}
      <span className={`char-counter ${error ? "error" : ""}`}>
        {value.length}/{max}
      </span>
    </label>
  );
}
