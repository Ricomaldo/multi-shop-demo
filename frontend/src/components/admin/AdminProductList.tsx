import { VStack } from "@chakra-ui/react";
import type { Product } from "../../../../shared/types";
import { SharedProductCard } from "../shared/SharedProductCard";

interface AdminProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

/**
 * Liste des produits pour l'interface admin
 * Utilise SharedProductCard avec thématisation automatique
 */
export default function AdminProductList({
  products,
  onEdit,
}: AdminProductListProps) {
  const handleEdit = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      onEdit(product);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      {products.map((product) => (
        <SharedProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          category={product.category?.name}
          onEdit={handleEdit}
          isAdminMode={true}
        />
      ))}
    </VStack>
  );
}
