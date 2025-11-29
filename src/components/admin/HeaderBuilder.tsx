import { useEffect, useMemo, useState } from "react";
import type { DesignFallback, HeaderContent } from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";
import { MediaUploader } from "./MediaUploader";
import { designFallback } from "../../content/designFallback";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

type HeaderBuilderProps = {
  block: BlocksResult["header.main"];
  onSave: (content: HeaderContent) => Promise<void>;
  onPublishToggle: (nextPublished: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
};

const SYSTEM_HEADER_IMAGE =
  designFallback["header.main"].backgroundImage ?? "/img/principal.webp";

type HeaderDraft = {
  backgroundImage: string;
  useSystemBackground: boolean;
};

export function HeaderBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: HeaderBuilderProps) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as HeaderContent;
  }, [block]);

  const [draft, setDraft] = useState<HeaderDraft>({
    backgroundImage: block.useSystemBackground
      ? SYSTEM_HEADER_IMAGE
      : block.backgroundImage ?? "",
    useSystemBackground: block.useSystemBackground ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    setDraft({
      backgroundImage: block.useSystemBackground
        ? SYSTEM_HEADER_IMAGE
        : block.backgroundImage ?? "",
      useSystemBackground: block.useSystemBackground ?? true,
    });
  }, [block]);

  const headerPreview = draft.useSystemBackground
    ? SYSTEM_HEADER_IMAGE
    : draft.backgroundImage || SYSTEM_HEADER_IMAGE;

  const handleUpload = (url: string) => {
    setDraft({
      backgroundImage: url,
      useSystemBackground: false,
    });
  };

  const handleUseSystem = (checked: boolean) => {
    setDraft((prev) => ({
      ...prev,
      useSystemBackground: checked,
      backgroundImage: checked ? SYSTEM_HEADER_IMAGE : prev.backgroundImage,
    }));
  };

  const persist = async () => {
    if (!apiReady) {
      setError("Configurá API URL + API key para guardar cambios.");
      return;
    }
    const content: HeaderContent = {
      ...baseContent,
      backgroundImage: draft.useSystemBackground
        ? SYSTEM_HEADER_IMAGE
        : draft.backgroundImage,
      useSystemBackground: draft.useSystemBackground,
    };

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(content);
      setFeedback("Header actualizado.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar el header.",
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
          ? "Header publicado."
          : "Header ocultado del sitio.",
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
      setFeedback("Versión del header actualizada.");
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

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Header</p>
          <h2>Imagen de fondo</h2>
          <p className="muted">
            Seleccioná una imagen personalizada o usá la imagen base del sistema.
            El resto del header se mantiene fijo para preservar la navegación.
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

      <div className="header-builder">
        <div className="header-preview" style={{ backgroundImage: `url(${headerPreview})` }}>
          <div className="header-preview-overlay">
            <span>Vista previa de la cabecera</span>
          </div>
        </div>

        <div className="header-controls">
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={draft.useSystemBackground}
              onChange={(event) => handleUseSystem(event.target.checked)}
            />
            <span>Usar imagen base del sistema</span>
          </label>

          <MediaUploader
            label="Imagen personalizada"
            description="Formatos recomendados: WEBP o JPG, mínimo 1200px de ancho."
            folder="header"
            value={draft.useSystemBackground ? "" : draft.backgroundImage}
            onChange={handleUpload}
            onRemove={() =>
              setDraft((prev) => ({ ...prev, backgroundImage: "" }))
            }
            disabled={!apiReady}
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
          disabled={!apiReady || saving}
        >
          {saving ? "Guardando…" : "Guardar header"}
        </button>
      </div>
    </section>
  );
}
