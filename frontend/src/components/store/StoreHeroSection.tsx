import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import { getUniverseTokens } from "../../theme/universeTokens";

interface StoreHeroSectionProps {
  shop: Shop;
  title?: string;
  subtitle?: string;
  imagePath?: string;
  height?: string;
  overlay?: boolean;
}

/**
 * Section hero avec image background pour les pages vitrine
 * 🎯 APPLICATION DIRECTE shopType → tokens (plus de mapping !)
 */
export default function StoreHeroSection({
  shop,
  title,
  subtitle,
  imagePath,
  height = "60vh",
  overlay = true,
}: StoreHeroSectionProps) {
  // 🎯 APPLICATION DIRECTE shopType → tokens (plus de mapping !)
  const tokens = getUniverseTokens(shop.shopType);

  // Images par défaut selon le shopType (depuis tokens)
  const heroImage = imagePath || tokens.imagePaths.hero;

  // Overlay selon le shopType (plus subtil pour TeaShop, plus marqué pour Brewery)
  const overlayColor = (() => {
    switch (shop.shopType) {
      case "brewery":
        return `${tokens.colors[900]}CC`; // Overlay plus opaque, robust
      case "teaShop":
        return `${tokens.colors[800]}80`; // Overlay doux, zen
      case "beautyShop":
        return `${tokens.colors[800]}99`; // Overlay sophistiqué
      case "herbShop":
        return `${tokens.colors[800]}B3`; // Overlay naturel
      default:
        return `${tokens.colors[800]}99`;
    }
  })();

  // Opacity par shopType pour le sous-titre
  const getSubtitleOpacity = () => {
    switch (shop.shopType) {
      case "brewery":
        return 0.95; // Très visible - direct
      case "teaShop":
        return 0.85; // Subtil - zen
      case "beautyShop":
        return 0.9; // Raffiné
      case "herbShop":
        return 0.88; // Naturel
      default:
        return 0.9;
    }
  };

  // Spacing responsive selon le shopType
  const getResponsiveSpacing = () => {
    switch (shop.shopType) {
      case "brewery":
        return { base: 6, md: 8 }; // Plus compact - robuste
      case "teaShop":
        return { base: 8, md: 12 }; // Plus aéré - zen
      case "beautyShop":
        return { base: 6, md: 10 }; // Élégant
      case "herbShop":
        return { base: 6, md: 8 }; // Naturel
      default:
        return { base: 6, md: 8 };
    }
  };

  const spacing = getResponsiveSpacing();

  return (
    <Box
      position="relative"
      height={{ base: "50vh", md: height }}
      backgroundImage={`url(${heroImage})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundAttachment={{ base: "scroll", md: "fixed" }}
      overflow="hidden"
      borderRadius={tokens.borderRadius.base}
    >
      {overlay && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={overlayColor}
          backdropFilter="blur(1px)"
          borderRadius={tokens.borderRadius.base}
        />
      )}

      <Container
        maxW="7xl"
        height="100%"
        position="relative"
        zIndex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: 4, md: 6 }}
      >
        <VStack
          spacing={spacing}
          textAlign="center"
          color="white"
          maxW="4xl"
          px={{ base: 4, md: 0 }}
        >
          <Heading
            as="h1"
            size={{ base: "xl", md: "2xl", lg: "3xl" }}
            fontWeight={tokens.typography.fontWeight.heavy}
            fontFamily={tokens.typography.fontFamily.heading}
            textShadow="2px 2px 8px rgba(0,0,0,0.8)"
            lineHeight="shorter"
            letterSpacing="tight"
          >
            {title || shop.name}
          </Heading>

          {subtitle && (
            <Text
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              textShadow="1px 1px 4px rgba(0,0,0,0.8)"
              lineHeight="tall"
              fontWeight={tokens.typography.fontWeight.normal}
              fontFamily={tokens.typography.fontFamily.body}
              opacity={getSubtitleOpacity()}
            >
              {subtitle}
            </Text>
          )}
        </VStack>
      </Container>

      {/* Gradient fade en bas selon le shopType */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="100px"
        bgGradient={`linear(to-t, ${tokens.colors[900]}60, transparent)`}
        pointerEvents="none"
        borderBottomRadius={tokens.borderRadius.base}
      />
    </Box>
  );
}
