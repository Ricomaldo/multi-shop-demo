import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import type { Product, Shop } from "../../../../shared/types";
import {
  getKeyAttributesForCard,
  getStockBadgeColor,
  getStockBadgeText,
  isOutOfStock,
} from "../../utils/productAttributes";

interface StoreProductCardProps {
  product: Product;
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const StoreProductCard: React.FC<StoreProductCardProps> = ({
  product,
  shop,
  onAddToCart,
  onViewDetails,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const keyAttributes = getKeyAttributesForCard(product, shop);
  const stockBadgeColor = getStockBadgeColor(product);
  const stockBadgeText = getStockBadgeText(product);
  const outOfStock = isOutOfStock(product);

  // Couleur thématique selon le type de boutique
  const getThemeColor = () => {
    switch (shop.shopType) {
      case "brewery":
        return "orange";
      case "tea-shop":
        return "green";
      case "beauty-shop":
        return "pink";
      case "herb-shop":
        return "green";
      default:
        return "blue";
    }
  };

  // Icône selon le type de boutique
  const getShopTypeIcon = () => {
    switch (shop.shopType) {
      case "brewery":
        return "🍺";
      case "tea-shop":
        return "🍵";
      case "beauty-shop":
        return "💄";
      case "herb-shop":
        return "🌿";
      default:
        return "🏪";
    }
  };

  const themeColor = getThemeColor();

  return (
    <Card
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      shadow="md"
      _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
      transition="all 0.3s"
      opacity={outOfStock ? 0.7 : 1}
    >
      <CardHeader pb={2}>
        <VStack spacing={2} align="stretch">
          {/* Image placeholder */}
          <Box
            height="200px"
            bg={`${themeColor}.50`}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <Text fontSize="6xl" opacity={0.3}>
              {getShopTypeIcon()}
            </Text>

            {/* Badge stock en overlay */}
            <Badge
              position="absolute"
              top={2}
              right={2}
              colorScheme={stockBadgeColor}
              variant="solid"
            >
              {stockBadgeText}
            </Badge>
          </Box>

          {/* Titre et prix */}
          <VStack spacing={1} align="start">
            <Heading size="md" noOfLines={2} color={`${themeColor}.600`}>
              {product.name}
            </Heading>
            <Text color={textColor} fontSize="sm" noOfLines={2}>
              {product.description}
            </Text>
            <Text fontWeight="bold" fontSize="xl" color={`${themeColor}.500`}>
              {product.price.toFixed(2)} €
            </Text>
          </VStack>
        </VStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={4} align="stretch">
          {/* Attributs métier spécialisés */}
          {keyAttributes.length > 0 && (
            <>
              <Divider />
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb={2}
                  color={`${themeColor}.600`}
                >
                  Caractéristiques :
                </Text>
                <SimpleGrid columns={2} spacing={2}>
                  {keyAttributes.slice(0, 4).map((attr, index) => (
                    <Box key={index}>
                      <Text fontSize="xs" color={textColor} fontWeight="medium">
                        {attr.label}
                      </Text>
                      <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
                        {attr.value}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </>
          )}

          {/* Actions */}
          <VStack spacing={2}>
            {onViewDetails && (
              <Button
                variant="outline"
                colorScheme={themeColor}
                size="sm"
                width="full"
                onClick={() => onViewDetails(product)}
              >
                Voir les détails
              </Button>
            )}

            {onAddToCart && (
              <Button
                colorScheme={themeColor}
                size="sm"
                width="full"
                isDisabled={outOfStock}
                onClick={() => onAddToCart(product)}
              >
                {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
              </Button>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
