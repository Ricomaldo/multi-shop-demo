import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "@/types";
import adminProductService, {
  type ProductFilters,
} from "../services/adminProductService";
import {
  filterProductsLocally,
  hasAdvancedFilters,
} from "../utils/productFilterHelpers";
import { useBaseProductFilters } from "./useBaseProductFilters";

interface UseAdvancedProductFiltersReturn {
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
 * Hook personnalisé pour gérer les filtres avancés de produits
 * Combine filtres par catégorie et filtres métier spécialisés
 * Utilise useBaseProductFilters et productFilterHelpers pour éviter la duplication
 */
export const useAdvancedProductFilters = (
  allProducts: Product[] = [],
  shopId?: string
): UseAdvancedProductFiltersReturn => {
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

  // Appliquer les filtres avancés via le service ou localement
  const applyAdvancedFilters = useCallback(
    async (filters: ProductFilters, searchTerm: string) => {
      if (!shopId) return;

      setLoading(true);
      setError(null);
      setCurrentFilters(filters);
      setCurrentSearchTerm(searchTerm);

      try {
        // Déterminer si on a besoin du service distant ou si le filtrage local suffit
        const needsRemoteFiltering =
          hasAdvancedFilters(filters) ||
          filters.minPrice !== undefined ||
          filters.maxPrice !== undefined ||
          filters.stockStatus !== undefined;

        if (!needsRemoteFiltering && !searchTerm.trim()) {
          // Filtrage local uniquement par catégorie
          const localFiltered = filterProductsLocally(
            allProducts,
            selectedCategoryId,
            "",
            {}
          );
          setFilteredProducts(localFiltered);
        } else if (!needsRemoteFiltering) {
          // Filtrage local complet
          const localFiltered = filterProductsLocally(
            allProducts,
            selectedCategoryId,
            searchTerm,
            filters
          );
          setFilteredProducts(localFiltered);
        } else {
          // Utiliser le service pour les filtres avancés
          const result = await adminProductService.getFilteredProducts(shopId, {
            ...filters,
            search: searchTerm,
            category: selectedCategoryId
              ? categories.find((c) => c.id === selectedCategoryId)?.name
              : undefined,
          });
          setFilteredProducts(result.products);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors du filtrage";
        setError(errorMessage);
        console.error("Erreur filtrage avancé:", err);

        // Fallback sur filtrage local en cas d'erreur
        try {
          const fallbackFiltered = filterProductsLocally(
            allProducts,
            selectedCategoryId,
            searchTerm,
            filters
          );
          setFilteredProducts(fallbackFiltered);
        } catch (fallbackErr) {
          console.error("Erreur fallback filtrage local:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      shopId,
      allProducts,
      selectedCategoryId,
      categories,
      setLoading,
      setError,
      setFilteredProducts,
    ]
  );

  // Réappliquer les filtres quand la catégorie change
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
