import React, { createContext, useContext, useState } from "react";
import type { Shop } from "../../../shared/types";
import type { UniverseType } from "./UniverseContext";

interface AdminDualSelectorContextType {
  // Étape 1: Univers
  selectedUniverse: UniverseType | null;
  setSelectedUniverse: (universe: UniverseType | null) => void;

  // Étape 2: Boutique
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;

  // Helpers
  clearSelection: () => void;
  isUniverseSelected: (universe: UniverseType) => boolean;
  isShopSelected: (shopId: string) => boolean;
}

const AdminDualSelectorContext = createContext<
  AdminDualSelectorContextType | undefined
>(undefined);

interface AdminDualSelectorProviderProps {
  children: React.ReactNode;
  defaultUniverse?: UniverseType | null;
  defaultShop?: Shop | null;
}

/**
 * Provider pour la gestion de la sélection en deux étapes
 * Étape 1: Sélection de l'univers métier
 * Étape 2: Sélection de la boutique dans cet univers
 */
export const AdminDualSelectorProvider: React.FC<
  AdminDualSelectorProviderProps
> = ({ children, defaultUniverse = null, defaultShop = null }) => {
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseType | null>(
    defaultUniverse
  );
  const [selectedShop, setSelectedShop] = useState<Shop | null>(defaultShop);

  const clearSelection = () => {
    setSelectedUniverse(null);
    setSelectedShop(null);
  };

  const isUniverseSelected = (universe: UniverseType): boolean => {
    return selectedUniverse === universe;
  };

  const isShopSelected = (shopId: string): boolean => {
    return selectedShop?.id === shopId;
  };

  // Synchroniser l'univers avec la boutique sélectionnée
  const handleSetSelectedShop = (shop: Shop | null) => {
    setSelectedShop(shop);
    if (shop && shop.shopType !== selectedUniverse) {
      setSelectedUniverse(shop.shopType as UniverseType);
    }
  };

  // Réinitialiser la boutique si on change d'univers
  const handleSetSelectedUniverse = (universe: UniverseType | null) => {
    setSelectedUniverse(universe);
    if (universe && selectedShop && selectedShop.shopType !== universe) {
      setSelectedShop(null);
    }
  };

  return (
    <AdminDualSelectorContext.Provider
      value={{
        selectedUniverse,
        setSelectedUniverse: handleSetSelectedUniverse,
        selectedShop,
        setSelectedShop: handleSetSelectedShop,
        clearSelection,
        isUniverseSelected,
        isShopSelected,
      }}
    >
      {children}
    </AdminDualSelectorContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de sélection en deux étapes
 */
export const useAdminDualSelector = (): AdminDualSelectorContextType => {
  const context = useContext(AdminDualSelectorContext);
  if (!context) {
    throw new Error(
      "useAdminDualSelector must be used within AdminDualSelectorProvider"
    );
  }
  return context;
};

export default AdminDualSelectorProvider;
