import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Shop } from "../../../../shared/types";
import { SharedProductPreviewCard } from "../../components/shared/SharedProductPreviewCard";
import StoreHeader from "../../components/store/StoreHeader";
import StoreLayout from "../../components/store/StoreLayout";
import { useShopData, useStoreHandlers } from "../../hooks";

export default function StoreBrewery() {
  const {
    products: allProducts,
    loading,
    getShopByType,
    shops,
    refreshData,
  } = useShopData();
  const navigate = useNavigate();

  // État local pour la boutique courante (permet le changement)
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const { handleAddToCart, handleViewProduct } = useStoreHandlers(
    currentShop || undefined
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Nombre de produits à afficher selon la taille d'écran
  const itemsToShow = useBreakpointValue({ base: 1, md: 2, lg: 3 }) || 1;

  // Initialiser la boutique courante
  useEffect(() => {
    if (!loading) {
      const shop = getShopByType("brewery");
      if (!shop) {
        navigate("/404");
      } else {
        setCurrentShop(shop);
      }
    }
  }, [loading, getShopByType, navigate]);

  // Si chargement ou pas de boutique, afficher un loader
  if (loading || !currentShop) {
    return <Box>Chargement...</Box>;
  }

  // Filtrer les produits de la boutique courante
  const shopProducts = allProducts.filter((p) => p.shopId === currentShop.id);
  const maxIndex = Math.max(0, shopProducts.length - itemsToShow);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Handler pour changement de boutique avec navigation
  const handleShopChange = async (newShop: Shop) => {
    setCurrentShop(newShop);
    setCurrentIndex(0);
    // Refresh des données pour la nouvelle boutique
    await refreshData();
  };

  return (
    <StoreLayout shop={currentShop}>
      {/* VARIANT SIMPLE - Hero + Navigation overlay */}
      <StoreHeader
        shop={currentShop}
        title={currentShop.name}
        subtitle="Brasserie artisanale - L'art du houblon et de la tradition depuis 1987"
        availableShops={shops}
        onShopChange={handleShopChange}
        variant="simple"
        imagePath="/images/store/brewery-hero.jpg"
        height="80vh"
      />

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
              colorScheme="orange"
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
              colorScheme="orange"
            />
          </Flex>
        </Box>

        {/* Bouton catalogue complet */}
        <Button
          as={Link}
          to={`/store/${currentShop.shopType}/products`}
          colorScheme="orange"
          size="lg"
          variant="solid"
          px={8}
          py={6}
        >
          Découvrir toute la gamme
        </Button>
      </VStack>
    </StoreLayout>
  );
}
