import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, Shop, ShopType } from "../../../shared/types";

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

// Mock data pour développement
const mockShops: Shop[] = [
  {
    id: "brewery-1",
    name: "Houblon & Tradition",
    shopType: "brewery",
    themeColor: "orange",
    description: "Brasserie artisanale",
    address: "12 rue de la Bière, Paris",
  },
  {
    id: "tea-1",
    name: "Les Jardins de Darjeeling",
    shopType: "teaShop",
    themeColor: "teal",
    description: "Salon de thé et boutique",
    address: "15 rue de la Paix, Paris",
  },
  {
    id: "beauty-1",
    name: "L'Écrin de Jade",
    shopType: "beautyShop",
    themeColor: "pink",
    description: "Institut de beauté",
    address: "18 avenue Montaigne, Paris",
  },
  {
    id: "herb-1",
    name: "L'Herbier Traditionnel",
    shopType: "herbShop",
    themeColor: "green",
    description: "Herboristerie traditionnelle",
    address: "23 rue des Plantes, Paris",
  },
];

const mockProducts: Product[] = [
  // Brewery products
  {
    id: "beer-1",
    name: "IPA Houblonnée",
    description: "Une IPA aux arômes intenses",
    price: 4.5,
    imageUrl: "/images/products/ipa.jpg",
    shopId: "brewery-1",
    category: "IPA",
    stockStatus: "in_stock",
    featured: true,
    attributes: { degre_alcool: 6.5, type_houblon: "Cascade" },
  },
  {
    id: "beer-2",
    name: "Blonde de Garde",
    description: "Blonde traditionnelle",
    price: 3.8,
    imageUrl: "/images/products/blonde.jpg",
    shopId: "brewery-1",
    category: "Blondes",
    stockStatus: "in_stock",
  },
  // Tea products
  {
    id: "tea-1",
    name: "Darjeeling First Flush",
    description: "Thé noir d'exception",
    price: 12.5,
    imageUrl: "/images/products/darjeeling.jpg",
    shopId: "tea-1",
    category: "Thés Noirs",
    stockStatus: "in_stock",
    featured: true,
    attributes: { origine_plantation: "Darjeeling", grade_qualite: "FTGFOP" },
  },
  {
    id: "tea-2",
    name: "Sencha Premium",
    description: "Thé vert japonais",
    price: 15.0,
    imageUrl: "/images/products/sencha.jpg",
    shopId: "tea-1",
    category: "Thés Verts",
    stockStatus: "in_stock",
  },
  // Beauty products
  {
    id: "beauty-1",
    name: "Crème Hydratante Bio",
    description: "Soin visage naturel",
    price: 28.0,
    imageUrl: "/images/products/creme.jpg",
    shopId: "beauty-1",
    category: "Visage",
    stockStatus: "in_stock",
    featured: true,
    attributes: { type_peau: "Tous types", certification_bio: true },
  },
  // Herb products
  {
    id: "herb-1",
    name: "Tisane Digestion",
    description: "Mélange de plantes digestives",
    price: 8.5,
    imageUrl: "/images/products/tisane.jpg",
    shopId: "herb-1",
    category: "Digestion",
    stockStatus: "in_stock",
    attributes: { usage_traditionnel: "digestion", forme_galenique: "Tisane" },
  },
];

export const useShopData = (): UseShopDataReturn => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Simuler appel API avec délai
      await new Promise((resolve) => setTimeout(resolve, 500));

      setShops(mockShops);
      setProducts(mockProducts);
    } catch (err) {
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
        lowStock: shopProducts.filter((p) => p.stockStatus === "low_stock")
          .length,
        outOfStock: shopProducts.filter((p) => p.stockStatus === "out_of_stock")
          .length,
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
