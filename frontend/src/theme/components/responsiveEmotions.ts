import { getUniverseTokens, type ShopType } from "../universeTokens";

/**
 * 📱 ÉMOTIONS RESPONSIVE
 *
 * Adapte les micro-interactions émotionnelles selon la taille d'écran :
 * - Mobile : Interactions simplifiées et directes
 * - Tablet : Interactions modérées
 * - Desktop : Pleine expressivité émotionnelle
 */

export interface ResponsiveEmotions {
  mobile: {
    enableAnimations: boolean;
    buttonScale: number;
    hoverTransform: string;
    transitionDuration: string;
  };
  tablet: {
    enableAnimations: boolean;
    buttonScale: number;
    hoverTransform: string;
    transitionDuration: string;
  };
  desktop: {
    enableAnimations: boolean;
    buttonScale: number;
    hoverTransform: string;
    transitionDuration: string;
  };
}

/**
 * Génère les variantes responsive selon l'univers émotionnel
 */
export const getResponsiveEmotions = (
  shopType: ShopType
): ResponsiveEmotions => {
  const tokens = getUniverseTokens(shopType);

  // 🍺 BREWERY - Robuste sur tous les écrans
  if (tokens.emotions.personality === "authentic") {
    return {
      mobile: {
        enableAnimations: false, // ✅ Robustesse = pas d'animations
        buttonScale: 0.98, // ✅ Click ferme même mobile
        hoverTransform: "none", // ✅ Pas de mouvement
        transitionDuration: "0.1s", // ✅ Immédiat
      },
      tablet: {
        enableAnimations: false, // ✅ Cohérence
        buttonScale: 0.97, // ✅ Légèrement plus marqué
        hoverTransform: "none", // ✅ Solidité constante
        transitionDuration: "0.1s",
      },
      desktop: {
        enableAnimations: false, // ✅ Pas d'effets sophistiqués
        buttonScale: 0.96, // ✅ Pleine expression robuste
        hoverTransform: "none", // ✅ Statique
        transitionDuration: "0.1s",
      },
    };
  }

  // 🍵 TEASHOP - Zen adaptatif
  if (tokens.emotions.personality === "serene") {
    return {
      mobile: {
        enableAnimations: false, // ✅ Simplicité mobile
        buttonScale: 1.01, // ✅ Expansion douce minimale
        hoverTransform: "none", // ✅ Pas de lévitation mobile
        transitionDuration: "0.3s", // ✅ Plus rapide
      },
      tablet: {
        enableAnimations: true, // ✅ Réintroduction progressive
        buttonScale: 1.015, // ✅ Plus d'expression
        hoverTransform: "translateY(-2px)", // ✅ Lévitation modérée
        transitionDuration: "0.4s", // ✅ Plus fluide
      },
      desktop: {
        enableAnimations: true, // ✅ Pleine expressivité zen
        buttonScale: 1.02, // ✅ Expansion complète
        hoverTransform: "translateY(-8px)", // ✅ Lévitation zen maximale
        transitionDuration: "0.6s", // ✅ Très fluide
      },
    };
  }

  // 💄 BEAUTY - Sophistication progressive
  if (tokens.emotions.personality === "sophisticated") {
    return {
      mobile: {
        enableAnimations: false, // ✅ Performances mobile
        buttonScale: 1.005, // ✅ Micro-expansion
        hoverTransform: "none", // ✅ Pas de double effet
        transitionDuration: "0.2s", // ✅ Rapide et précis
      },
      tablet: {
        enableAnimations: true, // ✅ Sophistication émergente
        buttonScale: 1.01, // ✅ Plus de raffinement
        hoverTransform: "translateY(-1px)", // ✅ Mouvement subtil
        transitionDuration: "0.25s", // ✅ Précision temporelle
      },
      desktop: {
        enableAnimations: true, // ✅ Sophistication complète
        buttonScale: 1.01, // ✅ Micro-expansion sophistiquée
        hoverTransform: "translateY(-2px) scale(1.02)", // ✅ Double effet raffiné
        transitionDuration: "0.35s", // ✅ Sophistication temporelle
      },
    };
  }

  // 🌿 HERB - Naturel constant
  if (tokens.emotions.personality === "sincere") {
    return {
      mobile: {
        enableAnimations: false, // ✅ Simplicité naturelle
        buttonScale: 1.02, // ✅ Scale naturel même mobile
        hoverTransform: "none", // ✅ Pas de mouvement
        transitionDuration: "0.15s", // ✅ Direct
      },
      tablet: {
        enableAnimations: true, // ✅ Naturalité progressive
        buttonScale: 1.03, // ✅ Expansion naturelle
        hoverTransform: "scale(1.02)", // ✅ Scale simple
        transitionDuration: "0.2s", // ✅ Rythme naturel
      },
      desktop: {
        enableAnimations: true, // ✅ Pleine naturalité
        buttonScale: 1.03, // ✅ Expansion naturelle complète
        hoverTransform: "scale(1.05)", // ✅ Scale organique
        transitionDuration: "0.25s", // ✅ Naturel complet
      },
    };
  }

  // Fallback
  return {
    mobile: {
      enableAnimations: false,
      buttonScale: 1,
      hoverTransform: "none",
      transitionDuration: "0.2s",
    },
    tablet: {
      enableAnimations: true,
      buttonScale: 1.01,
      hoverTransform: "translateY(-1px)",
      transitionDuration: "0.3s",
    },
    desktop: {
      enableAnimations: true,
      buttonScale: 1.02,
      hoverTransform: "translateY(-2px)",
      transitionDuration: "0.3s",
    },
  };
};

/**
 * Breakpoints Chakra UI standard
 */
export const responsiveBreakpoints = {
  mobile: { base: true, md: false },
  tablet: { base: false, md: true, lg: false },
  desktop: { base: false, md: false, lg: true },
};

/**
 * Helper pour obtenir les props responsive selon device
 */
export const getResponsiveProps = (
  shopType: ShopType,
  device: "mobile" | "tablet" | "desktop"
) => {
  const emotions = getResponsiveEmotions(shopType);
  return emotions[device];
};
