import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import type { UniverseType } from "../../contexts/UniverseContext";
import { type UniverseIcon } from "../../utils/universeMapping";

interface SharedUniverseSelectorProps {
  mode: "shop" | "universe"; // Mode sélection boutique vs univers
  // Props pour mode shop
  shops?: Shop[];
  selectedShop?: Shop | null;
  onShopChange?: (shop: Shop) => void;
  loading?: boolean;
  // Props pour mode universe
  universe?: UniverseType;
  onUniverseChange?: (universe: UniverseType) => void;
  // Props communes
  title?: string;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "solid" | "ghost";
  showDescription?: boolean;
}

interface UniverseOption {
  type: UniverseType;
  label: string;
  icon: UniverseIcon;
  description: string;
  colorScheme: string;
}

const universeOptions: UniverseOption[] = [
  {
    type: "brewery",
    label: "Houblon & Tradition",
    icon: { emoji: "🍺", label: "bière" },
    description: "Brasserie artisanale",
    colorScheme: "orange",
  },
  {
    type: "teaShop",
    label: "Les Jardins de Darjeeling",
    icon: { emoji: "🍵", label: "thé" },
    description: "Salon de thé",
    colorScheme: "green",
  },
  {
    type: "beautyShop",
    label: "L'Écrin de Jade",
    icon: { emoji: "💄", label: "beauté" },
    description: "Institut beauté",
    colorScheme: "pink",
  },
  {
    type: "herbShop",
    label: "Herboristerie du Moulin Vert",
    icon: { emoji: "🌿", label: "herbes" },
    description: "Herboristerie traditionnelle",
    colorScheme: "teal",
  },
];

/**
 * Composant partagé universel pour la sélection boutique/univers
 * Unifie AdminShopSelector et AdminUniverseSelector
 * Mode shop: Sélection de boutique avec données réelles
 * Mode universe: Sélection d'univers thématique
 */
export default function SharedUniverseSelector({
  mode,
  // Props shop
  shops = [],
  selectedShop,
  onShopChange,
  loading = false,
  // Props universe
  universe,
  onUniverseChange,
  // Props communes
  title,
  size = "md",
  variant = "outline",
  showDescription = true,
}: SharedUniverseSelectorProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Utilitaires pour les boutiques
  const getShopIcon = (shopType: string): UniverseIcon => {
    const option = universeOptions.find((opt) => opt.type === shopType);
    return option?.icon || { emoji: "🏪", label: "boutique" };
  };

  const getShopColor = (shopType: string) => {
    const option = universeOptions.find((opt) => opt.type === shopType);
    return option?.colorScheme || "blue";
  };

  const getShopDescription = (shopType: string) => {
    const option = universeOptions.find((opt) => opt.type === shopType);
    return option?.description || shopType.replace("-", " ");
  };

  // Titre par défaut selon le mode
  const defaultTitle =
    mode === "shop" ? "Sélectionner une boutique" : "Univers Boutique";
  const effectiveTitle = title || defaultTitle;

  // Rendu en mode shop (sélection de boutiques réelles)
  if (mode === "shop") {
    if (loading) {
      return (
        <Box
          p={4}
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
        >
          <Text fontSize={size === "sm" ? "sm" : "md"}>
            Chargement des boutiques...
          </Text>
        </Box>
      );
    }

    return (
      <Box
        p={4}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
      >
        <VStack spacing={4} align="stretch">
          <Text
            fontWeight="semibold"
            fontSize={size === "sm" ? "sm" : "md"}
            color="gray.600"
          >
            {effectiveTitle} :
          </Text>

          <VStack spacing={2} align="stretch">
            {shops.map((shop) => {
              const isSelected = selectedShop?.id === shop.id;
              const colorScheme = getShopColor(shop.shopType);

              return (
                <Button
                  key={shop.id}
                  variant={isSelected ? "solid" : variant}
                  colorScheme={colorScheme}
                  onClick={() => onShopChange?.(shop)}
                  justifyContent="flex-start"
                  size={size}
                  leftIcon={
                    <Text fontSize={size === "sm" ? "md" : "lg"}>
                      <span
                        role="img"
                        aria-label={getShopIcon(shop.shopType).label}
                      >
                        {getShopIcon(shop.shopType).emoji}
                      </span>
                    </Text>
                  }
                >
                  <VStack spacing={0} align="start" flex="1">
                    <Text
                      fontWeight="medium"
                      fontSize={size === "sm" ? "xs" : "sm"}
                    >
                      {shop.name}
                    </Text>
                    {showDescription && (
                      <Text
                        fontSize={size === "sm" ? "xs" : "xs"}
                        opacity={0.8}
                      >
                        {getShopDescription(shop.shopType)}
                      </Text>
                    )}
                  </VStack>
                </Button>
              );
            })}
          </VStack>

          {selectedShop && showDescription && (
            <Box
              p={3}
              bg={`${getShopColor(selectedShop.shopType)}.50`}
              borderRadius="md"
            >
              <HStack spacing={2}>
                <Text fontSize={size === "sm" ? "md" : "lg"}>
                  <span
                    role="img"
                    aria-label={getShopIcon(selectedShop.shopType).label}
                  >
                    {getShopIcon(selectedShop.shopType).emoji}
                  </span>
                </Text>
                <VStack spacing={0} align="start" flex="1">
                  <Text
                    fontWeight="medium"
                    fontSize={size === "sm" ? "xs" : "sm"}
                  >
                    Boutique active : {selectedShop.name}
                  </Text>
                  <Text fontSize={size === "sm" ? "xs" : "xs"} color="gray.600">
                    {selectedShop.categories?.length || 0} catégorie(s)
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>
    );
  }

  // Rendu en mode universe (sélection d'univers thématique)
  const currentUniverse = universeOptions.find((opt) => opt.type === universe);
  const currentColorScheme = currentUniverse?.colorScheme || "blue";

  return (
    <Box p={4} bg="gray.50" borderRadius="md" _dark={{ bg: "gray.700" }}>
      <Text
        mb={3}
        fontWeight="bold"
        color="gray.700"
        _dark={{ color: "gray.200" }}
        fontSize={size === "sm" ? "sm" : "md"}
      >
        🏪 {effectiveTitle}
      </Text>

      <Flex direction="column" gap={2}>
        {universeOptions.map((option) => (
          <Button
            key={option.type}
            size={size}
            colorScheme={option.type === universe ? currentColorScheme : "gray"}
            variant={option.type === universe ? "solid" : variant}
            onClick={() => onUniverseChange?.(option.type)}
            leftIcon={
              <Text>
                <span role="img" aria-label={option.icon.label}>
                  {option.icon.emoji}
                </span>
              </Text>
            }
            justifyContent="flex-start"
            w="full"
            fontSize={size === "sm" ? "xs" : "sm"}
          >
            <Text noOfLines={1}>{option.label}</Text>
          </Button>
        ))}
      </Flex>

      {showDescription && currentUniverse && (
        <Text
          mt={2}
          fontSize={size === "sm" ? "xs" : "sm"}
          color="gray.600"
          _dark={{ color: "gray.400" }}
        >
          Univers actuel : {currentUniverse.description}
        </Text>
      )}
    </Box>
  );
}
