import { Box, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import { getUniverseTokens } from "../../theme/universeTokens";
import StoreHeroSection from "./StoreHeroSection";
import StoreNavigation from "./StoreNavigation";
import StoreShopSelector from "./StoreShopSelector";

interface StoreHeaderProps {
  shop: Shop;
  title?: string;
  subtitle?: string;
  availableShops: Shop[];
  onShopChange?: (shop: Shop) => void;
  variant?: "nav-only" | "hero" | "full" | "simple";
  imagePath?: string;
  height?: string;
  showShopSelector?: boolean;
}

/**
 * Header modulaire pour les pages vitrine - Architecture v3
 * 🎯 Intégration élégante du StoreShopSelector dans une zone dédiée
 * ✅ Aucune superposition avec la navigation
 * ✅ UX/UI de qualité supérieure avec transitions fluides
 * ✅ Usage direct shopType sans mapping
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
  showShopSelector = true,
}: StoreHeaderProps) {
  // 🎯 APPLICATION DIRECTE shopType → tokens (plus de mapping !)
  const tokens = getUniverseTokens(shop.shopType);

  // Styles de l'univers appliqués directement
  const headerStyles = {
    bgGradient: `linear(to-b, ${tokens.colors[50]}, white)`,
    titleColor: tokens.colors[800],
    subtitleColor: tokens.colors[700],
    borderColor: tokens.colors[200],
    navBg: tokens.colors[50],
  };

  // Barre supérieure avec sélecteur de boutique - Design premium
  const TopBar = () => (
    <Box
      bg={`linear-gradient(135deg, ${tokens.colors[50]} 0%, ${tokens.colors[100]} 50%, ${tokens.colors[50]} 100%)`}
      borderBottomWidth="1px"
      borderBottomColor={tokens.colors[100]}
      py={2}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        bg: `linear-gradient(90deg, transparent, ${tokens.colors[200]}, transparent)`,
      }}
    >
      <Container maxW="7xl">
        <Flex justify="flex-end" align="center" minH="52px">
          {showShopSelector && (
            <Box
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: "-8px",
                left: "-12px",
                right: "-12px",
                bottom: "-8px",
                bg: `${tokens.colors[100]}20`,
                borderRadius: tokens.borderRadius.xl,
                border: `1px solid ${tokens.colors[200]}30`,
                backdropFilter: "blur(10px)",
                zIndex: -1,
                opacity: 0,
                transition: "all 0.3s ease",
              }}
              _hover={{
                _before: {
                  opacity: 1,
                },
              }}
            >
              <StoreShopSelector
                shops={availableShops}
                currentShop={shop}
                onShopChange={onShopChange}
                showOpeningStatus={true}
                variant={tokens.variants.selector}
              />
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );

  // Variant: Navigation seule avec navbar différenciée + TopBar
  if (variant === "nav-only") {
    return (
      <>
        <TopBar />
        <StoreNavigation shop={shop} />
      </>
    );
  }

  // Variant: Hero section avec navbar différenciée + TopBar
  if (variant === "hero") {
    return (
      <>
        <TopBar />
        <StoreNavigation shop={shop} />
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

  // Variant: Simple (backward compatibility) - Hero + Navigation + TopBar
  if (variant === "simple") {
    return (
      <>
        <TopBar />
        <StoreNavigation shop={shop} />
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

  // Variant: Full (gradient) - Mode existant avec navbar différenciée + TopBar
  return (
    <>
      <TopBar />
      <StoreNavigation shop={shop} />
      <Box
        as="header"
        bgGradient={headerStyles.bgGradient}
        py={tokens.spacing.section}
        borderBottomWidth="2px"
        borderColor={headerStyles.borderColor}
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: "2px",
          bg: `linear-gradient(90deg, transparent, ${tokens.colors[300]}, transparent)`,
        }}
      >
        <Container maxW="7xl">
          <VStack spacing={tokens.spacing.component} textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              color={headerStyles.titleColor}
              fontWeight={tokens.typography.fontWeight.heavy}
              fontFamily={tokens.typography.fontFamily.heading}
              letterSpacing="tight"
              position="relative"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "3px",
                bg: tokens.colors[400],
                borderRadius: "full",
              }}
            >
              {title || shop.name}
            </Heading>

            {subtitle && (
              <Text
                fontSize="lg"
                color={headerStyles.subtitleColor}
                fontFamily={tokens.typography.fontFamily.body}
                maxW="2xl"
                lineHeight={tokens.typography.lineHeight.relaxed}
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
