import { keyframes } from "@emotion/react";
import { type ShopType } from "../universeTokens";

/**
 * 🎬 ANIMATIONS SIGNATURE PAR UNIVERS
 *
 * Animations complexes qui renforcent l'identité émotionnelle :
 * - 🍺 Brewery : Vibrations industrielles et effets robustes
 * - 🍵 TeaShop : Ondulations zen et respirations méditatives
 * - 💄 Beauty : Brillances premium et transformations sophistiquées
 * - 🌿 Herb : Pulsations organiques et croissances naturelles
 */

// ===== ANIMATIONS BREWERY - CRAFT AUTHENTIQUE =====

const breweryShake = keyframes`
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-2px); }
  20% { transform: translateX(2px); }
  30% { transform: translateX(-1px); }
  40% { transform: translateX(1px); }
  50% { transform: translateX(0); }
`;

const breweryStamp = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(0.95) rotate(-1deg); opacity: 0.8; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const breweryIndustrial = keyframes`
  0% { box-shadow: 0 2px 4px rgba(212, 148, 15, 0.1); }
  50% { box-shadow: 0 4px 8px rgba(212, 148, 15, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
  100% { box-shadow: 0 2px 4px rgba(212, 148, 15, 0.1); }
`;

// ===== ANIMATIONS TEASHOP - ZEN WELLNESS =====

const teaRipple = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const teaFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(0.5deg); }
  50% { transform: translateY(-12px) rotate(0deg); }
  75% { transform: translateY(-6px) rotate(-0.5deg); }
`;

const teaBreathe = keyframes`
  0%, 100% { transform: scale(1) opacity(1); }
  50% { transform: scale(1.05) opacity(0.9); }
`;

const teaBloom = keyframes`
  0% { transform: scale(0.8) rotate(-5deg); opacity: 0.6; }
  50% { transform: scale(1.1) rotate(2deg); opacity: 0.9; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

// ===== ANIMATIONS BEAUTY - LUXE PREMIUM =====

const beautyShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const beautyElegant = keyframes`
  0% { transform: translateY(0) scale(1); box-shadow: 0 4px 12px rgba(232, 101, 101, 0.1); }
  50% { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 24px rgba(232, 101, 101, 0.25); }
  100% { transform: translateY(0) scale(1); box-shadow: 0 4px 12px rgba(232, 101, 101, 0.1); }
`;

const beautyGlow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(232, 101, 101, 0.3); }
  50% { box-shadow: 0 0 20px rgba(232, 101, 101, 0.6), 0 0 30px rgba(232, 101, 101, 0.4); }
`;

const beautyTransform = keyframes`
  0% { transform: perspective(400px) rotateY(0deg); }
  100% { transform: perspective(400px) rotateY(360deg); }
`;

// ===== ANIMATIONS HERB - BIO AUTHENTIQUE =====

const herbGrow = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.02) rotate(0.5deg); }
  50% { transform: scale(1.05) rotate(0deg); }
  75% { transform: scale(1.03) rotate(-0.5deg); }
  100% { transform: scale(1.05) rotate(0deg); }
`;

const herbPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.03); }
`;

const herbSway = keyframes`
  0%, 100% { transform: rotate(0deg) translateX(0); }
  25% { transform: rotate(1deg) translateX(1px); }
  50% { transform: rotate(0deg) translateX(0); }
  75% { transform: rotate(-1deg) translateX(-1px); }
`;

const herbBloom = keyframes`
  0% { 
    transform: scale(0.95) rotate(-2deg);
    filter: hue-rotate(0deg) brightness(1);
  }
  50% { 
    transform: scale(1.05) rotate(1deg);
    filter: hue-rotate(10deg) brightness(1.1);
  }
  100% { 
    transform: scale(1) rotate(0deg);
    filter: hue-rotate(0deg) brightness(1);
  }
