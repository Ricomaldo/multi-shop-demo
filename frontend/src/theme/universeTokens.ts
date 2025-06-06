// Type direct depuis la base de données - plus de mapping inutile !
import type { ShopType } from "../../../shared/types";

export type { ShopType };

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

  // 🆕 MICRO-INTERACTIONS DIFFÉRENCIÉES PAR UNIVERS
  microInteractions: {
    buttonClick: {
      scale: number;
      duration: number;
      easing?: string;
    };
    cardHover: {
      transform: string;
      transition: string;
      shadow?: string;
    };
    inputFocus: {
      borderColor: string;
      boxShadow: string;
      transition: string;
    };
    linkHover: {
      transform: string;
      color: string;
      transition: string;
    };
  };

  // 🆕 ÉMOTIONS ET PERSONNALITÉ PAR UNIVERS
  emotions: {
    texture: "rough" | "smooth" | "refined" | "organic";
    rhythm: "steady" | "slow" | "precise" | "natural";
    personality: "authentic" | "serene" | "sophisticated" | "sincere";
    energy: "robust" | "calm" | "dynamic" | "grounded";
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

  // Variantes par composant - MAGNIFIÉES pour différenciation réelle
  variants: {
    layout: "industrial" | "zen" | "luxe" | "organic"; // PERSONNALITÉS DISTINCTES
    header: "bold-hero" | "minimal-nav" | "gradient-full" | "natural-simple"; // VRAIES DIFFÉRENCES
    badge: "rectangular" | "pill" | "diamond" | "leaf"; // FORMES UNIQUES
    selector: "robust" | "floating" | "glass" | "bark"; // MATÉRIAUX DIFFÉRENTS
  };

  // 🆕 SIGNATURES VISUELLES UNIQUES
  signature: {
    bgPattern: string;
    visualElement: string;
    description: string;
    transformOrigin?: string;
  };
}

