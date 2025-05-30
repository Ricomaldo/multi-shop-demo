import {
  Box,
  Button,
  Container,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "../../../../shared/types";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopData } from "../../hooks/useShopData";

const MotionBox = motion(Box);

export default function StoreHerbShop() {
  const { products, loading, getShopByType } = useShopData();
  const herbShop = getShopByType("herbShop");

  if (loading || !herbShop) return null;

  const handleAddToCart = (product: Product) => {
    console.log("Ajouter au panier:", product);
  };

  const handleViewProduct = (product: Product) => {
    console.log("Voir produit:", product);
  };

  return (
    <Box as="main">
      <StoreHeroHeader
        shop={herbShop}
        imageSrc="/images/store/herb-hero.jpg"
        imageAlt="Herboristerie du Moulin Vert - Plantes médicinales et préparations naturelles"
        overlayOpacity={0.4}
        overlayColor="green"
        height="75vh"
        ctaText="Découvrir nos plantes"
        onCtaClick={() => console.log("CTA clicked")}
      />

      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={12} py={12}>
          {/* Grille de produits */}
          <VStack spacing={8} w="full">
            <VStack spacing={2} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Nos plantes médicinales
              </Text>
              <Text color="gray.600">
                Une sélection de plantes aux vertus millénaires
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={12} py={8}>
              {products
                .filter((p) => p.shopId === herbShop.id)
                .map((product) => (
                  <SharedProductCard
                    key={product.id}
                    product={product}
                    shop={herbShop}
                    onAddToCart={handleAddToCart}
                    onView={handleViewProduct}
                  />
                ))}
            </SimpleGrid>
          </VStack>

          {/* Footer naturel */}
          <Box
            as="footer"
            w="full"
            bg="green.50"
            p={12}
            borderRadius="none"
            textAlign="center"
            borderTop="1px solid"
            borderColor="green.100"
          >
            <VStack spacing={4}>
              <Text fontSize="2xl" color="green.800" fontFamily="body">
                L'Herbier Traditionnel
              </Text>
              <Text>🌿 Herboristerie & Conseils</Text>
              <Text>📍 23 rue des Plantes, 75014 Paris</Text>
              <Text>Cueillette et préparations artisanales</Text>
              <Button
                as={Link}
                to="/store/contact"
                colorScheme="teal"
                size="lg"
                variant="outline"
                px={8}
                _hover={{ bg: "green.50" }}
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
