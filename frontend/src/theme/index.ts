import { extendTheme } from "@chakra-ui/react";
import {
  ProductGrid,
  SharedProductPreviewCard,
  UniverseSection,
  getUniverseVariant,
  storeAnimations,
} from "./components/shared";
import {
  generateUniverseVariant,
  getResponsiveTokenValue,
  getUniverseTokens,
} from "./universeTokens";

const theme = extendTheme({
  colors: {
    // Couleurs par défaut Chakra préservées
    // Les couleurs d'univers sont intégrées via universeTokens.ts
  },
  components: {
    SharedProductPreviewCard,
    ProductGrid,
    UniverseSection,
  },
  // Extension avec les fonctions de tokens centralisées
  tokens: {
    universe: {
      getTokens: getUniverseTokens,
      generateVariant: generateUniverseVariant,
      getResponsiveValue: getResponsiveTokenValue,
      getVariant: getUniverseVariant,
    },
  },
  // Animations par univers
  animations: storeAnimations,
  // Fonts personnalisées par univers
  fonts: {
    heading: "system-ui, -apple-system, sans-serif",
    body: "system-ui, -apple-system, sans-serif",
    // Fonts spécifiques disponibles via tokens
    teaShopHeading: "Georgia, 'Times New Roman', serif",
    beautyShopHeading: "'Inter', system-ui, sans-serif",
  },
  // Styles globaux avec animations
  styles: {
    global: {
      "@keyframes pulse": {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0.5 },
      },
      // Animation smooth pour les transitions d'univers
      "*": {
        transition: "color 0.3s ease, background-color 0.3s ease",
      },
    },
  },
});

// Export theme avec les styles globaux et animations
export default theme;
