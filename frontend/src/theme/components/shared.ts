import {
  createMultiStyleConfigHelpers,
  defineStyleConfig,
} from "@chakra-ui/react";
import { getUniverseTokens, type ShopType } from "../universeTokens";

// ============================================
// SHARED COMPONENTS VARIANTS - VERSION DRY
// Intégration RÉELLE avec UniverseTokens
// ============================================

// Helpers pour SharedProductPreviewCard
const productCardHelpers = createMultiStyleConfigHelpers([
  "card",
  "image",
  "content",
  "title",
  "price",
  "badge",
  "button",
]);

// Factory pour générer les variants selon l'univers
const generateProductCardVariant = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    card: {
      bg: tokens.colors[50],
      borderWidth: "2px",
      borderColor: tokens.colors[200],
      borderRadius: tokens.borderRadius.base,
      fontFamily: tokens.typography.fontFamily.body,
      p: 4,
      transition: tokens.animations.transition,
      _hover: {
        borderColor: tokens.colors[300],
        bg: tokens.colors[100],
        transform: tokens.animations.hover.transform.md,
        boxShadow: shopType === "beautyShop" ? "lg" : "md",
      },
    },
    image: {
      borderRadius: tokens.borderRadius.md,
      objectFit: "cover",
      transition: tokens.animations.transition,
    },
    title: {
      fontWeight: tokens.typography.fontWeight.bold,
      fontFamily: tokens.typography.fontFamily.heading,
      color: tokens.colors[800],
    },
    price: {
      fontWeight: tokens.typography.fontWeight.heavy,
      color: tokens.colors[700],
      fontFamily: tokens.typography.fontFamily.heading,
    },
    badge: {
      borderRadius: tokens.borderRadius.base,
    },
    button: {
      fontFamily: tokens.typography.fontFamily.body,
      borderRadius: tokens.borderRadius.base,
      minH: tokens.heights.touchTarget,
    },
  };
};

// Configuration avec variants réels par univers
export const SharedProductPreviewCard =
  productCardHelpers.defineMultiStyleConfig({
    baseStyle: {
      card: {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      },
      image: {
        width: "100%",
        mb: 3,
      },
      content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
      },
    },
    variants: {
      brewery: generateProductCardVariant("brewery"),
      teaShop: generateProductCardVariant("teaShop"),
      beautyShop: generateProductCardVariant("beautyShop"),
      herbShop: generateProductCardVariant("herbShop"),
    },
    defaultProps: {
      variant: "brewery", // Fallback
    },
  });

// Configuration DRY pour ProductGrid
export const ProductGrid = defineStyleConfig({
  baseStyle: {
    display: "grid",
    w: "full",
  },
  variants: {
    brewery: {
      gap: 6,
      p: 4,
      gridTemplateColumns: {
        base: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      },
    },
    teaShop: {
      gap: 8,
      p: 6,
      gridTemplateColumns: {
        base: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      },
    },
    beautyShop: {
      gap: 6,
      p: 5,
      gridTemplateColumns: {
        base: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "repeat(4, 1fr)",
      },
    },
    herbShop: {
      gap: 8,
      p: 4,
      gridTemplateColumns: {
        base: "1fr",
        md: "repeat(2, 1fr)",
        xl: "repeat(3, 1fr)",
      },
    },
  },
  defaultProps: {
    variant: "brewery",
  },
});

// Factory pour sections avec tokens d'univers
const generateSectionVariant = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    py: tokens.spacing.section,
    px: tokens.spacing.component,
    fontFamily: tokens.typography.fontFamily.body,
    // Styles de box spécifiques à l'univers
    ".section-box": {
      bg: tokens.colors[50],
      p: tokens.spacing.card,
      borderRadius:
        shopType === "brewery"
          ? tokens.borderRadius.base
          : tokens.borderRadius.lg,
      border:
        shopType === "teaShop" ? "none" : `1px solid ${tokens.colors[200]}`,
    },
    // Headings avec typography d'univers
    ".section-heading": {
      fontFamily: tokens.typography.fontFamily.heading,
      color: tokens.colors[700],
      fontWeight: tokens.typography.fontWeight.heavy,
    },
  };
};

// Configuration pour les sections d'univers
export const UniverseSection = defineStyleConfig({
  baseStyle: {
    w: "full",
    position: "relative",
  },
  variants: {
    brewery: generateSectionVariant("brewery"),
    teaShop: generateSectionVariant("teaShop"),
    beautyShop: generateSectionVariant("beautyShop"),
    herbShop: generateSectionVariant("herbShop"),
  },
  defaultProps: {
    variant: "brewery",
  },
});

// Animations centralisées et DRY
export const storeAnimations = {
  brewery: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", bounce: 0.4 },
  },
  teaShop: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  beautyShop: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  herbShop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: "linear" },
  },
};

// Utilitaires DRY pour les composants
export const getUniverseVariant = (shopType: string) => {
  const variants = ["brewery", "teaShop", "beautyShop", "herbShop"];
  return variants.includes(shopType) ? shopType : "brewery";
};
