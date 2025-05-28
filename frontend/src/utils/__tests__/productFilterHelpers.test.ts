import type { Category, Product } from "../../../../shared/types";
import type { ProductFilters } from "../../services/adminProductService";
import {
  filterByBusinessAttributes,
  filterByCategory,
  filterByPrice,
  filterBySearch,
  filterByStock,
  filterProductsLocally,
  hasAdvancedFilters,
} from "../productFilterHelpers";

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
    name: "Bière IPA",
    description: "Une excellente bière houblonnée",
    price: 4.5,
    shopId: "shop1",
    categoryId: "cat1",
    category: mockCategory1,
    attributes: JSON.stringify({
      degre_alcool: 6.5,
      amertume_ibu: 45,
      type_houblon: "Cascade",
      stock: 25,
    }),
  },
  {
    id: "prod2",
    name: "Bière Blonde",
    description: "Bière légère et rafraîchissante",
    price: 3.8,
    shopId: "shop1",
    categoryId: "cat1",
    category: mockCategory1,
    attributes: JSON.stringify({
      degre_alcool: 4.2,
      amertume_ibu: 20,
      type_houblon: "Saaz",
      stock: 5,
    }),
  },
  {
    id: "prod3",
    name: "Verre à bière",
    description: "Verre spécialisé pour la dégustation",
    price: 12.0,
    shopId: "shop1",
    categoryId: "cat2",
    category: mockCategory2,
    attributes: JSON.stringify({
      stock: 0,
    }),
  },
];

describe("productFilterHelpers", () => {
  describe("filterByCategory", () => {
    it("devrait filtrer par catégorie", () => {
      const result = filterByCategory(mockProducts, "cat1");
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.categoryId === "cat1")).toBe(true);
    });

    it("devrait retourner tous les produits si categoryId est null", () => {
      const result = filterByCategory(mockProducts, null);
      expect(result).toEqual(mockProducts);
    });
  });

  describe("filterBySearch", () => {
    it("devrait filtrer par nom", () => {
      const result = filterBySearch(mockProducts, "IPA");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait filtrer par description", () => {
      const result = filterBySearch(mockProducts, "houblonnée");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait filtrer par attributs", () => {
      const result = filterBySearch(mockProducts, "Cascade");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait être insensible à la casse", () => {
      const result = filterBySearch(mockProducts, "ipa");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait retourner tous les produits si searchTerm est vide", () => {
      const result = filterBySearch(mockProducts, "");
      expect(result).toEqual(mockProducts);
    });
  });

  describe("filterByPrice", () => {
    it("devrait filtrer par prix minimum", () => {
      const result = filterByPrice(mockProducts, 4.0);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.price >= 4.0)).toBe(true);
    });

    it("devrait filtrer par prix maximum", () => {
      const result = filterByPrice(mockProducts, undefined, 5.0);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.price <= 5.0)).toBe(true);
    });

    it("devrait filtrer par plage de prix", () => {
      const result = filterByPrice(mockProducts, 4.0, 5.0);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait retourner tous les produits si aucun prix n'est spécifié", () => {
      const result = filterByPrice(mockProducts);
      expect(result).toEqual(mockProducts);
    });
  });

  describe("filterByStock", () => {
    it("devrait filtrer les produits en stock", () => {
      const result = filterByStock(mockProducts, "in_stock");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait filtrer les produits en stock faible", () => {
      const result = filterByStock(mockProducts, "low_stock");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière Blonde");
    });

    it("devrait filtrer les produits en rupture", () => {
      const result = filterByStock(mockProducts, "out_of_stock");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Verre à bière");
    });

    it("devrait retourner tous les produits si aucun statut n'est spécifié", () => {
      const result = filterByStock(mockProducts);
      expect(result).toEqual(mockProducts);
    });

    it("devrait gérer les produits sans attributs", () => {
      const productWithoutAttributes: Product = {
        id: "prod4",
        name: "Produit sans attributs",
        price: 10.0,
        shopId: "shop1",
        categoryId: "cat1",
      };

      const result = filterByStock([productWithoutAttributes], "out_of_stock");
      expect(result).toHaveLength(1);
    });
  });

  describe("filterByBusinessAttributes", () => {
    it("devrait filtrer par degré d'alcool minimum", () => {
      const filters: ProductFilters = { degre_alcool_min: 5.0 };
      const result = filterByBusinessAttributes(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait filtrer par degré d'alcool maximum", () => {
      const filters: ProductFilters = { degre_alcool_max: 5.0 };
      const result = filterByBusinessAttributes(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière Blonde");
    });

    it("devrait filtrer par type de houblon", () => {
      const filters: ProductFilters = { type_houblon: "Cascade" };
      const result = filterByBusinessAttributes(mockProducts, filters);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait retourner tous les produits si aucun filtre métier", () => {
      const filters: ProductFilters = { minPrice: 3.0 };
      const result = filterByBusinessAttributes(mockProducts, filters);
      expect(result).toEqual(mockProducts);
    });

    it("devrait gérer les produits sans attributs", () => {
      const productWithoutAttributes: Product = {
        id: "prod4",
        name: "Produit sans attributs",
        price: 10.0,
        shopId: "shop1",
        categoryId: "cat1",
      };

      const filters: ProductFilters = { degre_alcool_min: 5.0 };
      const result = filterByBusinessAttributes(
        [productWithoutAttributes],
        filters
      );
      expect(result).toHaveLength(0);
    });
  });

  describe("filterProductsLocally", () => {
    it("devrait combiner tous les filtres", () => {
      const filters: ProductFilters = {
        minPrice: 4.0,
        maxPrice: 5.0,
        degre_alcool_min: 6.0,
        stockStatus: "in_stock",
      };

      const result = filterProductsLocally(
        mockProducts,
        "cat1",
        "IPA",
        filters
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière IPA");
    });

    it("devrait fonctionner sans filtres", () => {
      const result = filterProductsLocally(mockProducts, null, "");
      expect(result).toEqual(mockProducts);
    });

    it("devrait appliquer les filtres dans l'ordre correct", () => {
      // Test que les filtres s'appliquent de manière cumulative
      const result = filterProductsLocally(
        mockProducts,
        "cat1", // Filtre par catégorie d'abord
        "Blonde" // Puis par recherche
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bière Blonde");
    });
  });

  describe("hasAdvancedFilters", () => {
    it("devrait détecter les filtres avancés", () => {
      const filters: ProductFilters = { degre_alcool_min: 5.0 };
      expect(hasAdvancedFilters(filters)).toBe(true);
    });

    it("devrait ignorer les filtres de base", () => {
      const filters: ProductFilters = {
        minPrice: 3.0,
        maxPrice: 10.0,
        stockStatus: "in_stock",
      };
      expect(hasAdvancedFilters(filters)).toBe(false);
    });

    it("devrait retourner false pour un objet vide", () => {
      expect(hasAdvancedFilters({})).toBe(false);
    });

    it("devrait détecter les filtres métier spécialisés", () => {
      const filters: ProductFilters = { type_houblon: "Cascade" };
      expect(hasAdvancedFilters(filters)).toBe(true);
    });
  });
});
