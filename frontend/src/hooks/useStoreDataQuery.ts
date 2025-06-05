import type { Category, Product, Shop } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUniverseTokens } from "../theme/universeTokens";
import { demoforgeStorage } from "../utils/storage";

interface StoreDataResponse {
  shops: Shop[];
  products: Product[];
  categories: Category[];
  meta: {
    shopsCount: number;
    productsCount: number;
    categoriesCount: number;
    timestamp: string;
  };
}

interface UseStoreDataReturn {
  shops: Shop[];
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  getProductsByShop: (shopId: string) => Product[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Fonction fetch réutilisable
const fetchStoreData = async (): Promise<StoreDataResponse> => {
  console.log("🚀 React Query - Fetch /api/store/data");

  const response = await fetch(`${API_BASE_URL}/store/data`);
  if (!response.ok) {
    throw new Error(`Erreur store/data: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ React Query - Données reçues:", data.meta);

  return data;
};

export const useStoreDataQuery = (): UseStoreDataReturn => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["store-data"],
    queryFn: fetchStoreData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Nettoyer les caches expirés au démarrage (sans sauvegarde pour l'instant)
  React.useEffect(() => {
    demoforgeStorage.cache.clear();
  }, []);

  // Traitement des données avec mémorisation
  const processedData = React.useMemo(() => {
    if (!data) {
      return { shops: [] as Shop[], products: [] as Product[] };
    }

    // Enrichissement des shops avec tokens d'univers
    const enrichedShops = data.shops.map((shop: Shop) => ({
      ...shop,
      universeTokens: getUniverseTokens(shop.shopType),
    }));

    // Enrichissement des produits
    const enrichedProducts = data.products.map((product: Product) => {
      const shop = enrichedShops.find((s: Shop) => s.id === product.shopId);
      return {
        ...product,
        shop,
        universeTokens: shop?.universeTokens,
      };
    });

    return {
      shops: enrichedShops,
      products: enrichedProducts,
    };
  }, [data]);

  // Log de debug détaillé
  console.log(
    `🎯 useStoreDataQuery - ${processedData.shops.length} shops, ${
      processedData.products.length
    } products (cached: ${!loading})`
  );

  return {
    shops: processedData.shops,
    products: processedData.products,
    loading: loading,
    error: error as Error | null,
    refetch,
    getProductsByShop: (shopId: string) =>
      processedData.products.filter((p) => p.shopId === shopId),
  };
};
