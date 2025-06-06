import { StorePageWrapper } from "@/components/features/store/content/StorePageWrapper";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SharedProductPreviewCard } from "../../components/business/product/SharedProductPreviewCard";
import UniverseSection from "../../components/features/store/sections/UniverseSection";
import { useShopContent, useStoreHandlers, useStorePage } from "../../hooks";
import { getUniverseTokens } from "../../theme/universeTokens";

/**
 * 🎯 PAGE VITRINE GÉNÉRIQUE 4-IN-1
 *
 * Remplace StoreBrewery, StoreTeaShop, StoreBeautyShop, StoreHerbShop
 * Thématisation automatique selon shopType dans l'URL
 * Intègre les sections spécifiques par univers
 *
 * Routes:
 * - /store/brewery
 * - /store/teaShop
 * - /store/beautyShop
 * - /store/herbShop
 */
export default function StoreLandingGeneric() {
  const { currentShop, shopProducts } = useStorePage({
    redirectOnShopChange: true,
  });
  const { handleAddToCart, handleViewProduct } = useStoreHandlers(
    currentShop || undefined
  );
  // Utilisation du hook pour charger le contenu dynamiquement
  const { heroSubtitle, heroImage } = useShopContent(
    currentShop?.shopType || "brewery"
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Nombre de produits à afficher selon la taille d'écran
  const itemsToShow = useBreakpointValue({ base: 1, md: 2, lg: 3 }) || 1;

  if (!currentShop) return null;

  // Tokens pour la thématisation automatique
  const tokens = getUniverseTokens(currentShop.shopType);

  const maxIndex = Math.max(0, shopProducts.length - itemsToShow);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <StorePageWrapper
      headerVariant="simple"
      headerProps={{
        title: currentShop.name,
        subtitle: heroSubtitle,
        imagePath: heroImage,
        height: "80vh",
      }}
      redirectOnShopChange={true}
      contentWrapper="none"
    >
      <VStack spacing={tokens.spacing.section} py={tokens.spacing.section}>
        {/* Carrousel responsive - Mobile et Desktop différenciés */}
        <Box w="full" maxW="1400px" mx="auto">
          {/* Version Mobile - Simple et directe */}
          <Box display={{ base: "block", md: "none" }} px={4}>
            <VStack spacing={4}>
              {shopProducts.slice(0, 3).map((product) => (
                <Box key={product.id} w="full" maxW="350px">
                  <SharedProductPreviewCard
                    product={product}
                    shop={currentShop}
                    onAddToCart={handleAddToCart}
                    onView={handleViewProduct}
                  />
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Version Desktop - Avec navigation */}
          <Box display={{ base: "none", md: "block" }} px={6}>
            <Flex align="center" justify="center" gap={4}>
              <IconButton
                aria-label="Produit précédent"
                icon={<ChevronLeftIcon />}
                onClick={handlePrevious}
                isDisabled={currentIndex === 0}
                variant="outline"
                size="lg"
                colorScheme={tokens.meta.colorScheme}
                flexShrink={0}
              />

              <Box flex={1} maxW="1000px">
                <Flex gap={6} justify="center">
                  {shopProducts
                    .slice(currentIndex, currentIndex + itemsToShow)
                    .map((product) => (
                      <Box
                        key={product.id}
                        flex={`0 0 ${
                          itemsToShow === 1
                            ? "100%"
                            : itemsToShow === 2
                            ? "45%"
                            : "30%"
                        }`}
                        maxW="400px"
                      >
                        <SharedProductPreviewCard
                          product={product}
                          shop={currentShop}
                          onAddToCart={handleAddToCart}
                          onView={handleViewProduct}
                        />
                      </Box>
                    ))}
                </Flex>
              </Box>

              <IconButton
                aria-label="Produit suivant"
                icon={<ChevronRightIcon />}
                onClick={handleNext}
                isDisabled={currentIndex >= maxIndex}
                variant="outline"
                size="lg"
                colorScheme={tokens.meta.colorScheme}
                flexShrink={0}
              />
            </Flex>
          </Box>
        </Box>

        {/* Section spécifique à l'univers */}
        <UniverseSection shopType={currentShop.shopType} />

        {/* Bouton catalogue complet */}
        <Button
          as={Link}
          to={`/store/${currentShop.shopType}/products`}
          colorScheme={tokens.meta.colorScheme}
          size="lg"
          variant="solid"
          px={tokens.spacing.section}
          py={tokens.spacing.component}
          borderRadius={tokens.borderRadius.base}
          fontFamily={tokens.typography.fontFamily.body}
          fontWeight={tokens.typography.fontWeight.bold}
          _hover={{ transform: tokens.animations.hover.transform.md }}
          transition={tokens.animations.transition}
        >
          {tokens.meta.icon} Découvrir toute la gamme
        </Button>
      </VStack>
    </StorePageWrapper>
  );
}
