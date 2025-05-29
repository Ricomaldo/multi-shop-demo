import type { UniverseType } from "../contexts/UniverseContext";

/**
 * Mapping entre les shopType de la base de données et les univers UniverseProvider
 * Basé sur la nomenclature technique DemoForge
 */
export const shopTypeToUniverse = (shopType: string): UniverseType => {
  switch (shopType) {
    case "brewery":
      return "brewery";
    case "teaShop":
      return "teaShop";
    case "beautyShop":
      return "beautyShop";
    case "herbShop":
      return "herbShop";
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
    case "teaShop":
      return "Les Jardins de Darjeeling";
    case "beautyShop":
      return "L'Écrin de Jade";
    case "herbShop":
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
    case "teaShop":
      return "🍵";
    case "beautyShop":
      return "💄";
    case "herbShop":
      return "🌿";
    default:
      return "🛍️";
  }
};
