import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Product, Shop } from "../../../../shared/types";
import type { UniverseType } from "../../contexts/UniverseContext";
import { UniverseProvider } from "../../contexts/UniverseContext";
import {
  getShopDisplayName,
  getUniverseIcon,
  shopTypeToUniverse,
} from "../../utils/universeMapping";
import { SharedProductCard } from "../shared/SharedProductCard";

interface AdminProductPreviewProps {
  /** Données du produit en cours d'édition */
  productData: {
    name: string;
    description: string;
    price: string | number;
    category?: string;
  };
  /** Indique si les données ont changé (pour animation) */
  hasChanges?: boolean;
  /** Type de boutique pour déterminer l'univers */
  shopType?: string;
}

const MotionBox = motion.create(Box);

/**
 * Aperçu temps réel d'un produit en cours d'édition
 * Utilise le vrai composant SharedProductCard pour une fidélité parfaite
 */
export default function AdminProductPreview({
  productData,
  hasChanges = false,
  shopType = "brewery",
}: AdminProductPreviewProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Déterminer l'univers basé sur le shopType
  const universe: UniverseType = shopTypeToUniverse(shopType);
  const shopDisplayName = getShopDisplayName(universe);
  const shopIcon = getUniverseIcon(universe);

  // Animation de highlight quand les données changent
  useEffect(() => {
    if (hasChanges) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasChanges, productData]);

  // Convertir le prix en number pour SharedProductCard
  const price =
    typeof productData.price === "string"
      ? parseFloat(productData.price) || 0
      : productData.price;

  const highlightVariants = {
    normal: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      borderColor: "rgba(229, 231, 235, 1)",
    },
    highlighted: {
      scale: 1.02,
      boxShadow: "0 10px 25px -3px rgba(59, 130, 246, 0.3)",
      borderColor: "rgba(59, 130, 246, 0.5)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Créer un objet Product mock pour l'aperçu
  const mockProduct: Product = {
    id: "preview",
    name: productData.name || "Nom du produit",
    description: productData.description || "Description du produit...",
    price: price,
    categoryId: "preview-category",
    shopId: "preview-shop",
    category: productData.category
      ? {
          id: "preview-category",
          name: productData.category,
          shopId: "preview-shop",
        }
      : undefined,
  };

  // Créer un objet Shop mock pour l'aperçu
  const mockShop: Shop = {
    id: "preview-shop",
    name: shopDisplayName,
    shopType: shopType as "brewery" | "teaShop" | "beautyShop" | "herbShop",
    themeColor: "orange",
    categories: [],
  };

  const handleAddToCart = (product: Product) => {
    // Simulation pour l'aperçu - pas d'action réelle
    console.log("Aperçu - Ajout au panier:", product.id);
  };

  return (
    <UniverseProvider defaultUniverse={universe}>
      <VStack spacing={6} align="stretch" p={6}>
        {/* En-tête de l'aperçu avec nom dynamique */}
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            {shopIcon} {shopDisplayName}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Aperçu vitrine - Voici comment votre produit apparaîtra
          </Text>
        </Box>

        {/* Carte produit avec le vrai composant vitrine */}
        <MotionBox
          variants={highlightVariants}
          animate={isHighlighted ? "highlighted" : "normal"}
          borderWidth={2}
          borderColor="gray.200"
          borderRadius="lg"
          p={4}
          bg="white"
          maxW="400px"
          mx="auto"
          w="full"
        >
          <SharedProductCard
            product={mockProduct}
            shop={mockShop}
            onAddToCart={handleAddToCart}
            isAdminMode={false} // Mode vitrine pour l'aperçu
          />
        </MotionBox>

        {/* Indicateur de changements */}
        {hasChanges && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            textAlign="center"
            p={3}
            bg="blue.50"
            borderRadius="md"
            border="1px"
            borderColor="blue.200"
          >
            <Text fontSize="sm" color="blue.700" fontWeight="medium">
              ✨ Aperçu mis à jour en temps réel
            </Text>
          </MotionBox>
        )}

        {/* Simulation d'autres produits pour le contexte */}
        <VStack spacing={3} opacity={0.4}>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Autres produits de la boutique
          </Text>
          {[1, 2].map((i) => (
            <Box
              key={i}
              p={4}
              bg="gray.50"
              borderRadius="md"
              w="full"
              maxW="400px"
              mx="auto"
            >
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Autre produit {i}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Description courte...
              </Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </UniverseProvider>
  );
}
