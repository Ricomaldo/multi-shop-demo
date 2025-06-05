import { getUniverseTokens, type ShopType } from "../theme/universeTokens";

/**
 * Hook pour accéder aux signatures visuelles uniques de chaque univers
 */
export const useUniverseSignature = (shopType: ShopType) => {
  const tokens = getUniverseTokens(shopType);

  const getSignatureProps = () => ({
    background: tokens.signature.bgPattern,
    position: "relative" as const,
    overflow: "hidden" as const,
    _before: {
      content: `"${tokens.signature.visualElement}"`,
      position: "absolute",
      top: "8px",
      right: "12px",
      fontSize: "xs",
      opacity: 0.6,
      color: tokens.colors[600],
    },
  });

  const getDifferentiatorText = () => {
    switch (shopType) {
      case "brewery":
        return "Aucune animation hover • Angles marqués • Click ferme 0.96";
      case "teaShop":
        return "Compression zen 0.95 • Lévitation 3D • Rotation X 2deg";
      case "beautyShop":
        return "Expansion luxe 1.08 • Brightness +5% • Bounce easing";
      case "herbShop":
        return "Scale forte 1.1 • Rotation organique 1deg • Force naturelle";
    }
  };

  return {
    signature: tokens.signature,
    getSignatureProps,
    getDifferentiatorText,
    tokens,
  };
};
