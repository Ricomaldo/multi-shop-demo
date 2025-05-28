import { act, renderHook } from "@testing-library/react";
import type { Category, Product } from "../../../../shared/types";
import type { ProductFilters } from "../../services/adminProductService";
import { useStoreProductFilters } from "../useStoreProductFilters";

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

describe("useStoreProductFilters", () => {
  it("devrait initialiser avec les bonnes valeurs par défaut", () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    expect(result.current.selectedCategoryId).toBeNull();
    expect(result.current.filteredProducts).toEqual(mockProducts);
    expect(result.current.categories).toHaveLength(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("devrait filtrer par recherche textuelle", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    await act(async () => {
      result.current.applyAdvancedFilters({}, "IPA");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière IPA");
  });

  it("devrait filtrer par catégorie", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    act(() => {
      result.current.setSelectedCategoryId("cat1");
    });

    // Attendre que l'effet se déclenche
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    expect(
      result.current.filteredProducts.every((p) => p.categoryId === "cat1")
    ).toBe(true);
  });

  it("devrait filtrer par prix", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    const priceFilters: ProductFilters = {
      minPrice: 4.0,
      maxPrice: 5.0,
    };

    await act(async () => {
      result.current.applyAdvancedFilters(priceFilters, "");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière IPA");
  });

  it("devrait filtrer par statut de stock", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    const stockFilters: ProductFilters = {
      stockStatus: "in_stock",
    };

    await act(async () => {
      result.current.applyAdvancedFilters(stockFilters, "");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière IPA");
  });

  it("devrait filtrer par attributs métier (degré d'alcool)", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    const businessFilters: ProductFilters = {
      degre_alcool_min: 6.0,
    };

    await act(async () => {
      result.current.applyAdvancedFilters(businessFilters, "");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière IPA");
  });

  it("devrait filtrer par type de houblon", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    const businessFilters: ProductFilters = {
      type_houblon: "Cascade",
    };

    await act(async () => {
      result.current.applyAdvancedFilters(businessFilters, "");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière IPA");
  });

  it("devrait combiner plusieurs filtres", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    const combinedFilters: ProductFilters = {
      minPrice: 4.0,
      maxPrice: 5.0,
      degre_alcool_min: 6.0,
      stockStatus: "in_stock",
    };

    await act(async () => {
      result.current.applyAdvancedFilters(combinedFilters, "IPA");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière IPA");
  });

  it("devrait combiner catégorie et filtres avancés", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    act(() => {
      result.current.setSelectedCategoryId("cat1");
    });

    const filters: ProductFilters = {
      degre_alcool_max: 5.0,
    };

    await act(async () => {
      result.current.applyAdvancedFilters(filters, "");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière Blonde");
  });

  it("devrait réinitialiser tous les filtres", () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    // Appliquer des filtres
    act(() => {
      result.current.setSelectedCategoryId("cat1");
    });

    // Réinitialiser
    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.selectedCategoryId).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.filteredProducts).toEqual(mockProducts);
  });

  it("devrait gérer les erreurs de filtrage avec fallback", async () => {
    // Mock console.error pour éviter les logs de test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // Créer un produit avec des attributs JSON invalides pour forcer une erreur
    const productsWithInvalidJSON: Product[] = [
      {
        ...mockProducts[0],
        attributes: "invalid json{",
      },
    ];

    const { result } = renderHook(() =>
      useStoreProductFilters(productsWithInvalidJSON)
    );

    const filters: ProductFilters = {
      degre_alcool_min: 6.0,
    };

    await act(async () => {
      result.current.applyAdvancedFilters(filters, "");
    });

    // Les produits avec attributs JSON invalides sont exclus lors du filtrage métier
    // C'est le comportement attendu pour éviter les erreurs
    expect(result.current.filteredProducts).toEqual([]);
    expect(result.current.error).toBeNull(); // Pas d'erreur car le filtrage a fonctionné

    consoleSpy.mockRestore();
  });

  it("devrait gérer une liste de produits vide", () => {
    const { result } = renderHook(() => useStoreProductFilters([]));

    expect(result.current.filteredProducts).toEqual([]);
    expect(result.current.categories).toEqual([]);
    expect(result.current.selectedCategoryId).toBeNull();
  });

  it("devrait mettre à jour les filtres quand les produits changent", () => {
    const { result, rerender } = renderHook(
      ({ products }) => useStoreProductFilters(products),
      { initialProps: { products: [mockProducts[0]] } }
    );

    // Initialement, une seule catégorie
    expect(result.current.categories).toHaveLength(1);
    expect(result.current.filteredProducts).toHaveLength(1);

    // Ajouter plus de produits
    rerender({ products: mockProducts });

    // Maintenant, deux catégories et tous les produits
    expect(result.current.categories).toHaveLength(2);
    expect(result.current.filteredProducts).toEqual(mockProducts);
  });

  it("devrait filtrer les produits en stock faible", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    const stockFilters: ProductFilters = {
      stockStatus: "low_stock",
    };

    await act(async () => {
      result.current.applyAdvancedFilters(stockFilters, "");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière Blonde");
  });

  it("devrait filtrer les produits en rupture de stock", async () => {
    const { result } = renderHook(() => useStoreProductFilters(mockProducts));

    const stockFilters: ProductFilters = {
      stockStatus: "out_of_stock",
    };

    await act(async () => {
      result.current.applyAdvancedFilters(stockFilters, "");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Verre à bière");
  });
});
