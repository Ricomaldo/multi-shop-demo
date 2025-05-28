import type { Category, Product } from "../../../../shared/types";
import {
  categoryExistsInProducts,
  extractCategories,
  getProductCountByCategory,
} from "../categoryHelpers";

// Mock data
const mockCategory1: Category = {
  id: "cat1",
  name: "Bières",
  shopId: "shop1",
};

const mockCategory2: Category = {
  id: "cat2",
  name: "Accessoires",
  shopId: "shop1",
};

const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Produit 1",
    description: "Description 1",
    price: 10.99,
    shopId: "shop1",
    categoryId: "cat1",
    category: mockCategory1,
  },
  {
    id: "prod2",
    name: "Produit 2",
    description: "Description 2",
    price: 15.99,
    shopId: "shop1",
    categoryId: "cat1",
    category: mockCategory1,
  },
  {
    id: "prod3",
    name: "Produit 3",
    description: "Description 3",
    price: 20.99,
    shopId: "shop1",
    categoryId: "cat2",
    category: mockCategory2,
  },
];

describe("categoryHelpers", () => {
  describe("extractCategories", () => {
    it("devrait extraire les catégories uniques", () => {
      const result = extractCategories(mockProducts);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Accessoires"); // Trié alphabétiquement
      expect(result[1].name).toBe("Bières");
    });

    it("devrait retourner un tableau vide pour une liste vide", () => {
      const result = extractCategories([]);
      expect(result).toEqual([]);
    });

    it("devrait ignorer les produits sans catégorie", () => {
      const productsWithoutCategory: Product[] = [
        {
          id: "prod1",
          name: "Produit 1",
          price: 10.99,
          shopId: "shop1",
          categoryId: "cat1", // categoryId requis mais category undefined
        },
      ];

      const result = extractCategories(productsWithoutCategory);
      expect(result).toEqual([]);
    });

    it("devrait éviter les doublons de catégories", () => {
      const productsWithDuplicates = [
        mockProducts[0],
        mockProducts[1], // Même catégorie que prod1
      ];

      const result = extractCategories(productsWithDuplicates);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("cat1");
    });
  });

  describe("categoryExistsInProducts", () => {
    it("devrait retourner true si la catégorie existe", () => {
      const result = categoryExistsInProducts("cat1", mockProducts);
      expect(result).toBe(true);
    });

    it("devrait retourner false si la catégorie n'existe pas", () => {
      const result = categoryExistsInProducts("cat999", mockProducts);
      expect(result).toBe(false);
    });

    it("devrait retourner false pour une liste vide", () => {
      const result = categoryExistsInProducts("cat1", []);
      expect(result).toBe(false);
    });
  });

  describe("getProductCountByCategory", () => {
    it("devrait compter correctement les produits par catégorie", () => {
      const result = getProductCountByCategory(mockProducts);

      expect(result.get("cat1")).toBe(2);
      expect(result.get("cat2")).toBe(1);
    });

    it("devrait retourner une map vide pour une liste vide", () => {
      const result = getProductCountByCategory([]);
      expect(result.size).toBe(0);
    });

    it("devrait ignorer les produits sans categoryId", () => {
      // Pour ce test, on simule un produit avec categoryId vide
      const productsWithEmptyCategory: Product[] = [
        {
          id: "prod1",
          name: "Produit 1",
          price: 10.99,
          shopId: "shop1",
          categoryId: "", // categoryId vide
        },
      ];

      const result = getProductCountByCategory(productsWithEmptyCategory);
      expect(result.size).toBe(0);
    });
  });
});