// Factory des tokens par shopType DIRECT - plus de mapping !
export function getUniverseTokens(shopType: ShopType): UniverseTokens {
  const baseTokens: Omit<
    UniverseTokens,
    "colors" | "meta" | "variants" | "signature"
  > = {
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
    // 🆕 BASE MICRO-INTERACTIONS
    microInteractions: {
      buttonClick: {
        scale: 0.98,
        duration: 0.15,
        easing: "ease-out",
      },
      cardHover: {
        transform: "translateY(-2px)",
        transition: "all 0.3s ease",
        shadow: "md",
      },
      inputFocus: {
        borderColor: "blue.400",
        boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
        transition: "all 0.2s ease",
      },
      linkHover: {
        transform: "translateX(2px)",
        color: "blue.600",
        transition: "all 0.2s ease",
      },
    },
    // 🆕 BASE EMOTIONS
    emotions: {
      texture: "smooth",
      rhythm: "steady",
      personality: "authentic",
      energy: "calm",
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
          layout: "industrial",
          header: "bold-hero",
          badge: "rectangular",
          selector: "robust",
        },
        borderRadius: {
          base: "0px", // ✅ Angles marqués - industriel craft
          md: "0px", // ✅ Pas de courbes
          lg: "2px", // ✅ Minimal
          xl: "4px", // ✅ Robustesse assumée
        },
        spacing: {
          component: { base: "6", md: "8" }, // ✅ Généreux pour respirer
          section: { base: "8", md: "12" }, // ✅ Espacements authentiques
          card: { base: "6", md: "8" },
        },
        typography: {
          ...baseTokens.typography,
          fontFamily: {
            heading: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif", // ✅ Sans-serif robuste
            body: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif", // ✅ Système robuste
          },
          fontWeight: {
            normal: "500", // ✅ Plus lourd que normal
            bold: "700", // ✅ Fort contraste
            heavy: "800", // ✅ Typographie robuste
          },
          lineHeight: {
            normal: "1.4", // ✅ Plus compact - industriel
            tight: "1.2",
            relaxed: "1.6",
          },
        },
        animations: {
          ...baseTokens.animations,
          enableOnMobile: false, // ✅ Solidité perçue
          transition: "all 0.1s ease", // ✅ Rapide et net
          hover: {
            transform: { base: "none", md: "none" }, // ✅ Pas d'effets sophistiqués
            transition: "all 0.1s ease", // ✅ Réactivité directe
          },
        },
        // 🍺 MICRO-INTERACTIONS BREWERY - AUTHENTIQUE ROBUSTE
        microInteractions: {
          buttonClick: {
            scale: 0.96, // ✅ Click ferme et solide
            duration: 0.1, // ✅ Très rapide - pas de chichi
            easing: "ease-out",
          },
          cardHover: {
            transform: "none", // ✅ Pas de mouvement - solidité
            transition: "box-shadow 0.15s ease", // ✅ Plus rapide
            shadow: "lg", // ✅ Ombre marquée
          },
          inputFocus: {
            borderColor: "#d4940f", // ✅ Orange brewery franc
            boxShadow: "0 0 0 2px rgba(212, 148, 15, 0.3)", // ✅ Plus marqué
            transition: "all 0.1s ease", // ✅ Immédiat
          },
          linkHover: {
            transform: "none", // ✅ Pas de mouvement
            color: "#b8820a", // ✅ Orange plus foncé
            transition: "color 0.1s ease", // ✅ Direct
          },
        },
        // 🍺 ÉMOTIONS BREWERY - CRAFT AUTHENTIQUE
        emotions: {
          texture: "rough", // ✅ Texture rugueuse artisanale
          rhythm: "steady", // ✅ Rythme constant et fiable
          personality: "authentic", // ✅ Personnalité authentique
          energy: "robust", // ✅ Énergie robuste et solide
        },
        imagePaths: {
          hero: "/images/store/brewery-hero.webp",
          background: "/images/store/brewery-bg.jpg",
          placeholder: "/images/store/brewery-placeholder.jpg",
        },
        signature: {
          bgPattern:
            "radial-gradient(circle at 30% 30%, rgba(90,166,90,0.1) 0%, transparent 50%)",
          visualElement: "◯ ◯ ◯",
          description: "Lévitation zen • Compression douce • Sérénité",
          transformOrigin: "center bottom",
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
          header: "minimal-nav",
          badge: "pill",
          selector: "floating",
        },
        borderRadius: {
          base: "12px", // ✅ Courbes douces zen
          md: "16px", // ✅ Généreux
          lg: "20px", // ✅ Très doux
          xl: "24px", // ✅ Maximum de douceur
        },
        spacing: {
          component: { base: "4", md: "6" }, // ✅ Aéré - zen
          section: { base: "8", md: "12" }, // ✅ Spacieux créant respiration
          card: { base: "6", md: "8" }, // ✅ Zones de respiration
        },
        typography: {
          ...baseTokens.typography,
          fontFamily: {
            heading: "'Crimson Text', 'Georgia', serif", // ✨ SERIF AUTHENTIQUE ZEN
            body: "'Source Sans Pro', system-ui, sans-serif", // ✨ LISIBILITÉ ZEN
          },
          fontWeight: {
            normal: "300", // ✅ Plus fin - douceur zen
            bold: "400", // ✅ Moins agressif - sérénité
            heavy: "500", // ✅ Raffinement
          },
          lineHeight: {
            normal: "1.7", // ✅ Aéré - respiration
            tight: "1.4",
            relaxed: "1.9", // ✅ Très détendu
          },
        },
        animations: {
          ...baseTokens.animations,
          enableOnMobile: false, // ✅ Simplifié sur mobile
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // ✅ Fluide zen
          hover: {
            transform: { base: "none", md: "translateY(-3px)" }, // ✅ Lévitation douce
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // ✅ Transitions fluides
          },
        },
        // 🍵 MICRO-INTERACTIONS TEASHOP - ZEN FLUIDE
        microInteractions: {
          buttonClick: {
            scale: 0.95, // ✨ COMPRESSION ZEN (effet unique inversé)
            duration: 0.6, // ✨ LENT ET MÉDITATIF
            easing: "cubic-bezier(0.23, 1, 0.32, 1)", // ✨ ULTRA FLUIDE
          },
          cardHover: {
            transform: "translateY(-12px) rotateX(2deg)", // ✨ LÉVITATION + ROTATION 3D UNIQUE
            transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)", // ✨ ULTRA FLUIDE
            shadow: "0 25px 50px rgba(90, 166, 90, 0.3)", // ✨ OMBRE ZEN PROFONDE
          },
          inputFocus: {
            borderColor: "#5aa65a",
            boxShadow:
              "0 0 0 4px rgba(90, 166, 90, 0.15), 0 8px 25px rgba(90, 166, 90, 0.2)", // ✨ PLUS PROFOND
            transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          },
          linkHover: {
            transform: "translateY(-1px)", // ✅ Mouvement subtil
            color: "#4d8f4d", // ✅ Vert plus profond
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // ✅ Fluide
          },
        },
        // 🍵 ÉMOTIONS TEASHOP - ZEN WELLNESS
        emotions: {
          texture: "smooth", // ✅ Texture lisse et apaisante
          rhythm: "slow", // ✅ Rythme lent et méditatif
          personality: "serene", // ✅ Personnalité sereine
          energy: "calm", // ✅ Énergie calme et paisible
        },
        imagePaths: {
          hero: "/images/store/tea-hero.webp",
          background: "/images/store/teashop-bg.jpg",
          placeholder: "/images/store/teashop-placeholder.jpg",
        },
        signature: {
          bgPattern:
            "radial-gradient(circle at 30% 30%, rgba(90,166,90,0.1) 0%, transparent 50%)",
          visualElement: "◯ ◯ ◯",
          description: "Lévitation zen • Compression douce • Sérénité",
          transformOrigin: "center bottom",
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
          layout: "luxe",
          header: "gradient-full",
          badge: "diamond",
          selector: "glass",
        },
        borderRadius: {
          base: "8px", // ✅ Équilibré - premium
          md: "12px", // ✅ Sophistication
          lg: "16px", // ✅ Finitions soignées
          xl: "20px", // ✅ Élégance contemporaine
        },
        spacing: {
          component: { base: "5", md: "7" }, // ✅ Précis - sophistiqué
          section: { base: "7", md: "10" }, // ✅ Sophistication parisienne
          card: { base: "5", md: "7" }, // ✅ Attention aux détails
        },
        typography: {
          ...baseTokens.typography,
          fontFamily: {
            heading: "'Playfair Display', serif", // ✨ LUXE PARISIEN
            body: "'Inter', -apple-system, system-ui, sans-serif", // ✨ MODERNITÉ PREMIUM
          },
          fontWeight: {
            normal: "300", // ✨ FINESSE PREMIUM
            bold: "500", // ✨ SOPHISTICATION MESURÉE
            heavy: "600", // ✨ ÉLÉGANCE
          },
          lineHeight: {
            normal: "1.5", // ✅ Équilibré et précis
            tight: "1.3", // ✅ Serré pour élégance
            relaxed: "1.7", // ✅ Sophistication aérée
          },
        },
        animations: {
          ...baseTokens.animations,
          enableOnMobile: false, // ✅ Simplifié sur mobile
          transition: "all 0.3s ease", // ✅ Précision temporelle
          hover: {
            transform: { base: "none", md: "translateY(-1px) scale(1.02)" }, // ✅ Micro-interactions subtiles
            transition: "all 0.3s ease", // ✅ Effets raffinés
          },
        },
        // 💄 MICRO-INTERACTIONS BEAUTY - SOPHISTIQUÉ PRÉCIS
        microInteractions: {
          buttonClick: {
            scale: 1.02, // ✨ EXPANSION PREMIUM
            duration: 0.15,
            easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)", // ✨ BOUNCE SOPHISTIQUÉ
          },
          cardHover: {
            transform: "scale(1.08) translateZ(0)", // ✨ EXPANSION PREMIUM + GPU
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // ✨ BACK EASING LUXE
            shadow: "0 30px 60px rgba(232, 101, 101, 0.25)", // ✨ OMBRE PREMIUM PROFONDE
          },
          inputFocus: {
            borderColor: "#e86565",
            boxShadow:
              "0 0 0 3px rgba(232, 101, 101, 0.12), 0 8px 25px rgba(232, 101, 101, 0.2)", // ✨ LUXE MULTICOUCHE
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          },
          linkHover: {
            transform: "translateY(-1px)", // ✅ Mouvement précis
            color: "#d94c4c", // ✅ Rose plus intense
            transition: "all 0.25s ease", // ✅ Sophistication
          },
        },
        // 💄 ÉMOTIONS BEAUTY - LUXE PREMIUM
        emotions: {
          texture: "refined", // ✅ Texture raffinée et précieuse
          rhythm: "precise", // ✅ Rythme précis et maîtrisé
          personality: "sophisticated", // ✅ Personnalité sophistiquée
          energy: "dynamic", // ✅ Énergie dynamique et moderne
        },
        imagePaths: {
          hero: "/images/store/beauty-hero.webp",
          background: "/images/store/beauty-bg.jpg",
          placeholder: "/images/store/beauty-placeholder.jpg",
        },
        signature: {
          bgPattern:
            "linear-gradient(135deg, rgba(232,101,101,0.05) 0%, rgba(255,255,255,0.8) 100%)",
          visualElement: "◆ ◇ ◆",
          description: "Expansion luxe • Brightness • Sophistication",
          transformOrigin: "center",
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
          layout: "organic",
          header: "natural-simple",
          badge: "leaf",
          selector: "bark",
        },
        borderRadius: {
          base: "6px", // ✅ Organique - naturel
          md: "10px", // ✅ Formes organiques variables
          lg: "14px", // ✅ Connexion à la terre
          xl: "18px", // ✅ Naturel brut
        },
        spacing: {
          component: { base: "4", md: "6" }, // ✅ Naturel - simple
          section: { base: "6", md: "9" }, // ✅ Simplicité directe
          card: { base: "4", md: "6" }, // ✅ Sincérité matières premières
        },
        typography: {
          ...baseTokens.typography,
          fontFamily: {
            heading: "'Merriweather', serif", // ✨ NATUREL ORGANIQUE
            body: "'Open Sans', system-ui, sans-serif", // ✨ LISIBILITÉ TERRE
          },
          fontWeight: {
            normal: "400",
            bold: "600", // ✨ PLUS MARQUÉ - NATUREL ASSUMÉ
            heavy: "700", // ✨ FORCE NATURELLE
          },
          lineHeight: {
            normal: "1.6", // ✅ Naturel et respirant
            tight: "1.3",
            relaxed: "1.8", // ✅ Détente naturelle
          },
        },
        animations: {
          ...baseTokens.animations,
          enableOnMobile: false, // ✅ Pas d'animations complexes
          transition: "all 0.2s ease-out", // ✅ Simple et direct
          hover: {
            transform: { base: "none", md: "scale(1.05)" }, // ✅ Simple scale naturel
            transition: "all 0.2s ease-out", // ✅ Interactions directes
          },
        },
        // 🌿 MICRO-INTERACTIONS HERB - NATUREL SINCÈRE
        microInteractions: {
          buttonClick: {
            scale: 1.1, // ✨ EXPANSION NATURELLE FORTE (unique)
            duration: 0.2,
            easing: "ease-out",
          },
          cardHover: {
            transform: "rotate(1deg) scale(1.05)", // ✨ ROTATION ORGANIQUE UNIQUE
            transition: "all 0.3s ease-out",
            shadow: "0 15px 35px rgba(102, 159, 127, 0.4)", // ✨ OMBRE TERRE PROFONDE
          },
          inputFocus: {
            borderColor: "#669f7f",
            boxShadow:
              "0 0 0 3px rgba(102, 159, 127, 0.3), 0 5px 15px rgba(102, 159, 127, 0.2)", // ✨ EFFET TERRE
            transition: "all 0.25s ease-out",
          },
          linkHover: {
            transform: "scale(1.05)", // ✅ Scale simple
            color: "#558669", // ✅ Vert plus profond
            transition: "all 0.2s ease-out", // ✅ Direct
          },
        },
        // 🌿 ÉMOTIONS HERB - BIO AUTHENTIQUE
        emotions: {
          texture: "organic", // ✅ Texture organique et naturelle
          rhythm: "natural", // ✅ Rythme naturel et fluide
          personality: "sincere", // ✅ Personnalité sincère et honnête
          energy: "grounded", // ✅ Énergie ancrée et stable
        },
        imagePaths: {
          hero: "/images/store/herb-hero.webp",
          background: "/images/store/herb-bg.jpg",
          placeholder: "/images/store/herb-placeholder.jpg",
        },
        signature: {
          bgPattern:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(102,159,127,0.05) 10px, rgba(102,159,127,0.05) 20px)",
          visualElement: "🌱 🍃 🌿",
          description: "Rotation organique • Force naturelle • Authenticité",
          transformOrigin: "center",
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
