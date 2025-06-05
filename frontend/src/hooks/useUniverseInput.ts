import { getUniverseInputVariant } from "../theme/components/universeInput";
import { getUniverseTokens, type ShopType } from "../theme/universeTokens";

/**
 * Hook pour utiliser facilement les inputs émotionnels par univers
 * Combine les variants Chakra + micro-interactions + validation émotionnelle
 */
export const useUniverseInput = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    // Variant prêt à l'emploi
    getInputProps: () => ({
      variant: getUniverseInputVariant(shopType),
      // Data attributes pour debug/analytics
      "data-universe": shopType,
      "data-personality": tokens.emotions.personality,
      "data-rhythm": tokens.emotions.rhythm,
    }),

    // Props personnalisés avec validation émotionnelle
    getCustomInputProps: (overrides = {}) => ({
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: tokens.typography.fontSize.card.base,
      minH: tokens.heights.input.base,
      borderRadius: tokens.borderRadius.base,
      borderWidth: "2px",
      borderColor: tokens.colors[300],
      bg: tokens.colors[50],
      color: tokens.colors[800],

      // Placeholder selon l'univers
      _placeholder: {
        color: tokens.colors[400],
      },

      // Focus avec micro-interactions
      _focus: {
        borderColor: tokens.microInteractions.inputFocus.borderColor,
        boxShadow: tokens.microInteractions.inputFocus.boxShadow,
        transition: tokens.microInteractions.inputFocus.transition,
      },

      // Data attributes pour analytics
      "data-universe": shopType,
      "data-texture": tokens.emotions.texture,
      "data-energy": tokens.emotions.energy,

      ...overrides,
    }),

    // Messages d'erreur contextualisés selon la personnalité
    getErrorMessage: (field: string) => {
      switch (tokens.emotions.personality) {
        case "authentic": // Brewery - Direct et franc
          return `${field} est requis.`;
        case "serene": // TeaShop - Doux et bienveillant
          return `Pourriez-vous renseigner ${field} s'il vous plaît ?`;
        case "sophisticated": // Beauty - Élégant et précis
          return `Veuillez compléter le champ ${field}.`;
        case "sincere": // Herb - Simple et naturel
          return `${field} manquant.`;
        default:
          return `${field} est requis.`;
      }
    },

    // Placeholder contextualisé selon l'émotion
    getPlaceholder: (field: string) => {
      switch (tokens.emotions.personality) {
        case "authentic": // Brewery
          return `Votre ${field}`;
        case "serene": // TeaShop
          return `${field}...`;
        case "sophisticated": // Beauty
          return `Saisissez votre ${field}`;
        case "sincere": // Herb
          return field;
        default:
          return `Votre ${field}`;
      }
    },

    // Accès direct aux tokens pour cases complexes
    tokens,
    emotions: tokens.emotions,
    meta: tokens.meta,
  };
};
