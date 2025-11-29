import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  WholesaleSectionContent,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

type WholesaleBuilderProps = {
  block: BlocksResult["section.wholesale"];
  onSave: (content: WholesaleSectionContent) => Promise<void>;
  onPublishToggle: (nextPublished: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
};

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  paragraph: 240,
  bullet: 120,
};

const MAX_BULLETS = 5;

export function WholesaleBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: WholesaleBuilderProps) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as WholesaleSectionContent;
  }, [block]);

  const [draft, setDraft] = useState(() => ({
    kicker: baseContent.kicker,
    title: baseContent.title,
    subtitle: baseContent.subtitle,
    paragraph: baseContent.paragraph,
    bullets: baseContent.bullets ?? [],
  }));

  useEffect(() => {
    setDraft({
      kicker: baseContent.kicker,
      title: baseContent.title,
      subtitle: baseContent.subtitle,
      paragraph: baseContent.paragraph,
      bullets: baseContent.bullets ?? [],
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
    paragraph: draft.paragraph.length > LIMITS.paragraph,
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
      fieldErrors.paragraph ||
      fieldErrors.bullets.some(Boolean)
    ) {
      setError("Revisá los límites de caracteres antes de guardar.");
      return;
    }
    if (!draft.bullets.length) {
      setError("Agregá al menos un bullet.");
      return;
    }

    const content: WholesaleSectionContent = {
      ...baseContent,
      ...draft,
    };

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(content);
      setFeedback("Programa mayorista actualizado.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la sección mayorista.",
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
          : "Sección ocultada temporalmente.",
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
      setFeedback("Versión de mayoristas incrementada.");
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
          <p className="eyebrow">Mayoristas</p>
          <h2>Programa profesionales</h2>
          <p className="muted">
            Editá el contenido del bloque “Programa mayorista” de la página productos.
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
        <Field
          label="Párrafo principal"
          value={draft.paragraph}
          max={LIMITS.paragraph}
          error={fieldErrors.paragraph}
          multiline
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, paragraph: value }))
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
              <div className="stat-card" key={`wholesale-bullet-${index}`}>
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
            fieldErrors.paragraph ||
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
