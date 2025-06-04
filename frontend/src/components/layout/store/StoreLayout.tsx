import { getUniverseTokens } from "@/theme/universeTokens";
import type { Shop } from "@/types";
import { Box, VStack } from "@chakra-ui/react";
import StoreFooter from "./StoreFooter";

interface StoreLayoutProps {
  /** La boutique courante */
  shop: Shop;
  /** Les sections de la page */
  children: React.ReactNode;
  /** Largeur maximale du contenu principal */
  maxWidth?: string;
  /** Espacement vertical entre les sections principales */
  spacing?: number;
  /** Padding vertical global */
  py?: number;
  /** Variante de mise en page */
  variant?: "compact" | "zen" | "elegant" | "natural";
}

/**
 * Layout standardisé pour toutes les pages vitrine
 *
 * Structure garantie :
 * - Tokens automatiques par shopType (plus besoin UniverseProvider)
 * - Container avec maxWidth responsive
 * - VStack avec spacing standardisé
 * - StoreFooter automatique
 *
 * Usage recommandé :
 * <StoreLayout shop={shop}>
 *   <StoreHeader variant="hero" ... />
 *   <PageContent />
 * </StoreLayout>
 */
export default function StoreLayout({
  shop,
  children,
  maxWidth,
  spacing,
  py,
  variant,
}: StoreLayoutProps) {
  // 🎯 APPLICATION DIRECTE shopType → tokens (plus de mapping !)
  const tokens = getUniverseTokens(shop.shopType);

  // Déterminer la variante selon les tokens ou utiliser celle fournie
  const effectiveVariant: "compact" | "zen" | "elegant" | "natural" =
    variant || tokens.variants.layout;

  // Configuration responsive selon la variante et les tokens
  const getLayoutConfig = () => {
    switch (effectiveVariant) {
      case "compact":
        return {
          maxWidth: "1200px",
          spacing: 6,
          py: 0,
          bg: `${tokens.meta.colorScheme}.50`,
        };
      case "zen":
        return {
          maxWidth: "1000px",
          spacing: 12,
          py: 4,
          bg: "white",
        };
      case "elegant":
        return {
          maxWidth: "1400px",
          spacing: 10,
          py: 2,
          bg: `${tokens.meta.colorScheme}.25`,
        };
      case "natural":
        return {
          maxWidth: "1100px",
          spacing: 8,
          py: 2,
          bg: tokens.colors[50],
        };
      default:
        return {
          maxWidth: "1200px",
          spacing: 8,
          py: 0,
          bg: tokens.colors[50],
        };
    }
  };

  const config = getLayoutConfig();
  const finalMaxWidth = maxWidth || config.maxWidth;
  const finalSpacing = spacing || config.spacing;
  const finalPy = py || config.py;

  // Classes CSS spécifiques au shopType pour styles avancés
  const getUniverseClasses = () => {
    return `store-layout store-layout-${effectiveVariant} store-layout-${shop.shopType}`;
  };

  return (
    <Box
      as="main"
      w="full"
      bg={config.bg}
      minH="100vh"
      className={getUniverseClasses()}
    >
      <Box maxW={finalMaxWidth} mx="auto" px={{ base: 4, md: 6 }} py={finalPy}>
        <VStack
          spacing={finalSpacing}
          align="stretch"
          w="full"
          sx={{
            // Styles CSS par shopType (si besoin de customisation avancée)
            "&.store-layout-compact .product-grid": {
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
            },
            "&.store-layout-zen .section-title": {
              textAlign: "center",
              borderBottom: "2px solid",
              borderColor: `${tokens.meta.colorScheme}.200`,
              pb: 4,
              mb: 8,
            },
            "&.store-layout-elegant .product-card": {
              borderRadius: "xl",
              overflow: "hidden",
              transition: "all 0.3s",
              _hover: {
                transform: "translateY(-4px)",
                boxShadow: "xl",
              },
            },
            [`&.store-layout-natural .section-title::before`]: {
              content: `"${tokens.meta.icon}"`,
              mr: 2,
            },
          }}
        >
          {children}
          <StoreFooter shop={shop} />
        </VStack>
      </Box>
    </Box>
  );
}
