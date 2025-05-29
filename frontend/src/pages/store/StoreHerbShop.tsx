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

export default function StoreHerbShop() {
  const colorScheme = "teal";
  const [advancedFilters, setAdvancedFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Utiliser les hooks pour la gestion des données
  const { shops, products, loading, error } = useShopData();

  // Trouver l'herboristerie
  const herbShop = useMemo(() => {
    return shops.find((shop) => shop.shopType === "herbShop");
  }, [shops]);

  // Filtrer les produits de l'herboristerie
  const herbShopProducts = useMemo(() => {
    return products.filter((product) => product.shopId === herbShop?.id);
  }, [products, herbShop]);

  // Hook de filtrage vitrine
  const {
    filteredProducts,
    selectedCategoryId,
    categories,
    setSelectedCategoryId,
    resetFilters,
    applyAdvancedFilters,
  } = useStoreProductFilters(herbShopProducts);

  // Extraction dynamique des usages traditionnels
  const usageOptions = useMemo(() => {
    const usages = new Set<string>();
    herbShopProducts.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);
          if (attrs.usage_traditionnel) usages.add(attrs.usage_traditionnel);
        } catch {
          // Ignore les erreurs de parsing
        }
      }
    });
    return Array.from(usages).sort();
  }, [herbShopProducts]);

  // Extraction dynamique des formes galéniques
  const formeOptions = useMemo(() => {
    const formes = new Set<string>();
    herbShopProducts.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);
          if (attrs.forme_galenique) formes.add(attrs.forme_galenique);
        } catch {
          // Ignore les erreurs de parsing
        }
      }
    });
    return Array.from(formes).sort();
  }, [herbShopProducts]);

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
          <Text fontSize="lg">Chargement de l'herboristerie...</Text>
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
    <UniverseProvider defaultUniverse="herbShop">
      <Box p={6} maxW="1200px" mx="auto">
        <VStack spacing={6}>
          {/* Header E-commerce compact */}
          <VStack spacing={3} textAlign="center">
            <Heading size="lg" color={`${colorScheme}.700`}>
              🌿 Herboristerie du Moulin Vert
            </Heading>
            <Text fontSize="md" color="gray.600">
              Herboristerie traditionnelle - Plantes médicinales et bien-être
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
                placeholder="Rechercher une plante..."
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

              {/* Filtre par usage */}
              <Select
                placeholder="Usage"
                size="sm"
                maxW="150px"
                bg="white"
                value={advancedFilters.usage_traditionnel || ""}
                onChange={(e) =>
                  handleFiltersChange({
                    ...advancedFilters,
                    usage_traditionnel: e.target.value || undefined,
                  })
                }
              >
                {usageOptions.map((usage) => (
                  <option key={usage} value={usage}>
                    {usage}
                  </option>
                ))}
              </Select>

              {/* Filtre par forme */}
              <Select
                placeholder="Forme"
                size="sm"
                maxW="150px"
                bg="white"
                value={advancedFilters.forme_galenique || ""}
                onChange={(e) =>
                  handleFiltersChange({
                    ...advancedFilters,
                    forme_galenique: e.target.value || undefined,
                  })
                }
              >
                {formeOptions.map((forme) => (
                  <option key={forme} value={forme}>
                    {forme}
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
                Livraison gratuite dès 35€
              </Badge>
            </WrapItem>
            <WrapItem>
              <Badge colorScheme="blue" px={3} py={1}>
                Conseils d'herboriste
              </Badge>
            </WrapItem>
          </Wrap>

          {/* Grille produits */}
          {herbShop && (
            <ProductGrid
              products={filteredProducts}
              shop={herbShop}
              onAddToCart={handleAddToCart}
              onView={handleViewProduct}
              variant="standard"
              isAdminMode={false}
              emptyMessage={
                selectedCategoryId ||
                Object.keys(advancedFilters).length > 0 ||
                searchTerm
                  ? "Aucune plante ne correspond à vos critères"
                  : "Aucune plante disponible"
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
