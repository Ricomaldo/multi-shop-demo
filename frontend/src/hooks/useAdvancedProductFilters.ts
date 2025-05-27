import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "../../../shared/types";
import adminProductService, {
  type ProductFilters,
} from "../services/adminProductService";

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
 */
export const useAdvancedProductFilters = (
  allProducts: Product[] = [],
  shopId?: string
): UseAdvancedProductFiltersReturn => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ProductFilters>({});
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

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

  // Filtrer les produits localement (filtres de base)
  const filterProductsLocally = useCallback(
    (
      products: Product[],
      categoryId: string | null,
      searchTerm: string
    ): Product[] => {
      let filtered = products;

      // Filtre par catégorie
      if (categoryId) {
        filtered = filtered.filter(
          (product) => product.categoryId === categoryId
        );
      }

      // Filtre par recherche textuelle
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            (product.description &&
              product.description.toLowerCase().includes(searchLower))
        );
      }

      return filtered;
    },
    []
  );

  // Appliquer les filtres avancés via le service
  const applyAdvancedFilters = useCallback(
    async (filters: ProductFilters, searchTerm: string) => {
      if (!shopId) return;

      setLoading(true);
      setError(null);
      setCurrentFilters(filters);
      setCurrentSearchTerm(searchTerm);

      try {
        // Si aucun filtre avancé n'est appliqué, utiliser le filtrage local
        const hasAdvancedFilters = Object.keys(filters).some(
          (key) =>
            key !== "minPrice" &&
            key !== "maxPrice" &&
            key !== "stockStatus" &&
            filters[key as keyof ProductFilters]
        );

        if (
          !hasAdvancedFilters &&
          !filters.minPrice &&
          !filters.maxPrice &&
          !filters.stockStatus
        ) {
          // Filtrage local uniquement
          const localFiltered = filterProductsLocally(
            allProducts,
            selectedCategoryId,
            searchTerm
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
      } finally {
        setLoading(false);
      }
    },
    [shopId, allProducts, selectedCategoryId, categories, filterProductsLocally]
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

  // Réappliquer les filtres quand la catégorie change
  useEffect(() => {
    if (Object.keys(currentFilters).length > 0 || currentSearchTerm) {
      applyAdvancedFilters(currentFilters, currentSearchTerm);
    } else {
      // Filtrage local par catégorie uniquement
      const filtered = filterProductsLocally(
        allProducts,
        selectedCategoryId,
        ""
      );
      setFilteredProducts(filtered);
    }
  }, [
    selectedCategoryId,
    allProducts,
    currentFilters,
    currentSearchTerm,
    applyAdvancedFilters,
    filterProductsLocally,
  ]);

  const resetFilters = useCallback(() => {
    setSelectedCategoryId(null);
    setCurrentFilters({});
    setCurrentSearchTerm("");
    setError(null);
    setFilteredProducts(allProducts);
  }, [allProducts]);

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
