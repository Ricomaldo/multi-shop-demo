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
      <VStack spacing={12} py={12}>
        {/* Grille de produits avec carousel */}
        <Box position="relative" w="full" maxW="1400px" mx="auto">
          <Flex align="center" justify="space-between">
            <IconButton
              aria-label="Produit précédent"
              icon={<ChevronLeftIcon />}
              onClick={handlePrevious}
              isDisabled={currentIndex === 0}
              variant="ghost"
              size="lg"
              colorScheme={tokens.meta.colorScheme}
            />

            <Flex flex={1} gap={6} px={4} overflow="hidden" position="relative">
              {shopProducts
                .slice(currentIndex, currentIndex + itemsToShow)
                .map((product) => (
                  <Box key={product.id} flex={1}>
                    <SharedProductPreviewCard
                      product={product}
                      shop={currentShop}
                      onAddToCart={handleAddToCart}
                      onView={handleViewProduct}
                    />
                  </Box>
                ))}
            </Flex>

            <IconButton
              aria-label="Produit suivant"
              icon={<ChevronRightIcon />}
              onClick={handleNext}
              isDisabled={currentIndex >= maxIndex}
              variant="ghost"
              size="lg"
              colorScheme={tokens.meta.colorScheme}
            />
          </Flex>
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
          px={8}
          py={6}
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
