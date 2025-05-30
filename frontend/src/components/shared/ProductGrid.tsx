import { Box, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import React, { useMemo } from "react";
import type { Product, Shop } from "../../../../shared/types";
import { SharedProductCard } from "./SharedProductCard";

interface SharedProductGridProps {
  products: Product[];
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  columns?: { base: number; md?: number; lg?: number; xl?: number };
  spacing?: number | string;
  isAdminMode?: boolean;
  showActions?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  variant?: "compact" | "standard" | "showcase";
  maxItems?: number;
}

/**
 * Grille de produits responsive universelle
 * S'adapte automatiquement selon le contexte, l'univers et l'appareil
 * Optimisée pour tous les cas d'usage : vitrine, admin, preview, dashboard
 *
 * @param products - Liste des produits à afficher
 * @param shop - Boutique pour thématisation automatique
 * @param isAdminMode - Active le mode admin (actions édition/suppression)
 * @param variant - compact: admin/preview, standard: défaut, showcase: mise en avant
 * @param maxItems - Limite le nombre de produits affichés
 */
export const SharedProductGrid: React.FC<SharedProductGridProps> = ({
  products,
  shop,
  onAddToCart,
  onEdit,
  onView,
  onDelete,
  columns,
  spacing,
  isAdminMode = false,
  showActions = true,
  emptyMessage = "Aucun produit disponible",
  emptySubMessage,
  variant = "standard",
  maxItems,
}) => {
  // Détection responsive intelligente
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  // Configuration responsive intelligente selon le contexte
  const responsiveConfig = useMemo(() => {
    // Si columns est fourni explicitement, on l'utilise
    if (columns) {
      return { columns, spacing: spacing || 6 };
    }

    // Configuration automatique selon la variante et le contexte
    switch (variant) {
      case "compact":
        // Pour admin sidebar, preview, ou sections limitées
        return {
          columns: { base: 1, md: 2, lg: 3 },
          spacing: 4,
        };

      case "showcase":
        // Pour sections featured, hero, ou mise en avant
        return {
          columns: { base: 1, md: 2, lg: 3, xl: 4 },
          spacing: 8,
        };

      case "standard":
      default:
        // Configuration optimale selon l'univers et le mode
        if (isAdminMode) {
          return {
            columns: { base: 1, md: 2, lg: 3, xl: 4 },
            spacing: 4,
          };
        } else {
          // Mode vitrine - optimisé par univers
          switch (shop.shopType) {
            case "brewery":
              // Bières : mise en valeur avec plus d'espace
              return {
                columns: { base: 1, md: 2, lg: 3, xl: 4 },
                spacing: 6,
              };

            case "teaShop":
              // Thés : grille dense pour montrer la variété
              return {
                columns: { base: 1, md: 3, lg: 4, xl: 5 },
                spacing: 5,
              };

            case "beautyShop":
              // Cosmétiques : grille élégante avec espace
              return {
                columns: { base: 1, md: 2, lg: 3, xl: 4 },
                spacing: 8,
              };

            case "herbShop":
              // Herboristerie : grille naturelle et aérée
              return {
                columns: { base: 1, md: 2, lg: 3, xl: 4 },
                spacing: 6,
              };

            default:
              return {
                columns: { base: 1, md: 2, lg: 3, xl: 4 },
                spacing: 6,
              };
          }
        }
    }
  }, [columns, spacing, variant, isAdminMode, shop.shopType]);

  // Limitation intelligente des produits
  const displayedProducts = useMemo(() => {
    if (!maxItems) return products;
    return products.slice(0, maxItems);
  }, [products, maxItems]);

  // Adaptation du spacing selon l'écran
  const adaptiveSpacing = useMemo(() => {
    const baseSpacing =
      typeof responsiveConfig.spacing === "number"
        ? responsiveConfig.spacing
        : parseInt(String(responsiveConfig.spacing)) || 6;

    if (isMobile) {
      return Math.max(3, baseSpacing - 2); // Minimum 3, réduit de 2
    } else if (isTablet) {
      return Math.max(4, baseSpacing - 1); // Minimum 4, réduit de 1
    } else {
      return baseSpacing; // Spacing complet sur desktop
    }
  }, [responsiveConfig.spacing, isMobile, isTablet]);

  // Gestion du cas vide avec style adapté
  if (displayedProducts.length === 0) {
    return (
      <VStack
        spacing={4}
        py={variant === "compact" ? 6 : 8}
        px={4}
        textAlign="center"
      >
        <Text fontSize={variant === "compact" ? "md" : "lg"} color="gray.500">
          {emptyMessage}
        </Text>
        {emptySubMessage && (
          <Text fontSize="sm" color="gray.400" maxW="400px">
            {emptySubMessage}
          </Text>
        )}
      </VStack>
    );
  }

  return (
    <Box w="full">
      <Box
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={adaptiveSpacing}
        w="full"
      >
        {displayedProducts.map((product) => (
          <SharedProductCard
            key={product.id}
            product={product}
            shop={shop}
            isAdminMode={isAdminMode}
            onAddToCart={onAddToCart}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            showActions={showActions}
          />
        ))}
      </Box>

      {/* Indicateur si limitation active */}
      {maxItems && products.length > maxItems && (
        <Box mt={4} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            {maxItems} produits affichés sur {products.length}
          </Text>
        </Box>
      )}
    </Box>
  );
};
