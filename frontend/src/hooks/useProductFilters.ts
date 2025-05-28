import { useCallback, useEffect } from "react";
import type { Category, Product } from "../../../shared/types";
import { useBaseProductFilters } from "./useBaseProductFilters";

interface UseProductFiltersReturn {
  filteredProducts: Product[];
  selectedCategoryId: string | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  setSelectedCategoryId: (categoryId: string | null) => void;
  resetFilters: () => void;
}

/**
 * Hook personnalisé pour gérer les filtres de produits par catégorie
 * Centralise la logique de filtrage et de gestion des catégories
 * Utilise useBaseProductFilters pour éviter la duplication
 */
export const useProductFilters = (
  allProducts: Product[] = []
): UseProductFiltersReturn => {
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    filteredProducts,
    setFilteredProducts,
    categories,
    loading,
    setLoading,
    error,
    setError,
    resetFilters: baseResetFilters,
  } = useBaseProductFilters(allProducts);

  // Filtrer les produits par catégorie sélectionnée
  const filterProducts = useCallback(
    (products: Product[], categoryId: string | null): Product[] => {
      if (!categoryId) return products;
      return products.filter((product) => product.categoryId === categoryId);
    },
    []
  );

  // Mettre à jour les produits filtrés quand la sélection change
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const filtered = filterProducts(allProducts, selectedCategoryId);
      setFilteredProducts(filtered);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur de filtrage";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    allProducts,
    selectedCategoryId,
    filterProducts,
    setFilteredProducts,
    setLoading,
    setError,
  ]);

  const resetFilters = useCallback(() => {
    baseResetFilters();
    setError(null);
  }, [baseResetFilters, setError]);

  return {
    filteredProducts,
    selectedCategoryId,
    categories,
    loading,
    error,
    setSelectedCategoryId,
    resetFilters,
  };
};
