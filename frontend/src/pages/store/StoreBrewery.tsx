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

  // Extraction dynamique des options de houblon
  const hopOptions = useMemo(() => {
    const hops = new Set<string>();
    breweryProducts.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);
          if (attrs.type_houblon) hops.add(attrs.type_houblon);
        } catch {
          // Ignore les erreurs de parsing
        }
      }
    });
    return Array.from(hops).sort();
  }, [breweryProducts]);

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
      <Box p={6} maxW="1200px" mx="auto">
        <VStack spacing={6}>
          {/* Header E-commerce compact */}
          <VStack spacing={3} textAlign="center">
            <Heading size="lg" color={`${colorScheme}.700`}>
              🍺 Houblon & Tradition
            </Heading>
            <Text fontSize="md" color="gray.600">
              Brasserie artisanale - Sélection de bières traditionnelles
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
                placeholder="Rechercher une bière..."
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

              {/* Filtre par intensité */}
              <Select
                placeholder="Intensité"
                size="sm"
                maxW="150px"
                bg="white"
                value={advancedFilters.degre_alcool_ranges?.[0] || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFiltersChange({
                    ...advancedFilters,
                    degre_alcool_ranges: value ? [value] : undefined,
                  });
                }}
              >
                <option value="light">Légère (3-5°)</option>
                <option value="medium">Modérée (5-7°)</option>
                <option value="strong">Forte (7-10°)</option>
                <option value="very-strong">Très forte (10°+)</option>
              </Select>

              {/* Filtre par amertume */}
              <Select
                placeholder="Amertume"
                size="sm"
                maxW="150px"
                bg="white"
                value={advancedFilters.amertume_ibu_ranges?.[0] || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFiltersChange({
                    ...advancedFilters,
                    amertume_ibu_ranges: value ? [value] : undefined,
                  });
                }}
              >
                <option value="low">Douce (10-25)</option>
                <option value="medium">Équilibrée (25-45)</option>
                <option value="high">Amère (45-70)</option>
                <option value="very-high">Très amère (70+)</option>
              </Select>

              {/* Filtre par houblon */}
              <Select
                placeholder="Houblon"
                size="sm"
                maxW="150px"
                bg="white"
                value={advancedFilters.type_houblon || ""}
                onChange={(e) =>
                  handleFiltersChange({
                    ...advancedFilters,
                    type_houblon: e.target.value || undefined,
                  })
                }
              >
                {hopOptions.map((hop) => (
                  <option key={hop} value={hop}>
                    {hop}
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
                Livraison gratuite dès 50€
              </Badge>
            </WrapItem>
            <WrapItem>
              <Badge colorScheme="blue" px={3} py={1}>
                Paiement sécurisé
              </Badge>
            </WrapItem>
          </Wrap>

          {/* Grille produits */}
          <ProductGrid
            products={filteredProducts}
            shop={breweryShop!}
            onAddToCart={handleAddToCart}
            onView={handleViewProduct}
            variant="standard"
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
