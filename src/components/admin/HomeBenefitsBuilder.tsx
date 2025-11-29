import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  HomeBenefitsSectionContent,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  benefitTitle: 60,
  benefitDescription: 160,
};

const MAX_BENEFITS = 6;

export function HomeBenefitsBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: {
  block: BlocksResult["home.benefits"];
  onSave: (content: HomeBenefitsSectionContent) => Promise<void>;
  onPublishToggle: (next: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
}) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as HomeBenefitsSectionContent;
  }, [block]);

  const [draft, setDraft] = useState(baseContent);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setDraft(baseContent);
  }, [baseContent]);

  const fieldErrors = {
    kicker: draft.kicker.length > LIMITS.kicker,
    title: draft.title.length > LIMITS.title,
    subtitle: draft.subtitle.length > LIMITS.subtitle,
    benefits: draft.benefits.map((benefit) => ({
      title: benefit.title.length > LIMITS.benefitTitle,
      description: benefit.description.length > LIMITS.benefitDescription,
    })),
  };

  const persist = async () => {
    if (!apiReady) {
      setError("Configurá API URL + API key para guardar cambios.");
      return;
    }
    if (
      fieldErrors.kicker ||
      fieldErrors.title ||
      fieldErrors.subtitle ||
      fieldErrors.benefits.some((err) => err.title || err.description)
    ) {
      setError("Revisá los límites de texto antes de guardar.");
      return;
    }
    if (!draft.benefits.length) {
      setError("Agregá al menos un beneficio.");
      return;
    }

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(draft);
      setFeedback("Sección de beneficios actualizada.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la sección.",
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
          ? "Sección publicada."
          : "Sección ocultada del home.",
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
      setFeedback("Versión de la sección de beneficios incrementada.");
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

  const addBenefit = () => {
    if (draft.benefits.length >= MAX_BENEFITS) return;
    setDraft((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { title: "", description: "" }],
    }));
  };

  const updateBenefit = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, idx) =>
        idx === index ? { ...benefit, [field]: value } : benefit,
      ),
    }));
  };

  const removeBenefit = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Home · Beneficios</p>
          <h2>Bloque de ventajas</h2>
          <p className="muted">
            Controlá los textos que aparecen en el carrusel de beneficios del home.
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
        <Field
          label="Kicker"
          value={draft.kicker}
          max={LIMITS.kicker}
          error={fieldErrors.kicker}
          onChange={(value) => setDraft((prev) => ({ ...prev, kicker: value }))}
        />
        <Field
          label="Título"
          value={draft.title}
          max={LIMITS.title}
          error={fieldErrors.title}
          onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))}
        />
        <Field
          label="Descripción"
          value={draft.subtitle}
          max={LIMITS.subtitle}
          error={fieldErrors.subtitle}
          multiline
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, subtitle: value }))
          }
        />
        <div className="media-section">
          <div className="media-head">
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
              <div className="stat-card" key={`home-benefit-${index}`}>
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
                  error={fieldErrors.benefits[index]?.title}
                  onChange={(value) => updateBenefit(index, "title", value)}
                />
                <Field
                  label="Descripción"
                  value={benefit.description}
                  max={LIMITS.benefitDescription}
                  error={fieldErrors.benefits[index]?.description}
                  multiline
                  onChange={(value) =>
                    updateBenefit(index, "description", value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
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
            fieldErrors.kicker ||
            fieldErrors.title ||
            fieldErrors.subtitle ||
            fieldErrors.benefits.some((err) => err.title || err.description) ||
            draft.benefits.length === 0
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
