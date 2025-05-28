import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
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

interface SharedProductCardProps {
  product: Product;
  shop: Shop;
  isAdminMode?: boolean;
  onEdit?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onView?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  showActions?: boolean;
}

/**
 * Composant partagé universel pour afficher une carte produit
 * S'adapte automatiquement au thème de l'univers et affiche les attributs métier
 * Utilisé partout : vitrine, admin, splitView, dashboard
 */
export const SharedProductCard: React.FC<SharedProductCardProps> = ({
  product,
  shop,
  isAdminMode = false,
  onEdit,
  onAddToCart,
  onView,
  onDelete,
  showActions = true,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  // Attributs métier spécialisés selon l'univers
  const keyAttributes = getKeyAttributesForCard(product, shop);
  const stockBadgeColor = getStockBadgeColor(product);
  const stockBadgeText = getStockBadgeText(product);
  const outOfStock = isOutOfStock(product);

  // Thématisation automatique selon l'univers
  const getThemeColor = () => {
    switch (shop.shopType) {
      case "brewery":
        return "orange";
      case "tea-shop":
        return "green";
      case "beauty-shop":
        return "pink";
      case "herb-shop":
        return "teal";
      default:
        return "gray";
    }
  };

  // Icône selon l'univers
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
  const shopIcon = getShopTypeIcon();

  return (
    <Box
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="md"
      shadow="sm"
      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.3s"
      opacity={outOfStock ? 0.7 : 1}
      minW="280px"
      maxW="350px"
    >
      <VStack align="stretch" spacing={0}>
        {/* Image placeholder avec badge stock */}
        <Box
          height="160px"
          bg={`${themeColor}.50`}
          borderTopRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Text fontSize="4xl" opacity={0.3}>
            {shopIcon}
          </Text>

          {/* Badge stock en overlay */}
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme={stockBadgeColor}
            variant="solid"
            fontSize="xs"
          >
            {stockBadgeText}
          </Badge>
        </Box>

        {/* Contenu principal */}
        <VStack align="stretch" spacing={3} p={4}>
          {/* En-tête produit */}
          <VStack align="start" spacing={1}>
            <Heading size="md" color={`${themeColor}.600`} noOfLines={2}>
              {product.name}
            </Heading>

            {product.category && (
              <Badge colorScheme={themeColor} size="sm">
                {product.category.name}
              </Badge>
            )}

            {product.description && (
              <Text fontSize="sm" color={textColor} noOfLines={2}>
                {product.description}
              </Text>
            )}

            <Text fontWeight="bold" fontSize="xl" color={`${themeColor}.500`}>
              {product.price.toFixed(2)} €
            </Text>
          </VStack>

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

          {/* Actions selon le mode */}
          {showActions && (
            <VStack spacing={2}>
              {/* Mode admin */}
              {isAdminMode && (
                <HStack spacing={2} width="full">
                  {onEdit && (
                    <Button
                      size="sm"
                      colorScheme={themeColor}
                      variant="outline"
                      onClick={() => onEdit(product)}
                      flex={1}
                    >
                      ✏️ Modifier
                    </Button>
                  )}
                  {onView && (
                    <Button
                      size="sm"
                      colorScheme={themeColor}
                      variant="ghost"
                      onClick={() => onView(product)}
                      flex={1}
                    >
                      👁️ Voir
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => onDelete(product)}
                    >
                      🗑️
                    </Button>
                  )}
                </HStack>
              )}

              {/* Mode vitrine */}
              {!isAdminMode && (
                <VStack spacing={2} width="full">
                  {onView && (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme={themeColor}
                      onClick={() => onView(product)}
                      width="full"
                    >
                      Voir les détails
                    </Button>
                  )}
                  {onAddToCart && (
                    <Button
                      size="sm"
                      colorScheme={themeColor}
                      onClick={() => onAddToCart(product)}
                      width="full"
                      isDisabled={outOfStock}
                    >
                      {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
                    </Button>
                  )}
                </VStack>
              )}
            </VStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};
