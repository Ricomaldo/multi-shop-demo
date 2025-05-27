import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { SharedProductCard } from "../shared/SharedProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
}

interface StoreProductGridProps {
  products: Product[];
  onAddToCart?: (id: string) => void;
}

/**
 * Grille de produits pour les vitrines
 * Utilise SharedProductCard avec thématisation automatique
 */
export const StoreProductGrid: React.FC<StoreProductGridProps> = ({
  products,
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
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          category={product.category}
          onAddToCart={onAddToCart}
          isAdminMode={false}
        />
      ))}
    </SimpleGrid>
  );
};
