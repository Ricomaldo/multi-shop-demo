import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { Product, Shop } from "../../../../shared/types";

export interface SharedProductCardProps {
  product: Product;
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  onView?: (product: Product) => void;
  imageHeight?: string;
  isHighlighted?: boolean;
}

export const SharedProductCard: React.FC<SharedProductCardProps> = ({
  product,
  shop,
  onAddToCart,
  onView,
  imageHeight = "200px",
  isHighlighted = false,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const baseHoverShadow = useColorModeValue("lg", "dark-lg");
  const shadowHover = isHighlighted ? "2xl" : baseHoverShadow;

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

        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {product.description}
        </Text>

        <HStack justify="space-between" align="center">
          <Text
            fontSize={isHighlighted ? "xl" : "lg"}
            fontWeight="bold"
            color={`${shop.themeColor}.600`}
          >
            {product.price}€
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
          {onView && (
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
          {onAddToCart && product.stockStatus !== "out_of_stock" && (
            <Button
              colorScheme={shop.themeColor}
              size={isHighlighted ? "md" : "sm"}
              flex="1"
              onClick={() => onAddToCart(product)}
            >
              Ajouter
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
