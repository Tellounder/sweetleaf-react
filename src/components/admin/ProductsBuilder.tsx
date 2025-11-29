import { useEffect, useMemo, useState } from "react";
import type {
  CatalogProduct,
  CatalogSectionContent,
  DesignFallback,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";
import { MediaUploader } from "./MediaUploader";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

type ProductsBuilderProps = {
  block: BlocksResult["catalog.products"];
  onSave: (content: CatalogSectionContent) => Promise<void>;
  onPublishToggle: (nextPublished: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
};

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  name: 60,
  description: 200,
  price: 18,
  suggested: 18,
};

const MAX_PRODUCTS = 8;

export function ProductsBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: ProductsBuilderProps) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as CatalogSectionContent;
  }, [block]);

  const [draft, setDraft] = useState(() => ({
    kicker: baseContent.kicker ?? "",
    title: baseContent.title ?? "",
    subtitle: baseContent.subtitle ?? "",
    products: baseContent.products ?? [],
  }));

  useEffect(() => {
    setDraft({
      kicker: baseContent.kicker ?? "",
      title: baseContent.title ?? "",
      subtitle: baseContent.subtitle ?? "",
      products: baseContent.products ?? [],
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
  };

  const productErrors = draft.products.map((product) => ({
    name: product.name.length > LIMITS.name,
    description: product.description.length > LIMITS.description,
    price: product.price.length > LIMITS.price,
    suggested: product.suggested.length > LIMITS.suggested,
  }));

  const canAddProduct = draft.products.length < MAX_PRODUCTS;

  const persist = async () => {
    if (!apiReady) {
      setError("Configurá API URL + API key para guardar cambios.");
      return;
    }
    if (Object.values(fieldErrors).some(Boolean)) {
      setError("Revisá los límites de caracteres del encabezado.");
      return;
    }
    if (
      productErrors.some(
        (err) => err.name || err.description || err.price || err.suggested,
      )
    ) {
      setError("Revisá los campos de cada producto.");
      return;
    }
    if (draft.products.length === 0) {
      setError("Agregá al menos un producto.");
      return;
    }

    const content: CatalogSectionContent = {
      ...baseContent,
      kicker: draft.kicker,
      title: draft.title,
      subtitle: draft.subtitle,
      products: draft.products,
    };

    try {
      setSaving(true);
      setError(undefined);
      setFeedback(undefined);
      await onSave(content);
      setFeedback("Catálogo actualizado.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el catálogo.",
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
      setError(undefined);
      setFeedback(undefined);
      await onPublishToggle(!block.__meta.isPublished);
      setFeedback(
        !block.__meta.isPublished
          ? "Catálogo publicado."
          : "Catálogo ocultado.",
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
      setError(undefined);
      setFeedback(undefined);
      await onBumpVersion();
      setFeedback("Versión del catálogo incrementada.");
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

  const updateProduct = (
    index: number,
    field: keyof CatalogProduct,
    value: string,
  ) => {
    setDraft((prev) => {
      const products = prev.products.map((product, idx) =>
        idx === index ? { ...product, [field]: value } : product,
      );
      return { ...prev, products };
    });
  };

  const addProduct = () => {
    if (!canAddProduct) return;
    setDraft((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: `product-${Date.now()}`,
          name: "",
          price: "",
          suggested: "",
          description: "",
          image: "",
        },
      ],
    }));
  };

  const removeProduct = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      products: prev.products.filter((_, idx) => idx !== index),
    }));
  };

  const moveProduct = (index: number, direction: -1 | 1) => {
    setDraft((prev) => {
      const next = [...prev.products];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, products: next };
    });
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Productos</p>
          <h2>Catálogo principal</h2>
          <p className="muted">
            Editá título, descripción y cada card del catálogo. El orden aquí se respeta en la página
            /productos y en otras secciones donde se reutilicen estos productos.
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
              <h3>Listado de productos</h3>
              <p className="muted">Máximo {MAX_PRODUCTS}. Podés reordenarlos y subir imágenes.</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addProduct}
              disabled={!canAddProduct}
            >
              Agregar producto
            </button>
          </div>

          <div className="stack">
            {draft.products.map((product, index) => (
              <div className="stat-card" key={product.id}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <div className="media-card-actions">
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() => moveProduct(index, -1)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-tertiary"
                      onClick={() => moveProduct(index, 1)}
                      disabled={index === draft.products.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => removeProduct(index)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>

                <Field
                  label="Nombre"
                  value={product.name}
                  max={LIMITS.name}
                  error={productErrors[index]?.name}
                  onChange={(value) => updateProduct(index, "name", value)}
                />
                <Field
                  label="Descripción"
                  value={product.description}
                  max={LIMITS.description}
                  error={productErrors[index]?.description}
                  multiline
                  onChange={(value) => updateProduct(index, "description", value)}
                />
                <div className="cta-grid">
                  <Field
                    label="Precio"
                    value={product.price}
                    max={LIMITS.price}
                    error={productErrors[index]?.price}
                    onChange={(value) => updateProduct(index, "price", value)}
                  />
                  <Field
                    label="Referencia"
                    value={product.suggested}
                    max={LIMITS.suggested}
                    error={productErrors[index]?.suggested}
                    onChange={(value) =>
                      updateProduct(index, "suggested", value)
                    }
                  />
                </div>

                <MediaUploader
                  label="Imagen"
                  description="Subí una imagen optimizada (WEBP/JPG)."
                  folder="products"
                  value={product.image}
                  onChange={(url) => updateProduct(index, "image", url)}
                  onRemove={() => updateProduct(index, "image", "")}
                  disabled={!apiReady}
                />
              </div>
            ))}
            {!draft.products.length && (
              <div className="media-card placeholder">
                <span>Sin productos configurados</span>
              </div>
            )}
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
            Object.values(fieldErrors).some(Boolean) ||
            productErrors.some(
              (err) =>
                err.name || err.description || err.price || err.suggested,
            ) ||
            draft.products.length === 0
          }
        >
          {saving ? "Guardando…" : "Guardar catálogo"}
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
