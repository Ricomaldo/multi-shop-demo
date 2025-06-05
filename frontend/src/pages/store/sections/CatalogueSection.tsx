import { SharedProductPreviewCard } from "@/components/business/product/SharedProductPreviewCard";
import type { Category, Product, Shop } from "@/types";
import {
  Badge,
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

interface StoreCatalogueSectionProps {
  shop: Shop;
  categories: Category[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (v: string | null) => void;
  handleResetFilters: () => void;
  handleProductView: (product: Product) => void;
  handleAddToCart: (product: Product) => void;
  filteredProducts: Product[];
  signature: unknown;
  universeButton: unknown;
  universeColors: unknown;
  universeLayout: unknown;
  responsiveEmotions: unknown;
  animations: unknown;
  tokens: unknown;
}

export default function StoreCatalogueSection({
  shop,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategoryId,
  setSelectedCategoryId,
  handleResetFilters,
  handleProductView,
  handleAddToCart,
  filteredProducts,
  signature,
  universeButton,
  universeColors,
  universeLayout,
  responsiveEmotions,
  animations,
  tokens,
}: StoreCatalogueSectionProps) {
  return (
    <Box
      {...universeLayout.getContainerProps()}
      {...signature.getSignatureProps()}
    >
      {/* En-tête avec différenciateur visible */}
      <Box textAlign="center" py={8} {...animations.getEntranceProps()}>
        <Flex justify="center" align="center" gap={3} mb={4}>
          <Text fontSize="3xl">{tokens.meta.icon}</Text>
          <Heading
            size="xl"
            color={universeColors.primary}
            fontFamily={tokens.typography.fontFamily.heading}
          >
            Catalogue {shop.name}
          </Heading>
          <Text fontSize="lg" color={universeColors.text.subtle}>
            {signature.signature.visualElement}
          </Text>
        </Flex>
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
      {/* Barre de recherche et filtres */}
      <Box w="full" {...animations.getStaggeredEntranceProps(1)}>
        <HStack spacing={4} w="full" flexWrap="wrap" justify="center">
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="400px"
            size="lg"
            borderColor={universeColors.borders.light}
            focusBorderColor={universeColors.primary}
            borderRadius={tokens.borderRadius.base}
            {...responsiveEmotions.getInputProps()}
          />
          <Select
            placeholder="Toutes les catégories"
            value={selectedCategoryId || ""}
            onChange={(e) => setSelectedCategoryId(e.target.value || null)}
            maxW="250px"
            size="lg"
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
            size="lg"
            {...responsiveEmotions.getButtonProps()}
          >
            Réinitialiser
          </Button>
        </HStack>
        <Flex justify="center" align="center" w="full" mt={6}>
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
      {/* Grille des produits */}
      <Box w="full" {...animations.getStaggeredEntranceProps(2)}>
        {filteredProducts.length > 0 ? (
          <SimpleGrid {...universeLayout.getGridProps()} spacing={6}>
            {filteredProducts.map((product: Product, index: number) => (
              <Box
                key={product.id}
                {...animations.getStaggeredEntranceProps(index, 0.05)}
                {...responsiveEmotions.getCardProps()}
              >
                <SharedProductPreviewCard
                  product={product}
                  shop={shop}
                  onAddToCart={handleAddToCart}
                  onView={handleProductView}
                />
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={12}>
            <Text
              fontSize="lg"
              color={universeColors.text.subtle}
              fontFamily={tokens.typography.fontFamily.body}
              mb={4}
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
  );
}
