// Type direct depuis la base de données - plus de mapping inutile !
export type ShopType = "brewery" | "teaShop" | "beautyShop" | "herbShop";

// Couleurs intégrées directement (depuis universeColors.ts)
const shopColors = {
  // Brewery - "Craft Authentique" - Ambrés robustes + accents cuivre
  brewery: {
    50: "#fdf6e3",
    100: "#f9e6b8",
    200: "#f4d48a",
    300: "#efc05c",
    400: "#ebb03a",
    500: "#e6a419", // Principal - Ambre authentique
    600: "#d4940f",
    700: "#b8820a",
    800: "#9c6f06",
    900: "#7a5602",
  },

  // TeaShop - "Zen Wellness" - Verts jade apaisants + nuances subtiles
  teaShop: {
    50: "#f0f9f0",
    100: "#d4edd4",
    200: "#b7dfb7",
    300: "#98d098",
    400: "#7ec47e",
    500: "#66b866", // Principal - Jade zen
    600: "#5aa65a",
    700: "#4d8f4d",
    800: "#407840",
    900: "#2f5a2f",
  },

  // Beauty - "Luxe Premium" - Rose-corail sophistiqué + touches dorées
  beautyShop: {
    50: "#fef7f7",
    100: "#fde8e8",
    200: "#fbd4d4",
    300: "#f8b8b8",
    400: "#f59a9a",
    500: "#f27c7c", // Principal - Corail premium
    600: "#e86565",
    700: "#d94c4c",
    800: "#c93434",
    900: "#b01e1e",
  },

  // Herb - "Bio Authentique" - Verts forestiers profonds + terre
  herbShop: {
    50: "#f2f8f5",
    100: "#dcede4",
    200: "#c4e0d1",
    300: "#a8d1bb",
    400: "#8fc4a7",
    500: "#77b894", // Principal - Forêt authentique
    600: "#669f7f",
    700: "#558669",
    800: "#446d54",
    900: "#335340",
  },
};

// Configuration centralisée des tokens visuels par shopType (plus d'univers !)
export interface UniverseTokens {
  // Propriétés border radius
  borderRadius: {
    base: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Espacements spécifiques avec responsive simple
  spacing: {
    component: { base: string; md: string };
    section: { base: string; md: string };
    card: { base: string; md: string };
  };

  // Hauteurs standardisées responsive
  heights: {
    button: { base: string; md: string };
    input: { base: string; md: string };
    card: string;
    touchTarget: string; // 44px minimum pour mobile
  };

  // Chemins d'images spécifiques
  imagePaths: {
    hero: string;
    background: string;
    placeholder: string;
  };

  // Typography avec responsive
  typography: {
    fontFamily: {
      heading: string;
      body: string;
    };
    fontSize: {
      navigation: { base: string; md: string };
      button: { base: string; md: string };
      card: { base: string; md: string };
      hero: { base: string; md: string };
    };
    fontWeight: {
      normal: string;
      bold: string;
      heavy: string;
    };
    lineHeight: {
      normal: string;
      tight: string;
      relaxed: string;
    };
  };

  // Animations avec contrôle mobile
  animations: {
    transition: string;
    enableOnMobile: boolean;
    hover: {
      transform: { base: string; md: string };
      transition: string;
    };
  };

  // Couleurs complètes intégrées
  colors: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };

  // Métadonnées d'affichage
  meta: {
    displayName: string;
    icon: string;
    colorScheme: string;
    description: string;
  };

  // Variantes par composant
  variants: {
    layout: "compact" | "zen" | "elegant" | "natural";
    header: "nav-only" | "hero" | "full" | "simple";
    badge: "compact" | "full" | "minimal";
    selector: "compact" | "full" | "minimal";
  };
}

