import { act, renderHook } from "@testing-library/react";
import type { Category, Product } from "../../../../shared/types";
import { useBaseProductFilters } from "../useBaseProductFilters";

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
    categoryId: "cat2",
    category: mockCategory2,
  },
];

describe("useBaseProductFilters", () => {
  it("devrait initialiser avec les bonnes valeurs par défaut", () => {
    const { result } = renderHook(() => useBaseProductFilters(mockProducts));

    expect(result.current.selectedCategoryId).toBeNull();
    expect(result.current.filteredProducts).toEqual(mockProducts);
    expect(result.current.categories).toHaveLength(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("devrait extraire et trier les catégories correctement", () => {
    const { result } = renderHook(() => useBaseProductFilters(mockProducts));

    expect(result.current.categories).toHaveLength(2);
    expect(result.current.categories[0].name).toBe("Accessoires"); // Trié alphabétiquement
    expect(result.current.categories[1].name).toBe("Bières");
  });

  it("devrait permettre de sélectionner une catégorie", () => {
    const { result } = renderHook(() => useBaseProductFilters(mockProducts));

    act(() => {
      result.current.setSelectedCategoryId("cat1");
    });

    expect(result.current.selectedCategoryId).toBe("cat1");
  });

  it("devrait permettre de mettre à jour les produits filtrés", () => {
    const { result } = renderHook(() => useBaseProductFilters(mockProducts));

    const newProducts = [mockProducts[0]];

    act(() => {
      result.current.setFilteredProducts(newProducts);
    });

    expect(result.current.filteredProducts).toEqual(newProducts);
  });

  it("devrait permettre de gérer l'état de chargement", () => {
    const { result } = renderHook(() => useBaseProductFilters(mockProducts));

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  it("devrait permettre de gérer les erreurs", () => {
    const { result } = renderHook(() => useBaseProductFilters(mockProducts));

    const errorMessage = "Erreur de test";

    act(() => {
      result.current.setError(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });

  it("devrait réinitialiser les filtres correctement", () => {
    const { result } = renderHook(() => useBaseProductFilters(mockProducts));

    // Modifier l'état
    act(() => {
      result.current.setSelectedCategoryId("cat1");
      result.current.setError("Une erreur");
      result.current.setFilteredProducts([]);
    });

    // Vérifier que l'état a changé
    expect(result.current.selectedCategoryId).toBe("cat1");
    expect(result.current.error).toBe("Une erreur");
    expect(result.current.filteredProducts).toEqual([]);

    // Réinitialiser
    act(() => {
      result.current.resetFilters();
    });

    // Vérifier la réinitialisation
    expect(result.current.selectedCategoryId).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.filteredProducts).toEqual(mockProducts);
  });

  it("devrait mettre à jour les catégories quand les produits changent", () => {
    const { result, rerender } = renderHook(
      ({ products }) => useBaseProductFilters(products),
      { initialProps: { products: [mockProducts[0]] } }
    );

    // Initialement, une seule catégorie
    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories[0].name).toBe("Bières");

    // Ajouter un produit avec une nouvelle catégorie
    rerender({ products: mockProducts });

    // Maintenant, deux catégories
    expect(result.current.categories).toHaveLength(2);
  });

  it("devrait éviter les re-renders inutiles des catégories", () => {
    const { result, rerender } = renderHook(
      ({ products }) => useBaseProductFilters(products),
      { initialProps: { products: mockProducts } }
    );

    const initialCategories = result.current.categories;

    // Re-render avec les mêmes produits
    rerender({ products: mockProducts });

    // Les catégories devraient être la même référence (optimisation)
    expect(result.current.categories).toBe(initialCategories);
  });

  it("devrait gérer une liste de produits vide", () => {
    const { result } = renderHook(() => useBaseProductFilters([]));

    expect(result.current.filteredProducts).toEqual([]);
    expect(result.current.categories).toEqual([]);
    expect(result.current.selectedCategoryId).toBeNull();
  });
});
