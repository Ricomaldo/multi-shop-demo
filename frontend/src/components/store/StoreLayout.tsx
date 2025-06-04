import { Box, Container, VStack, useBreakpointValue } from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import { UniverseProvider } from "../../contexts/UniverseContext";
import { shopTypeToUniverse } from "../../utils/universeMapping";
import StoreFooter from "./StoreFooter";

interface StoreLayoutProps {
  /** La boutique courante */
  shop: Shop;
  /** Les sections de la page */
  children: React.ReactNode;
  /** Largeur maximale du contenu */
  maxContentWidth?: string;
  /** Espacement entre les sections */
  sectionSpacing?: number;
  /** Variante de mise en page */
  variant?: "compact" | "zen" | "elegant" | "natural";
}

// Type pour la configuration du layout
type LayoutConfig = {
  padding: number;
  columnGap: number;
  rowGap: number;
  gridColumns?: string;
  contentWidth?: string;
};

/**
 * Layout parent pour toutes les pages vitrine
 * Gère automatiquement :
 * - Le contexte d'univers
 * - La thématisation
 * - L'espacement des sections
 * - La largeur maximale
 * - Les variantes de layout selon l'univers
 */
export default function StoreLayout({
  shop,
  children,
  maxContentWidth = "1200px",
  sectionSpacing = 12,
  variant,
}: StoreLayoutProps) {
  // Détermine l'univers depuis le type de boutique
  const universe = shopTypeToUniverse(shop.shopType);

  // Déterminer la variante selon l'univers ou utiliser celle fournie
  const effectiveVariant: "compact" | "zen" | "elegant" | "natural" =
    variant ||
    (() => {
      switch (shop.shopType) {
        case "brewery":
          return "compact";
        case "teaShop":
          return "zen";
        case "beautyShop":
          return "elegant";
        case "herbShop":
          return "natural";
        default:
          return "compact";
      }
    })();

  // Configuration responsive du layout selon la variante
  const layoutConfig: LayoutConfig | undefined = useBreakpointValue({
    base: {
      padding: 4,
      columnGap: 4,
      rowGap: 6,
    },
    md: (() => {
      switch (effectiveVariant) {
        case "compact":
          return {
            padding: 6,
            columnGap: 4,
            rowGap: 6,
            gridColumns: "repeat(3, 1fr)",
            contentWidth: "1200px",
          };
        case "zen":
          return {
            padding: 8,
            columnGap: 8,
            rowGap: 12,
            gridColumns: "repeat(2, 1fr)",
            contentWidth: "1000px",
          };
        case "elegant":
          return {
            padding: 10,
            columnGap: 6,
            rowGap: 8,
            gridColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            contentWidth: "1400px",
          };
        case "natural":
          return {
            padding: 8,
            columnGap: 6,
            rowGap: 10,
            gridColumns: "repeat(2, 1fr)",
            contentWidth: "1100px",
          };
        default:
          return {
            padding: 6,
            columnGap: 4,
            rowGap: 6,
            gridColumns: "repeat(3, 1fr)",
            contentWidth: "1200px",
          };
      }
    })(),
  });

  // Classes CSS spécifiques à l'univers
  const getUniverseClasses = () => {
    switch (shop.shopType) {
      case "brewery":
        return "store-layout-brewery";
      case "teaShop":
        return "store-layout-tea";
      case "beautyShop":
        return "store-layout-beauty";
      case "herbShop":
        return "store-layout-herb";
      default:
        return "";
    }
  };

  return (
    <UniverseProvider defaultUniverse={universe}>
      <Box
        as="main"
        w="full"
        bg="gray.50"
        minH="100vh"
        className={`store-layout-${effectiveVariant} ${getUniverseClasses()}`}
      >
        <Container
          maxW={layoutConfig?.contentWidth || maxContentWidth}
          py={layoutConfig?.padding}
          px={4}
        >
          <VStack
            spacing={sectionSpacing}
            align="stretch"
            w="full"
            sx={{
              // Styles de base pour tous les layouts
              "& > .product-grid": {
                display: "grid",
                gridTemplateColumns:
                  layoutConfig?.gridColumns || "repeat(3, 1fr)",
                gap: `${layoutConfig?.rowGap || 6}px ${
                  layoutConfig?.columnGap || 4
                }px`,
              },
              "& > .category-section": {
                marginTop: `${sectionSpacing * 1.5}px`,
              },
              "& > .hero-section": {
                marginBottom: `${sectionSpacing * 1.5}px`,
              },

              // Variante Compact (Brewery)
              "&.store-layout-compact": {
                "& .product-card": {
                  transform: "scale(0.95)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1)",
                  },
                },
                "& .section-title": {
                  fontSize: "xl",
                  fontWeight: "bold",
                },
              },

              // Variante Zen (Tea Shop)
              "&.store-layout-zen": {
                "& .section-title": {
                  borderBottom: "2px solid",
                  borderColor: "green.200",
                  paddingBottom: "4",
                  marginBottom: "8",
                  textAlign: "center",
                  fontSize: "2xl",
                },
                "& .product-card": {
                  boxShadow: "none",
                  borderWidth: "1px",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "green.200",
                    transform: "translateY(-4px)",
                  },
                },
              },

              // Variante Elegant (Beauty Shop)
              "&.store-layout-elegant": {
                "& .section-title": {
                  fontFamily: "serif",
                  fontSize: "3xl",
                  fontWeight: "light",
                  letterSpacing: "wider",
                },
                "& .product-card": {
                  borderRadius: "xl",
                  overflow: "hidden",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "xl",
                  },
                },
                "& .product-card:nth-of-type(3n+2)": {
                  marginTop: "40px",
                },
              },

              // Variante Natural (Herb Shop)
              "&.store-layout-natural": {
                "& .section-title": {
                  color: "teal.700",
                  fontSize: "2xl",
                  fontWeight: "medium",
                  "&::before": {
                    content: "'🌿'",
                    marginRight: "2",
                  },
                },
                "& .product-card": {
                  borderRadius: "lg",
                  borderWidth: "1px",
                  borderColor: "teal.100",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "teal.300",
                    backgroundColor: "teal.50",
                  },
                },
                "& .section-divider": {
                  height: "2px",
                  background:
                    "linear-gradient(to right, transparent, teal.200, transparent)",
                  margin: "40px 0",
                },
              },
            }}
          >
            {children}
            <StoreFooter shop={shop} />
          </VStack>
        </Container>
      </Box>
    </UniverseProvider>
  );
}
