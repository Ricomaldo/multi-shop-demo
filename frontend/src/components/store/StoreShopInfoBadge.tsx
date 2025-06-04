import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import { useOpeningStatus } from "../../hooks/useOpeningStatus";
import {
  getUniverseColorScheme,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

interface StoreShopInfoBadgeProps {
  shops: Shop[];
  currentShop: Shop;
  onShopChange?: (shop: Shop) => void;
  colorScheme?: string;
  size?: "sm" | "md" | "lg";
  showOpeningStatus?: boolean;
}

/**
 * Badge boutique élégant et professionnel pour les pages vitrine
 * Design épuré sans emoji, focus sur l'essentiel : nom boutique + status ouverture
 * Navigation entre boutiques du même type via menu dropdown élégant
 */
export default function StoreShopInfoBadge({
  shops,
  currentShop,
  onShopChange,
  colorScheme: customColorScheme,
  size = "md",
  showOpeningStatus = true,
}: StoreShopInfoBadgeProps) {
  // Hooks en premier - avant tout return conditionnel
  const { isOpen, nextOpeningTime } = useOpeningStatus(
    currentShop?.openingHours
  );

  // Calculer les valeurs de thème
  const universe = shopTypeToUniverse(currentShop?.shopType || "brewery");
  const themeColor = customColorScheme || getUniverseColorScheme(universe);

  // Styles adaptatifs selon le thème - hooks avant return
  const bg = useColorModeValue(
    "rgba(255, 255, 255, 0.85)",
    "rgba(26, 32, 44, 0.85)"
  );
  const borderColor = useColorModeValue(
    "rgba(255, 255, 255, 0.3)",
    "rgba(255, 255, 255, 0.1)"
  );
  const textColor = useColorModeValue(`${themeColor}.700`, `${themeColor}.200`);
  const hoverBg = useColorModeValue(
    "rgba(255, 255, 255, 0.95)",
    "rgba(26, 32, 44, 0.95)"
  );

  // Return conditionnel après les hooks
  if (!currentShop?.shopType) return null;

  const compatibleShops = shops.filter(
    (shop) => shop.shopType === currentShop.shopType
  );
  const showNavigation = compatibleShops.length > 1;

  const sizeStyles = {
    sm: { px: 3, py: 2, fontSize: "sm" },
    md: { px: 4, py: 2, fontSize: "md" },
    lg: { px: 5, py: 3, fontSize: "lg" },
  };

  if (!showNavigation) {
    // Version simple sans navigation - design glassmorphism
    return (
      <Box
        bg={bg}
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="xl"
        shadow="lg"
        backdropFilter="blur(20px) saturate(150%)"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          shadow: "xl",
          borderColor: `${themeColor}.300`,
          transform: "translateY(-2px)",
        }}
        {...sizeStyles[size]}
      >
        <HStack spacing={3}>
          <Text color={textColor} fontWeight="medium">
            {currentShop.name}
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
                fontSize="xs"
                px={2}
                py={1}
              >
                {isOpen ? "Ouvert" : "Fermé"}
              </Badge>
            </Tooltip>
          )}
        </HStack>
      </Box>
    );
  }

  // Version avec menu de navigation - glassmorphism professionnel
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        bg={bg}
        borderWidth={1}
        borderColor={borderColor}
        color={textColor}
        backdropFilter="blur(20px) saturate(150%)"
        _hover={{
          borderColor: `${themeColor}.300`,
          bg: hoverBg,
          transform: "translateY(-2px)",
          shadow: "xl",
        }}
        _active={{
          borderColor: `${themeColor}.400`,
          transform: "translateY(0px)",
        }}
        borderRadius="xl"
        shadow="lg"
        fontWeight="medium"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        {...sizeStyles[size]}
      >
        <HStack spacing={3}>
          <Text>{currentShop.name}</Text>

          {showOpeningStatus && (
            <Badge
              colorScheme={isOpen ? "green" : "red"}
              variant="solid"
              borderRadius="full"
              fontSize="xs"
              px={2}
              py={1}
            >
              {isOpen ? "Ouvert" : "Fermé"}
            </Badge>
          )}
        </HStack>
      </MenuButton>

      <MenuList
        borderColor={borderColor}
        shadow="2xl"
        borderWidth={1}
        borderRadius="xl"
        overflow="hidden"
        bg={bg}
        backdropFilter="blur(25px) saturate(150%)"
      >
        {compatibleShops.map((shop) => (
          <MenuItem
            key={shop.id}
            onClick={() => onShopChange?.(shop)}
            bg={shop.id === currentShop.id ? hoverBg : "transparent"}
            _hover={{ bg: hoverBg }}
            color={textColor}
            px={4}
            py={3}
            transition="all 0.2s"
          >
            <HStack justify="space-between" w="full">
              <Text
                fontWeight={shop.id === currentShop.id ? "semibold" : "normal"}
              >
                {shop.name}
              </Text>
              {shop.id === currentShop.id && (
                <Badge colorScheme={themeColor} size="sm">
                  Actuel
                </Badge>
              )}
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
