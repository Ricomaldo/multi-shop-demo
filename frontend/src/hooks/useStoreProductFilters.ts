import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "../../../shared/types";
import type { ProductFilters } from "../services/adminProductService";
import { filterProductsLocally } from "../utils/productFilterHelpers";
import { useBaseProductFilters } from "./useBaseProductFilters";

interface UseStoreProductFiltersReturn {
  filteredProducts: Product[];
  selectedCategoryId: string | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  setSelectedCategoryId: (categoryId: string | null) => void;
  resetFilters: () => void;
  applyAdvancedFilters: (filters: ProductFilters, searchTerm: string) => void;
}

/**
 * Hook personnalisé pour gérer les filtres de produits côté vitrine
 * Utilise exclusivement le filtrage local pour une expérience client optimisée
 * Utilise useBaseProductFilters et productFilterHelpers pour éviter la duplication
 */
export const useStoreProductFilters = (
  allProducts: Product[] = []
): UseStoreProductFiltersReturn => {
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

  const [currentFilters, setCurrentFilters] = useState<ProductFilters>({});
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  // Appliquer les filtres (privilégier le filtrage local pour la vitrine)
  const applyAdvancedFilters = useCallback(
    async (filters: ProductFilters, searchTerm: string) => {
      setLoading(true);
      setError(null);
      setCurrentFilters(filters);
      setCurrentSearchTerm(searchTerm);

      try {
        // Pour la vitrine, privilégier le filtrage local pour de meilleures performances
        const localFiltered = filterProductsLocally(
          allProducts,
          selectedCategoryId,
          searchTerm,
          filters
        );
        setFilteredProducts(localFiltered);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors du filtrage";
        setError(errorMessage);
        console.error("Erreur filtrage vitrine:", err);

        // Fallback sur filtrage de base en cas d'erreur
        try {
          const basicFiltered = filterProductsLocally(
            allProducts,
            selectedCategoryId,
            searchTerm,
            {}
          );
          setFilteredProducts(basicFiltered);
        } catch (fallbackErr) {
          console.error("Erreur fallback filtrage vitrine:", fallbackErr);
          // En dernier recours, afficher tous les produits
          setFilteredProducts(allProducts);
        }
      } finally {
        setLoading(false);
      }
    },
    [allProducts, selectedCategoryId, setLoading, setError, setFilteredProducts]
  );

  // Initialiser et réappliquer les filtres quand les données changent
  useEffect(() => {
    if (Object.keys(currentFilters).length > 0 || currentSearchTerm) {
      applyAdvancedFilters(currentFilters, currentSearchTerm);
    } else {
      // Filtrage local par catégorie uniquement
      const filtered = filterProductsLocally(
        allProducts,
        selectedCategoryId,
        "",
        {}
      );
      setFilteredProducts(filtered);
    }
  }, [
    selectedCategoryId,
    allProducts,
    currentFilters,
    currentSearchTerm,
    applyAdvancedFilters,
    setFilteredProducts,
  ]);

  const resetFilters = useCallback(() => {
    baseResetFilters();
    setCurrentFilters({});
    setCurrentSearchTerm("");
  }, [baseResetFilters]);

  return {
    filteredProducts,
    selectedCategoryId,
    categories,
    loading,
    error,
    setSelectedCategoryId,
    resetFilters,
    applyAdvancedFilters,
  };
};
