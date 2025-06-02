import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  VStack
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product, Shop } from "../../../../shared/types";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopByType, useShopData, useStoreHandlers } from "../../hooks";

const StoreTeaShop = () => {
  const navigate = useNavigate();
  const { shop: initialShop, products, loading } = useShopByType("teaShop");
  const { handleAddToCart, handleViewProduct } = useStoreHandlers();
  const { shops } = useShopData();
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);

  // Initialiser la boutique courante
  useEffect(() => {
    if (!loading && initialShop) {
      setCurrentShop(initialShop);
    } else if (!loading && !initialShop) {
      navigate("/404");
    }
  }, [loading, initialShop, navigate]);

  // Grouper les produits par catégorie
  const productsByCategory = useMemo(() => {
    if (!currentShop) return {};
    const shopProducts = products.filter((p) => p.shopId === currentShop.id);
    const grouped: Record<string, Product[]> = {};
    shopProducts.forEach((product) => {
      const category = product.category || "Autres";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [products, currentShop]);

  // Si chargement ou pas de boutique, afficher un loader
  if (loading || !currentShop) {
    return <Box>Chargement...</Box>;
  }

  const handleShopChange = (newShop: Shop) => {
    setCurrentShop(newShop);
  };

  return (
    <Box as="main">
      <StoreHeroHeader
        shop={currentShop}
        title={currentShop.name}
        subtitle="Découvrez notre sélection de thés d'exception"
        availableShops={shops}
        onShopChange={handleShopChange}
      />

      <Container maxW="7xl" py={12}>
        <VStack spacing={12}>
          {Object.entries(productsByCategory).map(([category, products]) => (
            <Box key={category} w="full">
              <Heading
                as="h2"
                size="lg"
                mb={6}
                color="green.700"
                textAlign="center"
              >
                {category}
              </Heading>

              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing={6}
              >
                {products.map((product) => (
                  <SharedProductCard
                    key={product.id}
                    product={product}
                    shop={currentShop}
                    onAddToCart={handleAddToCart}
                    onView={handleViewProduct}
                  />
                ))}
              </SimpleGrid>
            </Box>
          ))}

          {/* Bouton catalogue complet */}
          <Button
            as={Link}
            to="/store/teaShop/products"
            colorScheme="green"
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
};

export default StoreTeaShop;
