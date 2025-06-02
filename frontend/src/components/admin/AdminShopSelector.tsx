import { ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorModeValue
} from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import type { UniverseType } from "../../contexts/UniverseContext";
import {
  getUniverseIcon,
  getUniverseName,
  shopTypeToUniverse
} from "../../utils/universeMapping";

interface AdminShopSelectorProps {
  /** Univers sélectionné */
  selectedUniverse: UniverseType;
  /** Boutique sélectionnée */
  selectedShop: Shop | null;
  /** Liste complète des boutiques */
  shops: Shop[];
  /** Callback changement d'univers */
  onUniverseChange: (universe: UniverseType) => void;
  /** Callback changement de boutique */
  onShopChange: (shop: Shop) => void;
  /** Taille du sélecteur */
  size?: "sm" | "md" | "lg";
  /** État du collapse */
  isCollapsed?: boolean;
}

const universeOptions: UniverseType[] = [
  "brewery",
  "teaShop",
  "beautyShop",
  "herbShop",
];

// Fonction utilitaire pour extraire la ville du nom de la boutique
const extractCity = (shopName: string) => {
  const parts = shopName.split(" - ");
  return parts.length > 1 ? parts[parts.length - 1] : shopName;
};

export default function AdminShopSelector({
  selectedUniverse,
  selectedShop,
  shops,
  onUniverseChange,
  onShopChange,
  size = "md",
  isCollapsed = false,
}: AdminShopSelectorProps) {
  // Styles conditionnels
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const activeBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  // Filtrer les boutiques de l'univers sélectionné
  const availableShops = shops.filter(
    (shop) => shopTypeToUniverse(shop.shopType) === selectedUniverse
  );

  return (
    <VStack spacing={2} align="stretch">
      {/* Sélecteur d'univers */}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          leftIcon={<Text>{getUniverseIcon(selectedUniverse)}</Text>}
          w="full"
          size={size}
          variant="outline"
          bg={bgColor}
          borderColor={borderColor}
          _hover={{ bg: hoverBg }}
          _active={{ bg: activeBg }}
        >
          <Box textAlign="left">
            {!isCollapsed && (
              <Text fontSize="xs" color={mutedColor}>
                Univers
              </Text>
            )}
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              {isCollapsed ? getUniverseIcon(selectedUniverse) : getUniverseName(selectedUniverse)}
            </Text>
          </Box>
        </MenuButton>
        <MenuList>
          {universeOptions.map((universe) => (
            <MenuItem
              key={universe}
              onClick={() => onUniverseChange(universe)}
              bg={universe === selectedUniverse ? hoverBg : "transparent"}
              _hover={{ bg: hoverBg }}
            >
              <HStack>
                <Text>{getUniverseIcon(universe)}</Text>
                <Text>{getUniverseName(universe)}</Text>
              </HStack>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      {/* Sélecteur de boutique */}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          leftIcon={<InfoIcon />}
          w="full"
          size={size}
          variant="outline"
          bg={bgColor}
          borderColor={borderColor}
          _hover={{ bg: hoverBg }}
          _active={{ bg: activeBg }}
        >
          <Box textAlign="left">
            {!isCollapsed && (
              <Text fontSize="xs" color={mutedColor}>
                Boutique
              </Text>
            )}
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              {selectedShop ? (isCollapsed ? extractCity(selectedShop.name) : extractCity(selectedShop.name)) : "Sélectionner"}
            </Text>
          </Box>
        </MenuButton>
        <MenuList>
          {availableShops.map((shop) => (
            <MenuItem
              key={shop.id}
              onClick={() => onShopChange(shop)}
              bg={shop.id === selectedShop?.id ? hoverBg : "transparent"}
              _hover={{ bg: hoverBg }}
            >
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">{extractCity(shop.name)}</Text>
                <Text fontSize="xs" color={mutedColor}>
                  {shop.address}
                </Text>
              </VStack>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </VStack>
  );
}