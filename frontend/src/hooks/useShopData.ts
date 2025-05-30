import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, Shop } from "../../../shared/types";
import { loadProducts, loadShops } from "../services/shopService";
import { hasLowStock, isOutOfStock } from "../utils/productAttributes";

interface UseShopDataReturn {
  shops: Shop[];
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getProductsByShop: (shopId: string) => Product[];
  getShopByType: (shopType: string) => Shop | undefined;
  stockData: Record<
    string,
    {
      total: number;
      lowStock: number;
      outOfStock: number;
    }
  >;
}

/**
 * Hook personnalisé pour gérer les données des boutiques et produits
 * Centralise la logique de récupération et de gestion des données
 */
export const useShopData = (): UseShopDataReturn => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const shopsData = await loadShops();
      setShops(shopsData);

      const shopIds = shopsData.map((shop: Shop) => shop.id);
      const productsData = await loadProducts(shopIds);

      // FIX: Déduplication explicite des produits
      const uniqueProducts = productsData.filter(
        (product: Product, index: number, array: Product[]) =>
          array.findIndex((p: Product) => p.id === product.id) === index
      );

      setProducts(uniqueProducts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      console.error("Erreur useShopData:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductsByShop = useCallback(
    (shopId: string): Product[] => {
      return products.filter((product: Product) => product.shopId === shopId);
    },
    [products]
  );

  const getShopByType = useCallback(
    (shopType: string): Shop | undefined => {
      return shops.find((shop: Shop) => shop.shopType === shopType);
    },
    [shops]
  );

  // Calcul des données de stock par boutique
  const stockData = useMemo(() => {
    const data: Record<
      string,
      { total: number; lowStock: number; outOfStock: number }
    > = {};

    shops.forEach((shop) => {
      const shopProducts = getProductsByShop(shop.id);
      data[shop.id] = {
        total: shopProducts.length,
        lowStock: shopProducts.filter(hasLowStock).length,
        outOfStock: shopProducts.filter(isOutOfStock).length,
      };
    });

    return data;
  }, [shops, getProductsByShop]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    shops,
    products,
    loading,
    error,
    refreshData,
    getProductsByShop,
    getShopByType,
    stockData,
  };
};
