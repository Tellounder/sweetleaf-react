import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  HomeIacaSectionContent,
  IacaBlockContent,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  intro: 320,
  blockTitle: 60,
  blockDescription: 200,
  bullet: 80,
};

const MAX_BLOCKS = 4;
const MAX_BULLETS = 4;

export function HomeIacaBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: {
  block: BlocksResult["home.iaca"];
  onSave: (content: HomeIacaSectionContent) => Promise<void>;
  onPublishToggle: (next: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
}) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as HomeIacaSectionContent;
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
    intro: draft.intro.length > LIMITS.intro,
    blocks: draft.blocks.map((iaca) => ({
      title: iaca.title.length > LIMITS.blockTitle,
      description: (iaca.description ?? "").length > LIMITS.blockDescription,
      bullets: (iaca.bullets ?? []).map((bullet) => bullet.length > LIMITS.bullet),
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
      fieldErrors.intro ||
      fieldErrors.blocks.some(
        (err) =>
          err.title ||
          err.description ||
          err.bullets.some((bulletErr) => bulletErr),
      )
    ) {
      setError("Revisá los límites de caracteres antes de guardar.");
      return;
    }
    if (!draft.blocks.length) {
      setError("Agregá al menos un bloque de laboratorio.");
      return;
    }

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(draft);
      setFeedback("Sección IACA actualizada.");
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
      setFeedback("Versión de la sección IACA incrementada.");
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

  const addBlock = () => {
    if (draft.blocks.length >= MAX_BLOCKS) return;
    const newBlock: IacaBlockContent = {
      title: "",
      description: "",
    };
    setDraft((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const updateBlock = (
    index: number,
    field: keyof IacaBlockContent,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((blockItem, idx) =>
        idx === index ? { ...blockItem, [field]: value } : blockItem,
      ),
    }));
  };

  const addBullet = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((blockItem, idx) =>
        idx === index
          ? {
              ...blockItem,
              bullets: [...(blockItem.bullets ?? []), ""].slice(
                0,
                MAX_BULLETS,
              ),
            }
          : blockItem,
      ),
    }));
  };

  const updateBullet = (index: number, bulletIndex: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((blockItem, idx) =>
        idx === index
          ? {
              ...blockItem,
              bullets: (blockItem.bullets ?? []).map((bullet, bIdx) =>
                bIdx === bulletIndex ? value : bullet,
              ),
            }
          : blockItem,
      ),
    }));
  };

  const removeBullet = (index: number, bulletIndex: number) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.map((blockItem, idx) =>
        idx === index
          ? {
              ...blockItem,
              bullets: (blockItem.bullets ?? []).filter(
                (_, bIdx) => bIdx !== bulletIndex,
              ),
            }
          : blockItem,
      ),
    }));
  };

  const removeBlock = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Home · IACA</p>
          <h2>Calidad certificada</h2>
          <p className="muted">
            Editá el texto y los bloques informativos del laboratorio IACA.
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
          label="Subtítulo"
          value={draft.subtitle}
          max={LIMITS.subtitle}
          error={fieldErrors.subtitle}
          multiline
          onChange={(value) =>
            setDraft((prev) => ({ ...prev, subtitle: value }))
          }
        />
        <Field
          label="Intro"
          value={draft.intro}
          max={LIMITS.intro}
          error={fieldErrors.intro}
          multiline
          onChange={(value) => setDraft((prev) => ({ ...prev, intro: value }))}
        />
        <div className="media-section">
          <div className="media-head">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addBlock}
              disabled={draft.blocks.length >= MAX_BLOCKS}
            >
              Agregar bloque
            </button>
          </div>
          <div className="stack">
            {draft.blocks.map((blockItem, index) => (
              <div className="stat-card" key={`iaca-block-${index}`}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeBlock(index)}
                  >
                    Quitar
                  </button>
                </div>
                <Field
                  label="Título"
                  value={blockItem.title}
                  max={LIMITS.blockTitle}
                  error={fieldErrors.blocks[index]?.title}
                  onChange={(value) => updateBlock(index, "title", value)}
                />
                <Field
                  label="Descripción"
                  value={blockItem.description ?? ""}
                  max={LIMITS.blockDescription}
                  error={fieldErrors.blocks[index]?.description}
                  multiline
                  onChange={(value) => updateBlock(index, "description", value)}
                />
                <div className="media-section">
                  <div className="media-head">
                    <div>
                      <h4>Bullets (opcional)</h4>
                    </div>
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() => addBullet(index)}
                      disabled={
                        (blockItem.bullets ?? []).length >= MAX_BULLETS
                      }
                    >
                      Agregar bullet
                    </button>
                  </div>
                  <div className="stack">
                    {(blockItem.bullets ?? []).map((bullet, bulletIdx) => (
                      <div
                        className="stat-card"
                        key={`iaca-bullet-${index}-${bulletIdx}`}
                      >
                        <div className="stat-card-head">
                          <span>·</span>
                          <button
                            type="button"
                            className="btn btn-tertiary"
                            onClick={() => removeBullet(index, bulletIdx)}
                          >
                            Quitar
                          </button>
                        </div>
                        <Field
                          label="Texto"
                          value={bullet}
                          max={LIMITS.bullet}
                          error={
                            fieldErrors.blocks[index]?.bullets?.[bulletIdx]
                          }
                          onChange={(value) =>
                            updateBullet(index, bulletIdx, value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
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
            fieldErrors.intro ||
            fieldErrors.blocks.some(
              (err) =>
                err.title ||
                err.description ||
                err.bullets.some((bulletErr) => bulletErr),
            ) ||
            draft.blocks.length === 0
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
