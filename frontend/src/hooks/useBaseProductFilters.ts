import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "@/types";
import { extractCategories } from "../utils/categoryHelpers";

interface UseBaseProductFiltersReturn {
  selectedCategoryId: string | null;
  setSelectedCategoryId: (categoryId: string | null) => void;
  filteredProducts: Product[];
  setFilteredProducts: (products: Product[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  resetFilters: () => void;
}

/**
 * Hook de base pour la gestion d'état des filtres produits
 * Centralise la logique commune à tous les hooks de filtrage
 */
export function useBaseProductFilters(
  allProducts: Product[] = []
): UseBaseProductFiltersReturn {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour les catégories quand les produits changent
  useEffect(() => {
    const extractedCategories = extractCategories(allProducts);
    setCategories((prev) => {
      // Optimisation : éviter les re-renders inutiles
      if (
        prev.length === extractedCategories.length &&
        prev.every((cat, i) => cat.id === extractedCategories[i].id)
      ) {
        return prev;
      }
      return extractedCategories;
    });
  }, [allProducts]);

  // Initialiser les produits filtrés
  useEffect(() => {
    setFilteredProducts(allProducts);
  }, [allProducts]);

  const resetFilters = useCallback(() => {
    setSelectedCategoryId(null);
    setError(null);
    setFilteredProducts(allProducts);
  }, [allProducts]);

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    filteredProducts,
    setFilteredProducts,
    categories,
    setCategories,
    loading,
    setLoading,
    error,
    setError,
    resetFilters,
  };
}
