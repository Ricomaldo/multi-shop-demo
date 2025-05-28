import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import type { Product, Shop } from "../../../../shared/types";
import { SharedProductCard } from "../shared/SharedProductCard";

interface StoreProductGridProps {
  products: Product[];
  shop: Shop;
  onAddToCart?: (product: Product) => void;
}

/**
 * Grille de produits pour les vitrines
 * Utilise SharedProductCard avec thématisation automatique
 */
export const StoreProductGrid: React.FC<StoreProductGridProps> = ({
  products,
  shop,
  onAddToCart,
}) => {
  if (products.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500" fontSize="lg">
          Aucun produit disponible pour le moment
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
      {products.map((product) => (
        <SharedProductCard
          key={product.id}
          product={product}
          shop={shop}
          onAddToCart={onAddToCart}
          isAdminMode={false}
        />
      ))}
    </SimpleGrid>
  );
};
