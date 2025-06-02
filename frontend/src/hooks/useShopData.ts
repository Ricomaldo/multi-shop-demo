import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, Shop, ShopType } from "../../../shared/types";
import { getUniverseColorScheme, shopTypeToUniverse } from "../utils/universeMapping";

interface UseShopDataReturn {
  shops: Shop[];
  products: Product[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
  getProductsByShop: (shopId: string) => Product[];
  getShopByType: (shopType: ShopType) => Shop | undefined;
  stockData: Record<
    string,
    { total: number; lowStock: number; outOfStock: number }
  >;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const useShopData = (): UseShopDataReturn => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);


      // 1. Charger toutes les boutiques
      const shopsResponse = await fetch(`${API_BASE_URL}/shops`);
      if (!shopsResponse.ok) {
        throw new Error(`Erreur shops: ${shopsResponse.status}`);
      }
      const rawShopsData: Omit<Shop, 'themeColor'>[] = await shopsResponse.json();

      // Enrichir avec themeColor
      const shopsData: Shop[] = rawShopsData.map(shop => ({
        ...shop,
        themeColor: getUniverseColorScheme(shopTypeToUniverse(shop.shopType))
      }));

      // 2. Charger tous les produits de toutes les boutiques
      const allProducts: Product[] = [];

      for (const shop of shopsData) {
        try {
          const productsResponse = await fetch(`${API_BASE_URL}/shops/${shop.id}/products`);

          if (!productsResponse.ok) {
            console.warn(`⚠️ Erreur produits boutique ${shop.name}:`, productsResponse.status);
            continue;
          }

          const shopProducts: Product[] = await productsResponse.json();

          // Enrichir les produits avec statut stock calculé
          const enrichedProducts = shopProducts.map(product => ({
            ...product,
            stockStatus: calculateStockStatus(product),
            // La catégorie vient de l'API comme objet Category, on extrait le nom
            category: typeof product.category === 'object' && product.category && 'name' in product.category
              ? (product.category as { name: string }).name
              : (product.category as string) || 'Non classé'
          }));

          allProducts.push(...enrichedProducts);
        } catch (productError) {
          console.warn(`❌ Erreur chargement produits ${shop.name}:`, productError);
        }
      }


      setShops(shopsData);
      setProducts(allProducts);
    } catch (err) {
      console.error("❌ Erreur useShopData:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductsByShop = useCallback(
    (shopId: string): Product[] => {
      return products.filter((product) => product.shopId === shopId);
    },
    [products]
  );

  const getShopByType = useCallback(
    (shopType: ShopType): Shop | undefined => {
      return shops.find((shop) => shop.shopType === shopType);
    },
    [shops]
  );

  const stockData = useMemo(() => {
    const data: Record<
      string,
      { total: number; lowStock: number; outOfStock: number }
    > = {};

    shops.forEach((shop) => {
      const shopProducts = getProductsByShop(shop.id);
      data[shop.id] = {
        total: shopProducts.length,
        lowStock: shopProducts.filter((p) => p.stockStatus === "low_stock").length,
        outOfStock: shopProducts.filter((p) => p.stockStatus === "out_of_stock").length,
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

// Helper function pour calculer le statut de stock
function calculateStockStatus(product: Product): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (!product.attributes) return 'in_stock';

  try {
    const attributes = typeof product.attributes === 'string'
      ? JSON.parse(product.attributes)
      : product.attributes;

    const stock = Number(attributes.stock) || 0;

    if (stock === 0) return 'out_of_stock';
    if (stock <= 10) return 'low_stock';
    return 'in_stock';
  } catch {
    return 'in_stock';
  }
}
