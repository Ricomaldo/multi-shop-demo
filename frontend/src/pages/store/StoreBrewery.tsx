import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { Product } from "../../../../shared/types";
import {
  SharedAdvancedFilters,
  SharedCategoryFilter,
} from "../../components/shared";
import { ProductGrid } from "../../components/shared/ProductGrid";
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

  const handleAddToCart = (product: Product) => {
    // Simulation ajout panier
    console.log("Ajout au panier:", product.name);
  };

  const handleViewProduct = (product: Product) => {
    // Navigation vers détail produit
    console.log("Voir détails:", product.name);
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
          {/* Header E-commerce */}
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color={`${colorScheme}.700`}>
              🍺 Houblon & Tradition
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Brasserie artisanale - Sélection de bières traditionnelles
            </Text>

            {/* Stats boutique */}
            <HStack spacing={6} wrap="wrap" justify="center">
              <Badge colorScheme={colorScheme} px={3} py={1}>
                {breweryProducts.length} produit
                {breweryProducts.length !== 1 ? "s" : ""}
              </Badge>
              <Badge colorScheme="green" px={3} py={1}>
                {categories.length} catégorie
                {categories.length !== 1 ? "s" : ""}
              </Badge>
              <Badge colorScheme="blue" px={3} py={1}>
                Livraison gratuite dès 50€
              </Badge>
            </HStack>
          </VStack>

          <Divider />

          {/* Filtres avancés - Spécificité brasserie */}
          {breweryShop && (
            <Box w="full">
              <SharedAdvancedFilters
                shop={breweryShop}
                filters={advancedFilters}
                searchTerm={searchTerm}
                onFiltersChange={handleFiltersChange}
                onSearchChange={handleSearchChange}
                onReset={handleResetFilters}
              />
            </Box>
          )}

          {/* Filtrage par catégorie */}
          {categories.length > 0 && (
            <SharedCategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
              onResetFilters={resetFilters}
              productCount={filteredProducts.length}
              colorScheme={colorScheme}
              mode="store"
            />
          )}

          {/* Résultats et actions */}
          <HStack justify="space-between" w="full">
            <Text fontSize="sm" color="gray.600">
              {filteredProducts.length} résultat
              {filteredProducts.length !== 1 ? "s" : ""} trouvé
              {filteredProducts.length !== 1 ? "s" : ""}
            </Text>

            {(selectedCategoryId ||
              Object.keys(advancedFilters).length > 0 ||
              searchTerm) && (
              <Button
                size="sm"
                variant="outline"
                colorScheme={colorScheme}
                onClick={handleResetFilters}
              >
                Réinitialiser tous les filtres
              </Button>
            )}
          </HStack>

          {/* Grille produits avec ProductGrid */}
          <ProductGrid
            products={filteredProducts}
            shop={breweryShop!}
            onAddToCart={handleAddToCart}
            onView={handleViewProduct}
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={6}
            isAdminMode={false}
            emptyMessage={
              selectedCategoryId ||
              Object.keys(advancedFilters).length > 0 ||
              searchTerm
                ? "Aucun produit ne correspond à vos critères"
                : "Aucun produit disponible"
            }
            emptySubMessage={
              selectedCategoryId ||
              Object.keys(advancedFilters).length > 0 ||
              searchTerm
                ? "Essayez de modifier vos filtres"
                : undefined
            }
          />
        </VStack>
      </Box>
    </UniverseProvider>
  );
}
