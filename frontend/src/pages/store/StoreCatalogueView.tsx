import StoreShopInfoBadge from "@/components/business/shop/StoreShopInfoBadge";
import { StorePageWrapper } from "@/components/features/store/content/StorePageWrapper";
import type { Category, Product } from "@/types";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SharedProductPreviewCard } from "../../components/business/product/SharedProductPreviewCard";
import { useStoreHandlers, useStorePage } from "../../hooks";
import type { ProductFilters } from "../../services/adminProductService";
import { getUniverseTokens } from "../../theme/universeTokens";

export default function StoreCatalogueView() {
  const navigate = useNavigate();
  const { currentShop, shopProducts } = useStorePage({
    redirectOnShopChange: true,
  });
  const { handleAddToCart } = useStoreHandlers(currentShop || undefined);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState<ProductFilters>({});

  // Tokens pour la thématisation automatique
  const tokens = getUniverseTokens(currentShop?.shopType || "brewery");

  // Obtenir les catégories uniques
  const categories: Category[] = Array.from(
    new Set(
      shopProducts
        .filter((p: Product) => p.category?.name)
        .map((p: Product) => p.category!.name)
    )
  ).map((name: string) => {
    const product = shopProducts.find(
      (p: Product) => p.category?.name === name
    );
    return {
      id: product?.categoryId || name,
      name,
      shopId: currentShop?.id || "",
    };
  });

  // Filtrer les produits selon les critères
  const filteredProducts = shopProducts.filter((product: Product) => {
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
    navigate(`/store/${currentShop?.shopType}/product/${product.id}`);
  };

  return (
    <StorePageWrapper headerVariant="nav-only" redirectOnShopChange={true}>
      {/* Badge d'informations boutique - En haut du contenu */}
      <Flex justify={{ base: "center", md: "flex-end" }} w="full">
        <Box maxW={{ base: "full", md: "400px" }}>
          <StoreShopInfoBadge shop={currentShop!} variant="compact" />
        </Box>
      </Flex>

      {/* En-tête catalogue avec tokens */}
      <Box textAlign="center" py={8}>
        <Heading
          size="xl"
          mb={4}
          color={tokens.colors[800]}
          fontFamily={tokens.typography.fontFamily.heading}
        >
          {tokens.meta.icon} Catalogue {currentShop?.name}
        </Heading>
        <Text
          fontSize="lg"
          color={tokens.colors[600]}
          fontFamily={tokens.typography.fontFamily.body}
        >
          Découvrez tous nos produits ({shopProducts.length} articles)
        </Text>
      </Box>

      {/* Barre de recherche et filtres avec styling universel */}
      <Box w="full">
        <HStack spacing={4} w="full" flexWrap="wrap" justify="center">
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="400px"
            size="lg"
            borderColor={tokens.colors[200]}
            focusBorderColor={tokens.colors[400]}
            borderRadius={tokens.borderRadius.base}
          />

          <Select
            placeholder="Toutes les catégories"
            value={selectedCategoryId || ""}
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            maxW="250px"
            size="lg"
            borderColor={tokens.colors[200]}
            focusBorderColor={tokens.colors[400]}
            borderRadius={tokens.borderRadius.base}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Button
            onClick={handleResetFilters}
            variant="outline"
            size="lg"
            colorScheme={tokens.meta.colorScheme}
            borderRadius={tokens.borderRadius.base}
            fontFamily={tokens.typography.fontFamily.body}
          >
            Réinitialiser
          </Button>
        </HStack>

        {/* Résultats avec styling universel */}
        <Flex justify="center" align="center" w="full" mt={6}>
          <Text
            color={tokens.colors[600]}
            fontFamily={tokens.typography.fontFamily.body}
          >
            {filteredProducts.length} produit
            {filteredProducts.length > 1 ? "s" : ""} trouvé
            {filteredProducts.length > 1 ? "s" : ""}
          </Text>
        </Flex>
      </Box>

      {/* Grille des produits */}
      <Box w="full">
        {filteredProducts.length > 0 ? (
          <SimpleGrid
            columns={{
              base: 1,
              sm: 2,
              md: 3,
              lg: 4,
            }}
            spacing={6}
          >
            {filteredProducts.map((product: Product) => (
              <SharedProductPreviewCard
                key={product.id}
                product={product}
                shop={currentShop!}
                onAddToCart={handleAddToCart}
                onView={handleProductView}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12}>
            <Text
              fontSize="lg"
              color={tokens.colors[500]}
              fontFamily={tokens.typography.fontFamily.body}
              mb={4}
            >
              Aucun produit ne correspond à vos critères
            </Text>
            <Button
              onClick={handleResetFilters}
              colorScheme={tokens.meta.colorScheme}
              borderRadius={tokens.borderRadius.base}
              fontFamily={tokens.typography.fontFamily.body}
              fontWeight={tokens.typography.fontWeight.bold}
            >
              Voir tous les produits
            </Button>
          </Box>
        )}
      </Box>
    </StorePageWrapper>
  );
}
