import { StorePageWrapper } from "@/components/features/store/content/StorePageWrapper";
import type { Category, Product } from "@/types";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SharedProductPreviewCard } from "../../components/business/product/SharedProductPreviewCard";
import {
  useResponsiveEmotions,
  useStoreHandlers,
  useStorePage,
  useUniverseAnimations,
  useUniverseButton,
  useUniverseColors,
  useUniverseLayout,
  useUniverseSignature,
} from "../../hooks";
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

  // 🆕 HOOKS ÉMOTIONNELS INTÉGRÉS - avec fallback safe
  const shopType = currentShop?.shopType || "brewery";
  const tokens = getUniverseTokens(shopType);
  const universeButton = useUniverseButton(shopType);
  const universeColors = useUniverseColors(shopType);
  const universeLayout = useUniverseLayout(shopType);
  const responsiveEmotions = useResponsiveEmotions(shopType);
  const animations = useUniverseAnimations(shopType);
  const signature = useUniverseSignature(shopType);

  // ✅ SÉCURITÉ : Vérification currentShop avant le rendu
  if (!currentShop) {
    return null; // ou un skeleton/loading si besoin
  }

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
      {/* Container avec signature background */}
      <Box
        {...universeLayout.getContainerProps()}
        {...signature.getSignatureProps()}
        py={tokens.spacing.section}
      >
        {/* En-tête avec différenciateur visible */}
        <Box
          textAlign="center"
          mb={tokens.spacing.section}
          {...animations.getEntranceProps()}
        >
          <Flex
            justify="center"
            align="center"
            gap={3}
            mb={tokens.spacing.component}
          >
            <Text fontSize="3xl">{tokens.meta.icon}</Text>
            <Heading
              size="xl"
              color={universeColors.primary}
              fontFamily={tokens.typography.fontFamily.heading}
            >
              Catalogue {currentShop.name}
            </Heading>
            <Text fontSize="lg" color={universeColors.text.subtle}>
              {signature.signature.visualElement}
            </Text>
          </Flex>

          {/* 🆕 BADGE DIFFÉRENCIATEUR UNIQUE */}
          <Badge
            variant="outline"
            colorScheme={tokens.meta.colorScheme}
            fontSize="xs"
            px={3}
            py={1}
            borderRadius={tokens.borderRadius.base}
          >
            {signature.getDifferentiatorText()}
          </Badge>
        </Box>

        {/* Barre de recherche et filtres avec styling universel responsive */}
        <Box
          w="full"
          mb={tokens.spacing.section}
          px={{ base: 4, md: 6 }}
          {...animations.getStaggeredEntranceProps(1)}
        >
          <VStack spacing={{ base: 3, md: 4 }} w="full" align="center">
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              w={{ base: "100%", sm: "400px" }}
              maxW="400px"
              size={{ base: "md", md: "lg" }}
              borderColor={universeColors.borders.light}
              focusBorderColor={universeColors.primary}
              borderRadius={tokens.borderRadius.base}
              {...responsiveEmotions.getInputProps()}
            />

            <Select
              placeholder="Toutes les catégories"
              value={selectedCategoryId || ""}
              onChange={(e) => handleCategoryChange(e.target.value || null)}
              w={{ base: "100%", sm: "250px" }}
              maxW="250px"
              size={{ base: "md", md: "lg" }}
              borderColor={universeColors.borders.light}
              focusBorderColor={universeColors.primary}
              borderRadius={tokens.borderRadius.base}
              {...responsiveEmotions.getInputProps()}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>

            <Button
              onClick={handleResetFilters}
              {...universeButton.getSecondaryProps()}
              size={{ base: "md", md: "lg" }}
              w={{ base: "100%", sm: "auto" }}
              {...responsiveEmotions.getButtonProps()}
            >
              Réinitialiser
            </Button>
          </VStack>

          {/* Résultats avec couleurs contextuelles */}
          <Flex
            justify="center"
            align="center"
            w="full"
            mt={tokens.spacing.component}
          >
            <Text
              color={universeColors.text.subtle}
              fontFamily={tokens.typography.fontFamily.body}
            >
              {filteredProducts.length} produit
              {filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
            </Text>
          </Flex>
        </Box>

        {/* Grille des produits avec layout émotionnel */}
        <Box w="full" {...animations.getStaggeredEntranceProps(2)}>
          {filteredProducts.length > 0 ? (
            <SimpleGrid {...universeLayout.getGridProps()}>
              {filteredProducts.map((product: Product, index: number) => (
                <Box
                  key={product.id}
                  {...animations.getStaggeredEntranceProps(index, 0.05)}
                  {...responsiveEmotions.getCardProps()}
                >
                  <SharedProductPreviewCard
                    product={product}
                    shop={currentShop}
                    onAddToCart={handleAddToCart}
                    onView={handleProductView}
                  />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={tokens.spacing.section}>
              <Text
                fontSize="lg"
                color={universeColors.text.subtle}
                fontFamily={tokens.typography.fontFamily.body}
                mb={tokens.spacing.component}
              >
                Aucun produit ne correspond à vos critères
              </Text>
              <Button
                onClick={handleResetFilters}
                {...universeButton.getPrimaryProps()}
                {...responsiveEmotions.getButtonProps()}
              >
                Voir tous les produits
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </StorePageWrapper>
  );
}
