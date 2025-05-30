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
import TeaSection from "../../components/store/sections/TeaSection";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopData } from "../../hooks/useShopData";

const MotionBox = motion(Box);

export default function StoreTeaShop() {
  const { products, loading, getShopByType } = useShopData();
  const teaShop = getShopByType("teaShop");

  if (loading || !teaShop) return null;

  const handleAddToCart = (product: Product) => {
    console.log("Ajouter au panier:", product);
  };

  const handleViewProduct = (product: Product) => {
    console.log("Voir produit:", product);
  };

  return (
    <Box as="main">
      <MotionBox
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <StoreHeroHeader
          shop={teaShop}
          imageSrc="/images/store/tea-hero.jpg"
          imageAlt="Les Jardins de Darjeeling - Salon de thé et boutique de thés d'exception"
          overlayOpacity={0.4}
          height="70vh"
          ctaText="Découvrir nos thés"
          onCtaClick={() => console.log("CTA clicked")}
        />
      </MotionBox>

      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={12} py={12}>
          {/* Section Rituels */}
          <TeaSection />

          {/* Citation */}
          <Box textAlign="center" py={12} px={4}>
            <Text
              fontSize="xl"
              fontFamily="serif"
              color="green.700"
              maxW="2xl"
              mx="auto"
              fontStyle="italic"
            >
              "Dans chaque tasse de thé réside une invitation à la méditation et
              à la sérénité"
            </Text>
          </Box>

          {/* Grille de produits */}
          <VStack spacing={8} w="full">
            <VStack spacing={2} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Nos thés d'exception
              </Text>
              <Text color="gray.600">
                Une collection unique de thés du monde entier
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={12} py={8}>
              {products
                .filter((p) => p.shopId === teaShop.id)
                .map((product) => (
                  <SharedProductCard
                    key={product.id}
                    product={product}
                    shop={teaShop}
                    onAddToCart={handleAddToCart}
                    onView={handleViewProduct}
                  />
                ))}
            </SimpleGrid>
          </VStack>

          {/* Footer zen */}
          <Box
            as="footer"
            w="full"
            bg="green.50"
            p={12}
            borderRadius="sm"
            textAlign="center"
          >
            <VStack spacing={6}>
              <Text fontFamily="serif" fontSize="lg" color="green.800">
                Les Jardins de Darjeeling
              </Text>
              <Text>
                <span role="img" aria-label="thé">
                  🍵
                </span>{" "}
                Salon de thé & boutique
              </Text>
              <Text>
                <span role="img" aria-label="localisation">
                  📍
                </span>{" "}
                15 rue de la Paix, 75002 Paris
              </Text>
              <Text>Cérémonies du thé sur réservation</Text>
              <Button
                as={Link}
                to="/store/contact"
                colorScheme="green"
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
