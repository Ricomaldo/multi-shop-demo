import axios from "axios";
import type { Product, Shop } from "../../../../shared/types";
import { loadProducts, loadShops } from "../shopService";

// Mock d'axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("shopService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadShops", () => {
    it("charge les boutiques avec succès", async () => {
      const mockShops: Shop[] = [
        {
          id: "shop-1",
          name: "Houblon & Tradition",
          shopType: "brewery",
          categories: [],
        },
        {
          id: "shop-2",
          name: "Les Jardins de Darjeeling",
          shopType: "tea-shop",
          categories: [],
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockShops });

      const result = await loadShops();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/api/shops"
      );
      expect(result).toEqual(mockShops);
    });

    it("gère les erreurs lors du chargement des boutiques", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(loadShops()).rejects.toThrow(
        "Impossible de charger les boutiques"
      );
    });
  });

  describe("loadProducts", () => {
    it("charge les produits pour plusieurs boutiques", async () => {
      const shopIds = ["shop-1", "shop-2"];
      const mockProducts1: Product[] = [
        {
          id: "prod-1",
          name: "Blonde Artisanale",
          price: 4.5,
          shopId: "shop-1",
          categoryId: "cat-1",
        },
      ];
      const mockProducts2: Product[] = [
        {
          id: "prod-2",
          name: "Thé Earl Grey",
          price: 12.0,
          shopId: "shop-2",
          categoryId: "cat-2",
        },
      ];

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts1 })
        .mockResolvedValueOnce({ data: mockProducts2 });

      const result = await loadProducts(shopIds);

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/api/shops/shop-1/products"
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/api/shops/shop-2/products"
      );
      expect(result).toEqual([...mockProducts1, ...mockProducts2]);
    });

    it("déduplique les produits avec le même ID", async () => {
      const shopIds = ["shop-1", "shop-2"];
      const duplicateProduct: Product = {
        id: "prod-1",
        name: "Produit Dupliqué",
        price: 10.0,
        shopId: "shop-1",
        categoryId: "cat-1",
      };

      mockedAxios.get
        .mockResolvedValueOnce({ data: [duplicateProduct] })
        .mockResolvedValueOnce({ data: [duplicateProduct] });

      const result = await loadProducts(shopIds);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(duplicateProduct);
    });

    it("gère les erreurs lors du chargement des produits", async () => {
      const shopIds = ["shop-1"];
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(loadProducts(shopIds)).rejects.toThrow(
        "Impossible de charger les produits"
      );
    });

    it("gère une liste vide de boutiques", async () => {
      const result = await loadProducts([]);

      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("fusionne correctement les produits de plusieurs boutiques", async () => {
      const shopIds = ["shop-1", "shop-2", "shop-3"];
      const mockProducts1: Product[] = [
        {
          id: "prod-1",
          name: "Produit 1",
          price: 5.0,
          shopId: "shop-1",
          categoryId: "cat-1",
        },
      ];
      const mockProducts2: Product[] = [
        {
          id: "prod-2",
          name: "Produit 2",
          price: 8.0,
          shopId: "shop-2",
          categoryId: "cat-2",
        },
        {
          id: "prod-3",
          name: "Produit 3",
          price: 12.0,
          shopId: "shop-2",
          categoryId: "cat-2",
        },
      ];
      const mockProducts3: Product[] = [
        {
          id: "prod-4",
          name: "Produit 4",
          price: 15.0,
          shopId: "shop-3",
          categoryId: "cat-3",
        },
      ];

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts1 })
        .mockResolvedValueOnce({ data: mockProducts2 })
        .mockResolvedValueOnce({ data: mockProducts3 });

      const result = await loadProducts(shopIds);

      expect(result).toHaveLength(4);
      expect(result).toEqual([
        ...mockProducts1,
        ...mockProducts2,
        ...mockProducts3,
      ]);
    });
  });
});
