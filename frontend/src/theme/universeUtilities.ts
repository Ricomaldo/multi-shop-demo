import { getUniverseTokens, type ShopType } from "./universeTokens";

// 🎯 UTILITAIRES POUR ÉLIMINER LE CODE EN DUR
// Remplace gray.500, blue.600, etc. par des couleurs d'univers contextuelles

/**
 * Remplace les couleurs gray hardcodées par des nuances d'univers
 */
export const getContextualGray = (
  shopType: ShopType,
  intensity: "light" | "medium" | "dark" = "medium"
) => {
  const tokens = getUniverseTokens(shopType);

  const mapping = {
    light: tokens.colors[200], // Remplace gray.300
    medium: tokens.colors[400], // Remplace gray.500, gray.600
    dark: tokens.colors[600], // Remplace gray.700, gray.800
  };

  return mapping[intensity];
};

/**
 * Couleurs de statut contextualisées selon l'univers
 */
export const getStatusColors = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    success: tokens.colors[600], // Remplace green.500
    warning: tokens.colors[500], // Remplace orange.500
    error: tokens.colors[700], // Remplace red.500
    info: tokens.colors[400], // Remplace blue.500
    // Seules exceptions - couleurs système pures
    systemSuccess: "green.500",
    systemWarning: "orange.500",
    systemError: "red.500",
  };
};

/**
 * Props universels pour badges selon l'univers
 */
export const getUniverseBadgeProps = (
  shopType: ShopType,
  variant: "stock" | "category" | "status" = "stock"
) => {
  const tokens = getUniverseTokens(shopType);

  const baseProps = {
    colorScheme: tokens.meta.colorScheme,
    borderRadius: tokens.borderRadius.base,
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: tokens.typography.fontSize.card.base,
  };

  // Variantes spécifiques selon le contexte
  switch (variant) {
    case "stock":
      return {
        ...baseProps,
        fontSize: "xs",
        fontWeight: tokens.typography.fontWeight.bold,
      };
    case "category":
      return {
        ...baseProps,
        fontSize: "sm",
        fontWeight: tokens.typography.fontWeight.normal,
      };
    case "status":
      return {
        ...baseProps,
        fontSize: "xs",
        fontWeight: tokens.typography.fontWeight.heavy,
      };
    default:
      return baseProps;
  }
};

/**
 * Couleurs de texte contextualisées
 */
export const getContextualTextColor = (
  shopType: ShopType,
  role: "heading" | "body" | "muted" | "accent" = "body"
) => {
  const tokens = getUniverseTokens(shopType);

  const mapping = {
    heading: tokens.colors[800], // Titres principaux
    body: tokens.colors[600], // Texte principal
    muted: tokens.colors[400], // Texte secondaire
    accent: tokens.colors[700], // Texte d'accent
  };

  return mapping[role];
};

/**
 * Configuration layout contextualisée
 */
export const getContextualLayout = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    container: {
      maxW: tokens.variants.layout === "zen" ? "1000px" : "1200px",
      spacing: tokens.spacing.section,
      py: tokens.spacing.component,
    },
    grid: {
      gap: tokens.spacing.card,
      columns: {
        base: 1,
        md: tokens.variants.layout === "compact" ? 3 : 2,
        lg: tokens.variants.layout === "elegant" ? 4 : 3,
      },
    },
  };
};
