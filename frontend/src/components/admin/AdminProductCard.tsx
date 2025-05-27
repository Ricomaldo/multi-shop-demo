import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import type { Product, Shop } from "../../../../shared/types";
import {
  getKeyAttributesForCard,
  getStockBadgeColor,
  getStockBadgeText,
  hasLowStock,
  isOutOfStock,
} from "../../utils/productAttributes";

interface AdminProductCardProps {
  product: Product;
  shop: Shop;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
}

export const AdminProductCard: React.FC<AdminProductCardProps> = ({
  product,
  shop,
  onEdit,
  onDelete,
  onView,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const keyAttributes = getKeyAttributesForCard(product, shop);
  const stockBadgeColor = getStockBadgeColor(product);
  const stockBadgeText = getStockBadgeText(product);

  // Couleur de bordure selon l'état du stock
  const getCardBorderColor = () => {
    if (isOutOfStock(product)) return "red.300";
    if (hasLowStock(product)) return "orange.300";
    return borderColor;
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

  return (
    <Card
      bg={cardBg}
      borderColor={getCardBorderColor()}
      borderWidth="2px"
      shadow="md"
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <CardHeader pb={2}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1} flex={1}>
            <HStack>
              <Text fontSize="lg">{getShopTypeIcon()}</Text>
              <Heading size="md" noOfLines={2}>
                {product.name}
              </Heading>
            </HStack>
            <Text color={textColor} fontSize="sm" noOfLines={2}>
              {product.description}
            </Text>
          </VStack>

          <VStack spacing={1}>
            <Badge colorScheme={stockBadgeColor} variant="solid">
              {stockBadgeText}
            </Badge>
            <Text fontWeight="bold" fontSize="lg" color="blue.500">
              {product.price.toFixed(2)} €
            </Text>
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={3} align="stretch">
          {/* Attributs métier spécialisés */}
          {keyAttributes.length > 0 && (
            <>
              <Divider />
              <SimpleGrid columns={2} spacing={2}>
                {keyAttributes.map((attr, index) => (
                  <Box key={index}>
                    <Text fontSize="xs" color={textColor} fontWeight="medium">
                      {attr.label}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      {attr.value}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </>
          )}

          {/* Actions admin */}
          <Divider />
          <HStack justify="space-between">
            <HStack spacing={1}>
              {onView && (
                <Tooltip label="Voir les détails">
                  <IconButton
                    aria-label="Voir"
                    icon={<ViewIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => onView(product)}
                  />
                </Tooltip>
              )}

              {onEdit && (
                <Tooltip label="Modifier le produit">
                  <IconButton
                    aria-label="Modifier"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => onEdit(product)}
                  />
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip label="Supprimer le produit">
                  <IconButton
                    aria-label="Supprimer"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(product)}
                  />
                </Tooltip>
              )}
            </HStack>

            <Text fontSize="xs" color={textColor}>
              ID: {product.id.slice(-8)}
            </Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
