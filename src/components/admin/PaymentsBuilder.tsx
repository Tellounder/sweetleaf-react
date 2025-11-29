import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  PaymentsSectionContent,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

type PaymentsBuilderProps = {
  block: BlocksResult["section.payments"];
  onSave: (content: PaymentsSectionContent) => Promise<void>;
  onPublishToggle: (nextPublished: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
};

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  optionTitle: 50,
  optionDescription: 140,
};

const MAX_OPTIONS = 4;

export function PaymentsBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: PaymentsBuilderProps) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as PaymentsSectionContent;
  }, [block]);

  const [draft, setDraft] = useState(() => ({
    kicker: baseContent.kicker,
    title: baseContent.title,
    subtitle: baseContent.subtitle,
    options: baseContent.options ?? [],
  }));

  useEffect(() => {
    setDraft({
      kicker: baseContent.kicker,
      title: baseContent.title,
      subtitle: baseContent.subtitle,
      options: baseContent.options ?? [],
    });
  }, [baseContent]);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [error, setError] = useState<string>();

  const fieldErrors = {
    kicker: draft.kicker.length > LIMITS.kicker,
    title: draft.title.length > LIMITS.title,
    subtitle: draft.subtitle.length > LIMITS.subtitle,
    options: draft.options.map((option) => ({
      title: option.title.length > LIMITS.optionTitle,
      description: option.description.length > LIMITS.optionDescription,
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
      fieldErrors.options.some((err) => err.title || err.description)
    ) {
      setError("Revisá los campos antes de guardar.");
      return;
    }
    if (!draft.options.length) {
      setError("Agregá al menos un medio de pago.");
      return;
    }

    const content: PaymentsSectionContent = {
      ...baseContent,
      ...draft,
    };

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(content);
      setFeedback("Sección de pagos actualizada.");
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
          : "Sección ocultada del sitio.",
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
      setFeedback("Versión incrementada.");
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

  const addOption = () => {
    if (draft.options.length >= MAX_OPTIONS) return;
    setDraft((prev) => ({
      ...prev,
      options: [...prev.options, { title: "", description: "" }],
    }));
  };

  const updateOption = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      options: prev.options.map((option, idx) =>
        idx === index ? { ...option, [field]: value } : option,
      ),
    }));
  };

  const removeOption = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Pagos</p>
          <h2>Medios disponibles</h2>
          <p className="muted">
            Gestioná el contenido de la sección de pagos (tarjetas, transferencias, links, etc.).
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
              onClick={addOption}
              disabled={draft.options.length >= MAX_OPTIONS}
            >
              Agregar medio
            </button>
          </div>
          <div className="stack">
            {draft.options.map((option, index) => (
              <div className="stat-card" key={`option-${index}`}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeOption(index)}
                  >
                    Quitar
                  </button>
                </div>
                <Field
                  label="Título"
                  value={option.title}
                  max={LIMITS.optionTitle}
                  error={fieldErrors.options[index]?.title}
                  onChange={(value) => updateOption(index, "title", value)}
                />
                <Field
                  label="Descripción"
                  value={option.description}
                  max={LIMITS.optionDescription}
                  error={fieldErrors.options[index]?.description}
                  multiline
                  onChange={(value) =>
                    updateOption(index, "description", value)
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
            fieldErrors.options.some((err) => err.title || err.description) ||
            draft.options.length === 0
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
