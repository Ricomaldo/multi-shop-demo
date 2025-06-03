import { useContext } from "react";
import type { AdminContextValue } from "../contexts/AdminContext";
import { AdminContext } from "../contexts/AdminContext";

// Hook principal AdminContext
export const useAdminContext = (): AdminContextValue => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};

// Hook spécialisé pour la gestion des boutiques
export const useAdminShop = () => {
  const {
    selectedUniverse,
    setSelectedUniverse,
    selectedShop,
    setSelectedShop,
    availableShops,
    loading,
    error,
  } = useAdminContext();

  return {
    universe: selectedUniverse,
    setUniverse: setSelectedUniverse,
    shop: selectedShop,
    setShop: setSelectedShop,
    availableShops,
    loading,
    error,
    hasShop: selectedShop !== null,
  };
};
