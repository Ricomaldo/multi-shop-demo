import type { Category, Product } from "../../../shared/types";

/**
 * Extrait les catégories uniques d'une liste de produits
 * Utilisé par tous les hooks de filtrage pour éviter la duplication
 */
export function extractCategories(products: Product[]): Category[] {
  const categoryMap = new Map<string, Category>();

  products.forEach((product) => {
    if (product.category && !categoryMap.has(product.category.id)) {
      categoryMap.set(product.category.id, product.category);
    }
  });

  return Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * Vérifie si une catégorie existe dans une liste de produits
 */
export function categoryExistsInProducts(
  categoryId: string,
  products: Product[]
): boolean {
  return products.some((product) => product.categoryId === categoryId);
}

/**
 * Compte le nombre de produits par catégorie
 */
export function getProductCountByCategory(
  products: Product[]
): Map<string, number> {
  const countMap = new Map<string, number>();

  products.forEach((product) => {
    if (product.categoryId && product.categoryId.trim() !== "") {
      const currentCount = countMap.get(product.categoryId) || 0;
      countMap.set(product.categoryId, currentCount + 1);
    }
  });

  return countMap;
}
