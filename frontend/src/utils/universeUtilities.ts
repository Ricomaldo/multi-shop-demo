import { getUniverseTokens, type ShopType } from "../theme/universeTokens";

/**
 * 🎨 UTILITAIRES UNIVERSE - Anti-hardcode
 *
 * Fonctions pour éviter le hardcode de couleurs et styles
 * spécifiques par univers dans les composants
 */

/**
 * 🔤 COULEURS CONTEXTUELLES - Plus de gray.500 !
 *
 * Utilise les couleurs de l'univers pour les éléments neutres
 */
export const getContextualGray = (
  shopType: ShopType,
  intensity: "light" | "medium" | "dark" = "medium"
) => {
  const tokens = getUniverseTokens(shopType);

  switch (intensity) {
    case "light":
      return tokens.colors[300];
    case "medium":
      return tokens.colors[500];
    case "dark":
      return tokens.colors[700];
    default:
      return tokens.colors[500];
  }
};

/**
 * 📏 ESPACEMENTS ADAPTATIFS
 *
 * Espacement selon la texture émotionnelle de l'univers
 */
export const getContextualSpacing = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  // Multipliers selon la texture émotionnelle
  const multiplier =
    tokens.emotions.texture === "rough"
      ? 1.2 // Plus d'espace brewery
      : tokens.emotions.texture === "smooth"
      ? 1.0 // Standard
      : tokens.emotions.texture === "refined"
      ? 0.9 // Moins d'espace beauty
      : 1.1; // Organique herb

  return {
    xs: `${Math.round(4 * multiplier)}px`,
    sm: `${Math.round(8 * multiplier)}px`,
    md: `${Math.round(16 * multiplier)}px`,
    lg: `${Math.round(24 * multiplier)}px`,
    xl: `${Math.round(32 * multiplier)}px`,
  };
};

/**
 * 🎨 COULEURS DE STATUT SELON L'UNIVERS
 *
 * Remplace les couleurs hardcodées green/red par des couleurs
 * adaptées à la personnalité de chaque univers
 */
export const getStatusColors = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    // Couleurs pour statut ouvert
    open: {
      bg:
        tokens.emotions.personality === "authentic"
          ? "#2e7d32" // Vert franc brewery
          : tokens.emotions.personality === "serene"
          ? "#81c784" // Vert doux teaShop
          : tokens.emotions.personality === "sophisticated"
          ? "#4caf50" // Vert précis beauty
          : "#8bc34a", // Vert naturel herb
      color: "white",
      pulse: tokens.emotions.rhythm === "slow", // Animation pulse selon rythme
    },

    // Couleurs pour statut fermé
    closed: {
      bg:
        tokens.emotions.personality === "authentic"
          ? "#d32f2f" // Rouge franc brewery
          : tokens.emotions.personality === "serene"
          ? "#ffab91" // Orange doux teaShop (pas rouge)
          : tokens.emotions.personality === "sophisticated"
          ? "#e91e63" // Rose sophistiqué beauty
          : "#ff9800", // Orange naturel herb (pas rouge agressif)
      color: "white",
    },

    // Alternative pour les hovers et focus
    openHover: tokens.colors[500],
    closedHover: tokens.colors[600],
  };
};

/**
 * 🔔 COULEURS D'ÉTAT SYSTÈME SELON L'UNIVERS
 *
 * Pour les notifications, alertes, validations
 */
export const getSystemColors = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);
  const statusColors = getStatusColors(shopType);

  return {
    success: tokens.colors[500], // Couleur principale de l'univers pour succès
    warning:
      tokens.emotions.personality === "authentic"
        ? "#ff9800" // Orange franc brewery
        : tokens.emotions.personality === "serene"
        ? "#ffcc02" // Jaune doux teaShop
        : tokens.emotions.personality === "sophisticated"
        ? "#ffc107" // Doré beauty
        : "#8bc34a", // Vert clair herb
    error: statusColors.closed.bg,
    info: tokens.colors[400],
  };
};
