import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import StoreCategoryFilter from "../../components/store/StoreCategoryFilter";
import { UniverseProvider } from "../../contexts/UniverseContext";
import { useProductFilters, useShopData } from "../../hooks";

export default function StoreBeautyShop() {
  const colorScheme = "pink";

  // Utiliser les hooks pour la gestion des données
  const { shops, products, loading, error } = useShopData();

  // Filtrer les produits de l'institut beauté
  const beautyShopProducts = useMemo(() => {
    const beautyShop = shops.find((shop) => shop.shopType === "beauty-shop");
    return products.filter((product) => product.shopId === beautyShop?.id);
  }, [shops, products]);

  // Hook de filtrage par catégorie
  const {
    filteredProducts,
    selectedCategoryId,
    categories,
    setSelectedCategoryId,
    resetFilters,
  } = useProductFilters(beautyShopProducts);

  const handleAddToCart = (productId: string) => {
    // Simulation ajout panier
    console.log("Ajout au panier:", productId);
  };

  if (loading) {
    return (
      <Box p={8} maxW="1200px" mx="auto">
        <VStack spacing={8}>
          <Text fontSize="lg">Chargement de l'institut beauté...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8} maxW="1200px" mx="auto">
        <VStack spacing={8}>
          <Text color="red.500">Erreur: {error}</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <UniverseProvider defaultUniverse="beauty-shop">
      <Box p={8} maxW="1200px" mx="auto">
        <VStack spacing={8}>
          <VStack spacing={4}>
            <Heading size="xl" color={`${colorScheme}.700`}>
              💄 L'Écrin de Jade
            </Heading>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Institut de beauté - Soins et cosmétiques de luxe
            </Text>
            <Text fontSize="sm" color="gray.500">
              {beautyShopProducts.length} produit
              {beautyShopProducts.length !== 1 ? "s" : ""} disponible
              {beautyShopProducts.length !== 1 ? "s" : ""}
            </Text>
          </VStack>

          {/* Filtrage par catégorie */}
          {categories.length > 0 && (
            <StoreCategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
              onResetFilters={resetFilters}
              productCount={filteredProducts.length}
              colorScheme={colorScheme}
            />
          )}

          {/* Grille des produits */}
          {filteredProducts.length === 0 ? (
            <VStack spacing={4} py={8}>
              <Text fontSize="lg" color="gray.500">
                {selectedCategoryId
                  ? "Aucun produit dans cette catégorie"
                  : "Aucun produit disponible"}
              </Text>
              {selectedCategoryId && (
                <Button
                  variant="outline"
                  colorScheme={colorScheme}
                  onClick={resetFilters}
                >
                  Voir tous les produits
                </Button>
              )}
            </VStack>
          ) : (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={6}
              w="full"
            >
              {filteredProducts.map((product) => (
                <Box
                  key={product.id}
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  shadow="md"
                  borderWidth={1}
                  borderColor={`${colorScheme}.200`}
                  transition="transform 0.2s"
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                >
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="start">
                      <Badge colorScheme={colorScheme} fontSize="xs">
                        {product.category?.name}
                      </Badge>
                    </Flex>

                    <VStack spacing={2} align="start">
                      <Heading size="md" color={`${colorScheme}.800`}>
                        {product.name}
                      </Heading>
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {product.description}
                      </Text>
                    </VStack>

                    <Flex justify="space-between" align="center">
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={`${colorScheme}.600`}
                      >
                        {product.price.toFixed(2)}€
                      </Text>
                      <Button
                        size="sm"
                        colorScheme={colorScheme}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        🛒 Ajouter
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Box>
    </UniverseProvider>
  );
}
