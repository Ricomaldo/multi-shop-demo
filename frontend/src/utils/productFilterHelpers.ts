import type { Product } from "../../../shared/types";
import type { ProductFilters } from "../services/adminProductService";

/**
 * Filtre les produits par catégorie
 */
export function filterByCategory(
  products: Product[],
  categoryId: string | null
): Product[] {
  if (!categoryId) return products;
  return products.filter((product) => product.categoryId === categoryId);
}

/**
 * Filtre les produits par recherche textuelle
 */
export function filterBySearch(
  products: Product[],
  searchTerm: string
): Product[] {
  if (!searchTerm.trim()) return products;

  const searchLower = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchLower) ||
      (product.description &&
        product.description.toLowerCase().includes(searchLower)) ||
      (product.attributes &&
        product.attributes.toLowerCase().includes(searchLower))
  );
}

/**
 * Filtre les produits par prix
 */
export function filterByPrice(
  products: Product[],
  minPrice?: number,
  maxPrice?: number
): Product[] {
  let filtered = products;

  if (minPrice !== undefined) {
    filtered = filtered.filter((product) => product.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    filtered = filtered.filter((product) => product.price <= maxPrice);
  }

  return filtered;
}

/**
 * Extrait le stock d'un produit depuis ses attributs
 */
function getProductStock(product: Product): number {
  if (!product.attributes) return 0;

  try {
    const attrs = JSON.parse(product.attributes || "{}");
    return attrs.stock || 0;
  } catch {
    return 0;
  }
}

/**
 * Filtre les produits par statut de stock
 */
export function filterByStock(
  products: Product[],
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock"
): Product[] {
  if (!stockStatus) return products;

  return products.filter((product) => {
    const stock = getProductStock(product);

    switch (stockStatus) {
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

/**
 * Filtre les produits par attributs métier spécialisés
 */
export function filterByBusinessAttributes(
  products: Product[],
  filters: ProductFilters
): Product[] {
  // Vérifier s'il y a des filtres métier
  const hasBusinessFilters = Object.keys(filters).some(
    (key) =>
      key !== "minPrice" &&
      key !== "maxPrice" &&
      key !== "stockStatus" &&
      key !== "search" &&
      key !== "category"
  );

  if (!hasBusinessFilters) return products;

  return products.filter((product) => {
    if (!product.attributes) return false;

    try {
      const attrs = JSON.parse(product.attributes || "{}");

      // Filtres brewery
      if (filters.degre_alcool_min !== undefined) {
        if (
          !attrs.degre_alcool ||
          parseFloat(attrs.degre_alcool) < filters.degre_alcool_min
        )
          return false;
      }
      if (filters.degre_alcool_max !== undefined) {
        if (
          !attrs.degre_alcool ||
          parseFloat(attrs.degre_alcool) > filters.degre_alcool_max
        )
          return false;
      }

      // Filtres par plages de degré d'alcool (nouveau)
      if (
        filters.degre_alcool_ranges &&
        filters.degre_alcool_ranges.length > 0
      ) {
        if (!attrs.degre_alcool) return false;

        const degre = parseFloat(attrs.degre_alcool);
        const matchesRange = filters.degre_alcool_ranges.some(
          (range: string) => {
            switch (range) {
              case "light":
                return degre >= 3 && degre < 5;
              case "medium":
                return degre >= 5 && degre < 7;
              case "strong":
                return degre >= 7 && degre < 10;
              case "very-strong":
                return degre >= 10;
              default:
                return false;
            }
          }
        );

        if (!matchesRange) return false;
      }

      if (filters.amertume_ibu_min !== undefined) {
        if (
          !attrs.amertume_ibu ||
          parseInt(attrs.amertume_ibu) < filters.amertume_ibu_min
        )
          return false;
      }
      if (filters.amertume_ibu_max !== undefined) {
        if (
          !attrs.amertume_ibu ||
          parseInt(attrs.amertume_ibu) > filters.amertume_ibu_max
        )
          return false;
      }

      // Filtres par plages d'amertume IBU (nouveau)
      if (
        filters.amertume_ibu_ranges &&
        filters.amertume_ibu_ranges.length > 0
      ) {
        if (!attrs.amertume_ibu) return false;

        const ibu = parseInt(attrs.amertume_ibu);
        const matchesRange = filters.amertume_ibu_ranges.some(
          (range: string) => {
            switch (range) {
              case "low":
                return ibu >= 10 && ibu < 25;
              case "medium":
                return ibu >= 25 && ibu < 45;
              case "high":
                return ibu >= 45 && ibu < 70;
              case "very-high":
                return ibu >= 70;
              default:
                return false;
            }
          }
        );

        if (!matchesRange) return false;
      }

      if (filters.type_houblon) {
        if (!attrs.type_houblon || attrs.type_houblon !== filters.type_houblon)
          return false;
      }

      // Filtres teaShop
      if (filters.origine_plantation) {
        if (
          !attrs.origine_plantation ||
          attrs.origine_plantation !== filters.origine_plantation
        )
          return false;
      }
      if (filters.grade_qualite) {
        if (
          !attrs.grade_qualite ||
          attrs.grade_qualite !== filters.grade_qualite
        )
          return false;
      }

      // Filtres beautyShop
      if (filters.type_peau) {
        if (!attrs.type_peau || attrs.type_peau !== filters.type_peau)
          return false;
      }
      if (filters.certification_bio !== undefined) {
        if (
          attrs.certification_bio === undefined ||
          Boolean(attrs.certification_bio) !== filters.certification_bio
        )
          return false;
      }

      // Filtres herbShop
      if (filters.usage_traditionnel) {
        if (
          !attrs.usage_traditionnel ||
          attrs.usage_traditionnel !== filters.usage_traditionnel
        )
          return false;
      }
      if (filters.forme_galenique) {
        if (
          !attrs.forme_galenique ||
          attrs.forme_galenique !== filters.forme_galenique
        )
          return false;
      }

      return true;
    } catch {
      return false;
    }
  });
}

/**
 * Fonction principale de filtrage local
 * Combine tous les filtres disponibles
 */
export function filterProductsLocally(
  products: Product[],
  categoryId: string | null,
  searchTerm: string,
  filters: ProductFilters = {}
): Product[] {
  let filtered = products;

  // Appliquer les filtres dans l'ordre optimal
  filtered = filterByCategory(filtered, categoryId);
  filtered = filterBySearch(filtered, searchTerm);
  filtered = filterByPrice(filtered, filters.minPrice, filters.maxPrice);
  filtered = filterByStock(filtered, filters.stockStatus);
  filtered = filterByBusinessAttributes(filtered, filters);

  return filtered;
}

/**
 * Vérifie si des filtres avancés sont appliqués
 */
export function hasAdvancedFilters(filters: ProductFilters): boolean {
  return Object.keys(filters).some(
    (key) =>
      key !== "minPrice" &&
      key !== "maxPrice" &&
      key !== "stockStatus" &&
      filters[key as keyof ProductFilters]
  );
}
