import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  Category,
  Product,
  Shop,
  ShopType,
} from "../../../../shared/types";
import { SharedProductPreviewCard } from "../../components/shared/SharedProductPreviewCard";
import StoreHeader from "../../components/store/StoreHeader";
import StoreLayout from "../../components/store/StoreLayout";
import { useShopData, useStoreHandlers } from "../../hooks";
import type { ProductFilters } from "../../services/adminProductService";

export default function StoreCatalogueView() {
  const { shopType } = useParams<{ shopType: string }>();
  const {
    shops,
    products: allProducts,
    loading,
    getShopByType,
    refreshData,
  } = useShopData();
  const navigate = useNavigate();

  // État local pour la boutique courante
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const { handleAddToCart } = useStoreHandlers(currentShop || undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState<ProductFilters>({});

  // Initialiser la boutique courante
  useEffect(() => {
    if (!loading && shopType) {
      const shop = getShopByType(shopType as ShopType);
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
  const categories: Category[] = Array.from(
    new Set(
      shopProducts.filter((p) => p.category?.name).map((p) => p.category!.name)
    )
  ).map((name) => {
    // Trouver le premier produit avec cette catégorie pour obtenir l'ID
    const product = shopProducts.find((p) => p.category?.name === name);
    return {
      id: product?.categoryId || name,
      name,
      shopId: currentShop.id,
    };
  });

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
    if (selectedCategoryId && product.categoryId !== selectedCategoryId) {
      return false;
    }

    // Filtres avancés
    if (product.attributes) {
      const productAttributes = JSON.parse(product.attributes);
      for (const [key, value] of Object.entries(filters)) {
        if (value && productAttributes[key] !== value) {
          return false;
        }
      }
    }

    return true;
  });

  // Handler pour changement de boutique avec navigation
  const handleShopChange = async (newShop: Shop) => {
    // Réinitialiser les filtres
    setSearchTerm("");
    setSelectedCategoryId(null);
    setFilters({});

    // Mettre à jour la boutique
    setCurrentShop(newShop);

    // Refresh des données pour la nouvelle boutique
    await refreshData();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategoryId(null);
    setFilters({});
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  };

  // Navigation vers page produit dédiée
  const handleProductView = (product: Product) => {
    navigate(`/store/${currentShop.shopType}/product/${product.id}`);
  };

  return (
    <StoreLayout shop={currentShop}>
      {/* VARIANT NAV-ONLY - Navigation boutique seule */}
      <StoreHeader
        shop={currentShop}
        availableShops={shops}
        onShopChange={handleShopChange}
        variant="nav-only"
      />

      <VStack spacing={8} py={8} align="stretch">
        {/* En-tête catalogue */}
        <Box textAlign="center" py={8}>
          <Heading size="xl" mb={4}>
            Catalogue {currentShop.name}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Découvrez tous nos produits ({shopProducts.length} articles)
          </Text>
        </Box>

        {/* Barre de recherche et filtres */}
        <Box maxW="1400px" mx="auto" w="full">
          <VStack spacing={6}>
            <HStack spacing={4} w="full" flexWrap="wrap">
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                maxW="400px"
                size="lg"
              />

              <Select
                placeholder="Toutes les catégories"
                value={selectedCategoryId || ""}
                onChange={(e) => handleCategoryChange(e.target.value || null)}
                maxW="250px"
                size="lg"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>

              <Button onClick={handleResetFilters} variant="outline" size="lg">
                Réinitialiser
              </Button>
            </HStack>

            {/* Résultats */}
            <Flex justify="space-between" align="center" w="full">
              <Text color="gray.600">
                {filteredProducts.length} produit
                {filteredProducts.length > 1 ? "s" : ""} trouvé
                {filteredProducts.length > 1 ? "s" : ""}
              </Text>
            </Flex>
          </VStack>
        </Box>

        {/* Grille des produits */}
        <Box maxW="1400px" mx="auto" w="full">
          {filteredProducts.length > 0 ? (
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={6}
            >
              {filteredProducts.map((product) => (
                <GridItem key={product.id}>
                  <SharedProductPreviewCard
                    product={product}
                    shop={currentShop}
                    onAddToCart={handleAddToCart}
                    onView={handleProductView}
                  />
                </GridItem>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color="gray.500">
                Aucun produit ne correspond à vos critères
              </Text>
              <Button mt={4} onClick={handleResetFilters} colorScheme="blue">
                Voir tous les produits
              </Button>
            </Box>
          )}
        </Box>
      </VStack>
    </StoreLayout>
  );
}
