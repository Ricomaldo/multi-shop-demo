import { getUniverseButtonVariant } from "../theme/components/universeButton";
import { getUniverseTokens, type ShopType } from "../theme/universeTokens";

/**
 * Hook pour utiliser facilement les boutons émotionnels par univers
 * Combine les variants Chakra + micro-interactions + contexte émotionnel
 */
export const useUniverseButton = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    // Variants prêts à l'emploi
    getPrimaryProps: () => ({
      variant: getUniverseButtonVariant(shopType, "primary"),
      // Data attributes pour debug/analytics
      "data-universe": shopType,
      "data-personality": tokens.emotions.personality,
      "data-energy": tokens.emotions.energy,
    }),

    getSecondaryProps: () => ({
      variant: getUniverseButtonVariant(shopType, "secondary"),
      "data-universe": shopType,
      "data-personality": tokens.emotions.personality,
      "data-energy": tokens.emotions.energy,
    }),

    getGhostProps: () => ({
      variant: getUniverseButtonVariant(shopType, "ghost"),
      "data-universe": shopType,
      "data-personality": tokens.emotions.personality,
      "data-energy": tokens.emotions.energy,
    }),

    // Props personnalisés avec micro-interactions manuelles (pour edge cases)
    getCustomProps: (overrides = {}) => ({
      fontFamily: tokens.typography.fontFamily.body,
      fontWeight: tokens.typography.fontWeight.bold,
      borderRadius: tokens.borderRadius.base,
      minH: tokens.heights.button.base,
      fontSize: tokens.typography.fontSize.button.base,
      colorScheme: tokens.meta.colorScheme,

      // Micro-interactions émotionnelles
      _active: {
        transform: `scale(${tokens.microInteractions.buttonClick.scale})`,
        transition: `all ${tokens.microInteractions.buttonClick.duration}s ${tokens.microInteractions.buttonClick.easing}`,
      },

      _hover: {
        transform:
          tokens.emotions.personality === "authentic"
            ? "none"
            : tokens.emotions.personality === "serene"
            ? "translateY(-1px)"
            : tokens.emotions.personality === "sophisticated"
            ? "translateY(-1px) scale(1.02)"
            : "scale(1.05)",
      },

      // Data attributes pour analytics
      "data-universe": shopType,
      "data-texture": tokens.emotions.texture,
      "data-rhythm": tokens.emotions.rhythm,

      ...overrides,
    }),

    // Accès direct aux tokens pour cases complexes
    tokens,
    emotions: tokens.emotions,
    meta: tokens.meta,
  };
};
