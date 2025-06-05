import { getUniverseTokens, type ShopType } from "../theme/universeTokens";

/**
 * Hook pour accéder aux micro-interactions émotionnelles par univers
 * Permet d'appliquer facilement les interactions spécifiques selon le shopType
 */
export const useUniverseMicroInteractions = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    // Micro-interactions directes
    microInteractions: tokens.microInteractions,
    emotions: tokens.emotions,

    // Helpers pour application directe
    getButtonClickProps: () => ({
      transform: `scale(${tokens.microInteractions.buttonClick.scale})`,
      transition: `all ${tokens.microInteractions.buttonClick.duration}s ${tokens.microInteractions.buttonClick.easing}`,
    }),

    getCardHoverProps: () => ({
      _hover: {
        transform: tokens.microInteractions.cardHover.transform,
        transition: tokens.microInteractions.cardHover.transition,
        boxShadow: tokens.microInteractions.cardHover.shadow,
      },
    }),

    getInputFocusProps: () => ({
      _focus: {
        borderColor: tokens.microInteractions.inputFocus.borderColor,
        boxShadow: tokens.microInteractions.inputFocus.boxShadow,
        transition: tokens.microInteractions.inputFocus.transition,
      },
    }),

    getLinkHoverProps: () => ({
      _hover: {
        transform: tokens.microInteractions.linkHover.transform,
        color: tokens.microInteractions.linkHover.color,
        transition: tokens.microInteractions.linkHover.transition,
      },
    }),

    // Props émotionnels pour debug/info
    getEmotionalContext: () => ({
      [`data-texture`]: tokens.emotions.texture,
      [`data-rhythm`]: tokens.emotions.rhythm,
      [`data-personality`]: tokens.emotions.personality,
      [`data-energy`]: tokens.emotions.energy,
    }),
  };
};
