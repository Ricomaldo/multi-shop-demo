import { useContext } from "react";
import type { UniverseContextType } from "../contexts/UniverseContext";
import { UniverseContext } from "../contexts/UniverseContext";

export const useUniverse = (): UniverseContextType => {
  const context = useContext(UniverseContext);
  if (!context) {
    throw new Error("useUniverse must be used within UniverseProvider");
  }
  return context;
};
