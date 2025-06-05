import React, { createContext, useEffect, useState } from "react";
import type { Shop, ShopType } from "../../../shared/types";
import { useStoreDataQuery } from "../hooks/useStoreDataQuery";
import { demoforgeStorage } from "../utils/storage";

export interface AdminContextValue {
  // État de l'univers/shopType DIRECT (plus besoin UniverseContext)
  selectedShopType: ShopType;
  setSelectedShopType: (shopType: ShopType) => void;
  // État de la boutique (logique métier préservée)
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  // Boutiques disponibles pour le shopType sélectionné
  availableShops: Shop[];
  // État global
  loading: boolean;
  error: string | null;
}

export const AdminContext = createContext<AdminContextValue | undefined>(
  undefined
);

interface AdminProviderProps {
  children: React.ReactNode;
  defaultShopType?: ShopType;
}

// ============================================
// COMPOSANT PROVIDER SIMPLIFIÉ
// ============================================

export const AdminProvider: React.FC<AdminProviderProps> = ({
  children,
  defaultShopType = "brewery",
}) => {
  // État local DIRECT - plus de délégation complexe
  const [selectedShopType, setSelectedShopTypeState] =
    useState<ShopType>(defaultShopType);
  const [selectedShop, setSelectedShopState] = useState<Shop | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { shops, loading, refetch } = useStoreDataQuery();

  // Filtrer les boutiques selon le shopType DIRECT
  const availableShops = shops.filter(
    (shop) => shop.shopType === selectedShopType
  );

  // 🚀 Utilisation du nouveau système de storage
  // Wrapper setShopType avec persistence
  const setSelectedShopType = (newShopType: ShopType) => {
    setSelectedShopTypeState(newShopType);
    demoforgeStorage.admin.setShopType(newShopType);
  };

  // Setter avec persistence pour la boutique + refresh des données
  const setSelectedShop = async (shop: Shop | null) => {
    setSelectedShopState(shop);
    if (shop) {
      demoforgeStorage.admin.setSelectedShop(selectedShopType, shop.id);
      // Refresh des données pour la nouvelle boutique
      await refetch();
    } else {
      demoforgeStorage.admin.clearShop(selectedShopType);
    }
    setError(null);
  };

  // Restauration persistence admin au démarrage
  useEffect(() => {
    const storedShopType = demoforgeStorage.admin.getShopType() as ShopType;

    if (storedShopType && storedShopType !== selectedShopType) {
      setSelectedShopTypeState(storedShopType);
    }
  }, [selectedShopType]);

  // Effet pour restaurer la boutique depuis storage
  useEffect(() => {
    if (!loading && availableShops.length > 0) {
      const storedShopId =
        demoforgeStorage.admin.getSelectedShop(selectedShopType);

      if (storedShopId) {
        const storedShop = availableShops.find(
          (shop) => shop.id === storedShopId
        );
        if (storedShop) {
          setSelectedShopState(storedShop);
          return;
        }
      }

      // Fallback: première boutique disponible
      setSelectedShopState(availableShops[0]);
      demoforgeStorage.admin.setSelectedShop(
        selectedShopType,
        availableShops[0].id
      );
    }
  }, [availableShops, loading, selectedShopType]);

  // Réinitialiser la boutique quand le shopType change
  useEffect(() => {
    setSelectedShopState(null);
    setError(null);
  }, [selectedShopType]);

  const value: AdminContextValue = {
    // shopType DIRECT (plus simple)
    selectedShopType,
    setSelectedShopType,
    // Gestion boutiques (logique préservée)
    selectedShop,
    setSelectedShop,
    availableShops,
    // État global
    loading,
    error,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
