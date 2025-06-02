import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product, Shop } from "../../../../shared/types";
import { ProductDetailView } from "../../components/shared/ProductDetailView";
import SharedAdvancedFilters from "../../components/shared/SharedAdvancedFilters";
import SharedCategoryFilter from "../../components/shared/SharedCategoryFilter";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopData, useStoreHandlers } from "../../hooks";
import type { ProductFilters } from "../../services/adminProductService";

// Configuration des couleurs par type de boutique
const SHOP_COLORS = {
  brewery: "orange",
  teaShop: "green",
  beautyShop: "pink",
  herbShop: "teal",
} as const;

// Mapping des images hero existantes
const HERO_IMAGES = {
  brewery: "/images/store/brewery-hero.jpg",
  teaShop: "/images/store/tea-hero.jpg",
  beautyShop: "/images/store/beauty-hero.jpg",
  herbShop: "/images/store/herb-hero.jpg",
} as const;

type ShopType = keyof typeof SHOP_COLORS;

export default function StoreProductsDisplay() {
  const { shopType = "" } = useParams<{ shopType: string }>();
  const { shops, products: allProducts, loading, getShopByType } = useShopData();
  const { handleAddToCart, handleViewProduct } = useStoreHandlers();
  const navigate = useNavigate();

  // État local pour la boutique courante
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Initialiser la boutique courante
  useEffect(() => {
    if (!loading) {
      const shop = getShopByType(shopType);
      if (!shop) {
        navigate("/404");
      } else {
        setCurrentShop(shop);
      }
    }
  }, [loading, shopType, getShopByType, navigate]);

  // Si chargement ou pas de boutique, afficher un loader
  if (loading || !currentShop) {
    return <Box>Chargement...</Box>;
  }

  // Obtenir les produits de la boutique
  const shopProducts = allProducts.filter((p) => p.shopId === currentShop.id);

  // Obtenir les catégories uniques
  const categories = Array.from(
    new Set(shopProducts.map((p) => p.category))
  ).map((name) => ({
    id: name,
    name,
  }));

  // Filtrer les produits selon les critères
  const filteredProducts = shopProducts.filter((product) => {
    // Filtre par recherche
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filtre par catégorie
    if (selectedCategoryId && product.category !== selectedCategoryId) {
      return false;
    }

    // Filtres avancés
    for (const [key, value] of Object.entries(filters)) {
      if (value && product.attributes?.[key] !== value) {
        return false;
      }
    }

    return true;
  });

  const handleShopChange = (newShop: Shop) => {
    // Réinitialiser les filtres
    setSearchTerm("");
    setSelectedCategoryId(null);
    setFilters({});

    // Mettre à jour la boutique
    setCurrentShop(newShop);
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategoryId(null);
    setFilters({});
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  // Handler personnalisé pour ouvrir la modale
  const handleProductModalOpen = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    onClose();
  };

  return (
    <Box as="main" bg="gray.50" minH="100vh">
      <StoreHeroHeader
        shop={currentShop}
        title={`Catalogue ${currentShop.name}`}
        subtitle="Découvrez tous nos produits"
        availableShops={shops}
        onShopChange={handleShopChange}
      />

      <Container maxW="7xl" py={8}>
        {/* Header de la page */}
        <VStack spacing={2} mb={8} textAlign="center">
          <Heading size="xl" color={`${currentShop.shopType}.600`} fontWeight="bold">
            Nos Produits
          </Heading>
          <Text color="gray.600" fontSize="lg">
            {filteredProducts.length} produits disponibles
          </Text>
        </VStack>

        {/* Layout principal avec sidebar et contenu */}
        <Grid
          templateColumns={{ base: "1fr", lg: "300px 1fr" }}
          gap={8}
          alignItems="start"
        >
          {/* Sidebar Filtres */}
          <GridItem>
            <VStack spacing={6} position="sticky" top={4}>
              <SharedCategoryFilter
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategoryChange}
                onResetFilters={handleResetFilters}
                productCount={filteredProducts.length}
                colorScheme={currentShop.shopType}
                mode="store"
              />

              <SharedAdvancedFilters
                shop={currentShop}
                filters={filters}
                searchTerm={searchTerm}
                onFiltersChange={handleFiltersChange}
                onSearchChange={setSearchTerm}
                onReset={handleResetFilters}
                mode="store"
                products={shopProducts}
              />
            </VStack>
          </GridItem>

          {/* Grille de produits */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Barre de résultats */}
              <Flex
                justify="space-between"
                align="center"
                bg="white"
                p={4}
                borderRadius="lg"
                shadow="sm"
                borderWidth="1px"
              >
                <Text fontSize="md" fontWeight="medium" color="gray.700">
                  {filteredProducts.length} produit
                  {filteredProducts.length > 1 ? "s" : ""} trouvé
                  {filteredProducts.length > 1 ? "s" : ""}
                </Text>

                {(searchTerm || selectedCategoryId) && (
                  <Text fontSize="sm" color={`${currentShop.shopType}.600`}>
                    Filtres actifs
                  </Text>
                )}
              </Flex>

              {/* Grille de produits */}
              {filteredProducts.length > 0 ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, xl: 3 }}
                  spacing={6}
                  w="full"
                >
                  {filteredProducts.map((product) => (
                    <Box
                      key={product.id}
                      transition="transform 0.2s, shadow 0.2s"
                      _hover={{
                        transform: "translateY(-4px)",
                        shadow: "lg",
                      }}
                    >
                      <SharedProductCard
                        product={product}
                        shop={currentShop}
                        onAddToCart={handleAddToCart}
                        onView={handleProductModalOpen}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Box
                  textAlign="center"
                  py={16}
                  bg="white"
                  borderRadius="xl"
                  shadow="sm"
                  borderWidth="1px"
                >
                  <Text fontSize="xl" color="gray.500" mb={2}>
                    🔍 Aucun produit trouvé
                  </Text>
                  <Text fontSize="md" color="gray.400" mb={4}>
                    Essayez de modifier vos critères de recherche
                  </Text>
                  <Text
                    fontSize="sm"
                    color={`${currentShop.shopType}.600`}
                    cursor="pointer"
                    textDecoration="underline"
                    onClick={handleResetFilters}
                  >
                    Réinitialiser tous les filtres
                  </Text>
                </Box>
              )}
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      {/* Modale de détail produit */}
      {selectedProduct && (
        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          size="6xl"
          scrollBehavior="inside"
        >
          <ModalOverlay bg="blackAlpha.600" />
          <ModalContent borderRadius="xl" overflow="hidden" maxH="90vh">
            <ModalHeader
              bg={`${currentShop.shopType}.50`}
              borderBottom="1px"
              borderColor={`${currentShop.shopType}.100`}
            >
              <Text
                color={`${currentShop.shopType}.700`}
                fontSize="xl"
                fontWeight="bold"
              >
                {selectedProduct.name}
              </Text>
            </ModalHeader>
            <ModalCloseButton
              color={`${currentShop.shopType}.600`}
              _hover={{ bg: `${currentShop.shopType}.100` }}
            />
            <ModalBody p={0}>
              <ProductDetailView
                product={selectedProduct}
                shop={currentShop}
                onAddToCart={handleAddToCart}
                onGoBack={handleCloseModal}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
