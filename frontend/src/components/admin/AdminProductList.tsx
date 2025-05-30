import type { Product, Shop } from "../../../../shared/types";
import { SharedProductGrid } from "../shared/ProductGrid";

interface AdminProductListProps {
  products: Product[];
  shop: Shop;
  onEdit: (product: Product) => void;
}

/**
 * Grille de produits pour l'interface admin
 * Utilise SharedProductGrid avec colonnes forcées pour éviter les problèmes de responsive
 */
export default function AdminProductList({
  products,
  shop,
  onEdit,
}: AdminProductListProps) {
  return (
    <SharedProductGrid
      products={products}
      shop={shop}
      onEdit={onEdit}
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={4}
      isAdminMode={true}
      showActions={true}
      emptyMessage="Aucun produit dans cette boutique"
      emptySubMessage="Commencez par ajouter votre premier produit"
    />
  );
}
