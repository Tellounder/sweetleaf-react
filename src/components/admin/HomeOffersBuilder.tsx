import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  HomeOffersSectionContent,
  OfferCardContent,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";
import { OfferCard } from "../OfferCard";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  offerTitle: 60,
  offerDescription: 160,
  price: 20,
  tag: 20,
  bonus: 90,
};

const MAX_OFFERS = 6;

export function HomeOffersBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
  onPreviewAdd,
}: {
  block: BlocksResult["home.offers"];
  onSave: (content: HomeOffersSectionContent) => Promise<void>;
  onPublishToggle: (next: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
  onPreviewAdd?: (title: string, price: string) => void;
}) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as HomeOffersSectionContent;
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
    offers: draft.offers.map((offer) => ({
      title: offer.title.length > LIMITS.offerTitle,
      description: offer.description.length > LIMITS.offerDescription,
      price: offer.price.length > LIMITS.price,
      oldPrice: offer.oldPrice.length > LIMITS.price,
      tag: offer.tag.length > LIMITS.tag,
      bonus: offer.bonus.length > LIMITS.bonus,
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
      fieldErrors.offers.some(
        (err) =>
          err.title ||
          err.description ||
          err.price ||
          err.oldPrice ||
          err.tag ||
          err.bonus,
      )
    ) {
      setError("Revisá los límites de texto antes de guardar.");
      return;
    }
    if (!draft.offers.length) {
      setError("Agregá al menos una oferta.");
      return;
    }

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(draft);
      setFeedback("Sección de ofertas actualizada.");
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
      setFeedback("Versión de la sección de ofertas incrementada.");
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

  const addOffer = () => {
    if (draft.offers.length >= MAX_OFFERS) return;
    const newOffer: OfferCardContent = {
      id: `offer-${Date.now()}`,
      title: "",
      description: "",
      price: "",
      oldPrice: "",
      tag: "",
      bonus: "",
    };
    setDraft((prev) => ({ ...prev, offers: [...prev.offers, newOffer] }));
  };

  const updateOffer = (
    index: number,
    field: keyof OfferCardContent,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      offers: prev.offers.map((offer, idx) =>
        idx === index ? { ...offer, [field]: value } : offer,
      ),
    }));
  };

  const removeOffer = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      offers: prev.offers.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Home · Ofertas</p>
          <h2>Bloque “Ofertas activas”</h2>
          <p className="muted">
            Configura el título y las cards que aparecen en el carrusel del home.
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
              onClick={addOffer}
              disabled={draft.offers.length >= MAX_OFFERS}
            >
              Agregar oferta
            </button>
          </div>
          <div className="stack">
            {draft.offers.map((offer, index) => (
              <div className="stat-card" key={offer.id}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <div className="admin-action-row">
                    {onPreviewAdd && (
                      <button
                        type="button"
                        className="btn btn-tertiary"
                        onClick={() => onPreviewAdd(offer.title, offer.price)}
                      >
                        Probar CTA
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => removeOffer(index)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <Field
                  label="Título"
                  value={offer.title}
                  max={LIMITS.offerTitle}
                  error={fieldErrors.offers[index]?.title}
                  onChange={(value) => updateOffer(index, "title", value)}
                />
                <Field
                  label="Descripción"
                  value={offer.description}
                  max={LIMITS.offerDescription}
                  error={fieldErrors.offers[index]?.description}
                  multiline
                  onChange={(value) =>
                    updateOffer(index, "description", value)
                  }
                />
                <div className="cta-grid">
                  <Field
                    label="Precio"
                    value={offer.price}
                    max={LIMITS.price}
                    error={fieldErrors.offers[index]?.price}
                    onChange={(value) => updateOffer(index, "price", value)}
                  />
                  <Field
                    label="Precio anterior"
                    value={offer.oldPrice}
                    max={LIMITS.price}
                    error={fieldErrors.offers[index]?.oldPrice}
                    onChange={(value) => updateOffer(index, "oldPrice", value)}
                  />
                </div>
                <Field
                  label="Tag"
                  value={offer.tag}
                  max={LIMITS.tag}
                  error={fieldErrors.offers[index]?.tag}
                  onChange={(value) => updateOffer(index, "tag", value)}
                />
                <Field
                  label="Bonus"
                  value={offer.bonus}
                  max={LIMITS.bonus}
                  error={fieldErrors.offers[index]?.bonus}
                  onChange={(value) => updateOffer(index, "bonus", value)}
                />
                <div className="offer-preview">
                  <OfferCard {...offer} onAdd={() => {}} />
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
            fieldErrors.offers.some(
              (err) =>
                err.title ||
                err.description ||
                err.price ||
                err.oldPrice ||
                err.tag ||
                err.bonus,
            ) ||
            draft.offers.length === 0
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
