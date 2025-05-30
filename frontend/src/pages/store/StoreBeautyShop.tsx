import { Box, Button, Container, Grid, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "../../../../shared/types";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import BeautySection from "../../components/store/sections/BeautySection";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopData } from "../../hooks/useShopData";

const MotionBox = motion(Box);

export default function StoreBeautyShop() {
  const { products, loading, getShopByType } = useShopData();
  const beautyShop = getShopByType("beautyShop");

  if (loading || !beautyShop) return null;

  const handleAddToCart = (product: Product) => {
    console.log("Ajouter au panier:", product);
  };

  const handleViewProduct = (product: Product) => {
    console.log("Voir produit:", product);
  };

  return (
    <Box as="main">
      <MotionBox
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <StoreHeroHeader
          shop={beautyShop}
          imageSrc="/images/store/beauty-hero.jpg"
          imageAlt="Institut de beauté L'Écrin de Jade - Ambiance spa et soins"
          overlayOpacity={0.3}
          overlayColor="pink"
          height="80vh"
          ctaText="Découvrir nos soins"
          onCtaClick={() => console.log("CTA clicked")}
        />
      </MotionBox>

      <Container maxW="8xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={20} py={20}>
          {/* Section Beauté */}
          <BeautySection />

          {/* Grille de produits asymétrique */}
          <Box w="full">
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={8}
              sx={{
                "& > *:nth-of-type(3n-1)": {
                  transform: "translateY(2rem)",
                },
              }}
            >
              {products
                .filter((p) => p.shopId === beautyShop.id)
                .map((product) => (
                  <SharedProductCard
                    key={product.id}
                    product={product}
                    shop={beautyShop}
                    onAddToCart={handleAddToCart}
                    onView={handleViewProduct}
                  />
                ))}
            </Grid>
          </Box>

          {/* Footer élégant */}
          <Box
            as="footer"
            w="full"
            bg="pink.50"
            p={16}
            borderRadius="lg"
            textAlign="center"
          >
            <VStack spacing={6}>
              <Text
                fontFamily="serif"
                fontSize="2xl"
                color="pink.700"
                fontWeight="light"
              >
                L'Institut de Beauté
              </Text>
              <Text fontSize="2xl" color="pink.700" fontWeight="light">
                L'Institut de Beauté
              </Text>
              <Text fontSize="lg">
                <span role="img" aria-label="étincelles">
                  ✨
                </span>{" "}
                Soins & Rituels
              </Text>
              <Text>
                <span role="img" aria-label="localisation">
                  📍
                </span>{" "}
                18 avenue Montaigne, 75008 Paris
              </Text>
              <Text fontStyle="italic">Sur rendez-vous uniquement</Text>
              <Button
                as={Link}
                to="/store/contact"
                colorScheme="pink"
                size="lg"
                variant="outline"
                px={8}
                _hover={{ bg: "pink.50" }}
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
