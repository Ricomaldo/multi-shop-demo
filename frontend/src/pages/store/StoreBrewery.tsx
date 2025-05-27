import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { Product } from "../../../../shared/types";
import { StoreAdvancedFilters } from "../../components/store/StoreAdvancedFilters";
import StoreCategoryFilter from "../../components/store/StoreCategoryFilter";
import { StoreProductCard } from "../../components/store/StoreProductCard";
import { UniverseProvider } from "../../contexts/UniverseContext";
import { useShopData, useStoreProductFilters } from "../../hooks";
import type { ProductFilters } from "../../services/adminProductService";

export default function StoreBrewery() {
  const colorScheme = "orange";
  const [advancedFilters, setAdvancedFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Utiliser les hooks pour la gestion des données
  const { shops, products, loading, error } = useShopData();

  // Trouver la boutique brasserie
  const breweryShop = useMemo(() => {
    return shops.find((shop) => shop.shopType === "brewery");
  }, [shops]);

  // Filtrer les produits de la brasserie
  const breweryProducts = useMemo(() => {
    return products.filter((product) => product.shopId === breweryShop?.id);
  }, [products, breweryShop]);

  // Hook de filtrage vitrine
  const {
    filteredProducts,
    selectedCategoryId,
    categories,
    setSelectedCategoryId,
    resetFilters,
    applyAdvancedFilters,
  } = useStoreProductFilters(breweryProducts);

  // Gestionnaires pour les filtres avancés
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setAdvancedFilters(newFilters);
    applyAdvancedFilters(newFilters, searchTerm);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    applyAdvancedFilters(advancedFilters, search);
  };

  const handleResetFilters = () => {
    setAdvancedFilters({});
    setSearchTerm("");
    resetFilters();
  };

  const handleAddToCart = (productId: string) => {
    // Simulation ajout panier
    console.log("Ajout au panier:", productId);
  };

  if (loading) {
    return (
      <Box p={8} maxW="1200px" mx="auto">
        <VStack spacing={8}>
          <Text fontSize="lg">Chargement de la brasserie...</Text>
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
    <UniverseProvider defaultUniverse="brewery">
      <Box p={8} maxW="1200px" mx="auto">
        <VStack spacing={8}>
          <VStack spacing={4}>
            <Heading size="xl" color={`${colorScheme}.700`}>
              🍺 Houblon & Tradition
            </Heading>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Brasserie artisanale - Sélection de bières traditionnelles
            </Text>
            <Text fontSize="sm" color="gray.500">
              {breweryProducts.length} produit
              {breweryProducts.length !== 1 ? "s" : ""} disponible
              {breweryProducts.length !== 1 ? "s" : ""}
            </Text>
          </VStack>

          {/* Filtres avancés */}
          {breweryShop && (
            <StoreAdvancedFilters
              shop={breweryShop}
              filters={advancedFilters}
              searchTerm={searchTerm}
              onFiltersChange={handleFiltersChange}
              onSearchChange={handleSearchChange}
              onReset={handleResetFilters}
            />
          )}

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
              {filteredProducts.map((product: Product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  shop={breweryShop!}
                  onAddToCart={(prod: Product) => handleAddToCart(prod.id)}
                />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Box>
    </UniverseProvider>
  );
}
