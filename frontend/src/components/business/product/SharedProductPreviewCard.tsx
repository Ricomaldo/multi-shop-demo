import type { Product, Shop } from "@/types";
import { getUniverseTokens } from "@/theme/universeTokens";
import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

export interface SharedProductPreviewCardProps {
  product: Product;
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  imageHeight?: string;
  isHighlighted?: boolean;
  isAdminMode?: boolean;
  showActions?: boolean;
  /** Prix override pour réactivité temps réel */
  priceOverride?: number;
}

export const SharedProductPreviewCard: React.FC<
  SharedProductPreviewCardProps
> = ({
  product,
  shop,
  onAddToCart,
  onView,
  onEdit,
  imageHeight = "200px",
  isHighlighted = false,
  isAdminMode = false,
  showActions = true,
  priceOverride,
}) => {
  const tokens = getUniverseTokens(shop.shopType);

  // Prix réactif : utilise override ou prix du produit
  const displayPrice =
    priceOverride !== undefined ? priceOverride : product.price;

  // Parser IBU pour enlever "IBU" si présent
  const parseIBU = (value: string) => {
    if (!value) return value;
    return value.replace(/ ?IBU/gi, "").trim();
  };

  // Badges attributs selon l'univers
  const getUniverseBadges = () => {
    if (!product.attributes) return [];

    try {
      const attrs = JSON.parse(product.attributes);

      switch (shop.shopType) {
        case "brewery":
          return [
            attrs.degre_alcool && {
              label: `${attrs.degre_alcool}%`,
              colorScheme: tokens.meta.colorScheme,
            },
            attrs.amertume_ibu && {
              label: `${parseIBU(attrs.amertume_ibu)} IBU`,
              colorScheme: "yellow",
            },
          ].filter(Boolean);

        case "teaShop":
          return [
            attrs.origine_plantation && {
              label: attrs.origine_plantation,
              colorScheme: tokens.meta.colorScheme,
            },
            attrs.grade_qualite && {
              label: attrs.grade_qualite,
              colorScheme: "teal",
            },
          ].filter(Boolean);

        case "beautyShop":
          return [
            attrs.certification_bio === "true" ||
              (attrs.certification_bio === true && {
                label: "Bio",
                colorScheme: "green",
              }),
            attrs.type_peau && {
              label: attrs.type_peau,
              colorScheme: tokens.meta.colorScheme,
            },
          ].filter(Boolean);

        case "herbShop":
          return [
            attrs.usage_traditionnel && {
              label: attrs.usage_traditionnel,
              colorScheme: tokens.meta.colorScheme,
            },
            attrs.certification &&
              attrs.certification !== "Non certifié" && {
                label: attrs.certification,
                colorScheme: "teal",
              },
          ].filter(Boolean);

        default:
          return [];
      }
    } catch {
      return [];
    }
  };

  const universeBadges = getUniverseBadges();

  // 🎨 STYLES DIRECTEMENT ISSUS DES TOKENS/COLORS
  const cardStyles = {
    // Background selon univers
    bg: tokens.colors[50],
    borderWidth: "2px",
    borderColor: tokens.colors[200],
    // BorderRadius selon tokens univers
    borderRadius: tokens.borderRadius.base,
    // Typography selon tokens
    fontFamily: tokens.typography.fontFamily.body,
    // Padding selon tokens
    p: 4,
    // Hover effects selon l'univers
    _hover: {
      borderColor: tokens.colors[300],
      bg: tokens.colors[100],
      transform:
        shop.shopType === "brewery"
          ? "none"
          : shop.shopType === "teaShop"
          ? "translateY(-2px)"
          : shop.shopType === "beautyShop"
          ? "translateY(-1px)"
          : "scale(1.02)", // herbShop
      transition: "all 0.3s ease",
      boxShadow: shop.shopType === "beautyShop" ? "lg" : "md",
    },
  };

  return (
    <Box {...cardStyles} overflow="hidden" height="100%">
      <Image
        src={product.imageUrl}
        alt={product.name}
        height={{ base: "180px", md: imageHeight }}
        width="100%"
        objectFit="cover"
        borderRadius={tokens.borderRadius.md}
        mb={3}
        onError={() => console.log("❌ Erreur image:", product.imageUrl)}
      />

      <VStack spacing={3} align="stretch">
        <Text
          fontSize={isHighlighted ? "xl" : "lg"}
          fontWeight={tokens.typography.fontWeight.bold}
          fontFamily={tokens.typography.fontFamily.heading}
          noOfLines={2}
          color={tokens.colors[800]}
        >
          {product.name}
        </Text>

        {/* Description avec typography de l'univers */}
        <Text
          fontSize="sm"
          color={tokens.colors[600]}
          fontFamily={tokens.typography.fontFamily.body}
          fontWeight={tokens.typography.fontWeight.normal}
        >
          {product.description}
        </Text>

        {/* Badges attributs par univers */}
        {universeBadges.length > 0 && (
          <Wrap spacing={1}>
            {universeBadges.map((badge, idx) => (
              <WrapItem key={idx}>
                <Badge
                  colorScheme={badge.colorScheme}
                  size="sm"
                  variant="subtle"
                  borderRadius={tokens.borderRadius.base}
                >
                  {badge.label}
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        )}

        <HStack justify="space-between" align="center">
          <Text
            fontSize={isHighlighted ? "xl" : "lg"}
            fontWeight={tokens.typography.fontWeight.heavy}
            color={tokens.colors[700]}
            fontFamily={tokens.typography.fontFamily.heading}
          >
            {displayPrice}€
          </Text>

          {product.stockStatus && (
            <Badge
              colorScheme={
                product.stockStatus === "in_stock"
                  ? "green"
                  : product.stockStatus === "low_stock"
                  ? "orange"
                  : "red"
              }
              borderRadius={tokens.borderRadius.base}
            >
              {product.stockStatus === "in_stock"
                ? "En stock"
                : product.stockStatus === "low_stock"
                ? "Stock limité"
                : "Rupture"}
            </Badge>
          )}
        </HStack>

        {/* Actions avec styles de l'univers */}
        {showActions && (
          <VStack spacing={3} pt={3}>
            {!isAdminMode ? (
              <HStack spacing={3} w="full">
                {onView && (
                  <Button
                    flex={1}
                    variant="outline"
                    colorScheme={tokens.meta.colorScheme}
                    size={{ base: "sm", md: "md" }}
                    minH="44px"
                    fontFamily={tokens.typography.fontFamily.body}
                    borderRadius={tokens.borderRadius.base}
                    onClick={() => onView(product)}
                  >
                    Voir
                  </Button>
                )}
                {onAddToCart && (
                  <Button
                    variant="solid"
                    colorScheme={tokens.meta.colorScheme}
                    size={{ base: "sm", md: "md" }}
                    minH="44px"
                    fontFamily={tokens.typography.fontFamily.body}
                    fontWeight={tokens.typography.fontWeight.bold}
                    borderRadius={tokens.borderRadius.base}
                    onClick={() => onAddToCart(product)}
                    disabled={product.stockStatus === "out_of_stock"}
                  >
                    {product.stockStatus === "out_of_stock"
                      ? "Rupture"
                      : "Ajouter"}
                  </Button>
                )}
              </HStack>
            ) : (
              <HStack spacing={3} w="full">
                {onEdit && (
                  <Button
                    flex={1}
                    variant="outline"
                    colorScheme="blue"
                    size={{ base: "md", md: "sm" }}
                    onClick={() => onEdit(product)}
                    borderRadius={tokens.borderRadius.base}
                    minH="44px"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    Modifier
                  </Button>
                )}
              </HStack>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
