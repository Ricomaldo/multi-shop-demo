import StoreHeroSection from "@/components/features/store/hero/StoreHeroSection";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { Shop } from "@/types";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import StoreNavigation from "./StoreNavigation";

interface StoreHeaderProps {
  shop: Shop;
  title?: string;
  subtitle?: string;
  availableShops: Shop[];
  onShopChange?: (shop: Shop) => void;
  variant?: "bold-hero" | "minimal-nav" | "gradient-full" | "natural-simple";
  imagePath?: string;
  height?: string;
  showShopSelector?: boolean;
}

/**
 * 🔥 HEADER PERSONNALISÉ PAR UNIVERS - Variantes MAGNIFIÉES
 * 🍺 bold-hero : Industrial robuste, hero imposant
 * 🍵 minimal-nav : Zen minimaliste, navigation discrète
 * 💄 gradient-full : Luxe sophistiqué, dégradés premium
 * 🌿 natural-simple : Organique naturel, simplicité authentique
 */
export default function StoreHeader({
  shop,
  title,
  subtitle,
  availableShops,
  onShopChange,
  variant,
  imagePath,
  height = "60vh",
  showShopSelector = true,
}: StoreHeaderProps) {
  // 🎯 APPLICATION DIRECTE shopType → tokens
  const tokens = getUniverseTokens(shop.shopType);

  // Utilise la variante des tokens si non spécifiée
  const effectiveVariant = variant || tokens.variants.header;

  // 🍺 BREWERY → BOLD-HERO (Industrial robuste, imposant)
  if (effectiveVariant === "bold-hero") {
    return (
      <>
        <StoreNavigation
          shop={shop}
          availableShops={availableShops}
          onShopChange={onShopChange}
          showShopSelector={showShopSelector}
        />
        <Box
          as="header"
          bg={tokens.colors[700]}
          color="white"
          py={12}
          px={4}
          position="relative"
          borderBottom="3px solid"
          borderColor={tokens.colors[600]}
        >
          <Container maxW="6xl">
            <VStack spacing={4} textAlign="center">
              <Heading
                as="h1"
                size="3xl"
                fontWeight="800"
                fontFamily="system-ui, sans-serif"
                textTransform="uppercase"
                letterSpacing="1px"
              >
                {title || shop.name}
              </Heading>
              {subtitle && (
                <Text fontSize="lg" fontWeight="500" maxW="2xl" opacity={0.9}>
                  {subtitle}
                </Text>
              )}
            </VStack>
          </Container>
        </Box>
      </>
    );
  }

  // 🍵 TEASHOP → MINIMAL-NAV (Zen épuré, navigation seule)
  if (effectiveVariant === "minimal-nav") {
    return (
      <Box
        bg="white"
        borderBottom="1px"
        borderColor={tokens.colors[200]}
        py={3}
      >
        <StoreNavigation
          shop={shop}
          availableShops={availableShops}
          onShopChange={onShopChange}
          showShopSelector={showShopSelector}
        />
      </Box>
    );
  }

  // 💄 BEAUTY → GRADIENT-FULL (Luxe sophistiqué, dégradés premium)
  if (effectiveVariant === "gradient-full") {
    return (
      <>
        <StoreNavigation
          shop={shop}
          availableShops={availableShops}
          onShopChange={onShopChange}
          showShopSelector={showShopSelector}
        />
        <Box
          as="header"
          bgGradient={`linear(135deg, ${tokens.colors[500]}, ${tokens.colors[400]})`}
          py={16}
          px={4}
          color="white"
        >
          <Container maxW="6xl">
            <VStack spacing={6} textAlign="center">
              <Box
                w="50px"
                h="50px"
                bg="white"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xl"
                color={tokens.colors[600]}
              >
                {tokens.meta.icon}
              </Box>
              <Heading
                as="h1"
                size="2xl"
                fontWeight="400"
                fontFamily="'Playfair Display', serif"
                letterSpacing="-0.5px"
              >
                {title || shop.name}
              </Heading>
              {subtitle && (
                <Text fontSize="md" maxW="xl" fontWeight="300" opacity={0.95}>
                  {subtitle}
                </Text>
              )}
            </VStack>
          </Container>
        </Box>
      </>
    );
  }

  // 🌿 HERB → NATURAL-SIMPLE (Organique naturel, simplicité authentique)
  if (effectiveVariant === "natural-simple") {
    return (
      <>
        <StoreNavigation
          shop={shop}
          availableShops={availableShops}
          onShopChange={onShopChange}
          showShopSelector={showShopSelector}
        />
        <Box
          as="header"
          bg={tokens.colors[50]}
          py={10}
          px={4}
          borderBottom="2px solid"
          borderColor={tokens.colors[300]}
        >
          <Container maxW="5xl">
            <VStack spacing={4} textAlign="center">
              <Text fontSize="2xl" color={tokens.colors[500]}>
                {tokens.meta.icon}
              </Text>
              <Heading
                as="h1"
                size="xl"
                fontWeight="600"
                fontFamily="'Merriweather', serif"
                color={tokens.colors[800]}
              >
                {title || shop.name}
              </Heading>
              {subtitle && (
                <Text
                  fontSize="md"
                  color={tokens.colors[600]}
                  maxW="lg"
                  fontFamily="'Open Sans', sans-serif"
                >
                  {subtitle}
                </Text>
              )}
            </VStack>
          </Container>
        </Box>
      </>
    );
  }

  // Fallback - utilise bold-hero par défaut
  return (
    <>
      <StoreNavigation
        shop={shop}
        availableShops={availableShops}
        onShopChange={onShopChange}
        showShopSelector={showShopSelector}
      />
      <StoreHeroSection
        shop={shop}
        title={title}
        subtitle={subtitle}
        imagePath={imagePath}
        height={height}
      />
    </>
  );
}
