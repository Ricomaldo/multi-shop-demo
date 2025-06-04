import { Box, Button, Container, HStack } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { getUniverseTokens } from "../../theme/universeTokens";
import type { Shop } from "../../types/index";

interface StoreNavigationProps {
  shop: Shop;
}

/**
 * 🎯 StoreNavigation - Navigation différenciée par shopType DIRECT
 * ✅ APPLICATION DIRECTE shopType → tokens (plus de mapping ni context !)
 * ✅ Touch targets 44px minimum (mobile)
 * ✅ Responsive spacing et animations
 * ✅ Animation adaptée par shopType
 */

export default function StoreNavigation({ shop }: StoreNavigationProps) {
  const location = useLocation();

  // 🎯 APPLICATION DIRECTE shopType → tokens (plus de mapping !)
  const tokens = getUniverseTokens(shop.shopType);

  // Liens de navigation communs
  const navigationLinks = [
    { label: "Accueil", path: `/store/${shop.shopType}` },
    { label: "Catalogue", path: `/store/${shop.shopType}/products` },
    { label: "Contact", path: `/store/${shop.shopType}/contact` },
  ];

  return (
    <Box
      bg={tokens.colors[50]}
      borderBottom="1px solid"
      borderBottomColor={tokens.colors[200]}
      position="sticky"
      top="0"
      zIndex={1000}
      shadow="sm"
    >
      <Container maxW="7xl">
        <HStack
          justify="center"
          spacing={tokens.spacing.component}
          py={tokens.spacing.component}
          px={tokens.spacing.component}
          wrap="wrap"
        >
          {navigationLinks.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Button
                key={link.path}
                as={RouterLink}
                to={link.path}
                variant={isActive ? "solid" : "ghost"}
                colorScheme={tokens.meta.colorScheme}
                size={{ base: "md", md: "lg" }}
                minH={tokens.heights.touchTarget}
                h={tokens.heights.button}
                px={tokens.spacing.component}
                borderRadius={tokens.borderRadius.base}
                fontFamily={tokens.typography.fontFamily.body}
                fontSize={tokens.typography.fontSize.navigation}
                fontWeight={
                  isActive
                    ? tokens.typography.fontWeight.bold
                    : tokens.typography.fontWeight.normal
                }
                transition={tokens.animations.transition}
                _hover={{
                  transform: tokens.animations.enableOnMobile
                    ? "none"
                    : tokens.animations.hover.transform.md,
                  bg: isActive ? tokens.colors[600] : tokens.colors[100],
                }}
                _active={{
                  transform: "scale(0.98)",
                }}
                textDecoration="none"
                _focus={{ outline: "none" }}
              >
                {link.label}
              </Button>
            );
          })}
        </HStack>
      </Container>
    </Box>
  );
}
