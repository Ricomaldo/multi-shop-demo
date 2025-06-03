import React, { createContext, useEffect, useState } from "react";
import type { Shop } from "../../../shared/types";
import { useShopData } from "../hooks/useShopData";
import { shopTypeToUniverse } from "../utils/universeMapping";
import type { UniverseType } from "./UniverseContext";

export interface AdminContextValue {
  // État de l'univers
  selectedUniverse: UniverseType;
  setSelectedUniverse: (universe: UniverseType) => void;
  // État de la boutique
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  // Boutiques disponibles pour l'univers sélectionné
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
}

// ============================================
// COMPOSANT PROVIDER
// ============================================

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  // État local
  const [selectedUniverse, setSelectedUniverse] =
    useState<UniverseType>("brewery");
  const [selectedShop, setSelectedShopState] = useState<Shop | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { shops, loading } = useShopData();

  // Filtrer les boutiques selon l'univers sélectionné
  const availableShops = shops.filter(
    (shop) => shopTypeToUniverse(shop.shopType) === selectedUniverse
  );

  // Gestion persistence localStorage
  const UNIVERSE_STORAGE_KEY = "demoforge_admin_universe";
  const SHOP_STORAGE_KEY = `demoforge_admin_shop_${selectedUniverse}`;

  // Setter avec persistence pour la boutique
  const setSelectedShop = (shop: Shop | null) => {
    setSelectedShopState(shop);
    if (shop) {
      localStorage.setItem(SHOP_STORAGE_KEY, shop.id);
    } else {
      localStorage.removeItem(SHOP_STORAGE_KEY);
    }
    setError(null);
  };

  // Effet pour restaurer l'univers depuis localStorage
  useEffect(() => {
    const storedUniverse = localStorage.getItem(
      UNIVERSE_STORAGE_KEY
    ) as UniverseType;
    if (storedUniverse) {
      setSelectedUniverse(storedUniverse);
    }
  }, []);

  // Effet pour sauvegarder l'univers dans localStorage
  useEffect(() => {
    localStorage.setItem(UNIVERSE_STORAGE_KEY, selectedUniverse);
  }, [selectedUniverse]);

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

  // Réinitialiser la boutique quand l'univers change
  useEffect(() => {
    setSelectedShopState(null);
    setError(null);
  }, [selectedUniverse]);

  const value: AdminContextValue = {
    selectedUniverse,
    setSelectedUniverse,
    selectedShop,
    setSelectedShop,
    availableShops,
    loading,
    error,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
