import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Card,
  CardBody,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useShopData } from "../../hooks/useShopData";
import {
  getUniverseColorScheme,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

interface AdminStockCarouselProps {
  productId: string;
  currentShopId: string;
}

/**
 * Carrousel pour afficher le stock d'un produit dans chaque boutique
 */
export const AdminStockCarousel: React.FC<AdminStockCarouselProps> = ({
  productId, // Sera utilisé pour l'appel API getStockByProduct(productId)
  currentShopId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { shops } = useShopData();
  const bgHover = useColorModeValue("gray.100", "gray.700");

  // Simuler les données de stock (à remplacer par l'API)
  const stockByShop = shops.map((shop) => {
    console.log(`Simulation stock pour produit ${productId} dans ${shop.name}`);
    return {
      shopId: shop.id,
      shopName: shop.name,
      shopType: shop.shopType,
      stock: Math.floor(Math.random() * 100), // Simulation
    };
  });

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? stockByShop.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === stockByShop.length - 1 ? 0 : prev + 1));
  };

  if (!stockByShop.length) return null;

  const currentStock = stockByShop[currentIndex];
  const colorScheme = getUniverseColorScheme(
    shopTypeToUniverse(currentStock.shopType)
  );

  return (
    <Card variant="outline" size="sm">
      <CardBody>
        <HStack justify="space-between" align="center">
          <IconButton
            aria-label="Boutique précédente"
            icon={<ChevronLeftIcon />}
            onClick={handlePrevious}
            variant="ghost"
            size="sm"
            _hover={{ bg: bgHover }}
          />

          <Box textAlign="center" flex="1">
            <Text fontSize="sm" fontWeight="medium">
              {currentStock.shopName}
            </Text>
            <Badge
              colorScheme={colorScheme}
              variant={
                currentStock.shopId === currentShopId ? "solid" : "outline"
              }
              mt={1}
            >
              Stock: {currentStock.stock} unités
            </Badge>
          </Box>

          <IconButton
            aria-label="Boutique suivante"
            icon={<ChevronRightIcon />}
            onClick={handleNext}
            variant="ghost"
            size="sm"
            _hover={{ bg: bgHover }}
          />
        </HStack>
      </CardBody>
    </Card>
  );
};
