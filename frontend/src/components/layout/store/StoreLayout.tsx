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
  variant?: "industrial" | "zen" | "luxe" | "organic";
}

/**
 * 🔥 LAYOUT PERSONNALISÉ PAR UNIVERS - Variantes MAGNIFIÉES
 * 🍺 industrial : Grilles robustes, espacements généreux, structure industrielle
 * 🍵 zen : Centré, aéré, respiration maximale, simplicité
 * 💄 luxe : Large, sophistiqué, mise en scène premium
 * 🌿 organic : Formes irrégulières, naturelles, asymétrie organique
 */
export default function StoreLayout({
  shop,
  children,
  maxWidth,
  spacing,
  py,
  variant,
}: StoreLayoutProps) {
  // 🎯 APPLICATION DIRECTE shopType → tokens
  const tokens = getUniverseTokens(shop.shopType);

  // Utilise la variante des tokens si non spécifiée
  const effectiveVariant = variant || tokens.variants.layout;

  // 🍺 BREWERY → INDUSTRIAL (Structure industrielle, grilles robustes)
  if (effectiveVariant === "industrial") {
    return (
      <Box
        as="main"
        w="full"
        bg="white"
        minH="100vh"
        className={`store-layout store-layout-industrial store-layout-${shop.shopType}`}
      >
        <Box
          maxW={maxWidth || "1300px"}
          mx="auto"
          px={{ base: 6, md: 8 }}
          py={py || 4}
        >
          <VStack
            spacing={spacing || 8}
            align="stretch"
            w="full"
            sx={{
              "& .section": {
                bg: tokens.colors[50],
                border: `2px solid ${tokens.colors[500]}`,
                borderRadius: tokens.borderRadius.md,
                p: 6,
                color: tokens.colors[800],
                fontWeight: "600",
              },
              "& .product-grid": {
                display: "grid",
                gridTemplateColumns: {
                  base: "1fr",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 6,
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

  // 🍵 TEASHOP → ZEN (Centré, aéré, respiration maximale)
  if (effectiveVariant === "zen") {
    return (
      <Box
        as="main"
        w="full"
        bg="white"
        minH="100vh"
        className={`store-layout store-layout-zen store-layout-${shop.shopType}`}
      >
        <Box
          maxW={maxWidth || "1000px"}
          mx="auto"
          px={{ base: 4, md: 6 }}
          py={py || 8}
        >
          <VStack
            spacing={spacing || 12}
            align="center"
            w="full"
            sx={{
              "& .section": {
                bg: "white",
                borderRadius: "20px",
                p: 8,
                shadow: "lg",
                border: `1px solid ${tokens.colors[200]}`,
                textAlign: "center",
                maxW: "800px",
                mx: "auto",
              },
              "& .section-title": {
                textAlign: "center",
                fontSize: "xl",
                fontFamily: tokens.typography.fontFamily.heading,
                color: tokens.colors[700],
                mb: 6,
              },
              "& .product-grid": {
                display: "grid",
                gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
                gap: 8,
                justifyItems: "center",
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

  // 💄 BEAUTY → LUXE (Large, sophistiqué, mise en scène premium)
  if (effectiveVariant === "luxe") {
    return (
      <Box
        as="main"
        w="full"
        bgGradient={`linear(135deg, ${tokens.colors[50]}, white)`}
        minH="100vh"
        className={`store-layout store-layout-luxe store-layout-${shop.shopType}`}
      >
        <Box
          maxW={maxWidth || "1400px"}
          mx="auto"
          px={{ base: 4, md: 8 }}
          py={py || 6}
        >
          <VStack
            spacing={spacing || 10}
            align="stretch"
            w="full"
            sx={{
              "& .section": {
                bg: "white",
                borderRadius: "16px",
                p: 8,
                shadow: "xl",
                border: `1px solid ${tokens.colors[200]}`,
                position: "relative",
                _before: {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  bgGradient: `linear(to-r, ${tokens.colors[500]}, ${tokens.colors[400]})`,
                  borderRadius: "16px 16px 0 0",
                },
              },
              "& .product-grid": {
                display: "grid",
                gridTemplateColumns: {
                  base: "1fr",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 8,
              },
              "& .product-card": {
                borderRadius: "12px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                _hover: {
                  transform: "translateY(-4px)",
                  boxShadow: "xl",
                },
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

  // 🌿 HERB → ORGANIC (Formes irrégulières, naturelles, asymétrie organique)
  if (effectiveVariant === "organic") {
    return (
      <Box
        as="main"
        w="full"
        bg={tokens.colors[50]}
        minH="100vh"
        className={`store-layout store-layout-organic store-layout-${shop.shopType}`}
      >
        <Box
          maxW={maxWidth || "1200px"}
          mx="auto"
          px={{ base: 4, md: 6 }}
          py={py || 6}
        >
          <VStack
            spacing={spacing || 8}
            align="stretch"
            w="full"
            sx={{
              "& .section": {
                bg: "white",
                borderRadius: "12px",
                p: 6,
                shadow: "md",
                border: `1px solid ${tokens.colors[300]}`,
                position: "relative",
                _before: {
                  content: `"${tokens.meta.icon}"`,
                  position: "absolute",
                  top: -2,
                  right: 4,
                  fontSize: "lg",
                  color: tokens.colors[400],
                  bg: "white",
                  borderRadius: "full",
                  w: "30px",
                  h: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${tokens.colors[300]}`,
                },
              },
              "& .section-title": {
                position: "relative",
                _before: {
                  content: `"${tokens.meta.icon}"`,
                  mr: 2,
                  color: tokens.colors[500],
                },
              },
              "& .product-grid": {
                display: "grid",
                gridTemplateColumns: {
                  base: "1fr",
                  md: "repeat(auto-fit, minmax(280px, 1fr))",
                },
                gap: 6,
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

  // Fallback - utilise industrial par défaut
  return (
    <Box as="main" w="full" bg={tokens.colors[50]} minH="100vh">
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={0}>
        <VStack spacing={8} align="stretch" w="full">
          {children}
          <StoreFooter shop={shop} />
        </VStack>
      </Box>
    </Box>
  );
}
