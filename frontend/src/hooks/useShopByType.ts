import { useMemo } from "react";
import type { Product, Shop, ShopType } from "../../../shared/types";
import { useShopData } from "./useShopData";

interface UseShopByTypeReturn {
  shop: Shop | null;
  products: Product[];
  loading: boolean;
  error: Error | null;
}

export const useShopByType = (shopType: ShopType): UseShopByTypeReturn => {
  const { shops, products, loading, error, getProductsByShop } = useShopData();

  const result = useMemo(() => {
    const shop = shops.find((s) => s.shopType === shopType) || null;
    const shopProducts = shop ? getProductsByShop(shop.id) : [];

    return {
      shop,
      products: shopProducts,
      loading,
      error,
    };
  }, [shops, products, loading, error, shopType, getProductsByShop]);

  return result;
};
