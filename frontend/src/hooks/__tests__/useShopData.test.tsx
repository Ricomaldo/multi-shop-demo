import { act, renderHook, waitFor } from "@testing-library/react";
import type { Shop } from "../../../../shared/types";
import * as shopService from "../../services/shopService";
import { useShopData } from "../useShopData";

jest.mock("../../services/shopService");
const mockedShopService = shopService as jest.Mocked<typeof shopService>;

const mockShops: Shop[] = [
  {
    id: "shop-1",
    name: "Houblon & Tradition",
    shopType: "brewery" as const,
    categories: [
      { id: "cat-1", name: "Blondes", shopId: "shop-1" },
      { id: "cat-2", name: "IPA", shopId: "shop-1" },
    ],
  },
  {
    id: "shop-2",
    name: "Les Jardins de Darjeeling",
    shopType: "teaShop" as const,
    categories: [{ id: "cat-3", name: "Thés Verts", shopId: "shop-2" }],
  },
];

const mockProducts = [
  {
    id: "prod-1",
    name: "Blonde de Garde",
    price: 4.5,
    shopId: "shop-1",
    categoryId: "cat-1",
  },
  {
    id: "prod-2",
    name: "IPA Américaine",
    price: 5.5,
    shopId: "shop-1",
    categoryId: "cat-2",
  },
  {
    id: "prod-3",
    name: "Sencha Premium",
    price: 12.5,
    shopId: "shop-2",
    categoryId: "cat-3",
  },
];

describe("useShopData Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("charge les données initiales correctement", async () => {
    mockedShopService.loadShops.mockResolvedValue(mockShops);
    mockedShopService.loadProducts.mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useShopData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.shops).toEqual(mockShops);
    expect(result.current.products).toHaveLength(3); // FIX: 3 produits uniques
    expect(result.current.error).toBe(null);
  });

  test("gère les erreurs de chargement des boutiques", async () => {
    mockedShopService.loadShops.mockRejectedValue(
      new Error("Impossible de charger les boutiques")
    );

    const { result } = renderHook(() => useShopData());

    await waitFor(() => {
      expect(result.current.error).toBe("Impossible de charger les boutiques");
      expect(result.current.shops).toEqual([]);
      expect(result.current.products).toEqual([]);
    });
  });

  test("gère les erreurs de chargement des produits", async () => {
    mockedShopService.loadShops.mockResolvedValue(mockShops);
    mockedShopService.loadProducts.mockRejectedValue(
      new Error("Impossible de charger les produits")
    );

    const { result } = renderHook(() => useShopData());

    await waitFor(() => {
      expect(result.current.error).toBe("Impossible de charger les produits");
    });
  });

  test("getProductsByShop retourne les bons produits", async () => {
    mockedShopService.loadShops.mockResolvedValue(mockShops);
    mockedShopService.loadProducts.mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useShopData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const shop1Products = result.current.getProductsByShop("shop-1");
    expect(shop1Products).toHaveLength(2);
    expect(shop1Products[0].name).toBe("Blonde de Garde");
    expect(shop1Products[1].name).toBe("IPA Américaine");
  });

  test("refreshData fonctionne correctement", async () => {
    mockedShopService.loadShops.mockResolvedValue(mockShops);
    mockedShopService.loadProducts.mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useShopData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshData();
    });

    expect(mockedShopService.loadShops).toHaveBeenCalledTimes(2);
    expect(mockedShopService.loadProducts).toHaveBeenCalledTimes(2);
  });
});
