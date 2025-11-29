import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PublishStatus = {
  isPublished?: boolean;
  updatedAt?: string;
  version?: number;
};

type RemoteDesignBlock = {
  id: string;
  blockKey: string;
  label: string;
  content: Record<string, unknown> | null;
  publishStatus?: PublishStatus | null;
  updatedAt?: string;
};

type BlockMeta = {
  blockKey: string;
  isPublished: boolean;
  source: "fallback" | "remote";
  updatedAt?: string;
  version?: number;
};

type UseDesignContentOptions = {
  apiBaseUrl?: string;
  autoLoad?: boolean;
};

export type UseDesignContentResult<TFallback extends Record<string, object>> = {
  blocks: {
    [K in keyof TFallback]: TFallback[K] & { __meta: BlockMeta };
  };
  status: "idle" | "loading" | "ready" | "error";
  isLoading: boolean;
  error?: string;
  apiBaseUrl: string | null;
  refresh: () => Promise<void>;
};

export function useDesignContent<TFallback extends Record<string, object>>(
  fallback: TFallback,
  options?: UseDesignContentOptions,
): UseDesignContentResult<TFallback> {
  const apiEnv =
    import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? "";
  const rawBase = options?.apiBaseUrl ?? apiEnv;
  const normalizedBase =
    typeof rawBase === "string" && rawBase.length > 0
      ? rawBase.replace(/\/$/, "")
      : "";
  const apiBaseUrl = normalizedBase || null;
  const autoLoad = options?.autoLoad ?? true;

  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    apiBaseUrl ? "loading" : "ready",
  );
  const [error, setError] = useState<string>();
  const [remoteBlocks, setRemoteBlocks] = useState<
    Record<string, RemoteDesignBlock>
  >({});

  const inflightRef = useRef<Promise<void> | null>(null);

  const fetchBlocks = useCallback(async () => {
    if (!apiBaseUrl) {
      setStatus("ready");
      setError(undefined);
      setRemoteBlocks({});
      return;
    }

    const request = (async () => {
      setStatus("loading");
      setError(undefined);
      try {
        const response = await fetch(`${apiBaseUrl}/design/blocks`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const payload: RemoteDesignBlock[] = await response.json();
        const nextMap = payload.reduce<Record<string, RemoteDesignBlock>>(
          (acc, block) => {
            acc[block.blockKey] = block;
            return acc;
          },
          {},
        );
        setRemoteBlocks(nextMap);
        setStatus("ready");
      } catch (err) {
        console.error("Design content fetch failed", err);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
    })();

    inflightRef.current = request;
    await request;
    inflightRef.current = null;
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!autoLoad) {
      setStatus((prev) => (prev === "idle" ? "ready" : prev));
      return;
    }
    fetchBlocks();
  }, [autoLoad, fetchBlocks]);

  const mergedBlocks = useMemo(() => {
    return (Object.keys(fallback) as Array<keyof TFallback>).reduce(
      (acc, key) => {
        const fallbackContent = fallback[key];
        const blockKey = String(key);
        const remoteContent = remoteBlocks[blockKey];
        const isPublished =
          remoteContent?.publishStatus?.isPublished ?? true;
        const shouldUseRemote = !!remoteContent && isPublished;
        const mergedContent = {
          ...fallbackContent,
          ...(shouldUseRemote ? (remoteContent.content ?? {}) : {}),
        } as TFallback[typeof key];

        acc[key] = {
          ...mergedContent,
          __meta: {
            blockKey,
            isPublished,
            source: shouldUseRemote ? "remote" : "fallback",
            updatedAt: remoteContent?.updatedAt,
            version: remoteContent?.publishStatus?.version,
          },
        };
        return acc;
      },
      {} as {
        [K in keyof TFallback]: TFallback[K] & { __meta: BlockMeta };
      },
    );
  }, [fallback, remoteBlocks]);

  const refresh = useCallback(async () => {
    if (inflightRef.current) {
      await inflightRef.current;
      return;
    }
    await fetchBlocks();
  }, [fetchBlocks]);

  return {
    blocks: mergedBlocks,
    status,
    isLoading: status === "loading",
    error,
    apiBaseUrl,
    refresh,
  };
}
