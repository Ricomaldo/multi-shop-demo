import { useBreakpointValue } from "@chakra-ui/react";
import {
  getAnimationProps,
  getUniverseAnimations,
} from "../theme/components/universeAnimations";
import { type ShopType } from "../theme/universeTokens";

/**
 * Hook pour les animations signature par univers
 * Contrôle automatiquement les performances selon device
 */
export const useUniverseAnimations = (shopType: ShopType) => {
  const animations = getUniverseAnimations(shopType);

  // Désactiver animations complexes sur mobile pour les performances
  const shouldAnimate =
    useBreakpointValue<boolean>({ base: false, md: true, lg: true }) ?? false;

  return {
    // Configuration complète
    animations,

    // État des animations
    enabled: shouldAnimate,

    // Helpers pour composants
    getSignatureProps: () =>
      shouldAnimate ? getAnimationProps(shopType, "signature") : {},

    getHoverProps: () =>
      shouldAnimate
        ? {
            _hover: getAnimationProps(shopType, "hover"),
          }
        : {},

    getClickProps: () =>
      shouldAnimate
        ? {
            _active: getAnimationProps(shopType, "click"),
          }
        : {},

    getFocusProps: () =>
      shouldAnimate
        ? {
            _focus: getAnimationProps(shopType, "focus"),
          }
        : {},

    getEntranceProps: () =>
      shouldAnimate ? getAnimationProps(shopType, "entrance") : {},

    getAmbientProps: () =>
      shouldAnimate ? getAnimationProps(shopType, "ambient") : {},

    // Props combinées pour composants complets
    getInteractiveProps: () =>
      shouldAnimate
        ? {
            ...getAnimationProps(shopType, "signature"),
            _hover: getAnimationProps(shopType, "hover"),
            _active: getAnimationProps(shopType, "click"),
            _focus: getAnimationProps(shopType, "focus"),
          }
        : {},

    // Animation d'entrée avec délai - VERSION CORRIGÉE
    getStaggeredEntranceProps: (index: number, delayMultiplier = 0.1) => {
      if (!shouldAnimate) return {};

      const baseDelay = parseFloat(animations.entrance.delay || "0");
      const staggerDelay = baseDelay + index * delayMultiplier;

      return {
        style: {
          animation: animations.entrance.animation,
          animationDelay: `${staggerDelay}s`, // ✅ Dans style maintenant
        },
      };
    },

    // Animation conditionnelle selon état
    getConditionalAnimation: (
      condition: boolean,
      type: "signature" | "hover" | "click" | "focus" | "entrance" | "ambient"
    ) => {
      if (!shouldAnimate || !condition) return {};
      return getAnimationProps(shopType, type);
    },

    // Informations sur l'univers
    meta: {
      shopType,
      hasComplexAnimations: shouldAnimate,
      signatureDuration: animations.signature.duration,
      ambientDuration: animations.ambient.duration,
    },
  };
};
