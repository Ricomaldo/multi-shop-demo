import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import { shopTypeToUniverse } from "../../utils/universeMapping";

interface StoreHeroSectionProps {
  shop: Shop;
  title?: string;
  subtitle?: string;
  imagePath?: string;
  height?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

/**
 * Section hero avec image background pour les pages vitrine
 * Séparée de la navigation pour plus de flexibilité UX
 * Images par défaut selon l'univers + overlay personnalisable
 */
export default function StoreHeroSection({
  shop,
  title,
  subtitle,
  imagePath,
  height = "60vh",
  overlay = true,
  overlayOpacity = 0.6,
}: StoreHeroSectionProps) {
  const universe = shopTypeToUniverse(shop.shopType);

  // Images par défaut selon l'univers
  const getDefaultImage = () => {
    switch (universe) {
      case "brewery":
        return "/images/hero/brewery-hero.jpg";
      case "teaShop":
        return "/images/hero/tea-hero.jpg";
      case "beautyShop":
        return "/images/hero/beauty-hero.jpg";
      case "herbShop":
        return "/images/hero/herb-hero.jpg";
      default:
        return "/images/hero/default-hero.jpg";
    }
  };

  const heroImage = imagePath || getDefaultImage();

  return (
    <Box
      position="relative"
      height={height}
      backgroundImage={`url(${heroImage})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundAttachment={{ base: "scroll", md: "fixed" }}
      overflow="hidden"
    >
      {overlay && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={`blackAlpha.${Math.round(overlayOpacity * 900)}`}
          backdropFilter="blur(1px)"
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
      >
        <VStack
          spacing={{ base: 4, md: 6 }}
          textAlign="center"
          color="white"
          maxW="4xl"
          px={{ base: 4, md: 0 }}
        >
          <Heading
            as="h1"
            size={{ base: "xl", md: "2xl", lg: "3xl" }}
            fontWeight="bold"
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
              fontWeight="medium"
              opacity={0.95}
            >
              {subtitle}
            </Text>
          )}
        </VStack>
      </Container>

      {/* Gradient fade en bas pour transition douce */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="100px"
        bgGradient="linear(to-t, blackAlpha.300, transparent)"
        pointerEvents="none"
      />
    </Box>
  );
}
