import { VStack } from "@chakra-ui/react";
import type { Product, Shop } from "../../../../shared/types";
import { SharedProductCard } from "../shared/SharedProductCard";

interface AdminProductListProps {
  products: Product[];
  shop: Shop;
  onEdit: (product: Product) => void;
}

/**
 * Liste des produits pour l'interface admin
 * Utilise SharedProductCard avec thématisation automatique
 */
export default function AdminProductList({
  products,
  shop,
  onEdit,
}: AdminProductListProps) {
  return (
    <VStack spacing={4} align="stretch">
      {products.map((product) => (
        <SharedProductCard
          key={product.id}
          product={product}
          shop={shop}
          onEdit={onEdit}
          isAdminMode={true}
        />
      ))}
    </VStack>
  );
}
