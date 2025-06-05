import { useBreakpointValue } from "@chakra-ui/react";
import { getResponsiveEmotions } from "../theme/components/responsiveEmotions";
import { type ShopType } from "../theme/universeTokens";

/**
 * Hook pour les émotions responsive automatiques
 * Détecte la taille d'écran et applique les bonnes micro-interactions
 */
export const useResponsiveEmotions = (shopType: ShopType) => {
  const emotions = getResponsiveEmotions(shopType);

  // Détection automatique du device avec Chakra UI
  const currentDevice = useBreakpointValue(
    { base: "mobile", md: "tablet", lg: "desktop" },
    { fallback: "mobile" }
  ) as "mobile" | "tablet" | "desktop";

  const currentProps = emotions[currentDevice] ||
    emotions.mobile || {
      enableAnimations: false,
      buttonScale: 1,
      hoverTransform: "none",
      transitionDuration: "0.2s",
    };

  return {
    // Props actuelles selon device
    current: currentProps,

    // Props spécifiques par device
    mobile: emotions.mobile,
    tablet: emotions.tablet,
    desktop: emotions.desktop,

    // Device actuel détecté
    device: currentDevice,

    // Helpers pour composants
    getButtonProps: () => ({
      transform: currentProps.enableAnimations
        ? `scale(${currentProps.buttonScale})`
        : "none",
      transition: `all ${currentProps.transitionDuration} ease`,
      _hover: currentProps.enableAnimations
        ? {
            transform:
              currentProps.hoverTransform ||
              `scale(${currentProps.buttonScale * 1.02})`,
          }
        : {},
      _active: {
        transform: `scale(${currentProps.buttonScale})`,
      },
    }),

    getCardProps: () => ({
      transition: `all ${currentProps.transitionDuration} ease`,
      _hover: currentProps.enableAnimations
        ? {
            transform: currentProps.hoverTransform,
          }
        : {},
    }),

    getInputProps: () => ({
      transition: `all ${currentProps.transitionDuration} ease`,
      _focus: currentProps.enableAnimations
        ? {
            transform: "scale(1.01)",
          }
        : {},
    }),

    // État des animations selon device
    isAnimationsEnabled: currentProps.enableAnimations,

    // Durée transition actuelle
    transitionDuration: currentProps.transitionDuration,
  };
};
