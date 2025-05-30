import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import {
  getUniverseColorScheme,
  getUniverseIcon,
} from "../../utils/universeMapping";
import OpeningBadge from "../shared/OpeningBadge";

interface StoreHeroHeaderProps {
  /** La boutique courante */
  shop: Shop;
  /** Titre personnalisé (sinon utilise le nom de la boutique) */
  title?: string;
  /** Sous-titre personnalisé (sinon utilise la description de la boutique) */
  subtitle?: string;
  /** Image de fond */
  imageSrc: string;
  /** Alt de l'image */
  imageAlt: string;
  /** Opacité de l'overlay (0-1) */
  overlayOpacity?: number;
  /** Couleur de l'overlay */
  overlayColor?: string;
  /** Hauteur du hero */
  height?: string;
  /** Texte du bouton CTA */
  ctaText?: string;
  /** Action du bouton CTA */
  onCtaClick?: () => void;
}

/**
 * Bannière immersive pour les pages vitrine
 * S'adapte automatiquement à l'univers de la boutique
 */
export default function StoreHeroHeader({
  shop,
  title = shop.name,
  subtitle = shop.description,
  imageSrc,
  imageAlt,
  overlayOpacity = 0.4,
  overlayColor = "blackAlpha",
  height = "70vh",
  ctaText,
  onCtaClick,
}: StoreHeroHeaderProps) {
  const colorScheme = getUniverseColorScheme(shop.shopType);
  const icon = getUniverseIcon(shop.shopType);
  const textColor = useColorModeValue("white", "white");

  // Gestion de l'overlay selon le type de couleur
  const bgOverlay = overlayColor.includes("Alpha")
    ? `${overlayColor}.${overlayOpacity * 1000}`
    : `${overlayColor}.900`;

  return (
    <Box position="relative" h={height} overflow="hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        objectFit="cover"
        objectPosition="center"
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        loading="eager"
        zIndex={0}
      />

      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={bgOverlay}
        opacity={overlayColor.includes("Alpha") ? 1 : overlayOpacity}
        zIndex={1}
      />

      <Flex
        position="relative"
        zIndex={2}
        direction="column"
        align="center"
        justify="center"
        h="full"
        px={4}
        color={textColor}
      >
        <VStack spacing={4} textAlign="center" maxW="container.md">
          <HStack spacing={3}>
            <Text fontSize="2xl">
              <span role="img" aria-label={icon.label}>
                {icon.emoji}
              </span>
            </Text>
            <OpeningBadge openingHours={shop.openingHours} size="md" />
          </HStack>

          <Heading size="2xl">{title}</Heading>
          <Text fontSize="xl" maxW="2xl">
            {subtitle}
          </Text>

          {ctaText && onCtaClick && (
            <Button
              size="lg"
              colorScheme={colorScheme}
              onClick={onCtaClick}
              mt={6}
            >
              {ctaText}
            </Button>
          )}
        </VStack>
      </Flex>
    </Box>
  );
}
