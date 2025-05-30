import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import {
  getUniverseColorScheme,
  getUniverseIcon,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

interface SharedShopInfoBadgeProps {
  /** Liste des boutiques disponibles */
  shops: Shop[];
  /** Boutique actuellement sélectionnée */
  currentShop: Shop;
  /** Callback lors du changement de boutique */
  onShopChange: (shop: Shop) => void;
  /** Données de stock par boutique */
  stockByShop?: Record<
    string,
    {
      total: number;
      lowStock: number;
      outOfStock: number;
    }
  >;
  /** Taille du composant */
  size?: "sm" | "md" | "lg";
  /** Variante d'affichage */
  variant?: "compact" | "full";
}

/**
 * Badge d'information boutique partagé avec navigation
 * Permet de voir le stock d'un produit dans différentes boutiques du même type
 */
export const SharedShopInfoBadge: React.FC<SharedShopInfoBadgeProps> = ({
  shops,
  currentShop,
  onShopChange,
  stockByShop = {},
  size = "md",
  variant = "full",
}) => {
  // Protection contre les erreurs
  if (!currentShop?.shopType) {
    return null;
  }

  // Filtrer les boutiques du même type
  const compatibleShops = shops.filter(
    (shop) => shop.shopType === currentShop.shopType
  );

  // Utilisation du helper centralisé pour l'univers
  const universe = shopTypeToUniverse(currentShop.shopType);
  const themeColor = getUniverseColorScheme(universe);
  const shopIcon = getUniverseIcon(universe);

  // Trouver l'index de la boutique actuelle
  const currentIndex = compatibleShops.findIndex(
    (shop) => shop.id === currentShop.id
  );
  const showNavigation = compatibleShops.length > 1;

  // Navigation entre boutiques compatibles
  const handlePrevious = () => {
    const newIndex =
      currentIndex > 0 ? currentIndex - 1 : compatibleShops.length - 1;
    onShopChange(compatibleShops[newIndex]);
  };

  const handleNext = () => {
    const newIndex =
      currentIndex < compatibleShops.length - 1 ? currentIndex + 1 : 0;
    onShopChange(compatibleShops[newIndex]);
  };

  // Données de stock pour la boutique actuelle
  const stockData = stockByShop[currentShop.id] || {
    total: 0,
    lowStock: 0,
    outOfStock: 0,
  };

  // Calcul du stock disponible
  const availableStock = stockData.total - stockData.outOfStock;

  return (
    <Box
      bg={`${themeColor}.50`}
      p={2}
      borderRadius="md"
      border="1px solid"
      borderColor={`${themeColor}.200`}
    >
      <HStack justify="space-between" align="center" spacing={2}>
        {/* Flèche gauche */}
        {showNavigation && (
          <IconButton
            aria-label="Boutique précédente"
            icon={<ChevronLeftIcon />}
            size="xs"
            variant="ghost"
            colorScheme={themeColor}
            onClick={handlePrevious}
          />
        )}

        {/* Infos boutique */}
        <VStack spacing={0} align="start" flex={1}>
          <Text
            fontSize={size === "sm" ? "xs" : "sm"}
            color={`${themeColor}.700`}
            fontWeight="medium"
          >
            {variant === "compact"
              ? currentShop.name
              : `Boutique : ${currentShop.name}`}
          </Text>
          <HStack spacing={1}>
            <Text fontSize="xs" color="gray.600">
              Stock :
            </Text>
            <Text
              fontSize="xs"
              fontWeight="bold"
              color={availableStock > 0 ? `${themeColor}.600` : "red.500"}
            >
              {availableStock} unité{availableStock > 1 ? "s" : ""} disponible
              {availableStock > 1 ? "s" : ""}
            </Text>
          </HStack>
        </VStack>

        {/* Icône boutique */}
        <Text fontSize={size === "sm" ? "md" : "lg"}>{shopIcon}</Text>

        {/* Flèche droite */}
        {showNavigation && (
          <IconButton
            aria-label="Boutique suivante"
            icon={<ChevronRightIcon />}
            size="xs"
            variant="ghost"
            colorScheme={themeColor}
            onClick={handleNext}
          />
        )}
      </HStack>
    </Box>
  );
};

export default SharedShopInfoBadge;
