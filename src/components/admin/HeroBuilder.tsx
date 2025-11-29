import { useEffect, useMemo, useRef, useState } from "react";
import type { DesignFallback, HeroHomeContent } from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";
import { Hero } from "../Hero";
import { buildHeroImages } from "../../utils/heroImages";
import { useMediaUpload } from "../../hooks/useMediaUpload";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

type HeroBuilderProps = {
  block: BlocksResult["hero.home"];
  onSave: (content: HeroHomeContent) => Promise<void>;
  onPublishToggle: (nextPublished: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
};

const LIMITS = {
  kicker: 48,
  title: 90,
  subtitle: 260,
  ctaLabel: 24,
  ctaHref: 80,
};

function sanitizeCta(
  cta: HeroHomeContent["ctaPrimary"],
): HeroHomeContent["ctaPrimary"] {
  if (!cta) return undefined;
  const label = cta.label?.trim() ?? "";
  const href = cta.href?.trim() ?? "";
  if (!label || !href) return undefined;
  return { label, href };
}

export function HeroBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: HeroBuilderProps) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as HeroHomeContent;
  }, [block]);

  const [draft, setDraft] = useState(() => ({
    kicker: baseContent.kicker ?? "",
    title: baseContent.title ?? "",
    subtitle: baseContent.subtitle ?? "",
    ctaPrimaryLabel: baseContent.ctaPrimary?.label ?? "",
    ctaPrimaryHref: baseContent.ctaPrimary?.href ?? "",
    ctaSecondaryLabel: baseContent.ctaSecondary?.label ?? "",
    ctaSecondaryHref: baseContent.ctaSecondary?.href ?? "",
    customImages: baseContent.customImages ?? [],
    useSystemImages: baseContent.useSystemImages ?? true,
    maxImages: baseContent.maxImages ?? 10,
  }));

  useEffect(() => {
    setDraft({
      kicker: baseContent.kicker ?? "",
      title: baseContent.title ?? "",
      subtitle: baseContent.subtitle ?? "",
      ctaPrimaryLabel: baseContent.ctaPrimary?.label ?? "",
      ctaPrimaryHref: baseContent.ctaPrimary?.href ?? "",
      ctaSecondaryLabel: baseContent.ctaSecondary?.label ?? "",
      ctaSecondaryHref: baseContent.ctaSecondary?.href ?? "",
      customImages: baseContent.customImages ?? [],
      useSystemImages: baseContent.useSystemImages ?? true,
      maxImages: baseContent.maxImages ?? 10,
    });
  }, [baseContent]);

  const systemImages = block.backgroundImages ?? [];
  const heroImages = buildHeroImages({
    systemImages: block.backgroundImages,
    customImages: draft.customImages,
    useSystemImages: draft.useSystemImages,
    maxImages: draft.maxImages,
  });

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [error, setError] = useState<string>();
  const { upload, isUploading, error: uploadError, reset: resetUpload } =
    useMediaUpload();
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  const fieldErrors = {
    kicker: draft.kicker.length > LIMITS.kicker,
    title: draft.title.length > LIMITS.title,
    subtitle: draft.subtitle.length > LIMITS.subtitle,
    ctaPrimaryLabel: draft.ctaPrimaryLabel.length > LIMITS.ctaLabel,
    ctaPrimaryHref: draft.ctaPrimaryHref.length > LIMITS.ctaHref,
    ctaSecondaryLabel: draft.ctaSecondaryLabel.length > LIMITS.ctaLabel,
    ctaSecondaryHref: draft.ctaSecondaryHref.length > LIMITS.ctaHref,
  };

  const systemCount = draft.useSystemImages ? systemImages.length : 0;
  const maxCustom = Math.max(draft.maxImages - systemCount, 0);
  const exceedsCustomLimit = draft.customImages.length > maxCustom;
  const canAddCustom = draft.customImages.length < maxCustom;

  const previewContent: HeroHomeContent = {
    ...baseContent,
    kicker: draft.kicker,
    title: draft.title,
    subtitle: draft.subtitle,
    ctaPrimary: sanitizeCta({
      label: draft.ctaPrimaryLabel,
      href: draft.ctaPrimaryHref,
    }),
    ctaSecondary: sanitizeCta({
      label: draft.ctaSecondaryLabel,
      href: draft.ctaSecondaryHref,
    }),
    customImages: draft.customImages,
    useSystemImages: draft.useSystemImages,
    maxImages: draft.maxImages,
    backgroundImages: block.backgroundImages,
  };

  const handleUpload = async (file: File) => {
    if (!canAddCustom) {
      setError("Alcanzaste el máximo de imágenes personalizadas.");
      return;
    }
    try {
      setError(undefined);
      const result = await upload(file, "hero");
      setDraft((prev) => ({
        ...prev,
        customImages: [...prev.customImages, result.url],
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo subir la imagen seleccionada.",
      );
    }
  };

  const persist = async () => {
    if (!apiReady) {
      setError("Configurá API URL + API key para guardar cambios.");
      return;
    }
    if (Object.values(fieldErrors).some(Boolean) || exceedsCustomLimit) {
      setError("Revisá los límites de caracteres e imágenes antes de guardar.");
      return;
    }
    const content: HeroHomeContent = {
      ...baseContent,
      kicker: draft.kicker,
      title: draft.title,
      subtitle: draft.subtitle,
      ctaPrimary: sanitizeCta({
        label: draft.ctaPrimaryLabel,
        href: draft.ctaPrimaryHref,
      }),
      ctaSecondary: sanitizeCta({
        label: draft.ctaSecondaryLabel,
        href: draft.ctaSecondaryHref,
      }),
      customImages: draft.customImages,
      useSystemImages: draft.useSystemImages,
      maxImages: draft.maxImages,
    };

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(content);
      setFeedback("Hero actualizado.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar el hero.",
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
          ? "Hero publicado en el sitio."
          : "Hero ocultado temporalmente.",
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
      setFeedback("Versión del hero incrementada.");
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

  const removeCustomImage = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      customImages: prev.customImages.filter((_, idx) => idx !== index),
    }));
  };

  const moveCustomImage = (index: number, direction: -1 | 1) => {
    setDraft((prev) => {
      const next = [...prev.customImages];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return { ...prev, customImages: next };
    });
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Hero</p>
          <h2>Textos e imágenes del hero principal</h2>
          <p className="muted">
            El contenido que ves acá refleja exactamente lo que aparece en la Home.
            Mantenemos los mismos límites de caracteres para garantizar que todo quede perfecto.
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

      <div className="builder-grid">
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

          <div className="cta-grid">
            <Field
              label="CTA Primaria (texto)"
              value={draft.ctaPrimaryLabel}
              max={LIMITS.ctaLabel}
              error={fieldErrors.ctaPrimaryLabel}
              onChange={(value) =>
                setDraft((prev) => ({ ...prev, ctaPrimaryLabel: value }))
              }
            />
            <Field
              label="CTA Primaria (URL)"
              value={draft.ctaPrimaryHref}
              max={LIMITS.ctaHref}
              error={fieldErrors.ctaPrimaryHref}
              onChange={(value) =>
                setDraft((prev) => ({ ...prev, ctaPrimaryHref: value }))
              }
            />
            <Field
              label="CTA Secundaria (texto)"
              value={draft.ctaSecondaryLabel}
              max={LIMITS.ctaLabel}
              error={fieldErrors.ctaSecondaryLabel}
              onChange={(value) =>
                setDraft((prev) => ({ ...prev, ctaSecondaryLabel: value }))
              }
            />
            <Field
              label="CTA Secundaria (URL)"
              value={draft.ctaSecondaryHref}
              max={LIMITS.ctaHref}
              error={fieldErrors.ctaSecondaryHref}
              onChange={(value) =>
                setDraft((prev) => ({ ...prev, ctaSecondaryHref: value }))
              }
            />
          </div>

          <div className="media-section">
            <div className="media-head">
              <div>
                <h3>Galería del hero</h3>
                <p className="muted">
                  Podés subir hasta {draft.maxImages} imágenes entre sistema y personalizadas.
                  Actualmente se muestran {heroImages.length}.
                </p>
              </div>
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={draft.useSystemImages}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      useSystemImages: event.target.checked,
                    }))
                  }
                />
                <span>Mostrar imágenes del sistema ({systemImages.length})</span>
              </label>
            </div>

            <div className="media-grid">
              {draft.customImages.map((url, index) => (
                <div className="media-card" key={`${url}-${index}`}>
                  <img src={url} alt={`Custom hero ${index + 1}`} loading="lazy" />
                  <div className="media-card-actions">
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() => moveCustomImage(index, -1)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() => moveCustomImage(index, 1)}
                      disabled={index === draft.customImages.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => removeCustomImage(index)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
              {draft.customImages.length === 0 && (
                <div className="media-card placeholder">
                  <span>Sin imágenes personalizadas</span>
                </div>
              )}
            </div>

            <div className="upload-row">
              <input
                ref={heroFileInputRef}
                type="file"
                accept="image/*"
                hidden
                disabled={!apiReady || isUploading || !canAddCustom}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleUpload(file);
                    event.target.value = "";
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => heroFileInputRef.current?.click()}
                disabled={!apiReady || isUploading || !canAddCustom}
              >
                {isUploading ? "Subiendo…" : "Agregar imagen al hero"}
              </button>
              <span className="muted small">
                {canAddCustom
                  ? `Podés sumar ${maxCustom - draft.customImages.length} imágenes más.`
                  : "Llegaste al máximo permitido con el set actual."}
              </span>
            </div>
            {uploadError && (
              <p className="admin-error" onClick={resetUpload}>
                {uploadError}
              </p>
            )}
            {exceedsCustomLimit && (
              <p className="admin-error">
                Quitar {draft.customImages.length - maxCustom} imagen(es) para cumplir
                el máximo combinado ({draft.maxImages}).
              </p>
            )}
          </div>
        </div>

        <div className="builder-preview">
          <Hero
            kicker={previewContent.kicker}
            title={previewContent.title}
            subtitle={previewContent.subtitle}
            ctaPrimary={previewContent.ctaPrimary}
            ctaSecondary={previewContent.ctaSecondary}
            backgroundImages={
              heroImages.length ? heroImages : previewContent.backgroundImages
            }
          />
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
            Object.values(fieldErrors).some(Boolean) ||
            exceedsCustomLimit
          }
        >
          {saving ? "Guardando…" : "Guardar hero"}
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
  const CounterTag = (
    <span className={`char-counter ${error ? "error" : ""}`}>
      {value.length}/{max}
    </span>
  );

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
      {CounterTag}
    </label>
  );
}
