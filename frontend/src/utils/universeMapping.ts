import type { UniverseType } from "../contexts/UniverseContext";

/**
 * Mapping entre les shopType de la base de données et les univers UniverseProvider
 * Basé sur la nomenclature technique DemoForge
 */
export const shopTypeToUniverse = (shopType: string): UniverseType => {
  switch (shopType) {
    case "brewery":
      return "brewery";
    case "tea-shop":
      return "tea-shop";
    case "beauty-shop":
      return "beauty-shop";
    case "herb-shop":
      return "herb-shop";
    default:
      return "brewery"; // Fallback par défaut
  }
};

/**
 * Mapping inverse : universe → shopType
 */
export const universeToShopType = (universe: UniverseType): string => {
  return universe; // Dans notre cas, ils sont identiques
};

/**
 * Obtenir le nom commercial de la boutique selon l'univers
 */
export const getShopDisplayName = (universe: UniverseType): string => {
  switch (universe) {
    case "brewery":
      return "Houblon & Tradition";
    case "tea-shop":
      return "Les Jardins de Darjeeling";
    case "beauty-shop":
      return "L'Écrin de Jade";
    case "herb-shop":
      return "Herboristerie du Moulin Vert";
    default:
      return "Boutique DemoForge";
  }
};

/**
 * Obtenir l'icône de l'univers
 */
export const getUniverseIcon = (universe: UniverseType): string => {
  switch (universe) {
    case "brewery":
      return "🍺";
    case "tea-shop":
      return "🍵";
    case "beauty-shop":
      return "💄";
    case "herb-shop":
      return "🌿";
    default:
      return "🛍️";
  }
};
