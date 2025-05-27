import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "../../../shared/types";

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
 */
export const useProductFilters = (
  allProducts: Product[] = []
): UseProductFiltersReturn => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extraire les catégories uniques des produits
  const extractCategories = useCallback((products: Product[]): Category[] => {
    const categoryMap = new Map<string, Category>();

    products.forEach((product) => {
      if (product.category && !categoryMap.has(product.category.id)) {
        categoryMap.set(product.category.id, product.category);
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, []);

  // Filtrer les produits par catégorie sélectionnée
  const filterProducts = useCallback(
    (products: Product[], categoryId: string | null): Product[] => {
      if (!categoryId) return products;
      return products.filter((product) => product.categoryId === categoryId);
    },
    []
  );

  // Mettre à jour les catégories quand les produits changent
  useEffect(() => {
    const extractedCategories = extractCategories(allProducts);
    setCategories((prev) => {
      if (
        prev.length === extractedCategories.length &&
        prev.every((cat, i) => cat.id === extractedCategories[i].id)
      ) {
        return prev;
      }
      return extractedCategories;
    });
  }, [allProducts, extractCategories]);

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
  }, [allProducts, selectedCategoryId, filterProducts]);

  const resetFilters = useCallback(() => {
    setSelectedCategoryId(null);
    setError(null);
  }, []);

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
