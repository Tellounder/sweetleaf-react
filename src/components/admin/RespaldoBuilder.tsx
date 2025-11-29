import { useEffect, useMemo, useState } from "react";
import type {
  DesignFallback,
  RespaldoSectionContent,
  RespaldoStat,
} from "../../content/designFallback";
import type { UseDesignContentResult } from "../../hooks/useDesignContent";

type BlocksResult = UseDesignContentResult<DesignFallback>["blocks"];

type RespaldoBuilderProps = {
  block: BlocksResult["section.respaldo"];
  onSave: (content: RespaldoSectionContent) => Promise<void>;
  onPublishToggle: (nextPublished: boolean) => Promise<void>;
  onBumpVersion: () => Promise<void>;
  apiReady: boolean;
};

const LIMITS = {
  kicker: 40,
  title: 90,
  subtitle: 260,
  statLabel: 28,
  statValue: 18,
};

export function RespaldoBuilder({
  block,
  onSave,
  onPublishToggle,
  onBumpVersion,
  apiReady,
}: RespaldoBuilderProps) {
  const baseContent = useMemo(() => {
    const { __meta, ...rest } = block;
    return rest as RespaldoSectionContent;
  }, [block]);

  const [draft, setDraft] = useState(() => ({
    kicker: baseContent.kicker ?? "",
    title: baseContent.title ?? "",
    subtitle: baseContent.subtitle ?? "",
    stats: baseContent.stats ?? [],
  }));

  useEffect(() => {
    setDraft({
      kicker: baseContent.kicker ?? "",
      title: baseContent.title ?? "",
      subtitle: baseContent.subtitle ?? "",
      stats: baseContent.stats ?? [],
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

  const statErrors = draft.stats.map((stat) => ({
    label: stat.label.length > LIMITS.statLabel,
    value: stat.value.length > LIMITS.statValue,
  }));

  const canAddStat = draft.stats.length < 6;

  const persist = async () => {
    if (!apiReady) {
      setError("Configurá API URL + API key para guardar cambios.");
      return;
    }
    if (Object.values(fieldErrors).some(Boolean)) {
      setError("Revisá los límites de caracteres antes de guardar.");
      return;
    }
    if (statErrors.some((err) => err.label || err.value)) {
      setError("Ajustá los textos de cada estadística.");
      return;
    }
    if (!draft.stats.length) {
      setError("Agregá al menos una estadística.");
      return;
    }

    const content: RespaldoSectionContent = {
      ...baseContent,
      kicker: draft.kicker,
      title: draft.title,
      subtitle: draft.subtitle,
      stats: draft.stats,
    };

    try {
      setSaving(true);
      setFeedback(undefined);
      setError(undefined);
      await onSave(content);
      setFeedback("Sección de respaldo actualizada.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la sección Respaldo.",
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
      setFeedback("Versión de la sección incrementada.");
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

  const updateStat = (
    index: number,
    field: keyof RespaldoStat,
    value: string,
  ) => {
    setDraft((prev) => {
      const stats = prev.stats.map((stat, idx) =>
        idx === index ? { ...stat, [field]: value } : stat,
      );
      return { ...prev, stats };
    });
  };

  const addStat = () => {
    if (!canAddStat) return;
    setDraft((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: "", value: "" }],
    }));
  };

  const removeStat = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <section className="card builder-panel">
      <header className="builder-head">
        <div>
          <p className="eyebrow">Respaldo</p>
          <h2>Sección de métricas</h2>
          <p className="muted">
            Controlá textos y valores de la barra de estadísticas tal cual se ve en la Home.
            Los límites de caracteres impiden que se corte el diseño.
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
              <h3>Estadísticas</h3>
              <p className="muted">
                Podés listar hasta 6 valores. El orden en la lista es el orden en el sitio.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addStat}
              disabled={!canAddStat}
            >
              Agregar estadística
            </button>
          </div>
          <div className="stack">
            {draft.stats.map((stat, index) => (
              <div className="stat-card" key={`stat-${index}`}>
                <div className="stat-card-head">
                  <span>#{index + 1}</span>
                  <button
                    type="button"
                    className="btn btn-tertiary"
                    onClick={() => removeStat(index)}
                  >
                    Quitar
                  </button>
                </div>
                <div className="cta-grid">
                  <Field
                    label="Etiqueta"
                    value={stat.label}
                    max={LIMITS.statLabel}
                    error={statErrors[index]?.label}
                    onChange={(value) => updateStat(index, "label", value)}
                  />
                  <Field
                    label="Valor"
                    value={stat.value}
                    max={LIMITS.statValue}
                    error={statErrors[index]?.value}
                    onChange={(value) => updateStat(index, "value", value)}
                  />
                </div>
              </div>
            ))}
            {!draft.stats.length && (
              <div className="media-card placeholder">
                <span>Sin estadísticas cargadas</span>
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
            statErrors.some((err) => err.label || err.value) ||
            draft.stats.length === 0
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
