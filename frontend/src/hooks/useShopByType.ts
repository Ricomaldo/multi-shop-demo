import type { Product, Shop, ShopType } from "@/types";
import { useMemo } from "react";
import { useStoreDataQuery } from "./useStoreDataQuery";

interface UseShopByTypeReturn {
  shop: Shop | null;
  products: Product[];
  loading: boolean;
  error: Error | null;
}

export const useShopByType = (shopType: ShopType): UseShopByTypeReturn => {
  const { shops, loading, error, getProductsByShop } = useStoreDataQuery();

  const result = useMemo(() => {
    const shop = shops.find((s) => s.shopType === shopType) || null;
    const shopProducts = shop ? getProductsByShop(shop.id) : [];

    return {
      shop,
      products: shopProducts,
      loading,
      error,
    };
  }, [shops, shopType, getProductsByShop, loading, error]);

  return result;
};
