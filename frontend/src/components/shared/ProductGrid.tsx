import { Box, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import React from "react";
import type { Product, Shop } from "../../../../shared/types";
import { SharedProductCard } from "./SharedProductCard";

interface ProductGridProps {
  products: Product[];
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  columns?: { base: number; md?: number; lg?: number; xl?: number };
  spacing?: number | string;
  isAdminMode?: boolean;
  showActions?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
}

/**
 * Grille de produits réutilisable utilisant SharedProductCard
 * Composant central pour afficher des collections de produits
 * Utilisé dans toutes les pages vitrines et admin
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  shop,
  onAddToCart,
  onEdit,
  onView,
  onDelete,
  columns = { base: 1, md: 2, lg: 3 },
  spacing = 6,
  isAdminMode = false,
  showActions = true,
  emptyMessage = "Aucun produit disponible",
  emptySubMessage,
}) => {
  // Gestion du cas vide
  if (products.length === 0) {
    return (
      <VStack spacing={4} py={8}>
        <Text fontSize="lg" color="gray.500" textAlign="center">
          {emptyMessage}
        </Text>
        {emptySubMessage && (
          <Text fontSize="sm" color="gray.400" textAlign="center">
            {emptySubMessage}
          </Text>
        )}
      </VStack>
    );
  }

  return (
    <Box w="full">
      <SimpleGrid columns={columns} spacing={spacing} w="full">
        {products.map((product) => (
          <SharedProductCard
            key={product.id}
            product={product}
            shop={shop}
            isAdminMode={isAdminMode}
            onAddToCart={onAddToCart}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            showActions={showActions}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};
