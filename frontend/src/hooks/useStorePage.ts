import type { Shop, ShopType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreDataQuery } from "./useStoreDataQuery";

interface UseStorePageOptions {
  redirectOnShopChange?: boolean;
  productId?: string;
}

export function useStorePage(options: UseStorePageOptions = {}) {
  const { shopType } = useParams<{ shopType: string }>();
  const navigate = useNavigate();
  const { shops, products, loading, refetch } = useStoreDataQuery();

  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [availableShops, setAvailableShops] = useState<Shop[]>([]);
  const [isChanging, setIsChanging] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Configuration boutique au chargement
  useEffect(() => {
    if (loading || !shopType) return;

    const shopsOfType = shops.filter(
      (shop) => shop.shopType === (shopType as ShopType)
    );
    setAvailableShops(shopsOfType);

    if (shopsOfType.length > 0) {
      setCurrentShop(shopsOfType[0]);
      setIsInitialized(true);
    } else {
      navigate("/404");
    }
  }, [shops, shopType, loading, navigate]);

  // Handler de changement avec transition anti-FOUC
  const handleShopChange = useCallback(
    async (newShop: Shop) => {
      setIsChanging(true);

      // Transition visible pour éviter le flash
      await new Promise((resolve) => setTimeout(resolve, 150));

      setCurrentShop(newShop);

      // Navigation si demandée
      if (options.redirectOnShopChange) {
        const currentPath = window.location.pathname.split("/").pop();
        navigate(`/store/${newShop.shopType}/${currentPath}`, {
          replace: true,
        });
      }

      // Refresh des données
      await refetch();
      setIsChanging(false);
    },
    [refetch, navigate, options.redirectOnShopChange]
  );

  // Produits de la boutique courante
  const shopProducts = currentShop
    ? products.filter((p) => p.shopId === currentShop.id)
    : [];

  return {
    // État de la boutique
    currentShop,
    availableShops,
    shopProducts,

    // États de loading
    loading,
    isChanging,
    isInitialized,
    isReady: isInitialized && !loading && currentShop,

    // Handlers
    handleShopChange,
  };
}
