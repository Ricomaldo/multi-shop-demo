import { Box, Button, Container, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "../../../../shared/types";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopData } from "../../hooks/useShopData";

const MotionBox = motion(Box);

export default function StoreBrewery() {
  const { products, loading, getShopByType } = useShopData();
  const breweryShop = getShopByType("brewery");

  if (loading || !breweryShop) return null;

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
          onCtaClick={() => console.log("CTA clicked")}
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

            <VStack spacing={8} w="full">
              {products
                .filter((p) => p.shopId === breweryShop.id)
                .map((product) => (
                  <SharedProductCard
                    key={product.id}
                    product={product}
                    shop={breweryShop}
                    onAddToCart={handleAddToCart}
                    onView={handleViewProduct}
                  />
                ))}
            </VStack>
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
