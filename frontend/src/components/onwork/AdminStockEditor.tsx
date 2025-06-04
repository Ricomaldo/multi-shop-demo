import {
  Badge,
  Box,
  Button,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import type { Product, Shop } from "../../../../shared/types";
import {
  getStockBadgeColor,
  parseProductAttributes,
} from "../../utils/productAttributes";
import {
  getUniverseColorScheme,
  getUniverseIcon,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

interface AdminStockEditorProps {
  product: Product;
  shop: Shop;
  onStockUpdate: (productId: string, newStock: number) => void;
  isUpdating?: boolean;
}

/**
 * Composant d'édition rapide du stock pour une boutique
 * Interface simple pour ajuster le stock produit par produit
 */
const AdminStockEditor: React.FC<AdminStockEditorProps> = ({
  product,
  shop,
  onStockUpdate,
  isUpdating = false,
}) => {
  const toast = useToast();
  const universe = shopTypeToUniverse(shop.shopType);
  const colorScheme = getUniverseColorScheme(universe);
  const shopIcon = getUniverseIcon(universe);

  // Extraire le stock actuel du produit
  const attributes = parseProductAttributes(product);
  const currentStock = attributes?.stock || 0;

  const [newStock, setNewStock] = useState<number>(currentStock);
  const stockBadgeColor = getStockBadgeColor(product);

  const handleStockUpdate = () => {
    if (newStock !== currentStock) {
      onStockUpdate(product.id, newStock);
      toast({
        title: "Stock mis à jour",
        description: `Stock de "${product.name}" mis à jour : ${newStock} unités`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const hasChanges = newStock !== currentStock;

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor={`${colorScheme}.200`}
      borderRadius="md"
      bg={`${colorScheme}.50`}
    >
      <VStack spacing={3} align="stretch">
        {/* En-tête produit */}
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Text fontSize="lg">{shopIcon}</Text>
            <VStack spacing={0} align="start">
              <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                {product.name}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {shop.name}
              </Text>
            </VStack>
          </HStack>
          <Badge colorScheme={stockBadgeColor} fontSize="0.7em">
            Stock : {currentStock}
          </Badge>
        </HStack>

        {/* Éditeur de stock */}
        <HStack spacing={3}>
          <VStack spacing={1} align="start" flex={1}>
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              Nouveau stock :
            </Text>
            <NumberInput
              value={newStock}
              onChange={(_, value) => setNewStock(isNaN(value) ? 0 : value)}
              min={0}
              max={9999}
              size="sm"
              colorScheme={colorScheme}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </VStack>

          <VStack spacing={1}>
            <Text fontSize="xs" color="transparent">
              Action
            </Text>
            <Button
              size="sm"
              colorScheme={colorScheme}
              onClick={handleStockUpdate}
              isDisabled={!hasChanges || isUpdating}
              isLoading={isUpdating}
              loadingText="..."
            >
              {hasChanges ? "Mettre à jour" : "À jour"}
            </Button>
          </VStack>
        </HStack>

        {/* Indicateur de changement */}
        {hasChanges && (
          <Text fontSize="xs" color={`${colorScheme}.600`} textAlign="center">
            ⚠️ Changement : {currentStock} → {newStock} unités
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default AdminStockEditor;
