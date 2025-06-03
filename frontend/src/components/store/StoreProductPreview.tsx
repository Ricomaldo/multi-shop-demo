import { Box, Image, Text, useMultiStyleConfig } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import type { Product, Shop } from "../../../../shared/types";
import { storeAnimations } from "../../theme/components/shared";

interface StoreProductPreviewProps {
  /** Produit à afficher en aperçu */
  product: Product;
  /** Boutique pour la thématisation */
  shop: Shop;
  /** Callback pour ouvrir la modal détaillée */
  onViewDetails: (product: Product) => void;
}

const MotionBox = motion.create(Box);

// Mapping des types de boutique vers les clés d'animation
const shopTypeToAnimationKey = {
  brewery: "brewery",
  teaShop: "tea",
  beautyShop: "beauty",
  herbShop: "herb",
} as const;

/**
 * Aperçu compact d'un produit pour la vitrine
 * Affiche uniquement image + nom + prix avec animation au hover
 */
export const StoreProductPreview: React.FC<StoreProductPreviewProps> = ({
  product,
  shop,
  onViewDetails,
}) => {
  const styles = useMultiStyleConfig("StoreProductPreview", {
    variant: shop.shopType,
  });

  // Animation selon le type de boutique
  const animationKey = shopTypeToAnimationKey[shop.shopType] || "brewery";
  const animation = storeAnimations[animationKey];

  return (
    <MotionBox
      role="group"
      as="article"
      cursor="pointer"
      onClick={() => onViewDetails(product)}
      __css={styles.card}
      {...animation}
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        height="250px"
        width="100%"
        objectFit="cover"
        borderRadius="lg"
      />

      <Box __css={styles.content}>
        <Text __css={styles.title}>{product.name}</Text>
        <Text __css={styles.price}>{product.price.toFixed(2)}€</Text>
      </Box>
    </MotionBox>
  );
};
