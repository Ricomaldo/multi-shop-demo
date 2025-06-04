// frontend/src/components/business/shop/SharedShopInfoBadge.tsx
import type { Shop } from "@/types";
import { useOpeningStatus } from "@/hooks/useOpeningStatus";
import { getUniverseTokens } from "@/theme/universeTokens";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  HStack,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";

interface SharedShopInfoBadgeProps {
  shops: Shop[];
  currentShop: Shop;
  onShopChange: (shop: Shop) => void;
  stockByShop?: Record<
    string,
    { total: number; lowStock: number; outOfStock: number }
  >;
  size?: "sm" | "md" | "lg";
  variant?: "compact" | "full";
  showOpeningStatus?: boolean;
}

export const SharedShopInfoBadge: React.FC<SharedShopInfoBadgeProps> = ({
  shops,
  currentShop,
  onShopChange,
  stockByShop = {},
  size = "md",
  variant = "full",
  showOpeningStatus = false,
}) => {
  const { isOpen, nextOpeningTime } = useOpeningStatus(
    currentShop.openingHours
  );

  if (!currentShop?.shopType) return null;

  const compatibleShops = shops.filter(
    (shop) => shop.shopType === currentShop.shopType
  );

  const tokens = getUniverseTokens(currentShop.shopType);
  const themeColor = tokens.meta.colorScheme;
  const shopIcon = tokens.meta.icon;

  const currentIndex = compatibleShops.findIndex(
    (shop) => shop.id === currentShop.id
  );
  const showNavigation = compatibleShops.length > 1;

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

  const stockData = stockByShop[currentShop.id] || {
    total: 0,
    lowStock: 0,
    outOfStock: 0,
  };
  const availableStock = stockData.total - stockData.outOfStock;

  const sizeStyles = {
    sm: { px: 2, py: 1, fontSize: "xs" },
    md: { px: 3, py: 1, fontSize: "sm" },
    lg: { px: 4, py: 2, fontSize: "md" },
  };

  return (
    <Box
      bg={`${themeColor}.50`}
      p={2}
      borderRadius="md"
      border="1px solid"
      borderColor={`${themeColor}.200`}
    >
      <HStack justify="space-between" align="center" spacing={2}>
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

          {showOpeningStatus && (
            <Tooltip
              label={
                !isOpen && nextOpeningTime
                  ? `Prochaine ouverture : ${nextOpeningTime}`
                  : undefined
              }
              hasArrow
            >
              <Badge
                colorScheme={isOpen ? "green" : "red"}
                variant="solid"
                borderRadius="full"
                {...sizeStyles[size]}
              >
                {isOpen ? "Ouvert maintenant" : "Fermé"}
              </Badge>
            </Tooltip>
          )}

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

        <Text fontSize={size === "sm" ? "md" : "lg"}>{shopIcon}</Text>

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
