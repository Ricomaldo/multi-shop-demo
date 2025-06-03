import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Shop } from "../../../../shared/types";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopData, useStoreHandlers } from "../../hooks";

// Animation variants
const MotionBox = motion.create(Box);

export default function StoreBrewery() {
  const { products, loading, getShopByType, shops } = useShopData();
  const { handleAddToCart, handleViewProduct } = useStoreHandlers();
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

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
  const shopProducts = products.filter((p) => p.shopId === currentShop.id);
  const maxIndex = Math.max(0, shopProducts.length - itemsToShow);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleShopChange = (newShop: Shop) => {
    setCurrentShop(newShop);
    setCurrentIndex(0);
  };

  return (
    <Box as="main">
      <MotionBox
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "anticipate" }}
      >
        <StoreHeroHeader
          shop={currentShop}
          title="Houblon & Tradition"
          subtitle="Brasserie artisanale depuis 2015"
          availableShops={shops}
          onShopChange={handleShopChange}
        />
      </MotionBox>

      <Container maxW="8xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={12} py={12}>
          {/* Grille de produits */}
          <Box position="relative" w="full">
            <Flex align="center" justify="space-between">
              <IconButton
                aria-label="Produit précédent"
                icon={<ChevronLeftIcon />}
                onClick={handlePrevious}
                isDisabled={currentIndex === 0}
                variant="ghost"
                size="lg"
              />

              <Flex
                flex={1}
                gap={6}
                px={4}
                overflow="hidden"
                position="relative"
              >
                {shopProducts
                  .slice(currentIndex, currentIndex + itemsToShow)
                  .map((product) => (
                    <Box key={product.id} flex={1}>
                      <SharedProductCard
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
              />
            </Flex>
          </Box>

          {/* Bouton catalogue complet */}
          <Button
            as={Link}
            to="/store/brewery/products"
            colorScheme="orange"
            size="lg"
            variant="outline"
            px={8}
          >
            Voir tout le catalogue
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
