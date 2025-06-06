import { getUniverseTokens } from "@/theme/universeTokens";
import type { Shop, ShopType } from "@/types";
import { ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface AdminShopSelectorProps {
  /** shopType sélectionné */
  selectedShopType: ShopType;
  /** Boutique sélectionnée */
  selectedShop: Shop | null;
  /** Liste complète des boutiques */
  shops: Shop[];
  /** Callback changement de shopType */
  onShopTypeChange: (shopType: ShopType) => void;
  /** Callback changement de boutique */
  onShopChange: (shop: Shop) => void;
  /** Taille du sélecteur */
  size?: "sm" | "md" | "lg";
  /** État du collapse */
  isCollapsed?: boolean;
}

const shopTypeOptions: ShopType[] = [
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
  selectedShopType,
  selectedShop,
  shops,
  onShopTypeChange,
  onShopChange,
  size = "md",
  isCollapsed = false,
}: AdminShopSelectorProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [lastSelectedShopId, setLastSelectedShopId] = useState<string | null>(
    null
  );

  // Styles conditionnels
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const activeBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  // Détecter quand le changement de boutique est terminé
  useEffect(() => {
    if (isChanging && selectedShop && selectedShop.id !== lastSelectedShopId) {
      // Le changement est terminé
      setIsChanging(false);
      setLastSelectedShopId(selectedShop.id);
    }
  }, [selectedShop, isChanging, lastSelectedShopId]);

  // Filtrer les boutiques du shopType sélectionné
  const availableShops = shops.filter(
    (shop) => shop.shopType === selectedShopType
  );

  const handleShopChange = async (shop: Shop) => {
    setIsChanging(true);
    setLastSelectedShopId(selectedShop?.id || null);
    try {
      await onShopChange(shop);
    } catch (error) {
      console.error("Erreur changement boutique:", error);
      setIsChanging(false);
    }
  };

  // Tokens pour le shopType sélectionné
  const tokens = getUniverseTokens(selectedShopType);

  return (
    <VStack spacing={2} align="stretch">
      {/* Sélecteur de shopType */}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          leftIcon={<Text>{tokens.meta.icon}</Text>}
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
                Type de boutique
              </Text>
            )}
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              {isCollapsed ? tokens.meta.icon : tokens.meta.displayName}
            </Text>
          </Box>
        </MenuButton>
        <MenuList zIndex={2000} maxW="250px">
          {shopTypeOptions.map((shopType) => {
            const shopTokens = getUniverseTokens(shopType);
            return (
              <MenuItem
                key={shopType}
                onClick={() => onShopTypeChange(shopType)}
                bg={shopType === selectedShopType ? hoverBg : "transparent"}
                _hover={{ bg: hoverBg }}
                minH="40px"
              >
                <HStack spacing={2}>
                  <Text>{shopTokens.meta.icon}</Text>
                  <Text fontSize="sm">{shopTokens.meta.displayName}</Text>
                </HStack>
              </MenuItem>
            );
          })}
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
            <HStack spacing={2} justify="flex-start">
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={textColor}
                noOfLines={1}
              >
                {selectedShop
                  ? isCollapsed
                    ? extractCity(selectedShop.name)
                    : extractCity(selectedShop.name)
                  : "Sélectionner"}
              </Text>
              {isChanging && <Spinner size="sm" color={textColor} />}
            </HStack>
          </Box>
        </MenuButton>
        <MenuList zIndex={2000} maxW="200px">
          {availableShops.map((shop) => (
            <MenuItem
              key={shop.id}
              onClick={() => handleShopChange(shop)}
              bg={shop.id === selectedShop?.id ? hoverBg : "transparent"}
              _hover={{ bg: hoverBg }}
              minH="36px"
              py={2}
            >
              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                {extractCity(shop.name)}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </VStack>
  );
}
