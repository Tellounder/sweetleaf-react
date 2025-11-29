import { useEffect, useMemo, useState } from "react";
import type {
  CbdIntroCard,
  CbdIntroSectionContent,
  DesignFallback,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  cardTitle: 60,
  paragraph: 220,
  pill: 70,
};

const MAX_CARDS = 3;
const MAX_PARAGRAPHS = 3;

export function CbdIntroBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: {
  block: BlocksResult["cbd.intro"];
  onSave: (content: CbdIntroSectionContent) => Promise<void>;
  onPublishToggle: (next: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
}) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as CbdIntroSectionContent;
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
    cards: draft.cards.map((card) => ({
      title: card.title.length > LIMITS.cardTitle,
      paragraphs: card.paragraphs.map(
        (paragraph) => paragraph.length > LIMITS.paragraph,
      ),
      pill: (card.pill ?? "").length > LIMITS.pill,
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
      fieldErrors.cards.some(
        (card) =>
          card.title || card.pill || card.paragraphs.some((p) => p === true),
      )
    ) {
      setError("Revisá los límites de texto antes de guardar.");
      return;
    }
    if (!draft.cards.length) {
      setError("Agregá al menos una card.");
      return;
    }

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(draft);
      setFeedback("Sección CBD Intro actualizada.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la sección CBD Intro.",
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
          : "Sección ocultada de /cbd.",
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
      setFeedback("Versión de la sección CBD Intro incrementada.");
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

  const addCard = () => {
    if (draft.cards.length >= MAX_CARDS) return;
    const card: CbdIntroCard = {
      title: "",
      paragraphs: [""],
    };
    setDraft((prev) => ({ ...prev, cards: [...prev.cards, card] }));
  };

  const updateCard = (
    index: number,
    field: keyof CbdIntroCard,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      cards: prev.cards.map((card, idx) =>
        idx === index ? { ...card, [field]: value } : card,
      ),
    }));
  };

  const addParagraph = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      cards: prev.cards.map((card, idx) =>
        idx === index
          ? {
              ...card,
              paragraphs: card.paragraphs.length >= MAX_PARAGRAPHS
                ? card.paragraphs
                : [...card.paragraphs, ""],
            }
          : card,
      ),
    }));
  };

  const updateParagraph = (
    index: number,
    paragraphIndex: number,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      cards: prev.cards.map((card, idx) =>
        idx === index
          ? {
              ...card,
              paragraphs: card.paragraphs.map((paragraph, pIdx) =>
                pIdx === paragraphIndex ? value : paragraph,
              ),
            }
          : card,
      ),
    }));
  };

  const removeParagraph = (index: number, paragraphIndex: number) => {
    setDraft((prev) => ({
      ...prev,
      cards: prev.cards.map((card, idx) =>
        idx === index
          ? {
              ...card,
              paragraphs: card.paragraphs.filter(
                (_, pIdx) => pIdx !== paragraphIndex,
              ),
            }
          : card,
      ),
    }));
  };

  const removeCard = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">CBD · Intro</p>
          <h2>Hero educativo</h2>
          <p className="muted">
            Controlá el texto y las cards que explican qué es el CBD.
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

        <div className="media-section">
          <div className="media-head">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addCard}
              disabled={draft.cards.length >= MAX_CARDS}
            >
              Agregar card
            </button>
          </div>
          <div className="stack">
            {draft.cards.map((card, index) => (
              <div className="stat-card" key={`cbd-card-${index}`}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeCard(index)}
                  >
                    Quitar
                  </button>
                </div>
                <Field
                  label="Título"
                  value={card.title}
                  max={LIMITS.cardTitle}
                  error={fieldErrors.cards[index]?.title}
                  onChange={(value) => updateCard(index, "title", value)}
                />
                <div className="media-section">
                  <div className="media-head">
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() => addParagraph(index)}
                      disabled={card.paragraphs.length >= MAX_PARAGRAPHS}
                    >
                      Agregar párrafo
                    </button>
                  </div>
                  <div className="stack">
                    {card.paragraphs.map((paragraph, pIdx) => (
                      <div className="stat-card" key={`cbd-card-${index}-${pIdx}`}>
                        <div className="stat-card-head">
                          <span>§</span>
                          <button
                            type="button"
                            className="btn btn-tertiary"
                            onClick={() => removeParagraph(index, pIdx)}
                          >
                            Quitar
                          </button>
                        </div>
                        <Field
                          label="Texto"
                          value={paragraph}
                          max={LIMITS.paragraph}
                          error={fieldErrors.cards[index]?.paragraphs?.[pIdx]}
                          multiline
                          onChange={(value) =>
                            updateParagraph(index, pIdx, value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Field
                  label="Texto del pill"
                  value={card.pill ?? ""}
                  max={LIMITS.pill}
                  error={fieldErrors.cards[index]?.pill}
                  onChange={(value) => updateCard(index, "pill", value)}
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
            fieldErrors.cards.some(
              (card) =>
                card.title ||
                card.pill ||
                card.paragraphs.some((paragraph) => paragraph),
            ) ||
            draft.cards.length === 0
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
