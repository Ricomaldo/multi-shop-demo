import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import type { Product, Shop } from "../../types";
import { parseProductAttributes } from "../../utils/productAttributes";
import {
  getUniverseColorScheme,
  getUniverseIcon,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

interface AdminStockTransferFormProps {
  shops: Shop[];
  products: Product[];
  onTransfer: (
    sourceShopId: string,
    destinationShopId: string,
    productId: string,
    quantity: number
  ) => Promise<void>;
  isLoading: boolean;
}

export const AdminStockTransferForm: React.FC<AdminStockTransferFormProps> = ({
  shops,
  products,
  onTransfer,
  isLoading,
}) => {
  const [sourceShopId, setSourceShopId] = useState("");
  const [destinationShopId, setDestinationShopId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [transferQuantity, setTransferQuantity] = useState(1);

  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Filtrer les produits de la boutique source
  const sourceProducts = useMemo(() => {
    if (!sourceShopId) return [];
    return products.filter((p) => p.shopId === sourceShopId);
  }, [products, sourceShopId]);

  // Obtenir les infos du produit sélectionné
  const selectedProduct = useMemo(() => {
    return sourceProducts.find((p) => p.id === selectedProductId);
  }, [sourceProducts, selectedProductId]);

  // Stock disponible du produit sélectionné
  const availableStock = useMemo(() => {
    if (!selectedProduct) return 0;
    const attributes = parseProductAttributes(selectedProduct);
    return attributes?.stock || 0;
  }, [selectedProduct]);

  // Boutiques disponibles pour destination (même type que source)
  const destinationShops = useMemo(() => {
    if (!sourceShopId) return [];
    const sourceShop = shops.find((s) => s.id === sourceShopId);
    if (!sourceShop) return [];

    return shops.filter(
      (s) => s.id !== sourceShopId && s.shopType === sourceShop.shopType
    );
  }, [shops, sourceShopId]);

  // Validation du formulaire
  const canTransfer = useMemo(() => {
    return (
      sourceShopId &&
      destinationShopId &&
      selectedProductId &&
      transferQuantity > 0 &&
      transferQuantity <= availableStock
    );
  }, [
    sourceShopId,
    destinationShopId,
    selectedProductId,
    transferQuantity,
    availableStock,
  ]);

  const handleTransfer = async () => {
    if (canTransfer) {
      await onTransfer(
        sourceShopId,
        destinationShopId,
        selectedProductId,
        transferQuantity
      );
      // Reset form
      setSourceShopId("");
      setDestinationShopId("");
      setSelectedProductId("");
      setTransferQuantity(1);
    }
  };

  const getShopDisplay = (shop: Shop) => {
    const universe = shopTypeToUniverse(shop.shopType);
    const icon = getUniverseIcon(universe);
    return `${icon} ${shop.name}`;
  };

  const getColorScheme = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop) return "gray";
    const universe = shopTypeToUniverse(shop.shopType);
    return getUniverseColorScheme(universe);
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center">
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          🔄 Nouveau Transfert
        </Text>
        <Text fontSize="sm" color="gray.600">
          Transférez du stock entre boutiques du même type
        </Text>
      </Box>

      {/* Sélection boutique source */}
      <VStack spacing={3} align="stretch">
        <Text fontSize="sm" fontWeight="medium">
          1. Boutique source
        </Text>
        <Select
          placeholder="Sélectionnez la boutique source"
          value={sourceShopId}
          onChange={(e) => {
            setSourceShopId(e.target.value);
            setDestinationShopId("");
            setSelectedProductId("");
          }}
          colorScheme={sourceShopId ? getColorScheme(sourceShopId) : "gray"}
        >
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {getShopDisplay(shop)}
            </option>
          ))}
        </Select>
      </VStack>

      {/* Sélection produit */}
      {sourceShopId && (
        <VStack spacing={3} align="stretch">
          <Text fontSize="sm" fontWeight="medium">
            2. Produit à transférer
          </Text>
          <Select
            placeholder="Sélectionnez un produit"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            colorScheme={sourceShopId ? getColorScheme(sourceShopId) : "gray"}
          >
            {sourceProducts.map((product) => {
              const attributes = parseProductAttributes(product);
              const stock = attributes?.stock || 0;
              return (
                <option key={product.id} value={product.id}>
                  {product.name} (Stock: {stock})
                </option>
              );
            })}
          </Select>
          {sourceProducts.length === 0 && (
            <Alert status="info" size="sm">
              <AlertIcon />
              Aucun produit dans cette boutique
            </Alert>
          )}
        </VStack>
      )}

      {/* Affichage stock disponible */}
      {selectedProduct && (
        <Box
          p={4}
          bg={`${getColorScheme(sourceShopId)}.50`}
          borderRadius="md"
          border="1px solid"
          borderColor={borderColor}
        >
          <HStack justify="space-between">
            <VStack spacing={1} align="start">
              <Text fontSize="sm" fontWeight="bold">
                {selectedProduct.name}
              </Text>
              <Text fontSize="xs" color="gray.600">
                Prix : {selectedProduct.price}€
              </Text>
            </VStack>
            <Badge
              colorScheme={
                availableStock > 10
                  ? "green"
                  : availableStock > 0
                  ? "orange"
                  : "red"
              }
              variant="solid"
            >
              Stock : {availableStock}
            </Badge>
          </HStack>
        </Box>
      )}

      {/* Quantité et boutique destination */}
      {selectedProduct && availableStock > 0 && (
        <>
          <HStack spacing={4}>
            <VStack spacing={3} align="stretch" flex={1}>
              <Text fontSize="sm" fontWeight="medium">
                3. Quantité
              </Text>
              <NumberInput
                value={transferQuantity}
                onChange={(_, value) =>
                  setTransferQuantity(isNaN(value) ? 1 : value)
                }
                min={1}
                max={availableStock}
                colorScheme={getColorScheme(sourceShopId)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </VStack>

            <VStack spacing={3} align="stretch" flex={2}>
              <Text fontSize="sm" fontWeight="medium">
                4. Boutique destination
              </Text>
              <Select
                placeholder="Sélectionnez la destination"
                value={destinationShopId}
                onChange={(e) => setDestinationShopId(e.target.value)}
                colorScheme={
                  destinationShopId ? getColorScheme(destinationShopId) : "gray"
                }
              >
                {destinationShops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {getShopDisplay(shop)}
                  </option>
                ))}
              </Select>
            </VStack>
          </HStack>

          {destinationShops.length === 0 && (
            <Alert status="warning" size="sm">
              <AlertIcon />
              Aucune boutique de même type disponible pour le transfert
            </Alert>
          )}
        </>
      )}

      {/* Validation et erreurs */}
      {selectedProduct && availableStock === 0 && (
        <Alert status="error">
          <AlertIcon />
          Ce produit est en rupture de stock
        </Alert>
      )}

      {transferQuantity > availableStock && availableStock > 0 && (
        <Alert status="warning">
          <AlertIcon />
          Quantité demandée supérieure au stock disponible ({availableStock})
        </Alert>
      )}

      {/* Bouton transfert */}
      <Button
        colorScheme={sourceShopId ? getColorScheme(sourceShopId) : "blue"}
        size="lg"
        onClick={handleTransfer}
        isDisabled={!canTransfer}
        isLoading={isLoading}
        loadingText="Transfert en cours..."
      >
        {canTransfer
          ? "🚚 Effectuer le transfert"
          : "⚠️ Veuillez compléter le formulaire"}
      </Button>

      {/* Résumé */}
      {canTransfer && (
        <Box
          p={4}
          bg="blue.50"
          borderRadius="md"
          border="1px solid"
          borderColor="blue.200"
        >
          <Text fontSize="sm" color="blue.800" textAlign="center">
            📋 <strong>Résumé :</strong> Transfert de {transferQuantity}{" "}
            unité(s) de "{selectedProduct?.name}" de{" "}
            {shops.find((s) => s.id === sourceShopId)?.name} vers{" "}
            {shops.find((s) => s.id === destinationShopId)?.name}
          </Text>
        </Box>
      )}
    </VStack>
  );
};
