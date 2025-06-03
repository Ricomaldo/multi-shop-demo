import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import type { Shop } from "../../../../shared/types";
import { shopTypeToUniverse } from "../../utils/universeMapping";
import SharedShopInfoBadge from "../shared/SharedShopInfoBadge";
import StoreLocationSelector from "./StoreLocationSelector";

interface StoreHeroHeaderProps {
  /** La boutique courante */
  shop: Shop;
  /** Titre personnalisé (sinon utilise le nom de la boutique) */
  title?: string;
  /** Sous-titre personnalisé (sinon utilise la description de la boutique) */
  subtitle?: string;
  /** Liste des boutiques disponibles */
  availableShops: Shop[];
  /** Callback appelé quand l'utilisateur change de boutique */
  onShopChange?: (shop: Shop) => void;
}

/**
 * Bannière immersive pour les pages vitrine
 * S'adapte automatiquement à l'univers de la boutique
 */
export default function StoreHeroHeader({
  shop,
  title,
  subtitle,
  availableShops,
  onShopChange,
}: StoreHeroHeaderProps) {
  const [currentShop, setCurrentShop] = useState(shop);
  const universe = shopTypeToUniverse(shop.shopType);

  // Définir le colorScheme en fonction de l'univers
  const colorScheme = (() => {
    switch (universe) {
      case "brewery":
        return "orange";
      case "teaShop":
        return "green";
      case "beautyShop":
        return "pink";
      case "herbShop":
        return "teal";
      default:
        return "gray";
    }
  })();

  // Hooks de style
  const bgGradient = useColorModeValue(
    `linear(to-b, ${colorScheme}.50, white)`,
    `linear(to-b, ${colorScheme}.900, gray.900)`
  );
  const titleColor = useColorModeValue(`${colorScheme}.700`, `${colorScheme}.200`);
  const subtitleColor = useColorModeValue(`${colorScheme}.600`, `${colorScheme}.300`);
  const mutedColor = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.400`);

  const handleShopChange = (newShop: Shop) => {
    setCurrentShop(newShop);
    onShopChange?.(newShop);
  };

  return (
    <Box as="header" bgGradient={bgGradient} pt={8} pb={12}>
      <Container maxW="7xl">
        <Flex direction="column" align="center" textAlign="center" gap={4}>
          <StoreLocationSelector
            currentShop={currentShop}
            availableShops={availableShops}
            onShopChange={handleShopChange}
            colorScheme={colorScheme}
          />

          <VStack spacing={4}>
            <Heading
              as="h1"
              size="2xl"
              color={titleColor}
            >
              {title || currentShop.name}
            </Heading>

            {subtitle && (
              <Text
                fontSize="lg"
                color={subtitleColor}
                maxW="2xl"
              >
                {subtitle}
              </Text>
            )}

            {/* Informations boutique */}
            <VStack spacing={2} pt={4}>
              <SharedShopInfoBadge
                shops={[currentShop]}
                currentShop={currentShop}
                onShopChange={() => {}}
                showOpeningStatus={true}
                variant="compact"
              />

              <Text fontSize="sm" color={mutedColor}>
                📍 {currentShop.address}
              </Text>

              <Text fontSize="sm" color={mutedColor}>
                📞 {currentShop.phone}
              </Text>
            </VStack>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}
