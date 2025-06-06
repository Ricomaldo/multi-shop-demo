import { useOpeningStatus } from "@/hooks/useOpeningStatus";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { Shop } from "@/types/index";
import { Badge, Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";

interface StoreShopInfoBadgeProps {
  shop: Shop;
  variant?: "rectangular" | "pill" | "diamond" | "leaf";
}

/**
 * 🔥 BADGE PERSONNALISÉ PAR UNIVERS - Formes UNIQUES
 * 🍺 rectangular : Forme rectangulaire industrielle, angles nets
 * 🍵 pill : Forme pilule zen, courbes douces
 * 💄 diamond : Forme diamant luxe, géométrie raffinée
 * 🌿 leaf : Forme feuille organique, contours naturels
 */

export default function StoreShopInfoBadge({
  shop,
  variant,
}: StoreShopInfoBadgeProps) {
  const tokens = getUniverseTokens(shop.shopType);
  const { isOpen: shopIsOpen, nextOpeningTime } = useOpeningStatus(
    shop.openingHours
  );

  // Utilise la variante des tokens si non spécifiée
  const effectiveVariant = variant || tokens.variants.badge;

  const getUniverseLabel = (shopType: string) => {
    const labels = {
      brewery: "Brasserie",
      teaShop: "Salon de Thé",
      beautyShop: "Institut",
      herbShop: "Herboristerie",
    };
    return labels[shopType as keyof typeof labels] || shopType;
  };

  // 🍺 BREWERY → RECTANGULAR (Forme rectangulaire industrielle)
  if (effectiveVariant === "rectangular") {
    return (
      <Box
        bg={tokens.colors[600]}
        color="white"
        borderRadius={tokens.borderRadius.base}
        p={5}
        shadow="md"
        border="2px solid"
        borderColor={tokens.colors[500]}
      >
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Badge
              bg={tokens.colors[500]}
              color="white"
              borderRadius={tokens.borderRadius.base}
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="700"
              textTransform="uppercase"
            >
              {getUniverseLabel(shop.shopType)}
            </Badge>
            <Badge
              bg={shopIsOpen ? "green.500" : "red.500"}
              color="white"
              borderRadius={tokens.borderRadius.base}
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="700"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Box w="8px" h="8px" bg="white" borderRadius="sm" />
              {shopIsOpen ? "OUVERT" : "FERMÉ"}
            </Badge>
          </HStack>

          <Text
            fontSize="lg"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            {shop.name}
          </Text>

          {!shopIsOpen && nextOpeningTime && (
            <HStack spacing={2}>
              <Icon as={FiClock} boxSize="4" />
              <Text fontSize="sm" fontWeight="500">
                Ouvre {nextOpeningTime}
              </Text>
            </HStack>
          )}
        </VStack>
      </Box>
    );
  }

  // 🍵 TEASHOP → PILL (Forme pilule zen, courbes douces)
  if (effectiveVariant === "pill") {
    return (
      <Box
        bg="white"
        borderRadius="25px"
        p={5}
        shadow="lg"
        border="1px solid"
        borderColor={tokens.colors[200]}
      >
        <VStack spacing={3} align="center">
          <HStack spacing={3}>
            <Badge
              bg={tokens.colors[100]}
              color={tokens.colors[700]}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="400"
            >
              {getUniverseLabel(shop.shopType)}
            </Badge>
            <Badge
              bg={shopIsOpen ? "green.50" : "red.50"}
              color={shopIsOpen ? "green.700" : "red.700"}
              borderRadius="full"
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="400"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg={shopIsOpen ? "green.400" : "red.400"}
              />
              {shopIsOpen ? "Ouvert" : "Fermé"}
            </Badge>
          </HStack>

          <Text
            fontSize="md"
            fontWeight="500"
            color={tokens.colors[800]}
            textAlign="center"
          >
            {shop.name}
          </Text>

          {!shopIsOpen && nextOpeningTime && (
            <HStack spacing={2}>
              <Icon as={FiClock} boxSize="4" color={tokens.colors[400]} />
              <Text fontSize="sm" color={tokens.colors[600]}>
                Ouvre {nextOpeningTime}
              </Text>
            </HStack>
          )}
        </VStack>
      </Box>
    );
  }

  // 💄 BEAUTY → DIAMOND (Forme diamant luxe, géométrie raffinée)
  if (effectiveVariant === "diamond") {
    return (
      <Box
        bg="white"
        borderRadius="xl"
        p={6}
        shadow="xl"
        border="1px solid"
        borderColor={tokens.colors[200]}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          bgGradient: `linear(to-r, ${tokens.colors[500]}, ${tokens.colors[400]})`,
        }}
      >
        <VStack spacing={4} align="center">
          <HStack spacing={3}>
            <Badge
              bg={tokens.colors[50]}
              color={tokens.colors[600]}
              borderRadius="lg"
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="500"
            >
              {getUniverseLabel(shop.shopType)}
            </Badge>
            <Badge
              bg={shopIsOpen ? "green.500" : "red.500"}
              color="white"
              borderRadius="lg"
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="500"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg="white"
                opacity={0.8}
              />
              {shopIsOpen ? "Ouvert" : "Fermé"}
            </Badge>
          </HStack>

          <Text
            fontSize="lg"
            fontWeight="400"
            fontFamily="'Playfair Display', serif"
            color={tokens.colors[800]}
            textAlign="center"
          >
            {shop.name}
          </Text>

          {!shopIsOpen && nextOpeningTime && (
            <HStack spacing={2}>
              <Icon as={FiClock} boxSize="4" color={tokens.colors[500]} />
              <Text fontSize="sm" color={tokens.colors[600]}>
                Ouvre {nextOpeningTime}
              </Text>
            </HStack>
          )}
        </VStack>
      </Box>
    );
  }

  // 🌿 HERB → LEAF (Forme feuille organique, contours naturels)
  if (effectiveVariant === "leaf") {
    return (
      <Box
        bg={tokens.colors[50]}
        p={5}
        borderRadius="lg"
        border="1px solid"
        borderColor={tokens.colors[300]}
        shadow="md"
        position="relative"
        _before={{
          content: `"${tokens.meta.icon}"`,
          position: "absolute",
          top: 2,
          right: 3,
          fontSize: "lg",
          color: tokens.colors[400],
          opacity: 0.6,
        }}
      >
        <VStack spacing={3} align="start">
          <HStack spacing={3}>
            <Badge
              bg={tokens.colors[200]}
              color={tokens.colors[800]}
              borderRadius="md"
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="600"
            >
              {getUniverseLabel(shop.shopType)}
            </Badge>
            <Badge
              bg={shopIsOpen ? "green.100" : "red.100"}
              color={shopIsOpen ? "green.800" : "red.800"}
              borderRadius="md"
              px={3}
              py={1}
              fontSize="sm"
              fontWeight="600"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="sm"
                bg={shopIsOpen ? "green.500" : "red.500"}
              />
              {shopIsOpen ? "Ouvert" : "Fermé"}
            </Badge>
          </HStack>

          <Text
            fontSize="md"
            fontWeight="600"
            fontFamily="'Merriweather', serif"
            color={tokens.colors[800]}
          >
            {shop.name}
          </Text>

          {!shopIsOpen && nextOpeningTime && (
            <HStack spacing={2}>
              <Icon as={FiClock} boxSize="4" color={tokens.colors[500]} />
              <Text fontSize="sm" color={tokens.colors[600]}>
                Ouvre {nextOpeningTime}
              </Text>
            </HStack>
          )}
        </VStack>
      </Box>
    );
  }

  // Fallback - utilise rectangular par défaut
  return (
    <Box
      bg={`linear-gradient(135deg, ${tokens.colors[50]} 0%, white 100%)`}
      borderWidth="1px"
      borderColor={tokens.colors[200]}
      borderRadius={tokens.borderRadius.lg}
      p={4}
      shadow="sm"
    >
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between" align="center">
          <Badge
            colorScheme={tokens.meta.colorScheme}
            borderRadius={tokens.borderRadius.base}
            px={3}
            py={1}
            fontSize="sm"
          >
            {getUniverseLabel(shop.shopType)}
          </Badge>
          <Badge
            colorScheme={shopIsOpen ? "green" : "red"}
            borderRadius="full"
            fontSize="sm"
            px={4}
            py={2}
            fontWeight="bold"
          >
            {shopIsOpen ? "Ouvert" : "Fermé"}
          </Badge>
        </HStack>
        <Text fontSize="md" fontWeight="bold" color={tokens.colors[800]}>
          {shop.name}
        </Text>
      </VStack>
    </Box>
  );
}
