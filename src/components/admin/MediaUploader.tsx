import { useRef } from "react";
import { useMediaUpload } from "../../hooks/useMediaUpload";

type MediaUploaderProps = {
  label: string;
  description?: string;
  folder: string;
  value?: string;
  onChange?: (url: string) => void;
  onUploaded?: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  buttonLabel?: string;
  helper?: string;
  previewMode?: "single" | "none";
};

export function MediaUploader({
  label,
  description,
  folder,
  value,
  onChange,
  onUploaded,
  onRemove,
  disabled,
  buttonLabel = "Subir imagen",
  helper,
  previewMode = "single",
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { upload, isUploading, error, reset } = useMediaUpload();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await upload(file, folder);
      if (onChange) {
        onChange(result.url);
      }
      if (onUploaded) {
        onUploaded(result.url);
      }
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      // error handled inside hook
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
      reset();
    }
  };

  const openPicker = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  return (
    <div className="media-uploader">
      <div className="media-uploader-head">
        <div>
          <p className="eyebrow">{label}</p>
          {description && <p className="muted">{description}</p>}
        </div>
        {helper && <span className="muted small">{helper}</span>}
      </div>

      {previewMode === "single" && (
        <>
          {value ? (
            <div className="media-preview">
              <img src={value} alt={label} loading="lazy" />
              {onRemove && (
                <button
                  type="button"
                  className="btn btn-tertiary"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  Quitar imagen
                </button>
              )}
            </div>
          ) : (
            <div className="media-preview placeholder">
              <span>Sin imagen seleccionada</span>
            </div>
          )}
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        style={{ display: "none" }}
      />

      <button
        type="button"
        className="btn btn-secondary"
        onClick={openPicker}
        disabled={disabled || isUploading}
      >
        {isUploading ? "Subiendo…" : buttonLabel}
      </button>

      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
