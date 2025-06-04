import type { Product, Shop } from "@/types";
import { SharedProductPreviewCard } from "@/components/business/product/SharedProductPreviewCard";
import { Box, SimpleGrid, Text, VStack } from "@chakra-ui/react";

interface AdminProductListProps {
  products: Product[];
  shop: Shop;
  onEdit: (product: Product) => void;
}

/**
 * Grille de produits pour l'interface admin
 * Utilise SimpleGrid direct avec configuration responsive optimisée
 */
export default function AdminProductList({
  products,
  shop,
  onEdit,
}: AdminProductListProps) {
  // Cas vide
  if (products.length === 0) {
    return (
      <VStack spacing={4} py={8} px={4} textAlign="center">
        <Text fontSize="lg" color="gray.500">
          Aucun produit dans cette boutique
        </Text>
        <Text fontSize="sm" color="gray.400" maxW="400px">
          Commencez par ajouter votre premier produit
        </Text>
      </VStack>
    );
  }

  return (
    <Box w="full">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {products.map((product) => (
          <SharedProductPreviewCard
            key={product.id}
            product={product}
            shop={shop}
            onEdit={onEdit}
            isAdminMode={true}
            showActions={true}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
