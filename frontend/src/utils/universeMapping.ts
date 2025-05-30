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
export interface UniverseIcon {
  emoji: string;
  label: string;
}

export const getUniverseIcon = (universe: UniverseType): UniverseIcon => {
  switch (universe) {
    case "brewery":
      return { emoji: "🍺", label: "bière" };
    case "teaShop":
      return { emoji: "🍵", label: "thé" };
    case "beautyShop":
      return { emoji: "💄", label: "beauté" };
    case "herbShop":
      return { emoji: "🌿", label: "herbes" };
    default:
      return { emoji: "🛍️", label: "boutique" };
  }
};

/**
 * Obtenir la couleur principale de l'univers (format hexadécimal)
 */
export const getUniverseColor = (universe: UniverseType): string => {
  switch (universe) {
    case "brewery":
      return "#ffc107"; // Ambre/doré
    case "teaShop":
      return "#8bc34a"; // Vert naturel
    case "beautyShop":
      return "#e91e63"; // Rose/corail
    case "herbShop":
      return "#4caf50"; // Vert profond
    default:
      return "#2196f3"; // Bleu par défaut
  }
};

/**
 * Obtenir le colorScheme Chakra UI pour l'univers
 */
export const getUniverseColorScheme = (universe: UniverseType): string => {
  switch (universe) {
    case "brewery":
      return "orange";
    case "teaShop":
      return "green";
    case "beautyShop":
      return "pink";
    case "herbShop":
      return "teal";
    default:
      return "blue";
  }
};

/**
 * Obtenir le nom lisible de l'univers (pour affichage)
 */
export const getUniverseName = (universe: UniverseType): string => {
  switch (universe) {
    case "brewery":
      return "Brasserie";
    case "teaShop":
      return "Salon de thé";
    case "beautyShop":
      return "Institut beauté";
    case "herbShop":
      return "Herboristerie";
    default:
      return "Boutique";
  }
};

/**
 * Obtenir la couleur de fond claire de l'univers (pour cartes, etc.)
 */
export const getUniverseLightBg = (universe: UniverseType): string => {
  const colorScheme = getUniverseColorScheme(universe);
  return `${colorScheme}.50`;
};

/**
 * Obtenir la couleur d'accentuation de l'univers (pour textes, bordures)
 */
export const getUniverseAccentColor = (universe: UniverseType): string => {
  const colorScheme = getUniverseColorScheme(universe);
  return `${colorScheme}.600`;
};
