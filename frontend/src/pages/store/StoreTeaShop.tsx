import { SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { Product } from "../../../../shared/types";
import { ProductGrid } from "../../components/shared/ProductGrid";
import { UniverseProvider } from "../../contexts/UniverseContext";
import { useShopData, useStoreProductFilters } from "../../hooks";
import type { ProductFilters } from "../../services/adminProductService";

export default function StoreTeaShop() {
  const colorScheme = "green";
  const [advancedFilters, setAdvancedFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Utiliser les hooks pour la gestion des données
  const { shops, products, loading, error } = useShopData();

  // Trouver la boutique salon de thé
  const teaShop = useMemo(() => {
    return shops.find((shop) => shop.shopType === "teaShop");
  }, [shops]);

  // Filtrer les produits du salon de thé
  const teaShopProducts = useMemo(() => {
    return products.filter((product) => product.shopId === teaShop?.id);
  }, [products, teaShop]);

  // Hook de filtrage vitrine
  const {
    filteredProducts,
    selectedCategoryId,
    categories,
    setSelectedCategoryId,
    resetFilters,
    applyAdvancedFilters,
  } = useStoreProductFilters(teaShopProducts);

  // Extraction dynamique des options d'origine
  const originOptions = useMemo(() => {
    const origins = new Set<string>();
    teaShopProducts.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);
          if (attrs.origine_plantation) origins.add(attrs.origine_plantation);
        } catch {
          // Ignore les erreurs de parsing
        }
      }
    });
    return Array.from(origins).sort();
  }, [teaShopProducts]);

  // Extraction dynamique des grades de qualité
  const gradeOptions = useMemo(() => {
    const grades = new Set<string>();
    teaShopProducts.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);
          if (attrs.grade_qualite) grades.add(attrs.grade_qualite);
        } catch {
          // Ignore les erreurs de parsing
        }
      }
    });
    return Array.from(grades).sort();
  }, [teaShopProducts]);

  // Gestionnaires pour les filtres
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
    console.log("Ajout au panier:", product.name);
  };

  const handleViewProduct = (product: Product) => {
    console.log("Voir détails:", product.name);
  };

  if (loading) {
    return (
      <Box p={8} maxW="1200px" mx="auto">
        <VStack spacing={8}>
          <Text fontSize="lg">Chargement du salon de thé...</Text>
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
    <UniverseProvider defaultUniverse="teaShop">
      <Box p={6} maxW="1200px" mx="auto">
        <VStack spacing={6}>
          {/* Header E-commerce compact */}
          <VStack spacing={3} textAlign="center">
            <Heading size="lg" color={`${colorScheme}.700`}>
              🍵 Les Jardins de Darjeeling
            </Heading>
            <Text fontSize="md" color="gray.600">
              Salon de thé raffiné - Sélection de thés d'exception
            </Text>
          </VStack>

          {/* Barre de recherche et filtres rapides */}
          <VStack spacing={4} w="full">
            {/* Recherche principale */}
            <InputGroup size="lg" maxW="500px">
              <InputLeftElement>
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Rechercher un thé..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                borderRadius="full"
                bg="white"
                _focus={{
                  borderColor: `${colorScheme}.400`,
                  boxShadow: `0 0 0 1px var(--chakra-colors-${colorScheme}-400)`,
                }}
              />
            </InputGroup>

            {/* Filtres rapides horizontaux */}
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              align="center"
              justify="center"
              wrap="wrap"
            >
              {/* Filtre par catégorie */}
              <Select
                placeholder="Catégorie"
                size="sm"
                maxW="150px"
                bg="white"
                value={selectedCategoryId || ""}
                onChange={(e) => setSelectedCategoryId(e.target.value || null)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>

              {/* Filtre par origine */}
              <Select
                placeholder="Origine"
                size="sm"
                maxW="150px"
                bg="white"
                value={advancedFilters.origine_plantation || ""}
                onChange={(e) =>
                  handleFiltersChange({
                    ...advancedFilters,
                    origine_plantation: e.target.value || undefined,
                  })
                }
              >
                {originOptions.map((origin) => (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                ))}
              </Select>

              {/* Filtre par grade */}
              <Select
                placeholder="Grade"
                size="sm"
                maxW="150px"
                bg="white"
                value={advancedFilters.grade_qualite || ""}
                onChange={(e) =>
                  handleFiltersChange({
                    ...advancedFilters,
                    grade_qualite: e.target.value || undefined,
                  })
                }
              >
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </Select>

              {/* Reset */}
              {(selectedCategoryId ||
                Object.keys(advancedFilters).length > 0 ||
                searchTerm) && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme={colorScheme}
                  onClick={handleResetFilters}
                >
                  Effacer tout
                </Button>
              )}
            </Flex>
          </VStack>

          {/* Stats et badges */}
          <Wrap justify="center" spacing={4}>
            <WrapItem>
              <Badge colorScheme={colorScheme} px={3} py={1}>
                {filteredProducts.length} résultat
                {filteredProducts.length !== 1 ? "s" : ""}
              </Badge>
            </WrapItem>
            <WrapItem>
              <Badge colorScheme="green" px={3} py={1}>
                Livraison gratuite dès 30€
              </Badge>
            </WrapItem>
            <WrapItem>
              <Badge colorScheme="blue" px={3} py={1}>
                Thés d'exception
              </Badge>
            </WrapItem>
          </Wrap>

          {/* Grille produits */}
          {teaShop && (
            <ProductGrid
              products={filteredProducts}
              shop={teaShop}
              onAddToCart={handleAddToCart}
              onView={handleViewProduct}
              variant="standard"
              isAdminMode={false}
              emptyMessage={
                selectedCategoryId ||
                Object.keys(advancedFilters).length > 0 ||
                searchTerm
                  ? "Aucun thé ne correspond à vos critères"
                  : "Aucun thé disponible"
              }
              emptySubMessage={
                selectedCategoryId ||
                Object.keys(advancedFilters).length > 0 ||
                searchTerm
                  ? "Essayez de modifier vos filtres"
                  : undefined
              }
            />
          )}
        </VStack>
      </Box>
    </UniverseProvider>
  );
}
