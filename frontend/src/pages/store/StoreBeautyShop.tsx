import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../../../../shared/types";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import BeautySection from "../../components/store/sections/BeautySection";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopByType } from "../../hooks";

// Configuration de la mosaïque par catégorie
type BeautyCategory = "visage" | "corps" | "cheveux" | "maquillage";

const BEAUTY_LAYOUT: Record<
  BeautyCategory,
  { rowSpan: number; colSpan: number; name: string }
> = {
  visage: { rowSpan: 2, colSpan: 2, name: "Soins Visage" },
  corps: { rowSpan: 1, colSpan: 1, name: "Soins Corps" },
  cheveux: { rowSpan: 1, colSpan: 1, name: "Soins Cheveux" },
  maquillage: { rowSpan: 2, colSpan: 1, name: "Maquillage" },
};

const StoreBeautyShop = () => {
  const navigate = useNavigate();
  const { shop, products, loading } = useShopByType("beautyShop");

  useEffect(() => {
    if (!loading && !shop) {
      navigate("/404");
    }
  }, [loading, shop, navigate]);

  // Répartir les produits en sections pour la mosaïque
  const mosaicProducts = useMemo(() => {
    const featured = products.filter((p) => p.featured).slice(0, 2);
    const regular = products.filter((p) => !p.featured);
    return { featured, regular };
  }, [products]);

  if (loading || !shop) {
    return <Box>Chargement...</Box>;
  }

  const handleAddToCart = (product: Product) => {
    console.log("Ajouter au panier:", product);
  };

  const handleViewProduct = (product: Product) => {
    console.log("Voir produit:", product);
  };

  // Grouper les produits par catégorie
  const productsByCategory = products
    .filter((p) => p.shopId === shop.id)
    .reduce((acc, product) => {
      const category = (product.category?.name as BeautyCategory) || "visage";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<BeautyCategory, Product[]>);

  return (
    <Box>
<StoreHeroHeader
  shop={currentShop}
  title="L'Écrin de Jade"
  subtitle="Institut de beauté bio..."
  availableShops={availableShops}
  onShopChange={handleShopChange}
  variant="simple"
  imagePath="/images/hero/beauty-hero.jpg"
/>

      <VStack spacing={8} p={8}>
        <Box textAlign="center" maxW="2xl" mx="auto">
          <Heading size="lg" mb={4} color="pink.600">
            Nos Soins & Produits
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Des produits naturels sélectionnés avec soin pour votre bien-être
          </Text>
        </Box>

        <Grid
          templateColumns="repeat(12, 1fr)"
          gap={6}
          w="full"
          maxW="1400px"
          mx="auto"
        >
          {/* Produits mis en avant - Grande taille */}
          {mosaicProducts.featured.map((product) => (
            <GridItem
              key={product.id}
              colSpan={{ base: 12, md: 6 }}
              rowSpan={2}
            >
              <SharedProductCard
                product={product}
                shop={shop}
                imageHeight="400px"
                isHighlighted
              />
            </GridItem>
          ))}

          {/* Produits réguliers - Taille normale */}
          {mosaicProducts.regular.map((product) => (
            <GridItem
              key={product.id}
              colSpan={{ base: 12, sm: 6, md: 4, lg: 3 }}
            >
              <SharedProductCard
                product={product}
                shop={shop}
                imageHeight="250px"
              />
            </GridItem>
          ))}
        </Grid>
      </VStack>

      <Container maxW="8xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={20} py={20}>
          {/* Section Beauté */}
          <BeautySection />

          {/* Mosaïque de produits */}
          <Box w="full">
            <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={12}>
              Notre Collection Beauté
            </Text>

            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={8}
              mx="auto"
              maxW="1400px"
            >
              {Object.entries(BEAUTY_LAYOUT).map(([category, layout]) => {
                const categoryProducts =
                  productsByCategory[category as BeautyCategory] || [];
                if (categoryProducts.length === 0) return null;

                return (
                  <GridItem
                    key={category}
                    rowSpan={layout.rowSpan}
                    colSpan={{ base: 1, md: layout.colSpan }}
                    bg="pink.50"
                    p={4}
                    borderRadius="lg"
                    position="relative"
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="medium"
                      color="pink.600"
                      mb={4}
                      textAlign="center"
                    >
                      {layout.name}
                    </Text>
                    <VStack spacing={6}>
                      {categoryProducts.map((product) => (
                        <Box
                          key={product.id}
                          w="full"
                          transform={
                            layout.rowSpan === 2 ? "scale(1.05)" : "none"
                          }
                          transition="transform 0.2s"
                          _hover={{ transform: "scale(1.02)" }}
                        >
                          <SharedProductCard
                            product={product}
                            shop={shop}
                            onAddToCart={handleAddToCart}
                            onView={handleViewProduct}
                          />
                        </Box>
                      ))}
                    </VStack>
                  </GridItem>
                );
              })}
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
};

export default StoreBeautyShop;
