import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useDesignContent } from "../hooks/useDesignContent";
import type { UseDesignContentResult } from "../hooks/useDesignContent";
import { designFallback } from "../content/designFallback";
import type { DesignFallback } from "../content/designFallback";

type ProviderValue = UseDesignContentResult<DesignFallback>;

const DesignContentContext = createContext<ProviderValue | null>(null);

export function DesignContentProvider({ children }: { children: ReactNode }) {
  const value = useDesignContent(designFallback);
  return (
    <DesignContentContext.Provider value={value}>
      {children}
    </DesignContentContext.Provider>
  );
}

export function useDesignBlocks() {
  const context = useContext(DesignContentContext);
  if (!context) {
    throw new Error(
      "useDesignBlocks debe usarse dentro de DesignContentProvider",
    );
  }
  return context;
}
