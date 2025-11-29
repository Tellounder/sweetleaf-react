import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  HomePetSectionContent,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";
import { MediaUploader } from "./MediaUploader";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  description: 260,
  pill: 80,
  bullet: 90,
};

const MAX_BULLETS = 5;

export function HomePetBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: {
  block: BlocksResult["home.pet"];
  onSave: (content: HomePetSectionContent) => Promise<void>;
  onPublishToggle: (next: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
}) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as HomePetSectionContent;
  }, [block]);

  const [hero, setHero] = useState(baseContent.hero);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setHero(baseContent.hero);
  }, [baseContent]);

  const heroErrors = {
    kicker: hero.kicker.length > LIMITS.kicker,
    title: hero.title.length > LIMITS.title,
    subtitle: hero.subtitle.length > LIMITS.subtitle,
    description: hero.description.length > LIMITS.description,
    pill: hero.pill.length > LIMITS.pill,
    bullets: hero.bulletPoints.map((bullet) => bullet.length > LIMITS.bullet),
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
      heroErrors.bullets.some(Boolean)
    ) {
      setError("Revisá los límites de caracteres antes de guardar.");
      return;
    }

    const content: HomePetSectionContent = {
      ...baseContent,
      hero,
    };

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(content);
      setFeedback("Sección Pet (Home) actualizada.");
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
      setFeedback("Versión de la sección Pet (Home) incrementada.");
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
    if (hero.bulletPoints.length >= MAX_BULLETS) return;
    setHero((prev) => ({
      ...prev,
      bulletPoints: [...prev.bulletPoints, ""],
    }));
  };

  const updateBullet = (index: number, value: string) => {
    setHero((prev) => ({
      ...prev,
      bulletPoints: prev.bulletPoints.map((bullet, idx) =>
        idx === index ? value : bullet,
      ),
    }));
  };

  const removeBullet = (index: number) => {
    setHero((prev) => ({
      ...prev,
      bulletPoints: prev.bulletPoints.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Home · Sección Pet</p>
          <h2>Hero mascotas</h2>
          <p className="muted">
            Controla los textos e imagen del bloque Pet que aparece en la home.
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
        <div className="builder-grid">
          <div className="stack">
            <Field
              label="Kicker"
              value={hero.kicker}
              max={LIMITS.kicker}
              error={heroErrors.kicker}
              onChange={(value) => setHero((prev) => ({ ...prev, kicker: value }))}
            />
            <Field
              label="Título"
              value={hero.title}
              max={LIMITS.title}
              error={heroErrors.title}
              onChange={(value) => setHero((prev) => ({ ...prev, title: value }))}
            />
            <Field
              label="Subtítulo"
              value={hero.subtitle}
              max={LIMITS.subtitle}
              error={heroErrors.subtitle}
              onChange={(value) =>
                setHero((prev) => ({ ...prev, subtitle: value }))
              }
            />
            <Field
              label="Descripción"
              value={hero.description}
              max={LIMITS.description}
              error={heroErrors.description}
              multiline
              onChange={(value) =>
                setHero((prev) => ({ ...prev, description: value }))
              }
            />
            <Field
              label="Texto del pill"
              value={hero.pill}
              max={LIMITS.pill}
              error={heroErrors.pill}
              onChange={(value) => setHero((prev) => ({ ...prev, pill: value }))}
            />
          </div>
          <div className="stack">
            <MediaUploader
              label="Imagen"
              description="Recomendado 1000px+"
              folder="home-pet"
              value={hero.image}
              onChange={(url) => setHero((prev) => ({ ...prev, image: url }))}
              onRemove={() => setHero((prev) => ({ ...prev, image: "" }))}
              disabled={!apiReady}
            />
          </div>
        </div>

        <div className="media-section">
          <div className="media-head">
            <div>
              <h3>Bullets (máx. {MAX_BULLETS})</h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addBullet}
              disabled={hero.bulletPoints.length >= MAX_BULLETS}
            >
              Agregar bullet
            </button>
          </div>
          <div className="stack">
            {hero.bulletPoints.map((bullet, index) => (
              <div className="stat-card" key={`home-pet-bullet-${index}`}>
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
            heroErrors.bullets.some(Boolean)
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
