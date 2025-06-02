import { ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";

interface StoreLocationSelectorProps {
  currentShop: Shop;
  availableShops: Shop[];
  onShopChange: (shop: Shop) => void;
  colorScheme?: string;
}

export default function StoreLocationSelector({
  currentShop,
  availableShops = [],
  onShopChange,
  colorScheme = "gray",
}: StoreLocationSelectorProps) {
  // Styles conditionnels
  const buttonBg = useColorModeValue(`${colorScheme}.50`, `${colorScheme}.900`);
  const buttonHoverBg = useColorModeValue(`${colorScheme}.100`, `${colorScheme}.800`);
  const menuItemHoverBg = useColorModeValue(`${colorScheme}.50`, `${colorScheme}.700`);
  const textColor = useColorModeValue(`${colorScheme}.700`, `${colorScheme}.100`);
  const mutedColor = useColorModeValue(`${colorScheme}.600`, `${colorScheme}.300`);

  // Vérifier et filtrer les boutiques du même type
  if (!Array.isArray(availableShops)) return null;

  const sameTypeShops = availableShops.filter(
    (shop) => shop && shop.shopType === currentShop.shopType
  );

  // Si une seule boutique, pas besoin d'afficher le sélecteur
  if (sameTypeShops.length <= 1) return null;

  return (
    <Menu autoSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        leftIcon={<InfoIcon />}
        variant="ghost"
        size="sm"
        px={4}
        bg={buttonBg}
        color={textColor}
        _hover={{ bg: buttonHoverBg }}
        _active={{ bg: buttonHoverBg }}
      >
        <Box textAlign="left">
          <Text fontSize="xs" color={mutedColor} lineHeight="1">
            Notre boutique
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            {currentShop.name?.split(" ").slice(-1)[0] || "Boutique"} {/* Sécuriser le split */}
          </Text>
        </Box>
      </MenuButton>
      <MenuList
        borderColor={`${colorScheme}.100`}
        boxShadow="lg"
        p={1}
      >
        {sameTypeShops.map((shop) => (
          <MenuItem
            key={shop.id}
            onClick={() => onShopChange(shop)}
            bg={shop.id === currentShop.id ? buttonBg : "transparent"}
            _hover={{ bg: menuItemHoverBg }}
            borderRadius="md"
            px={3}
            py={2}
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {shop.name?.split(" ").slice(-1)[0] || "Boutique"} {/* Sécuriser le split */}
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                {shop.address || "Adresse non disponible"}
              </Text>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}