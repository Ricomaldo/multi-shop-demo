import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { getUniverseTokens, type ShopType } from "../universeTokens";

/**
 * 📐 LAYOUTS ÉMOTIONNELS PAR UNIVERS
 *
 * Chaque univers a ses propres variants de layout selon :
 * - emotions.texture : rough/smooth/refined/organic
 * - emotions.rhythm : steady/slow/precise/natural
 * - emotions.personality : authentic/serene/sophisticated/sincere
 */

// Helper pour créer un variant de layout par univers
const createUniverseLayoutVariant = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return defineStyle({
    // Container principal selon la texture émotionnelle
    container: {
      maxW:
        tokens.emotions.texture === "refined"
          ? "1400px" // Beauty - plus large
          : tokens.emotions.texture === "rough"
          ? "1200px" // Brewery - compact
          : tokens.emotions.texture === "smooth"
          ? "1300px" // TeaShop - équilibré
          : "1250px", // Herb - naturel
      mx: "auto",
      px:
        tokens.emotions.texture === "refined"
          ? "8" // Beauty - plus d'espace
          : tokens.emotions.texture === "rough"
          ? "6" // Brewery - compact
          : "7", // TeaShop/Herb - équilibré
      py:
        tokens.emotions.rhythm === "slow"
          ? "12" // TeaShop - plus d'espace vertical
          : tokens.emotions.rhythm === "precise"
          ? "10" // Beauty - précis
          : "8", // Brewery/Herb - standard
    },

    // Grid selon le rythme émotionnel
    grid: {
      display: "grid",
      gap:
        tokens.emotions.rhythm === "slow"
          ? "8" // TeaShop - plus d'espace
          : tokens.emotions.rhythm === "precise"
          ? "6" // Beauty - précis
          : tokens.emotions.rhythm === "natural"
          ? "7" // Herb - organique
          : "5", // Brewery - standard

      // Colonnes selon la personnalité
      gridTemplateColumns:
        tokens.emotions.personality === "sophisticated"
          ? "repeat(auto-fit, minmax(320px, 1fr))" // Beauty - grille sophistiquée
          : tokens.emotions.personality === "serene"
          ? "repeat(auto-fit, minmax(280px, 1fr))" // TeaShop - grille zen
          : tokens.emotions.personality === "authentic"
          ? "repeat(auto-fit, minmax(300px, 1fr))" // Brewery - grille robuste
          : "repeat(auto-fit, minmax(290px, 1fr))", // Herb - grille naturelle
    },

    // Card container selon l'émotion
    card: {
      bg: `linear-gradient(135deg, ${tokens.colors[50]} 0%, white 100%)`,
      borderRadius: tokens.borderRadius.base,
      borderWidth: tokens.emotions.texture === "rough" ? "2px" : "1px",
      borderColor: tokens.colors[200],
      p:
        tokens.emotions.texture === "refined"
          ? "6" // Beauty - plus d'espace
          : tokens.emotions.texture === "rough"
          ? "4" // Brewery - compact
          : "5", // TeaShop/Herb - équilibré
      transition: tokens.animations.transition,

      // Shadow selon la personnalité
      boxShadow:
        tokens.emotions.personality === "sophisticated"
          ? "lg" // Beauty - ombre marquée
          : tokens.emotions.personality === "serene"
          ? "md" // TeaShop - ombre douce
          : tokens.emotions.personality === "authentic"
          ? "sm" // Brewery - ombre nette
          : "base", // Herb - ombre naturelle

      // Hover selon le rythme
      _hover: {
        transform:
          tokens.emotions.rhythm === "slow"
            ? "translateY(-4px)" // TeaShop - lévitation
            : tokens.emotions.rhythm === "precise"
            ? "scale(1.02)" // Beauty - expansion
            : tokens.emotions.rhythm === "natural"
            ? "scale(1.03)" // Herb - scale organique
            : "none", // Brewery - pas de mouvement
        boxShadow:
          tokens.emotions.personality === "sophisticated"
            ? "xl"
            : tokens.emotions.personality === "serene"
            ? "lg"
            : tokens.emotions.personality === "authentic"
            ? "md"
            : "lg",
      },
    },

    // Section header selon l'univers
    sectionHeader: {
      mb:
        tokens.emotions.rhythm === "slow"
          ? "8" // TeaShop - plus d'espace
          : tokens.emotions.rhythm === "precise"
          ? "6" // Beauty - précis
          : "5", // Brewery/Herb - standard
      textAlign:
        tokens.emotions.personality === "sophisticated"
          ? "center" // Beauty - centré
          : tokens.emotions.personality === "serene"
          ? "center" // TeaShop - centré zen
          : "left", // Brewery/Herb - aligné gauche

      // Spacing selon la texture
      pb:
        tokens.emotions.texture === "refined"
          ? "6" // Beauty - plus d'espace
          : tokens.emotions.texture === "smooth"
          ? "5" // TeaShop - équilibré
          : "4", // Brewery/Herb - compact
    },
  });
};

// 🍺 BREWERY LAYOUT - Compact & Robuste
const breweryLayout = createUniverseLayoutVariant("brewery");

// 🍵 TEASHOP LAYOUT - Zen & Aéré
const teaShopLayout = createUniverseLayoutVariant("teaShop");

// 💄 BEAUTY LAYOUT - Élégant & Sophistiqué
const beautyShopLayout = createUniverseLayoutVariant("beautyShop");

// 🌿 HERB LAYOUT - Naturel & Organique
const herbShopLayout = createUniverseLayoutVariant("herbShop");

// Export du style config complet
export const universeLayoutTheme = defineStyleConfig({
  variants: {
    // 🍺 BREWERY VARIANTS
    brewery: breweryLayout,

    // 🍵 TEASHOP VARIANTS
    teashop: teaShopLayout,

    // 💄 BEAUTY VARIANTS
    beauty: beautyShopLayout,

    // 🌿 HERB VARIANTS
    herb: herbShopLayout,
  },
});

/**
 * Helper pour obtenir le variant de layout selon l'univers
 */
export const getUniverseLayoutVariant = (shopType: ShopType) => {
  const mapping = {
    brewery: "brewery",
    teaShop: "teashop",
    beautyShop: "beauty",
    herbShop: "herb",
  };

  return mapping[shopType];
};

/**
 * Helper pour obtenir les props de layout selon l'univers
 */
export const getUniverseLayoutProps = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);
  const variant = getUniverseLayoutVariant(shopType);

  return {
    variant,
    "data-universe": shopType,
    "data-texture": tokens.emotions.texture,
    "data-rhythm": tokens.emotions.rhythm,
    "data-personality": tokens.emotions.personality,
  };
};
