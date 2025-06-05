import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { getUniverseTokens, type ShopType } from "../universeTokens";

/**
 * 📝 INPUTS ÉMOTIONNELS PAR UNIVERS
 *
 * Chaque univers a ses propres styles d'inputs avec :
 * - Bordures spécifiques selon emotions.texture
 * - Focus behavior selon emotions.rhythm
 * - Validation selon emotions.personality
 * - Couleurs contextuelles
 */

// Helper pour créer un variant d'input par univers
const createUniverseInputVariant = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return defineStyle({
    field: {
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
        fontWeight: tokens.typography.fontWeight.normal,
      },

      // Focus avec micro-interactions émotionnelles
      _focus: {
        borderColor: tokens.microInteractions.inputFocus.borderColor,
        boxShadow: tokens.microInteractions.inputFocus.boxShadow,
        transition: tokens.microInteractions.inputFocus.transition,
        bg: tokens.colors[50], // Garde la même couleur claire au focus

        // Animation selon le rythme émotionnel
        transform:
          tokens.emotions.rhythm === "slow"
            ? "scale(1.01)"
            : tokens.emotions.rhythm === "precise"
            ? "none"
            : tokens.emotions.rhythm === "natural"
            ? "scale(1.02)"
            : "none", // steady
      },

      // Hover selon la personnalité
      _hover: {
        borderColor: tokens.colors[400],
        bg: tokens.colors[100], // Utilise la couleur 100 disponible
        transition: `all ${
          tokens.emotions.rhythm === "slow" ? "0.4s" : "0.2s"
        } ease`,
      },

      // Invalid state selon l'émotion
      _invalid: {
        borderColor:
          tokens.emotions.personality === "authentic"
            ? "#d32f2f" // Rouge franc brewery
            : tokens.emotions.personality === "serene"
            ? "#e57373" // Rouge doux teaShop
            : tokens.emotions.personality === "sophisticated"
            ? "#c62828" // Rouge précis beauty
            : "#8bc34a", // Vert naturel herb (pas de rouge agressif)
        boxShadow:
          tokens.emotions.personality === "authentic"
            ? "0 0 0 1px #d32f2f"
            : tokens.emotions.personality === "serene"
            ? "0 0 0 2px rgba(229, 115, 115, 0.3)"
            : tokens.emotions.personality === "sophisticated"
            ? "0 0 0 2px rgba(198, 40, 40, 0.2)"
            : "0 0 0 2px rgba(139, 195, 74, 0.3)",
      },

      // Valid state positif
      _valid: {
        borderColor: tokens.colors[500],
        boxShadow: `0 0 0 2px ${tokens.colors[200]}`,
      },

      // Disabled state
      _disabled: {
        bg: tokens.colors[100],
        borderColor: tokens.colors[200],
        color: tokens.colors[400],
        cursor: "not-allowed",
      },
    },
  });
};

// 🍺 BREWERY INPUT - Authentique & Net
const breweryInput = createUniverseInputVariant("brewery");

// 🍵 TEASHOP INPUT - Zen & Doux
const teaShopInput = createUniverseInputVariant("teaShop");

// 💄 BEAUTY INPUT - Sophistiqué & Précis
const beautyShopInput = createUniverseInputVariant("beautyShop");

// 🌿 HERB INPUT - Naturel & Organique
const herbShopInput = createUniverseInputVariant("herbShop");

// Export du style config complet
export const universeInputTheme = defineStyleConfig({
  variants: {
    // 🍺 BREWERY VARIANTS
    brewery: breweryInput,

    // 🍵 TEASHOP VARIANTS
    teashop: teaShopInput,

    // 💄 BEAUTY VARIANTS
    beauty: beautyShopInput,

    // 🌿 HERB VARIANTS
    herb: herbShopInput,
  },
});

/**
 * Helper pour obtenir le variant d'input selon l'univers
 */
export const getUniverseInputVariant = (shopType: ShopType) => {
  const mapping = {
    brewery: "brewery",
    teaShop: "teashop",
    beautyShop: "beauty",
    herbShop: "herb",
  };

  return mapping[shopType];
};
