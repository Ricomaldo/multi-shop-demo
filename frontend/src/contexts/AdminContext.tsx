import React, { createContext, useEffect, useState } from "react";
import type { Shop, ShopType } from "../../../shared/types";
import { useShopData } from "../hooks/useShopData";

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
  const { shops, loading, refreshData } = useShopData();

  // Filtrer les boutiques selon le shopType DIRECT
  const availableShops = shops.filter(
    (shop) => shop.shopType === selectedShopType
  );

  // Persistence admin avec clés spécifiques (logique préservée)
  const SHOPTYPE_STORAGE_KEY = "demoforge_admin_shoptype";
  const SHOP_STORAGE_KEY = `demoforge_admin_shop_${selectedShopType}`;

  // Wrapper setShopType avec persistence
  const setSelectedShopType = (newShopType: ShopType) => {
    setSelectedShopTypeState(newShopType);
    localStorage.setItem(SHOPTYPE_STORAGE_KEY, newShopType);
  };

  // Setter avec persistence pour la boutique + refresh des données
  const setSelectedShop = async (shop: Shop | null) => {
    setSelectedShopState(shop);
    if (shop) {
      localStorage.setItem(SHOP_STORAGE_KEY, shop.id);
      // Refresh des données pour la nouvelle boutique
      await refreshData();
    } else {
      localStorage.removeItem(SHOP_STORAGE_KEY);
    }
    setError(null);
  };

  // Restauration persistence admin au démarrage
  useEffect(() => {
    const storedShopType = localStorage.getItem(
      SHOPTYPE_STORAGE_KEY
    ) as ShopType;

    if (storedShopType && storedShopType !== selectedShopType) {
      setSelectedShopTypeState(storedShopType);
    }
  }, [selectedShopType]);

  // Effet pour restaurer la boutique depuis localStorage
  useEffect(() => {
    if (!loading && availableShops.length > 0) {
      const storedShopId = localStorage.getItem(SHOP_STORAGE_KEY);

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
      localStorage.setItem(SHOP_STORAGE_KEY, availableShops[0].id);
    }
  }, [availableShops, loading, SHOP_STORAGE_KEY]);

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
