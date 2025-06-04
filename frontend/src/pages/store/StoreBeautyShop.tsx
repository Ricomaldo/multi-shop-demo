import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product, Shop } from "../../../../shared/types";
import { SharedProductPreviewCard } from "../../components/shared/SharedProductPreviewCard";
import StoreHeader from "../../components/store/StoreHeader";
import StoreLayout from "../../components/store/StoreLayout";
import { useShopByType, useStoreHandlers } from "../../hooks";
import { useShopData } from "../../hooks/useShopData";

const StoreBeautyShop = () => {
  const navigate = useNavigate();
  const { shop: initialShop, loading: shopLoading } =
    useShopByType("beautyShop");
  const { shops, products: allProducts, refreshData } = useShopData();

  // État local pour la boutique courante (permet le changement)
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const { handleAddToCart, handleViewProduct } = useStoreHandlers(
    currentShop || undefined
  );

  // Initialiser la boutique courante
  useEffect(() => {
    if (!shopLoading && initialShop) {
      setCurrentShop(initialShop);
    } else if (!shopLoading && !initialShop) {
      navigate("/404");
    }
  }, [shopLoading, initialShop, navigate]);

  // Filtrer les produits de la boutique courante
  const products = currentShop
    ? allProducts.filter((p) => p.shopId === currentShop.id)
    : [];

  // Répartir les produits : mis en avant + par catégorie
  const organizedProducts = useMemo(() => {
    const featured = products.filter((p) => p.featured).slice(0, 2);
    const byCategory: Record<string, Product[]> = {};

    // Grouper tous les produits restants par catégorie
    products.forEach((product) => {
      if (!product.featured) {
        // Éviter les doublons avec featured
        const category = product.category?.name || "Autres";
        if (!byCategory[category]) {
          byCategory[category] = [];
        }
        byCategory[category].push(product);
      }
    });

    return { featured, byCategory };
  }, [products]);

  // Si chargement ou pas de boutique, afficher un loader
  if (shopLoading || !currentShop) {
    return <Box>Chargement...</Box>;
  }

  // Handler pour changement de boutique avec navigation
  const handleShopChange = async (newShop: Shop) => {
    setCurrentShop(newShop);
    // Refresh des données pour la nouvelle boutique
    await refreshData();
  };

  return (
    <StoreLayout shop={currentShop} variant="elegant">
      <StoreHeader
        shop={currentShop}
        title={currentShop.name}
        subtitle="Institut de beauté naturelle - Soins bio et cosmétiques éthiques"
        availableShops={shops}
        onShopChange={handleShopChange}
        variant="hero"
        imagePath="/images/store/beauty-hero.jpg"
        height="70vh"
      />

      <VStack spacing={12} py={8}>
        {/* Section produits mis en avant */}
        {organizedProducts.featured.length > 0 && (
          <VStack spacing={8} w="full">
            <Box textAlign="center" maxW="2xl" mx="auto">
              <Heading size="lg" mb={4} color="pink.600">
                Nos Coups de Cœur
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Une sélection de nos produits phares
              </Text>
            </Box>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={8}
              w="full"
              maxW="1400px"
              mx="auto"
            >
              {organizedProducts.featured.map((product) => (
                <GridItem key={product.id}>
                  <SharedProductPreviewCard
                    product={product}
                    shop={currentShop}
                    imageHeight="350px"
                    isHighlighted
                    onAddToCart={handleAddToCart}
                    onView={handleViewProduct}
                  />
                </GridItem>
              ))}
            </Grid>
          </VStack>
        )}

        {/* Section produits par catégorie */}
        {Object.keys(organizedProducts.byCategory).length > 0 && (
          <VStack spacing={8} w="full">
            <Box textAlign="center">
              <Heading size="lg" mb={4} color="pink.600">
                Notre Collection Beauté
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Découvrez nos gammes de soins naturels
              </Text>
            </Box>

            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={8}
              mx="auto"
              maxW="1400px"
            >
              {Object.entries(organizedProducts.byCategory).map(
                ([category, categoryProducts]) => (
                  <GridItem
                    key={category}
                    bg="pink.50"
                    p={6}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="pink.100"
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="semibold"
                      color="pink.700"
                      mb={6}
                      textAlign="center"
                    >
                      {category}
                    </Text>
                    <VStack spacing={4}>
                      {categoryProducts.slice(0, 3).map((product) => (
                        <Box
                          key={product.id}
                          w="full"
                          transition="transform 0.2s"
                          _hover={{ transform: "scale(1.02)" }}
                        >
                          <SharedProductPreviewCard
                            product={product}
                            shop={currentShop}
                            imageHeight="200px"
                            onAddToCart={handleAddToCart}
                            onView={handleViewProduct}
                          />
                        </Box>
                      ))}
                      {categoryProducts.length > 3 && (
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          +{categoryProducts.length - 3} autres produits
                        </Text>
                      )}
                    </VStack>
                  </GridItem>
                )
              )}
            </Grid>
          </VStack>
        )}

        {/* Bouton catalogue complet */}
        <Button
          as={Link}
          to={`/store/${currentShop.shopType}/products`}
          colorScheme="pink"
          size="lg"
          variant="outline"
          px={8}
          py={6}
        >
          Découvrir tout le catalogue
        </Button>
      </VStack>
    </StoreLayout>
  );
};

export default StoreBeautyShop;
