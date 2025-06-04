import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { Product, Shop } from "../../../../shared/types";

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
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const baseHoverShadow = useColorModeValue("lg", "dark-lg");
  const shadowHover = isHighlighted ? "2xl" : baseHoverShadow;

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
              colorScheme: "orange",
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
              colorScheme: "green",
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
              colorScheme: "pink",
            },
          ].filter(Boolean);

        case "herbShop":
          return [
            attrs.usage_traditionnel && {
              label: attrs.usage_traditionnel,
              colorScheme: "green",
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

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        shadow: shadowHover,
      }}
      height="100%"
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        height={imageHeight}
        width="100%"
        objectFit="cover"
        onError={() => console.log("❌ Erreur image:", product.imageUrl)}
      />

      <VStack p={4} spacing={3} align="stretch">
        <Text
          fontSize={isHighlighted ? "xl" : "lg"}
          fontWeight="semibold"
          noOfLines={2}
        >
          {product.name}
        </Text>

        {/* Description complète sans limitation */}
        <Text fontSize="sm" color="gray.600">
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
            fontWeight="bold"
            color={`${shop.themeColor}.600`}
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
            >
              {product.stockStatus === "in_stock"
                ? "En stock"
                : product.stockStatus === "low_stock"
                ? "Stock faible"
                : "Rupture"}
            </Badge>
          )}
        </HStack>

        <HStack spacing={2}>
          {!isAdminMode && onView && (
            <Button
              variant="outline"
              colorScheme={shop.themeColor}
              size={isHighlighted ? "md" : "sm"}
              flex="1"
              onClick={() => onView(product)}
            >
              Voir
            </Button>
          )}
          {!isAdminMode &&
            onAddToCart &&
            product.stockStatus !== "out_of_stock" && (
              <Button
                colorScheme={shop.themeColor}
                size={isHighlighted ? "md" : "sm"}
                flex="1"
                onClick={() => onAddToCart(product)}
              >
                Ajouter
              </Button>
            )}

          {isAdminMode && showActions && onEdit && (
            <Button
              variant="outline"
              colorScheme="blue"
              size="sm"
              flex="1"
              onClick={() => onEdit(product)}
            >
              Modifier
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
