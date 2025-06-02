import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../../../../shared/types";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopData } from "../../hooks/useShopData";

const MotionBox = motion(Box);

export default function StoreBrewery() {
  const { products, loading, getShopByType } = useShopData();
  const breweryShop = getShopByType("brewery");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Nombre de produits à afficher selon la taille d'écran
  const itemsToShow = useBreakpointValue({ base: 1, md: 2, lg: 3 }) || 1;

  if (loading || !breweryShop) return null;

  const filteredProducts = products.filter((p) => p.shopId === breweryShop.id);
  const maxIndex = Math.max(0, filteredProducts.length - itemsToShow);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleAddToCart = (product: Product) => {
    console.log("Ajouter au panier:", product);
  };

  const handleViewProduct = (product: Product) => {
    console.log("Voir produit:", product);
  };

  return (
    <Box as="main">
      <MotionBox
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "anticipate" }}
      >
        <StoreHeroHeader
          shop={breweryShop}
          imageSrc="/images/store/brewery-hero.jpg"
          imageAlt="Brasserie Houblon & Tradition - Ambiance brasserie artisanale"
          overlayOpacity={0.6}
          height="60vh"
          ctaText="Découvrir nos bières"
          onCtaClick={() => {
            console.log("CTA clicked - navigating to /store/brewery/products");
            navigate("/store/brewery/products");
          }}
        />
      </MotionBox>

      <Container maxW="8xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={12} py={12}>
          {/* Grille de produits */}
          <VStack spacing={8} w="full">
            <VStack spacing={2} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Nos bières artisanales
              </Text>
              <Text color="gray.600">
                Découvrez notre sélection de bières brassées avec passion
              </Text>
            </VStack>

            {/* Carousel de produits */}
            <Box position="relative" w="full" py={8}>
              <Flex justify="center" align="center">
                <IconButton
                  aria-label="Produit précédent"
                  icon={<ChevronLeftIcon />}
                  onClick={handlePrevious}
                  isDisabled={currentIndex === 0}
                  variant="ghost"
                  colorScheme="orange"
                  size="lg"
                  mx={2}
                />

                <Flex
                  flex={1}
                  gap={4}
                  transition="transform 0.3s ease"
                  maxW={{ base: "300px", md: "600px", lg: "900px" }}
                  overflow="hidden"
                >
                  {filteredProducts
                    .slice(currentIndex, currentIndex + itemsToShow)
                    .map((product) => (
                      <Box
                        key={product.id}
                        flex={1}
                        minW={{ base: "300px", md: "280px" }}
                      >
                        <SharedProductCard
                          product={product}
                          shop={breweryShop}
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
                  colorScheme="orange"
                  size="lg"
                  mx={2}
                />
              </Flex>
            </Box>
          </VStack>

          {/* Footer spécialisé */}
          <Box
            as="footer"
            w="full"
            bg="orange.50"
            p={8}
            borderRadius="lg"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text>
                <span role="img" aria-label="bière">
                  🍺
                </span>{" "}
                Brasserie artisanale depuis 1996
              </Text>
              <Text>
                <span role="img" aria-label="localisation">
                  📍
                </span>{" "}
                12 rue du Houblon, 75001 Paris
              </Text>
              <Text>Dégustations tous les samedis de 14h à 18h</Text>
              <Button
                as={Link}
                to="/store/contact"
                colorScheme="orange"
                size="lg"
                variant="outline"
                px={8}
                _hover={{ bg: "orange.50" }}
              >
                Nous contacter
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
