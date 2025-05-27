import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Shop } from "../../../shared/types";
import { useShopData } from "../hooks";

interface AdminShopContextType {
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  shops: Shop[];
  loading: boolean;
  error: string | null;
}

const AdminShopContext = createContext<AdminShopContextType | undefined>(
  undefined
);

interface AdminShopProviderProps {
  children: ReactNode;
}

export const AdminShopProvider: React.FC<AdminShopProviderProps> = ({
  children,
}) => {
  const { shops, loading, error } = useShopData();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Sélectionner automatiquement la première boutique au chargement
  useEffect(() => {
    if (shops.length > 0 && !selectedShop) {
      setSelectedShop(shops[0]);
    }
  }, [shops, selectedShop]);

  const value: AdminShopContextType = {
    selectedShop,
    setSelectedShop,
    shops,
    loading,
    error,
  };

  return (
    <AdminShopContext.Provider value={value}>
      {children}
    </AdminShopContext.Provider>
  );
};

export const useAdminShop = (): AdminShopContextType => {
  const context = useContext(AdminShopContext);
  if (context === undefined) {
    throw new Error("useAdminShop must be used within an AdminShopProvider");
  }
  return context;
};
