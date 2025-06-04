import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Product, Shop } from "../../../shared/types";

/**
 * Hook standardisé pour les interactions produits dans les vitrines
 * Centralise la logique des handlers pour éviter la répétition
 */
export const useStoreHandlers = (shop?: Shop) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleAddToCart = useCallback(
    (product: Product) => {
      // Éviter l'erreur ESLint - sera utilisé quand la logique panier sera implémentée
      void product;

      toast({
        title: "Produit ajouté au panier !",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // TODO: Implémenter logique panier avec product
    },
    [toast]
  );

  const handleViewProduct = useCallback(
    (product: Product) => {
      if (shop) {
        navigate(`/store/${shop.shopType}/product/${product.id}`);
      } else {
        console.log("Voir produit:", product);
      }
    },
    [navigate, shop]
  );

  return {
    handleAddToCart,
    handleViewProduct,
  };
};