`;

/**
 * Configuration des animations par univers
 */
export interface UniverseAnimations {
  // Animations principales
  signature: {
    name: string;
    duration: string;
    timing: string;
    iteration: string;
  };

  // Animations d'interaction
  interactions: {
    hover: {
      animation: string;
      duration: string;
    };
    click: {
      animation: string;
      duration: string;
    };
    focus: {
      animation: string;
      duration: string;
    };
  };

  // Animations d'entrée
  entrance: {
    animation: string;
    duration: string;
    delay?: string;
  };

  // Effet de fond/ambiance
  ambient: {
    animation: string;
    duration: string;
    iteration: string;
  };
}

/**
 * Générateur d'animations par shopType
 */
export const getUniverseAnimations = (
  shopType: ShopType
): UniverseAnimations => {
  switch (shopType) {
    case "brewery":
      return {
        signature: {
          name: breweryIndustrial,
          duration: "2s",
          timing: "ease-in-out",
          iteration: "infinite",
        },
        interactions: {
          hover: {
            animation: `${breweryShake} 0.5s ease-in-out`,
            duration: "0.5s",
          },
          click: {
            animation: `${breweryStamp} 0.3s ease-out`,
            duration: "0.3s",
          },
          focus: {
            animation: `${breweryIndustrial} 1s ease-in-out`,
            duration: "1s",
          },
        },
        entrance: {
          animation: `${breweryStamp} 0.6s ease-out`,
          duration: "0.6s",
          delay: "0.1s",
        },
        ambient: {
          animation: breweryIndustrial,
          duration: "4s",
          iteration: "infinite",
        },
      };

    case "teaShop":
      return {
        signature: {
          name: teaFloat,
          duration: "6s",
          timing: "ease-in-out",
          iteration: "infinite",
        },
        interactions: {
          hover: {
            animation: `${teaBreathe} 2s ease-in-out infinite`,
            duration: "2s",
          },
          click: {
            animation: `${teaRipple} 0.8s ease-out`,
            duration: "0.8s",
          },
          focus: {
            animation: `${teaBloom} 1s ease-out`,
            duration: "1s",
          },
        },
        entrance: {
          animation: `${teaBloom} 1.2s ease-out`,
          duration: "1.2s",
          delay: "0.2s",
        },
        ambient: {
          animation: teaFloat,
          duration: "8s",
          iteration: "infinite",
        },
      };

    case "beautyShop":
      return {
        signature: {
          name: beautyElegant,
          duration: "3s",
          timing: "cubic-bezier(0.4, 0, 0.2, 1)",
          iteration: "infinite",
        },
        interactions: {
          hover: {
            animation: `${beautyGlow} 0.8s ease-in-out`,
            duration: "0.8s",
          },
          click: {
            animation: `${beautyTransform} 0.6s ease-in-out`,
            duration: "0.6s",
          },
          focus: {
            animation: `${beautyShimmer} 1.5s linear infinite`,
            duration: "1.5s",
          },
        },
        entrance: {
          animation: `${beautyElegant} 1s cubic-bezier(0.4, 0, 0.2, 1)`,
          duration: "1s",
          delay: "0.15s",
        },
        ambient: {
          animation: beautyShimmer,
          duration: "3s",
          iteration: "infinite",
        },
      };

    case "herbShop":
      return {
        signature: {
          name: herbGrow,
          duration: "4s",
          timing: "ease-in-out",
          iteration: "infinite",
        },
        interactions: {
          hover: {
            animation: `${herbSway} 2s ease-in-out infinite`,
            duration: "2s",
          },
          click: {
            animation: `${herbPulse} 0.5s ease-out`,
            duration: "0.5s",
          },
          focus: {
            animation: `${herbBloom} 1.2s ease-out`,
            duration: "1.2s",
          },
        },
        entrance: {
          animation: `${herbGrow} 1.5s ease-out`,
          duration: "1.5s",
          delay: "0.1s",
        },
        ambient: {
          animation: herbSway,
          duration: "6s",
          iteration: "infinite",
        },
      };

    default: {
      // Fallback neutre
      return {
        signature: { name: "", duration: "0s", timing: "ease", iteration: "1" },
        interactions: {
          hover: { animation: "", duration: "0s" },
          click: { animation: "", duration: "0s" },
          focus: { animation: "", duration: "0s" },
        },
        entrance: { animation: "", duration: "0s" },
        ambient: { animation: "", duration: "0s", iteration: "1" },
      };
    }
  }
};

/**
 * Helper pour appliquer facilement les animations
 */
export const getAnimationProps = (
  shopType: ShopType,
  type: "signature" | "hover" | "click" | "focus" | "entrance" | "ambient"
) => {
  const animations = getUniverseAnimations(shopType);

  switch (type) {
    case "signature":
      return {
        style: {
          animation: `${animations.signature.name} ${animations.signature.duration} ${animations.signature.timing} ${animations.signature.iteration}`,
        },
      };
    case "entrance":
      return {
        style: {
          animation: animations.entrance.animation,
          animationDelay: animations.entrance.delay || "0s",
        },
      };
    case "ambient":
      return {
        style: {
          animation: `${animations.ambient.animation} ${animations.ambient.duration} ease-in-out ${animations.ambient.iteration}`,
        },
      };
    default: {
      const interaction =
        animations.interactions[type as keyof typeof animations.interactions];
      return {
        style: {
          animation: interaction?.animation || "",
        },
      };
    }
  }
};
