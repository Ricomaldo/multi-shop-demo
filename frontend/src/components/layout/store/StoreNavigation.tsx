import StoreShopSelector from "@/components/business/shop/StoreShopSelector";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { Shop } from "@/types/index";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

interface StoreNavigationProps {
  shop: Shop;
  availableShops: Shop[];
  onShopChange?: (shop: Shop) => void;
  showShopSelector?: boolean;
}

/**
 * 🎯 StoreNavigation Responsive Life - Architecture v5
 * ✅ Desktop: Navigation + ShopSelector côte à côte
 * ✅ Tablette: ShopSelector en dessous pour éviter débordement
 * ✅ Mobile: Menu hamburger avec selector intégré
 * ✅ Thématisation complète par shopType
 */

export default function StoreNavigation({
  shop,
  availableShops,
  onShopChange,
  showShopSelector = true,
}: StoreNavigationProps) {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 🎯 APPLICATION DIRECTE shopType → tokens
  const tokens = getUniverseTokens(shop.shopType);

  // Responsive breakpoints - Plus granulaire
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  // Liens de navigation communs
  const navigationLinks = [
    { label: "Accueil", path: `/store/${shop.shopType}` },
    { label: "Catalogue", path: `/store/${shop.shopType}/products` },
    { label: "Contact", path: `/store/${shop.shopType}/contact` },
  ];

  // Version Mobile - Menu Hamburger
  const MobileNavigation = () => (
    <>
      <Box
        bg={tokens.colors[50]}
        borderBottom="1px solid"
        borderBottomColor={tokens.colors[200]}
        position="sticky"
        top="0"
        zIndex={1000}
        shadow="sm"
      >
        <Container maxW="7xl" px={4}>
          <Flex justify="space-between" align="center" py={3}>
            {/* Shop info compact */}
            <HStack spacing={2} flex={1} minW={0}>
              <Box fontSize="lg" flexShrink={0}>
                {tokens.meta.icon}
              </Box>
              <Box
                fontSize="sm"
                fontWeight="medium"
                color={tokens.colors[700]}
                isTruncated
                maxW="120px"
              >
                {shop.name}
              </Box>
            </HStack>

            {/* Hamburger button */}
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="ghost"
              colorScheme={tokens.meta.colorScheme}
              size="md"
              flexShrink={0}
            />
          </Flex>
        </Container>
      </Box>

      {/* Drawer mobile */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent bg={tokens.colors[50]}>
          <DrawerHeader
            borderBottomWidth="1px"
            borderBottomColor={tokens.colors[200]}
            bg={tokens.colors[50]}
            py={4}
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Box fontSize="lg">{tokens.meta.icon}</Box>
                <Box fontSize="md" fontWeight="bold" color={tokens.colors[700]}>
                  Navigation
                </Box>
              </HStack>
              <IconButton
                aria-label="Fermer"
                icon={<CloseIcon />}
                onClick={onClose}
                variant="ghost"
                size="sm"
              />
            </Flex>
          </DrawerHeader>

          <DrawerBody p={4}>
            <VStack spacing={6} align="stretch">
              {/* ShopSelector pour mobile */}
              {showShopSelector && availableShops.length > 1 && (
                <Box>
                  <StoreShopSelector
                    shops={availableShops}
                    currentShop={shop}
                    onShopChange={(shop) => {
                      onShopChange?.(shop);
                      onClose();
                    }}
                    variant="robust"
                    showOpeningStatus={false}
                  />
                </Box>
              )}

              {/* Navigation links */}
              <VStack spacing={2} align="stretch">
                {navigationLinks.map((link) => {
                  const isActive = location.pathname === link.path;

                  return (
                    <Button
                      key={link.path}
                      as={RouterLink}
                      to={link.path}
                      onClick={onClose}
                      variant={isActive ? "solid" : "ghost"}
                      colorScheme={tokens.meta.colorScheme}
                      size="lg"
                      h="48px"
                      justifyContent="flex-start"
                      fontFamily={tokens.typography.fontFamily.body}
                      fontSize="md"
                      fontWeight={isActive ? "bold" : "medium"}
                      borderRadius={tokens.borderRadius.base}
                    >
                      {link.label}
                    </Button>
                  );
                })}
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );

  // Version Tablette - Layout vertical pour éviter débordement
  const TabletNavigation = () => (
    <Box
      bg={tokens.colors[50]}
      borderBottom="1px solid"
      borderBottomColor={tokens.colors[200]}
      position="sticky"
      top="0"
      zIndex={1000}
      shadow="sm"
    >
      <Container maxW="7xl" px={4}>
        {/* Première ligne : Navigation */}
        <Flex justify="center" align="center" py={3}>
          <HStack spacing={tokens.spacing.component}>
            {navigationLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Button
                  key={link.path}
                  as={RouterLink}
                  to={link.path}
                  variant={isActive ? "solid" : "ghost"}
                  colorScheme={tokens.meta.colorScheme}
                  size="md"
                  px={4}
                  borderRadius={tokens.borderRadius.base}
                  fontFamily={tokens.typography.fontFamily.body}
                  fontSize="sm"
                  fontWeight={isActive ? "bold" : "medium"}
                >
                  {link.label}
                </Button>
              );
            })}
          </HStack>
        </Flex>

        {/* Deuxième ligne : ShopSelector si nécessaire */}
        {showShopSelector && availableShops.length > 1 && (
          <Box pb={3}>
            <Flex justify="center">
              <Box maxW="400px" w="100%">
                <StoreShopSelector
                  shops={availableShops}
                  currentShop={shop}
                  onShopChange={onShopChange}
                  variant="glass"
                  showOpeningStatus={false}
                />
              </Box>
            </Flex>
          </Box>
        )}
      </Container>
    </Box>
  );

  // Version Desktop - Navigation complète
  const DesktopNavigation = () => (
    <Box
      bg={tokens.colors[50]}
      borderBottom="1px solid"
      borderBottomColor={tokens.colors[200]}
      position="sticky"
      top="0"
      zIndex={1000}
      shadow="sm"
    >
      <Container maxW="7xl" px={4}>
        <Flex justify="space-between" align="center" py={4}>
          {/* Navigation links - côté gauche */}
          <HStack spacing={tokens.spacing.component}>
            {navigationLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Button
                  key={link.path}
                  as={RouterLink}
                  to={link.path}
                  variant={isActive ? "solid" : "ghost"}
                  colorScheme={tokens.meta.colorScheme}
                  size="md"
                  px={tokens.spacing.component}
                  borderRadius={tokens.borderRadius.base}
                  fontFamily={tokens.typography.fontFamily.body}
                  fontSize="sm"
                  fontWeight={isActive ? "bold" : "medium"}
                >
                  {link.label}
                </Button>
              );
            })}
          </HStack>

          {/* ShopSelector - côté droit */}
          {showShopSelector && availableShops.length > 1 && (
            <Box maxW="300px">
              <StoreShopSelector
                shops={availableShops}
                currentShop={shop}
                onShopChange={onShopChange}
                variant="floating"
                showOpeningStatus={true}
              />
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );

  // Sélection de la version selon la taille d'écran
  if (isMobile) {
    return <MobileNavigation />;
  }

  if (isTablet) {
    return <TabletNavigation />;
  }

  return <DesktopNavigation />;
}
