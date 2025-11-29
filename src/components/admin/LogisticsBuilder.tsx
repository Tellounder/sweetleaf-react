import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  LogisticsSectionContent,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

type LogisticsBuilderProps = {
  block: BlocksResult["section.logistics"];
  onSave: (content: LogisticsSectionContent) => Promise<void>;
  onPublishToggle: (nextPublished: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
};

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  bullet: 140,
  pill: 80,
};

const MAX_BULLETS = 5;

export function LogisticsBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: LogisticsBuilderProps) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as LogisticsSectionContent;
  }, [block]);

  const [draft, setDraft] = useState(() => ({
    kicker: baseContent.kicker,
    title: baseContent.title,
    subtitle: baseContent.subtitle,
    bullets: baseContent.bullets ?? [],
    pill: baseContent.pill,
  }));

  useEffect(() => {
    setDraft({
      kicker: baseContent.kicker,
      title: baseContent.title,
      subtitle: baseContent.subtitle,
      bullets: baseContent.bullets ?? [],
      pill: baseContent.pill,
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
    pill: draft.pill.length > LIMITS.pill,
    bullets: draft.bullets.map((bullet) => bullet.length > LIMITS.bullet),
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
      fieldErrors.pill ||
      fieldErrors.bullets.some(Boolean)
    ) {
      setError("Revisá los límites de texto antes de guardar.");
      return;
    }
    if (!draft.bullets.length) {
      setError("Agregá al menos un bullet.");
      return;
    }

    const content: LogisticsSectionContent = {
      ...baseContent,
      ...draft,
    };

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(content);
      setFeedback("Sección de logística actualizada.");
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

  const addBullet = () => {
    if (draft.bullets.length >= MAX_BULLETS) return;
    setDraft((prev) => ({ ...prev, bullets: [...prev.bullets, ""] }));
  };

  const updateBullet = (index: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      bullets: prev.bullets.map((bullet, idx) =>
        idx === index ? value : bullet,
      ),
    }));
  };

  const removeBullet = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      bullets: prev.bullets.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Logística</p>
          <h2>Envíos y cobertura</h2>
          <p className="muted">
            Editá el texto de la sección “Logística” de la página de productos.
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
            <div>
              <h3>Bullets (máx. {MAX_BULLETS})</h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addBullet}
              disabled={draft.bullets.length >= MAX_BULLETS}
            >
              Agregar bullet
            </button>
          </div>
          <div className="stack">
            {draft.bullets.map((bullet, index) => (
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
                  error={fieldErrors.bullets[index]}
                  onChange={(value) => updateBullet(index, value)}
                />
              </div>
            ))}
          </div>
        </div>
        <Field
          label="Texto del pill"
          value={draft.pill}
          max={LIMITS.pill}
          error={fieldErrors.pill}
          onChange={(value) => setDraft((prev) => ({ ...prev, pill: value }))}
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
            fieldErrors.kicker ||
            fieldErrors.title ||
            fieldErrors.subtitle ||
            fieldErrors.pill ||
            fieldErrors.bullets.some(Boolean) ||
            draft.bullets.length === 0
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
