import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { getUniverseTokens, type ShopType } from "../universeTokens";

/**
 * 🔘 BOUTONS ÉMOTIONNELS PAR UNIVERS
 *
 * Chaque univers a ses propres variants de boutons avec :
 * - Micro-interactions spécifiques
 * - Personnalité émotionnelle
 * - Couleurs contextuelles
 * - Typography adaptée
 */

// Helper pour créer un variant de bouton par univers
const createUniverseButtonVariant = (
  shopType: ShopType,
  variant: "primary" | "secondary" | "ghost" = "primary"
) => {
  const tokens = getUniverseTokens(shopType);

  const baseStyle = {
    fontFamily: tokens.typography.fontFamily.body,
    fontWeight: tokens.typography.fontWeight.bold,
    borderRadius: tokens.borderRadius.base,
    minH: tokens.heights.button.base,
    fontSize: tokens.typography.fontSize.button.base,
    transition: `all ${tokens.microInteractions.buttonClick.duration}s ${tokens.microInteractions.buttonClick.easing}`,
  };

  const emotionalProps = {
    // Micro-interactions émotionnelles au click
    _active: {
      transform: `scale(${tokens.microInteractions.buttonClick.scale})`,
      transition: `all ${tokens.microInteractions.buttonClick.duration}s ${tokens.microInteractions.buttonClick.easing}`,
    },

    // Hover selon la personnalité émotionnelle
    _hover: {
      transform:
        tokens.emotions.personality === "authentic"
          ? "none"
          : tokens.emotions.personality === "serene"
          ? "translateY(-1px)"
          : tokens.emotions.personality === "sophisticated"
          ? "translateY(-1px) scale(1.02)"
          : "scale(1.05)", // sincere
      transition: `all ${
        tokens.emotions.rhythm === "slow"
          ? "0.6s"
          : tokens.emotions.rhythm === "precise"
          ? "0.3s"
          : "0.25s"
      } ease`,
    },

    // Focus avec couleurs d'univers
    _focus: {
      boxShadow: `0 0 0 3px ${tokens.colors[300]}40`, // 40 = 25% opacity
      borderColor: tokens.colors[500],
    },
  };

  // Variants selon le type (primary, secondary, ghost)
  switch (variant) {
    case "primary":
      return defineStyle({
        ...baseStyle,
        ...emotionalProps,
        bg: tokens.colors[500],
        color: "white",
        borderWidth: "2px",
        borderColor: tokens.colors[500],
        _hover: {
          ...emotionalProps._hover,
          bg: tokens.colors[600],
          borderColor: tokens.colors[600],
        },
        _active: {
          ...emotionalProps._active,
          bg: tokens.colors[700],
          borderColor: tokens.colors[700],
        },
      });

    case "secondary":
      return defineStyle({
        ...baseStyle,
        ...emotionalProps,
        bg: "transparent",
        color: tokens.colors[600],
        borderWidth: "2px",
        borderColor: tokens.colors[300],
        _hover: {
          ...emotionalProps._hover,
          bg: tokens.colors[50],
          borderColor: tokens.colors[400],
          color: tokens.colors[700],
        },
        _active: {
          ...emotionalProps._active,
          bg: tokens.colors[100],
          borderColor: tokens.colors[500],
        },
      });

    case "ghost":
      return defineStyle({
        ...baseStyle,
        ...emotionalProps,
        bg: "transparent",
        color: tokens.colors[600],
        borderWidth: "0px",
        _hover: {
          ...emotionalProps._hover,
          bg: tokens.colors[100],
          color: tokens.colors[700],
        },
        _active: {
          ...emotionalProps._active,
          bg: tokens.colors[200],
          color: tokens.colors[800],
        },
      });

    default:
      return defineStyle(baseStyle);
  }
};

// 🍺 BREWERY BUTTONS - Authentique & Robuste
const breweryPrimary = createUniverseButtonVariant("brewery", "primary");
const brewerySecondary = createUniverseButtonVariant("brewery", "secondary");
const breweryGhost = createUniverseButtonVariant("brewery", "ghost");

// 🍵 TEASHOP BUTTONS - Zen & Serein
const teaShopPrimary = createUniverseButtonVariant("teaShop", "primary");
const teaShopSecondary = createUniverseButtonVariant("teaShop", "secondary");
const teaShopGhost = createUniverseButtonVariant("teaShop", "ghost");

// 💄 BEAUTY BUTTONS - Sophistiqué & Précis
const beautyShopPrimary = createUniverseButtonVariant("beautyShop", "primary");
const beautyShopSecondary = createUniverseButtonVariant(
  "beautyShop",
  "secondary"
);
const beautyShopGhost = createUniverseButtonVariant("beautyShop", "ghost");

// 🌿 HERB BUTTONS - Naturel & Sincère
const herbShopPrimary = createUniverseButtonVariant("herbShop", "primary");
const herbShopSecondary = createUniverseButtonVariant("herbShop", "secondary");
const herbShopGhost = createUniverseButtonVariant("herbShop", "ghost");

// Export du style config complet
export const universeButtonTheme = defineStyleConfig({
  variants: {
    // 🍺 BREWERY VARIANTS
    "brewery-primary": breweryPrimary,
    "brewery-secondary": brewerySecondary,
    "brewery-ghost": breweryGhost,

    // 🍵 TEASHOP VARIANTS
    "teashop-primary": teaShopPrimary,
    "teashop-secondary": teaShopSecondary,
    "teashop-ghost": teaShopGhost,

    // 💄 BEAUTY VARIANTS
    "beauty-primary": beautyShopPrimary,
    "beauty-secondary": beautyShopSecondary,
    "beauty-ghost": beautyShopGhost,

    // 🌿 HERB VARIANTS
    "herb-primary": herbShopPrimary,
    "herb-secondary": herbShopSecondary,
    "herb-ghost": herbShopGhost,
  },
});

/**
 * Helper pour obtenir le variant de bouton selon l'univers
 */
export const getUniverseButtonVariant = (
  shopType: ShopType,
  style: "primary" | "secondary" | "ghost" = "primary"
) => {
  const mapping = {
    brewery: `brewery-${style}`,
    teaShop: `teashop-${style}`,
    beautyShop: `beauty-${style}`,
    herbShop: `herb-${style}`,
  };

  return mapping[shopType];
};
