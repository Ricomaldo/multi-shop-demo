import { useCallback } from "react";
import type { Product } from "../../../shared/types";

/**
 * Hook standardisé pour les interactions produits dans les vitrines
 * Centralise la logique des handlers pour éviter la répétition
 */
export const useStoreHandlers = () => {
  const handleAddToCart = useCallback((product: Product) => {
    console.log("Ajouter au panier:", product);
    // TODO: Implémenter logique panier
  }, []);

  const handleViewProduct = useCallback((product: Product) => {
    console.log("Voir produit:", product);
    // TODO: Implémenter navigation vers détail produit
  }, []);

  return {
    handleAddToCart,
    handleViewProduct,
  };
};