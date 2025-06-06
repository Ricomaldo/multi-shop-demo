import { getUniverseLayoutProps } from "../theme/components/universeLayout";
import { getUniverseTokens, type ShopType } from "../theme/universeTokens";

/**
 * Hook pour utiliser facilement les layouts émotionnels par univers
 * Combine les variants Chakra + spacing + grid selon l'émotion
 */
export const useUniverseLayout = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  return {
    // Variant prêt à l'emploi
    getLayoutProps: () => getUniverseLayoutProps(shopType),

    // Container principal avec spacing émotionnel
    getContainerProps: () => ({
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
          ? 8 // Beauty - plus d'espace
          : tokens.emotions.texture === "rough"
          ? 6 // Brewery - compact
          : 7, // TeaShop/Herb - équilibré
      py:
        tokens.emotions.rhythm === "slow"
          ? 12 // TeaShop - plus d'espace vertical
          : tokens.emotions.rhythm === "precise"
          ? 10 // Beauty - précis
          : 8, // Brewery/Herb - standard
    }),

    // Grid émotionnel responsive et mobile-friendly
    getGridProps: () => ({
      // Colonnes responsive selon la personnalité mais mobile-friendly
      columns:
        tokens.emotions.personality === "sophisticated"
          ? { base: 1, sm: 2, md: 3, lg: 4 } // Beauty - plus de colonnes
          : tokens.emotions.personality === "serene"
          ? { base: 1, md: 2, lg: 3 } // TeaShop - grille zen
          : tokens.emotions.personality === "authentic"
          ? { base: 1, md: 2, lg: 3, xl: 4 } // Brewery - grille robuste
          : { base: 1, md: 2, lg: 3 }, // Herb - grille naturelle

      spacing:
        tokens.emotions.rhythm === "slow"
          ? { base: 4, md: 8 } // TeaShop - plus d'espace responsive
          : tokens.emotions.rhythm === "precise"
          ? { base: 3, md: 6 } // Beauty - précis responsive
          : tokens.emotions.rhythm === "natural"
          ? { base: 4, md: 7 } // Herb - organique responsive
          : { base: 3, md: 5 }, // Brewery - standard responsive

      w: "full",
      px: { base: 4, md: 6 }, // Padding responsive
    }),

    // Card container émotionnel
    getCardProps: () => ({
      bg: `linear-gradient(135deg, ${tokens.colors[50]} 0%, white 100%)`,
      borderRadius: tokens.borderRadius.base,
      borderWidth: tokens.emotions.texture === "rough" ? "2px" : "1px",
      borderColor: tokens.colors[200],
      p:
        tokens.emotions.texture === "refined"
          ? 6 // Beauty - plus d'espace
          : tokens.emotions.texture === "rough"
          ? 4 // Brewery - compact
          : 5, // TeaShop/Herb - équilibré
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
    }),

    // Section header émotionnel
    getSectionHeaderProps: () => ({
      mb:
        tokens.emotions.rhythm === "slow"
          ? 8 // TeaShop - plus d'espace
          : tokens.emotions.rhythm === "precise"
          ? 6 // Beauty - précis
          : 5, // Brewery/Herb - standard
      textAlign:
        tokens.emotions.personality === "sophisticated"
          ? "center" // Beauty - centré
          : tokens.emotions.personality === "serene"
          ? "center" // TeaShop - centré zen
          : "left", // Brewery/Herb - aligné gauche

      // Spacing selon la texture
      pb:
        tokens.emotions.texture === "refined"
          ? 6 // Beauty - plus d'espace
          : tokens.emotions.texture === "smooth"
          ? 5 // TeaShop - équilibré
          : 4, // Brewery/Herb - compact
    }),

    // Accès direct aux tokens pour cases complexes
    tokens,
    emotions: tokens.emotions,
    meta: tokens.meta,
  };
};
