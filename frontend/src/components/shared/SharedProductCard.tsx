import { Box, Image, Text, useMultiStyleConfig } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import type { Product, Shop } from "../../../../shared/types";
import { storeAnimations } from "../../theme/components/shared";

interface SharedProductCardProps {
  /** Produit à afficher */
  product: Product;
  /** Boutique pour la thématisation automatique */
  shop: Shop;
  /** Active le mode admin avec actions d'édition */
  isAdminMode?: boolean;
  /** Callback pour éditer le produit (admin) */
  onEdit?: (product: Product) => void;
  /** Callback pour ajouter au panier (vitrine) */
  onAddToCart?: (product: Product) => void;
  /** Callback pour voir les détails */
  onView?: (product: Product) => void;
  /** Callback pour supprimer (admin) */
  onDelete?: (product: Product) => void;
  /** Affiche ou masque les boutons d'action */
  showActions?: boolean;
}

const MotionBox = motion(Box);

// Mapping des types de boutique vers les clés d'animation
const shopTypeToAnimationKey = {
  brewery: "brewery",
  teaShop: "tea",
  beautyShop: "beauty",
  herbShop: "herb",
} as const;

/**
 * Composant partagé universel pour afficher une carte produit
 * S'adapte automatiquement au thème de l'univers et affiche les attributs métier
 * Utilisé partout : vitrine, admin, splitView, dashboard
 *
 * @example
 * ```tsx
 * // Mode vitrine
 * <SharedProductCard
 *   product={product}
 *   shop={shop}
 *   onAddToCart={handleAddToCart}
 *   onView={handleView}
 * />
 *
 * // Mode admin
 * <SharedProductCard
 *   product={product}
 *   shop={shop}
 *   isAdminMode
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const SharedProductCard: React.FC<SharedProductCardProps> = ({
  product,
  shop,
  onView,
}) => {
  const styles = useMultiStyleConfig("SharedProductCard", {
    variant: shop.shopType,
  });

  // Utilisation du mapping pour obtenir la bonne clé d'animation
  const animationKey = shopTypeToAnimationKey[shop.shopType] || "brewery";
  const animation = storeAnimations[animationKey];

  return (
    <MotionBox
      role="group"
      as="article"
      cursor="pointer"
      onClick={() => onView?.(product)}
      __css={styles.card}
      {...animation}
    >
      <Image src={product.image} alt={product.name} __css={styles.image} />

      <Box __css={styles.content}>
        <Text __css={styles.title}>{product.name}</Text>
        <Text __css={styles.price}>{product.price.toFixed(2)}€</Text>
      </Box>
    </MotionBox>
  );
};
