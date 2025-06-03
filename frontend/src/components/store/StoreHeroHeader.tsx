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
  shop: Shop;
  title?: string;
  subtitle?: string;
  availableShops: Shop[];
  onShopChange?: (shop: Shop) => void;
  variant?: "simple" | "full"; // ⭐ AJOUTER
  imagePath?: string; // ⭐ AJOUTER
  height?: string; // ⭐ AJOUTER
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
  variant = "full", // ⭐ AJOUTER
  imagePath,
  height = "50vh",
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

  if (variant === "simple") {
    return (
      <Box
        as="header"
        position="relative"
        height={height}
        backgroundImage={imagePath ? `url(${imagePath})` : undefined}
        backgroundSize="cover"
        backgroundPosition="center"
        mb={8}
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.600" />
        <Container maxW="7xl" height="100%" position="relative" zIndex={1}>
          <VStack height="100%" justify="center" align="center" spacing={4} textAlign="center" color="white">
            <Heading as="h1" size="2xl" fontWeight="bold" textShadow="2px 2px 4px rgba(0,0,0,0.4)">
              {title || currentShop.name}
            </Heading>
            {subtitle && (
              <Text fontSize="xl" maxW="2xl" textShadow="1px 1px 2px rgba(0,0,0,0.4)">
                {subtitle}
              </Text>
            )}
          </VStack>
        </Container>
      </Box>
    );
  }

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
