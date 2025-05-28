import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { FaGift, FaHeart, FaStar } from "react-icons/fa";
import type { Product } from "../../../../shared/types";
import { ProductGrid } from "../../components/shared/ProductGrid";
import { UniverseProvider } from "../../contexts/UniverseContext";
import { useProductFilters, useShopData } from "../../hooks";

export default function StoreBeautyShop() {
  const colorScheme = "pink";
  const bgGradient = useColorModeValue(
    "linear(to-br, pink.50, purple.50, pink.100)",
    "linear(to-br, pink.900, purple.900, pink.800)"
  );
  const cardBg = useColorModeValue("white", "gray.800");

  // Utiliser les hooks pour la gestion des données
  const { shops, products, loading, error } = useShopData();

  // Filtrer les produits de l'institut beauté
  const beautyShopProducts = useMemo(() => {
    const beautyShop = shops.find((shop) => shop.shopType === "beauty-shop");
    return products.filter((product) => product.shopId === beautyShop?.id);
  }, [shops, products]);

  const beautyShop = useMemo(() => {
    return shops.find((shop) => shop.shopType === "beauty-shop");
  }, [shops]);

  // Hook de filtrage par catégorie
  const {
    filteredProducts,
    selectedCategoryId,
    categories,
    setSelectedCategoryId,
    resetFilters,
  } = useProductFilters(beautyShopProducts);

  // Produits vedettes (3 premiers)
  const featuredProducts = useMemo(() => {
    return beautyShopProducts.slice(0, 3);
  }, [beautyShopProducts]);

  const handleAddToCart = (product: Product) => {
    console.log("Ajout au panier:", product.name);
  };

  const handleViewProduct = (product: Product) => {
    console.log("Voir détails:", product.name);
  };

  if (loading) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack spacing={8}>
          <Text fontSize="lg">Chargement de l'institut beauté...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack spacing={8}>
          <Text color="red.500">Erreur: {error}</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <UniverseProvider defaultUniverse="beauty-shop">
      <Box>
        {/* Hero Section Magazine */}
        <Box
          bgGradient={bgGradient}
          py={16}
          px={8}
          textAlign="center"
          position="relative"
          overflow="hidden"
        >
          <Container maxW="800px">
            <VStack spacing={6}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={`${colorScheme}.600`}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Institut de Beauté Premium
              </Text>

              <Heading
                size="2xl"
                color={`${colorScheme}.700`}
                fontWeight="light"
                lineHeight="shorter"
              >
                💄 L'Écrin de Jade
              </Heading>

              <Text fontSize="xl" color="gray.600" maxW="600px">
                Découvrez notre sélection exclusive de soins et cosmétiques de
                luxe, pour révéler votre beauté naturelle
              </Text>

              <HStack spacing={8} wrap="wrap" justify="center">
                <HStack>
                  <Icon as={FaStar} color="yellow.400" />
                  <Text fontSize="sm" color="gray.600">
                    Excellence depuis 1995
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaHeart} color={`${colorScheme}.400`} />
                  <Text fontSize="sm" color="gray.600">
                    Produits naturels
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaGift} color="purple.400" />
                  <Text fontSize="sm" color="gray.600">
                    Conseils personnalisés
                  </Text>
                </HStack>
              </HStack>

              <Button
                size="lg"
                colorScheme={colorScheme}
                variant="solid"
                px={8}
                py={6}
                fontSize="md"
                _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                transition="all 0.3s"
              >
                Prendre rendez-vous
              </Button>
            </VStack>
          </Container>
        </Box>

        {/* Section Produits Vedettes */}
        {featuredProducts.length > 0 && (
          <Container maxW="1200px" py={16}>
            <VStack spacing={8}>
              <VStack spacing={4} textAlign="center">
                <Heading size="lg" color={`${colorScheme}.700`}>
                  Nos Coups de Cœur
                </Heading>
                <Text color="gray.600" maxW="600px">
                  Une sélection exclusive de nos produits les plus appréciés
                </Text>
              </VStack>

              <ProductGrid
                products={featuredProducts}
                shop={beautyShop!}
                onAddToCart={handleAddToCart}
                onView={handleViewProduct}
                columns={{ base: 1, md: 3 }}
                spacing={8}
                isAdminMode={false}
              />
            </VStack>
          </Container>
        )}

        {/* Section Catégories */}
        <Box bg={cardBg} py={16}>
          <Container maxW="1200px">
            <VStack spacing={8}>
              <VStack spacing={4} textAlign="center">
                <Heading size="lg" color={`${colorScheme}.700`}>
                  Explorez nos Univers
                </Heading>
                <Text color="gray.600">
                  Trouvez les produits parfaits selon vos besoins
                </Text>
              </VStack>

              {/* Grille des catégories */}
              {categories.length > 0 && (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 4 }}
                  spacing={6}
                  w="full"
                >
                  {categories.map((category) => {
                    const categoryProducts = beautyShopProducts.filter(
                      (p) => p.categoryId === category.id
                    );

                    return (
                      <Box
                        key={category.id}
                        p={6}
                        bg="white"
                        borderRadius="xl"
                        shadow="md"
                        textAlign="center"
                        cursor="pointer"
                        transition="all 0.3s"
                        _hover={{
                          transform: "translateY(-4px)",
                          shadow: "xl",
                          borderColor: `${colorScheme}.200`,
                        }}
                        borderWidth={2}
                        borderColor={
                          selectedCategoryId === category.id
                            ? `${colorScheme}.300`
                            : "transparent"
                        }
                        onClick={() =>
                          setSelectedCategoryId(
                            selectedCategoryId === category.id
                              ? null
                              : category.id
                          )
                        }
                      >
                        <VStack spacing={3}>
                          <Text fontSize="3xl">💄</Text>
                          <Heading size="md" color={`${colorScheme}.700`}>
                            {category.name}
                          </Heading>
                          <Badge colorScheme={colorScheme} px={3} py={1}>
                            {categoryProducts.length} produit
                            {categoryProducts.length !== 1 ? "s" : ""}
                          </Badge>
                        </VStack>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              )}
            </VStack>
          </Container>
        </Box>

        {/* Section Tous les Produits */}
        <Container maxW="1200px" py={16}>
          <VStack spacing={8}>
            <VStack spacing={4} textAlign="center">
              <Heading size="lg" color={`${colorScheme}.700`}>
                {selectedCategoryId
                  ? `${
                      categories.find((c) => c.id === selectedCategoryId)?.name
                    }`
                  : "Toute notre Collection"}
              </Heading>
              <Text color="gray.600">
                {filteredProducts.length} produit
                {filteredProducts.length !== 1 ? "s" : ""} disponible
                {filteredProducts.length !== 1 ? "s" : ""}
              </Text>
            </VStack>

            {selectedCategoryId && (
              <Button
                variant="outline"
                colorScheme={colorScheme}
                onClick={resetFilters}
                size="sm"
              >
                Voir toute la collection
              </Button>
            )}

            {/* Grille produits principale */}
            <ProductGrid
              products={filteredProducts}
              shop={beautyShop!}
              onAddToCart={handleAddToCart}
              onView={handleViewProduct}
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={8}
              isAdminMode={false}
              emptyMessage={
                selectedCategoryId
                  ? "Aucun produit dans cette catégorie"
                  : "Aucun produit disponible"
              }
              emptySubMessage={
                selectedCategoryId
                  ? "Explorez nos autres univers beauté"
                  : undefined
              }
            />
          </VStack>
        </Container>
      </Box>
    </UniverseProvider>
  );
}
