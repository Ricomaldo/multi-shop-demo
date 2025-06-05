import { getUniverseTokens, type ShopType } from "@/theme/universeTokens";
import {
  getContextualGray,
  getStatusColors,
  getSystemColors,
} from "@/utils/universeUtilities";

/**
 * Hook centralisé pour toutes les couleurs contextuelles par univers
 * Remplace définitivement les couleurs hardcodées Chakra UI
 */
export const useUniverseColors = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);
  const statusColors = getStatusColors(shopType);
  const systemColors = getSystemColors(shopType);

  return {
    // Couleurs primaires de l'univers
    primary: tokens.colors[500],
    primaryLight: tokens.colors[300],
    primaryDark: tokens.colors[700],

    // Couleurs de statut contextuelles (plus de green/red!)
    status: statusColors,

    // Couleurs système contextuelles
    system: systemColors,

    // Couleurs neutres contextuelles (plus de gray!)
    gray: {
      light: getContextualGray(shopType, "light"),
      medium: getContextualGray(shopType, "medium"),
      dark: getContextualGray(shopType, "dark"),
    },

    // Couleurs de fond selon l'univers
    backgrounds: {
      page: tokens.colors[50],
      card: `linear-gradient(135deg, ${tokens.colors[50]} 0%, white 100%)`,
      subtle: tokens.colors[100],
      elevated: "white",
    },

    // Couleurs de texte selon l'univers
    text: {
      primary: tokens.colors[800],
      secondary: tokens.colors[600],
      subtle: tokens.colors[500],
      inverse: "white",
    },

    // Couleurs de bordure selon l'univers
    borders: {
      light: tokens.colors[200],
      medium: tokens.colors[300],
      dark: tokens.colors[400],
    },

    // Accès direct aux tokens pour cas complexes
    tokens,
    emotions: tokens.emotions,
    meta: tokens.meta,
  };
};
