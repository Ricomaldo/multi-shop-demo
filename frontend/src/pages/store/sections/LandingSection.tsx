import { SharedProductPreviewCard } from "@/components/business/product/SharedProductPreviewCard";
import UniverseSection from "@/components/features/store/sections/UniverseSection";
import { useStoreHandlers } from "@/hooks";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { Product, Shop } from "@/types";
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

interface LandingSectionProps {
  shop: Shop;
  products: Product[];
}

export default function LandingSection({
  shop,
  products,
}: LandingSectionProps) {
  const { handleAddToCart, handleViewProduct } = useStoreHandlers(shop);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = useBreakpointValue({ base: 1, md: 2, lg: 3 }) || 1;
  const tokens = getUniverseTokens(shop.shopType);
  const maxIndex = Math.max(0, products.length - itemsToShow);

  const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
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
            {products
              .slice(currentIndex, currentIndex + itemsToShow)
              .map((product) => (
                <Box key={product.id} flex={1}>
                  <SharedProductPreviewCard
                    product={product}
                    shop={shop}
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
      <UniverseSection shopType={shop.shopType} />
      {/* Bouton catalogue complet */}
      <Button
        as={Link}
        to={`/store/${shop.shopType}/products`}
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
  );
}
