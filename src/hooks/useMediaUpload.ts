import { useCallback, useState } from "react";
import {
  isSupabaseConfigured,
  supabaseBucket,
  supabaseClient,
} from "../lib/supabaseClient";

type UploadResult = {
  url: string;
  path: string;
};

type UploadStatus = "idle" | "uploading" | "error" | "success";

function createFileSlug(fileName: string) {
  const extension = fileName.split(".").pop() ?? "webp";
  const base =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  return `${base}.${extension.replace(/[^a-z0-9]/gi, "")}`;
}

export function useMediaUpload() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | undefined>();

  const upload = useCallback(async (file: File, folder: string) => {
    if (!isSupabaseConfigured() || !supabaseClient || !supabaseBucket) {
      throw new Error(
        "Supabase no está configurado. Agregá VITE_SUPABASE_URL / KEY / BUCKET.",
      );
    }
    setStatus("uploading");
    setError(undefined);

    const slug = createFileSlug(file.name);
    const path = `${folder}/${slug}`;

    const { error: uploadError } = await supabaseClient.storage
      .from(supabaseBucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setStatus("error");
      setError(uploadError.message);
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabaseClient.storage.from(supabaseBucket).getPublicUrl(path);

    setStatus("success");
    return { url: publicUrl, path } as UploadResult;
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(undefined);
  }, []);

  return {
    upload,
    status,
    error,
    reset,
    isUploading: status === "uploading",
  };
}