// Factory des tokens par shopType DIRECT - plus de mapping !
export function getUniverseTokens(shopType: ShopType): UniverseTokens {
  const baseTokens: Omit<UniverseTokens, "colors" | "meta" | "variants"> = {
    borderRadius: {
      base: "4px",
      md: "8px",
      lg: "12px",
      xl: "16px",
    },
    spacing: {
      component: { base: "4", md: "6" },
      section: { base: "6", md: "8" },
      card: { base: "4", md: "6" },
    },
    heights: {
      button: { base: "44px", md: "48px" },
      input: { base: "44px", md: "48px" },
      card: "300px",
      touchTarget: "44px",
    },
    imagePaths: {
      hero: "/images/store/default-hero.jpg",
      background: "/images/store/default-bg.jpg",
      placeholder: "/images/store/placeholder.jpg",
    },
    typography: {
      fontFamily: {
        heading: "Inter, sans-serif",
        body: "Inter, sans-serif",
      },
      fontSize: {
        navigation: { base: "sm", md: "md" },
        button: { base: "sm", md: "md" },
        card: { base: "sm", md: "md" },
        hero: { base: "2xl", md: "4xl" },
      },
      fontWeight: {
        normal: "400",
        bold: "600",
        heavy: "700",
      },
      lineHeight: {
        normal: "1.5",
        tight: "1.2",
        relaxed: "1.8",
      },
    },
    animations: {
      transition: "all 0.2s ease",
      enableOnMobile: false,
      hover: {
        transform: { base: "none", md: "translateY(-2px)" },
        transition: "all 0.3s ease",
      },
    },
  };

  // Customisation par shopType DIRECT
  switch (shopType) {
    case "brewery":
      return {
        ...baseTokens,
        colors: shopColors.brewery,
        meta: {
          displayName: "Houblon & Tradition",
          icon: "🍺",
          colorScheme: "orange",
          description: "Brasserie artisanale authentique",
        },
        variants: {
          layout: "compact",
          header: "hero",
          badge: "full",
          selector: "compact",
        },
        borderRadius: {
          base: "0px", // Angular - industriel
          md: "2px",
          lg: "4px",
          xl: "6px",
        },
        spacing: {
          component: { base: "6", md: "8" }, // Plus d'espace - robuste
          section: { base: "8", md: "12" },
          card: { base: "6", md: "8" },
        },
        typography: {
          ...baseTokens.typography,
          fontFamily: {
            heading: "Inter, sans-serif",
            body: "Inter, sans-serif",
          },
          fontWeight: {
            normal: "500",
            bold: "700",
            heavy: "800", // Plus lourd
          },
        },
        animations: {
          ...baseTokens.animations,
          enableOnMobile: false, // Pas d'animations - solidité
          hover: {
            transform: { base: "none", md: "none" }, // Statique
            transition: "all 0.1s ease",
          },
        },
        imagePaths: {
          hero: "/images/store/brewery-hero.jpg",
          background: "/images/store/brewery-bg.jpg",
          placeholder: "/images/store/brewery-placeholder.jpg",
        },
      };

    case "teaShop":
      return {
        ...baseTokens,
        colors: shopColors.teaShop,
        meta: {
          displayName: "Les Jardins de Darjeeling",
          icon: "🍵",
          colorScheme: "green",
          description: "Salon de thé zen et raffinement",
        },
        variants: {
          layout: "zen",
          header: "simple",
          badge: "minimal",
          selector: "full",
        },
        borderRadius: {
          base: "12px", // Courbes zen
          md: "16px",
          lg: "20px",
          xl: "24px",
        },
        spacing: {
          component: { base: "4", md: "6" }, // Aéré - zen
          section: { base: "8", md: "12" },
          card: { base: "6", md: "8" },
        },
        typography: {
          ...baseTokens.typography,
          fontFamily: {
            heading: "Georgia, serif", // Élégant
            body: "Inter, sans-serif",
          },
          fontWeight: {
            normal: "300", // Plus fin
            bold: "500",
            heavy: "600",
          },
        },
        animations: {
          ...baseTokens.animations,
          enableOnMobile: false, // Simplifié sur mobile
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Fluide
          hover: {
            transform: { base: "none", md: "translateY(-3px)" },
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
        imagePaths: {
          hero: "/images/store/teashop-hero.jpg",
          background: "/images/store/teashop-bg.jpg",
          placeholder: "/images/store/teashop-placeholder.jpg",
        },
      };

    case "beautyShop":
      return {
        ...baseTokens,
        colors: shopColors.beautyShop,
        meta: {
          displayName: "L'Écrin de Jade",
          icon: "💄",
          colorScheme: "pink",
          description: "Institut de beauté premium",
        },
        variants: {
          layout: "elegant",
          header: "full",
          badge: "compact",
          selector: "full",
        },
        borderRadius: {
          base: "8px", // Équilibré - premium
          md: "12px",
          lg: "16px",
          xl: "20px",
        },
        spacing: {
          component: { base: "5", md: "7" }, // Précis - sophistiqué
          section: { base: "7", md: "10" },
          card: { base: "5", md: "7" },
        },
        typography: {
          ...baseTokens.typography,
          fontFamily: {
            heading: "Inter, sans-serif", // Moderne
            body: "Inter, sans-serif",
          },
          fontWeight: {
            normal: "400",
            bold: "600",
            heavy: "700",
          },
        },
        animations: {
          ...baseTokens.animations,
          enableOnMobile: false, // Simplifié sur mobile
          transition: "all 0.3s ease",
          hover: {
            transform: { base: "none", md: "translateY(-1px) scale(1.02)" },
            transition: "all 0.3s ease",
          },
        },
        imagePaths: {
          hero: "/images/store/beauty-hero.jpg",
          background: "/images/store/beauty-bg.jpg",
          placeholder: "/images/store/beauty-placeholder.jpg",
        },
      };

    case "herbShop":
      return {
        ...baseTokens,
        colors: shopColors.herbShop,
        meta: {
          displayName: "Herboristerie du Moulin Vert",
          icon: "🌿",
          colorScheme: "green",
          description: "Plantes médicinales bio et naturelles",
        },
        variants: {
          layout: "natural",
          header: "hero",
          badge: "compact",
          selector: "minimal",
        },
        borderRadius: {
          base: "6px", // Organique - naturel
          md: "10px",
          lg: "14px",
          xl: "18px",
        },
        spacing: {
          component: { base: "4", md: "6" }, // Naturel - simple
          section: { base: "6", md: "9" },
          card: { base: "4", md: "6" },
        },
        typography: {
          ...baseTokens.typography,
          fontFamily: {
            heading: "Inter, sans-serif", // Simple
            body: "Inter, sans-serif",
          },
          fontWeight: {
            normal: "400",
            bold: "500", // Plus doux
            heavy: "600",
          },
        },
        animations: {
          ...baseTokens.animations,
          enableOnMobile: false, // Pas d'animations complexes
          transition: "all 0.2s ease-out",
          hover: {
            transform: { base: "none", md: "scale(1.05)" }, // Simple scale
            transition: "all 0.2s ease-out",
          },
        },
        imagePaths: {
          hero: "/images/store/herb-hero.jpg",
          background: "/images/store/herb-bg.jpg",
          placeholder: "/images/store/herb-placeholder.jpg",
        },
      };

    default:
      // Fallback avec brewery
      return getUniverseTokens("brewery");
  }
}

// Fonction utilitaire pour générer les variants Chakra UI avec responsive
export const generateUniverseVariant = (
  shopType: ShopType,
  baseProps: Record<string, string | number> = {}
) => {
  const tokens = getUniverseTokens(shopType);

  return {
    ...baseProps,
    borderRadius: tokens.borderRadius.base,
    p: tokens.spacing.component,
    minH: tokens.heights.touchTarget, // Touch target assuré
    fontFamily: tokens.typography.fontFamily.body,
    fontWeight: tokens.typography.fontWeight.normal,
    fontSize: tokens.typography.fontSize.button,
    colorScheme: tokens.meta.colorScheme,
    transition: tokens.animations.transition,
  };
};

// Fonction pour obtenir les props responsive d'un token
export const getResponsiveTokenValue = (
  tokenValue: { base: string; md: string } | string
) => {
  if (typeof tokenValue === "string") {
    return tokenValue;
  }
  return tokenValue;
};
