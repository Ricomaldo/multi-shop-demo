import { act, renderHook } from "@testing-library/react";
import type { Product } from "../../../../shared/types";
import { useProductFilters } from "../useProductFilters";

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Blonde de Garde",
    price: 4.5,
    shopId: "shop-1",
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Blondes", shopId: "shop-1" },
  },
  {
    id: "prod-2",
    name: "IPA Américaine",
    price: 5.5,
    shopId: "shop-1",
    categoryId: "cat-2",
    category: { id: "cat-2", name: "IPA", shopId: "shop-1" },
  },
  {
    id: "prod-3",
    name: "Blonde Premium",
    price: 6.0,
    shopId: "shop-1",
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Blondes", shopId: "shop-1" },
  },
];

describe("useProductFilters Hook", () => {
  test("initialise correctement avec tous les produits", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    expect(result.current.filteredProducts).toEqual(mockProducts);
    expect(result.current.selectedCategoryId).toBe(null);
    expect(result.current.categories).toHaveLength(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("extrait les catégories uniques correctement", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    const categories = result.current.categories;
    expect(categories).toHaveLength(2);
    expect(categories.find((c) => c.name === "Blondes")).toBeDefined();
    expect(categories.find((c) => c.name === "IPA")).toBeDefined();
  });

  test("filtre les produits par catégorie", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    act(() => {
      result.current.setSelectedCategoryId("cat-1");
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    expect(
      result.current.filteredProducts.every((p) => p.categoryId === "cat-1")
    ).toBe(true);
    expect(result.current.selectedCategoryId).toBe("cat-1");
  });

  test("réinitialise les filtres correctement", () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));

    // Appliquer un filtre
    act(() => {
      result.current.setSelectedCategoryId("cat-1");
    });

    expect(result.current.selectedCategoryId).toBe("cat-1");

    // Réinitialiser
    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.selectedCategoryId).toBe(null);
    expect(result.current.filteredProducts).toEqual(mockProducts);
    expect(result.current.error).toBe(null);
  });

  test("gère les produits vides", () => {
    const { result } = renderHook(() => useProductFilters([]));

    expect(result.current.filteredProducts).toEqual([]);
    expect(result.current.categories).toEqual([]);
    expect(result.current.selectedCategoryId).toBe(null);
  });

  test("met à jour les filtres quand les produits changent", () => {
    const { result, rerender } = renderHook(
      ({ products }) => useProductFilters(products),
      { initialProps: { products: mockProducts.slice(0, 1) } }
    );

    expect(result.current.categories).toHaveLength(1);

    // Changer les produits
    rerender({ products: mockProducts });

    expect(result.current.categories).toHaveLength(2);
    expect(result.current.filteredProducts).toEqual(mockProducts);
  });
});
