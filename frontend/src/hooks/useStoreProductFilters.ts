import { useCallback, useEffect, useState } from "react";
import type { Category, Product } from "../../../shared/types";
import type { ProductFilters } from "../services/adminProductService";

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
 * Utilise storeProductService pour une expérience client optimisée
 */
export const useStoreProductFilters = (
  allProducts: Product[] = []
): UseStoreProductFiltersReturn => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);
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

  // Filtrer les produits localement avec attributs métier
  const filterProductsLocally = useCallback(
    (
      products: Product[],
      categoryId: string | null,
      searchTerm: string,
      filters: ProductFilters = {}
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
              product.description.toLowerCase().includes(searchLower)) ||
            (product.attributes &&
              product.attributes.toLowerCase().includes(searchLower))
        );
      }

      // Filtres de prix
      if (filters.minPrice !== undefined) {
        filtered = filtered.filter(
          (product) => product.price >= filters.minPrice!
        );
      }
      if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(
          (product) => product.price <= filters.maxPrice!
        );
      }

      // Filtre de stock (extraire depuis les attributs)
      if (filters.stockStatus) {
        filtered = filtered.filter((product) => {
          let stock = 0;
          if (product.attributes) {
            try {
              const attrs = JSON.parse(product.attributes);
              stock = attrs.stock || 0;
            } catch {
              stock = 0;
            }
          }

          switch (filters.stockStatus) {
            case "in_stock":
              return stock > 10;
            case "low_stock":
              return stock > 0 && stock <= 10;
            case "out_of_stock":
              return stock === 0;
            default:
              return true;
          }
        });
      }

      // Filtres métier spécialisés
      if (
        Object.keys(filters).some(
          (key) =>
            key !== "minPrice" &&
            key !== "maxPrice" &&
            key !== "stockStatus" &&
            key !== "search" &&
            key !== "category"
        )
      ) {
        filtered = filtered.filter((product) => {
          if (!product.attributes) return false;

          try {
            const attrs = JSON.parse(product.attributes);

            // Filtres brewery
            if (filters.degre_alcool_min !== undefined && attrs.degre_alcool) {
              if (parseFloat(attrs.degre_alcool) < filters.degre_alcool_min)
                return false;
            }
            if (filters.degre_alcool_max !== undefined && attrs.degre_alcool) {
              if (parseFloat(attrs.degre_alcool) > filters.degre_alcool_max)
                return false;
            }
            if (filters.amertume_ibu_min !== undefined && attrs.amertume_ibu) {
              if (parseInt(attrs.amertume_ibu) < filters.amertume_ibu_min)
                return false;
            }
            if (filters.amertume_ibu_max !== undefined && attrs.amertume_ibu) {
              if (parseInt(attrs.amertume_ibu) > filters.amertume_ibu_max)
                return false;
            }
            if (filters.type_houblon && attrs.type_houblon) {
              if (attrs.type_houblon !== filters.type_houblon) return false;
            }

            // Filtres tea-shop
            if (filters.origine_plantation && attrs.origine_plantation) {
              if (attrs.origine_plantation !== filters.origine_plantation)
                return false;
            }
            if (filters.grade_qualite && attrs.grade_qualite) {
              if (attrs.grade_qualite !== filters.grade_qualite) return false;
            }

            // Filtres beauty-shop
            if (filters.type_peau && attrs.type_peau) {
              if (attrs.type_peau !== filters.type_peau) return false;
            }
            if (
              filters.certification_bio !== undefined &&
              attrs.certification_bio !== undefined
            ) {
              if (
                Boolean(attrs.certification_bio) !== filters.certification_bio
              )
                return false;
            }

            // Filtres herb-shop
            if (filters.usage_traditionnel && attrs.usage_traditionnel) {
              if (attrs.usage_traditionnel !== filters.usage_traditionnel)
                return false;
            }
            if (filters.forme_galenique && attrs.forme_galenique) {
              if (attrs.forme_galenique !== filters.forme_galenique)
                return false;
            }

            return true;
          } catch {
            return false;
          }
        });
      }

      return filtered;
    },
    []
  );

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

        // Fallback sur filtrage de base
        const basicFiltered = filterProductsLocally(
          allProducts,
          selectedCategoryId,
          searchTerm
        );
        setFilteredProducts(basicFiltered);
      } finally {
        setLoading(false);
      }
    },
    [allProducts, selectedCategoryId, filterProductsLocally]
  );

  // Mettre à jour les catégories quand les produits changent
  useEffect(() => {
    const extractedCategories = extractCategories(allProducts);
    setCategories(extractedCategories);
  }, [allProducts, extractCategories]);

  // Initialiser les produits filtrés
  useEffect(() => {
    if (Object.keys(currentFilters).length > 0 || currentSearchTerm) {
      applyAdvancedFilters(currentFilters, currentSearchTerm);
    } else {
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
