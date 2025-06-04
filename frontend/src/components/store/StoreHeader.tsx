import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import { shopTypeToUniverse } from "../../utils/universeMapping";
import StoreHeroSection from "./StoreHeroSection";
import StoreShopInfoBadge from "./StoreShopInfoBadge";

interface StoreHeaderProps {
  shop: Shop;
  title?: string;
  subtitle?: string;
  availableShops: Shop[];
  onShopChange?: (shop: Shop) => void;
  variant?: "nav-only" | "hero" | "full" | "simple";
  imagePath?: string;
  height?: string;
  showNavigation?: boolean;
}

/**
 * Header modulaire pour les pages vitrine - Architecture v2
 *
 * Variants disponibles :
 * - "nav-only": Navigation seule (badge boutique)
 * - "hero": Hero section avec image background
 * - "full": Navigation + section gradient (mode existant)
 * - "simple": Backward compatibility (hero + navigation overlay)
 */
export default function StoreHeader({
  shop,
  title,
  subtitle,
  availableShops,
  onShopChange,
  variant = "full",
  imagePath,
  height = "60vh",
  showNavigation = true,
}: StoreHeaderProps) {
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

  // Hooks en premier - avant tous les returns conditionnels
  const bgGradient = useColorModeValue(
    `linear(to-b, ${colorScheme}.50, white)`,
    `linear(to-b, ${colorScheme}.900, gray.900)`
  );
  const titleColor = useColorModeValue(
    `${colorScheme}.700`,
    `${colorScheme}.200`
  );
  const subtitleColor = useColorModeValue(
    `${colorScheme}.600`,
    `${colorScheme}.300`
  );

  // Composant Navigation Header (réutilisable)
  const NavigationHeader = ({ isOverlay = false }: { isOverlay?: boolean }) => (
    <Box
      position={isOverlay ? "absolute" : "sticky"}
      top={0}
      right={isOverlay ? 4 : "auto"}
      left={isOverlay ? "auto" : 0}
      zIndex={1000}
      bg={isOverlay ? "transparent" : "white"}
      borderBottomWidth={isOverlay ? 0 : 1}
      borderColor="gray.100"
      shadow={isOverlay ? "none" : "sm"}
      backdropFilter={isOverlay ? "blur(15px) saturate(150%)" : "none"}
      w={isOverlay ? "auto" : "full"}
      borderRadius={isOverlay ? "xl" : 0}
      mt={isOverlay ? 4 : 0}
      _before={
        isOverlay
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: "rgba(255, 255, 255, 0.1)",
              borderRadius: "xl",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px)",
              zIndex: -1,
            }
          : {}
      }
    >
      <Container maxW="7xl">
        <Flex
          justify={isOverlay ? "flex-end" : "flex-end"}
          align="center"
          py={4}
          minH="64px"
          px={isOverlay ? 4 : 0}
        >
          {showNavigation && (
            <StoreShopInfoBadge
              shops={availableShops}
              currentShop={shop}
              onShopChange={onShopChange}
              showOpeningStatus={true}
              size="sm"
            />
          )}
        </Flex>
      </Container>
    </Box>
  );

  // Variant: Navigation seule
  if (variant === "nav-only") {
    return <NavigationHeader />;
  }

  // Variant: Hero section avec image
  if (variant === "hero") {
    return (
      <>
        <NavigationHeader isOverlay={true} />
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

  // Variant: Simple (backward compatibility) - Hero + Navigation overlay
  if (variant === "simple") {
    return (
      <>
        <NavigationHeader isOverlay={true} />
        <StoreHeroSection
          shop={shop}
          title={title || shop.name}
          subtitle={subtitle}
          imagePath={imagePath}
          height={height}
        />
      </>
    );
  }

  // Variant: Full (gradient) - Mode existant amélioré
  return (
    <>
      <NavigationHeader />
      <Box as="header" bgGradient={bgGradient} py={16}>
        <Container maxW="7xl">
          <VStack spacing={6} textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              color={titleColor}
              fontWeight="bold"
              letterSpacing="tight"
            >
              {title || shop.name}
            </Heading>

            {subtitle && (
              <Text
                fontSize="lg"
                color={subtitleColor}
                maxW="3xl"
                lineHeight="tall"
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
