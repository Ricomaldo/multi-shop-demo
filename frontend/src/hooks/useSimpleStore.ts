import { useContext } from "react";
import { SimpleStoreContext } from "../contexts/SimpleStoreContext";

// 🔧 Hook séparé pour éviter les erreurs Fast Refresh
export function useSimpleStore() {
  const context = useContext(SimpleStoreContext);
  if (!context) {
    throw new Error("useSimpleStore must be used within SimpleStoreProvider");
  }
  return context;
}
