import {
  useUniverseButton,
  useUniverseColors,
  useUniverseMicroInteractions,
} from "@/hooks";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { Product, Shop } from "@/types";
import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useUniverseSignature } from "../../../hooks";

const MotionBox = motion.create(Box);

export interface SharedProductPreviewCardProps {
  product: Product;
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  imageHeight?: string;
  isHighlighted?: boolean;
  isAdminMode?: boolean;
  showActions?: boolean;
  /** Prix override pour réactivité temps réel */
  priceOverride?: number;
}

/**
 * Carte produit universelle avec thématisation automatique
 * 🆕 INTÈGRE LES MICRO-INTERACTIONS ÉMOTIONNELLES PAR UNIVERS
 *
 * Réactions différenciées :
 * - Brewery: Clics solides, pas de mouvement
 * - TeaShop: Lévitation zen, transitions fluides
 * - Beauty: Effets sophistiqués, micro-expansions
 * - Herb: Scale naturel, simplicité organique
 */
export const SharedProductPreviewCard: React.FC<
  SharedProductPreviewCardProps
> = ({
  product,
  shop,
  onAddToCart,
  onView,
  isHighlighted = false,
  priceOverride,
}) => {
  // 🎯 TOKENS DIRECTS - Plus de mapping !
  const tokens = getUniverseTokens(shop.shopType);
  const colors = useUniverseColors(shop.shopType);

  // 🆕 MICRO-INTERACTIONS ÉMOTIONNELLES
  const { getCardHoverProps, getEmotionalContext, emotions } =
    useUniverseMicroInteractions(shop.shopType);

  // 🔘 BOUTONS ÉMOTIONNELS
  const { getPrimaryProps } = useUniverseButton(shop.shopType);

  const signature = useUniverseSignature(shop.shopType);

  // Prix réactif : utilise override ou prix du produit
  const displayPrice =
    priceOverride !== undefined
      ? priceOverride
      : product.price?.toFixed(2) || "0.00";

  // Statut stock simple
  const getStockBadgeColor = () => {
    if (product.stockStatus === "in_stock") return "green";
    if (product.stockStatus === "low_stock") return "orange";
    return "red";
  };

  // 🎨 STYLES DIRECTEMENT ISSUS DES TOKENS/COLORS + MICRO-INTERACTIONS
  const cardStyles = {
    // Background selon univers
    bg: tokens.colors[50],
    borderWidth: "2px",
    borderColor: tokens.colors[200],
    // BorderRadius selon tokens univers
    borderRadius: tokens.borderRadius.base,
    // Typography selon tokens
    fontFamily: tokens.typography.fontFamily.body,
    // Padding selon tokens
    p: 4,
    // 🆕 MICRO-INTERACTIONS ÉMOTIONNELLES AUTOMATIQUES
    ...getCardHoverProps(),
    // 🆕 CONTEXTE ÉMOTIONNEL (data attributes pour debug)
    ...getEmotionalContext(),
    // Animations selon l'univers et la personnalité
    transition: `all ${
      emotions.rhythm === "slow"
        ? "0.6s"
        : emotions.rhythm === "precise"
        ? "0.3s"
        : "0.25s"
    } ease`,
  };

  // Animations d'entrée selon la personnalité émotionnelle
  const getEntryAnimation = () => {
    switch (emotions.personality) {
      case "authentic": // Brewery - Direct et franc
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { type: "spring", stiffness: 300, damping: 25 },
        };
      case "serene": // TeaShop - Doux et fluide
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: "easeOut" },
        };
      case "sophisticated": // Beauty - Précis et raffiné
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.4, ease: "easeInOut" },
        };
      case "sincere": // Herb - Simple et naturel
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3, ease: "linear" },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 },
        };
    }
  };

  return (
    <MotionBox
      {...cardStyles}
      {...getEntryAnimation()}
      cursor="pointer"
      onClick={() => onView?.(product)}
      height="100%"
      display="flex"
      flexDirection="column"
      {...signature.getSignatureProps()}
    >
      {/* Image avec interactions spécifiques */}
      <Box position="relative" mb={3}>
        <Image
          src={product.imageUrl || "/images/products/placeholder.jpg"}
          alt={product.name}
          w="100%"
          h="200px"
          objectFit="cover"
          borderRadius={tokens.borderRadius.md}
          loading="lazy"
          // Effet image selon l'émotion
          filter={emotions.texture === "refined" ? "brightness(1.05)" : "none"}
          transition={`all ${
            emotions.rhythm === "slow" ? "0.6s" : "0.3s"
          } ease`}
        />

        {/* Badge stock avec couleurs émotionnelles */}
        {product.stockStatus && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme={getStockBadgeColor()}
            borderRadius={tokens.borderRadius.base}
            fontSize="xs"
            fontWeight={tokens.typography.fontWeight.bold}
          >
            {product.stockStatus === "in_stock"
              ? "En stock"
              : product.stockStatus === "low_stock"
              ? "Stock limité"
              : "Rupture"}
          </Badge>
        )}
      </Box>

      {/* Contenu avec typography émotionnelle */}
      <VStack align="stretch" spacing={3} flex={1}>
        <Text
          fontSize={isHighlighted ? "lg" : "md"}
          fontWeight={tokens.typography.fontWeight.bold}
          color={tokens.colors[800]}
          fontFamily={tokens.typography.fontFamily.heading}
          noOfLines={2}
          lineHeight={emotions.rhythm === "slow" ? "relaxed" : "normal"}
        >
          {product.name}
        </Text>

        {product.description && (
          <Text
            fontSize="sm"
            color={tokens.colors[600]}
            fontFamily={tokens.typography.fontFamily.body}
            noOfLines={2}
          >
            {product.description}
          </Text>
        )}

        <HStack justify="space-between" align="center">
          <Text
            fontSize={isHighlighted ? "xl" : "lg"}
            fontWeight={tokens.typography.fontWeight.heavy}
            color={tokens.colors[700]}
            fontFamily={tokens.typography.fontFamily.heading}
          >
            {displayPrice}€
          </Text>
        </HStack>

        {/* 🔘 BOUTON ÉMOTIONNEL AUTOMATIQUE */}
        {onAddToCart && (
          <Button
            {...getPrimaryProps()}
            size="sm"
            w="full"
            mt="auto"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={product.stockStatus === "out_of_stock"}
          >
            {product.stockStatus === "out_of_stock"
              ? "Rupture"
              : "Ajouter au panier"}
          </Button>
        )}
      </VStack>

      {/* 🆕 ÉLÉMENT SIGNATURE VISUEL DISCRET */}
      <Box
        position="absolute"
        top={2}
        left={2}
        fontSize="xs"
        opacity={0.6}
        color={colors.text.subtle}
      >
        {signature.signature.visualElement}
      </Box>
    </MotionBox>
  );
};
