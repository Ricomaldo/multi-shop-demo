import React, { createContext } from "react";
import { useStorePage } from "../hooks/useStorePage";

// Types ultra-simples pour éviter les erreurs rouges
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SimpleStoreContext = createContext<any>(undefined);

// 🔧 SEUL LE PROVIDER - pas de hook ici
export function SimpleStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔍 DEBUG : Vérifier que c'est appelé UNE seule fois
  console.log("🔍 SimpleStoreProvider RENDER - useStorePage appelé");

  // Une seule fois dans toute l'app !
  const storeData = useStorePage({
    redirectOnShopChange: true,
  });

  return (
    <SimpleStoreContext.Provider value={storeData}>
      {children}
    </SimpleStoreContext.Provider>
  );
}
