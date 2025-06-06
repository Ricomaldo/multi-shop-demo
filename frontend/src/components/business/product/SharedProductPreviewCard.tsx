import {
  useUniverseButton,
  useUniverseColors,
  useUniverseMicroInteractions,
} from "@/hooks";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { Product, Shop } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { getProductImageUrl } from "@/utils/imageUtils";
import { EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  useBreakpointValue,
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
  isAdminMode?: boolean;
  showActions?: boolean;
  /** Prix override pour réactivité temps réel */
  priceOverride?: number;
}

/**
 * Carte produit universelle avec thématisation automatique
 * 🆕 INTÈGRE LES MICRO-INTERACTIONS ÉMOTIONNELLES PAR UNIVERS
 * ✅ RESPONSIVE DESIGN AMÉLIORÉ
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
  onEdit,
  isAdminMode = false,
  showActions = false,
  priceOverride,
}) => {
  // 🎯 TOKENS DIRECTS - Plus de mapping !
  const tokens = getUniverseTokens(shop.shopType);
  const colors = useUniverseColors(shop.shopType);

  // 🆕 RESPONSIVE VALUES
  const imageHeight = useBreakpointValue({
    base: "160px",
    sm: "180px",
    md: "200px",
    lg: "220px",
  });

  const cardPadding = useBreakpointValue({
    base: 3,
    sm: 4,
    md: 4,
  });

  const buttonSize = useBreakpointValue({
    base: "sm",
    sm: "md",
    md: "md",
  });

  const fontSize = useBreakpointValue({
    base: "sm",
    sm: "md",
    md: "md",
  });

  // 🆕 MICRO-INTERACTIONS ÉMOTIONNELLES
  const { getCardHoverProps, getEmotionalContext, emotions } =
    useUniverseMicroInteractions(shop.shopType);

  // 🔘 BOUTONS ÉMOTIONNELS
  const { getPrimaryProps } = useUniverseButton(shop.shopType);

  const signature = useUniverseSignature(shop.shopType);

  // Prix réactif : utilise override ou prix du produit
  const displayPrice = formatPrice(
    priceOverride !== undefined ? priceOverride : product.price || 0
  );

  // Statut stock simple
  const getStockBadgeColor = () => {
    if (product.stockStatus === "in_stock") return "green";
    if (product.stockStatus === "low_stock") return "orange";
    return "red";
  };

  // 🎨 STYLES DIRECTEMENT ISSUS DES TOKENS/COLORS + MICRO-INTERACTIONS + RESPONSIVE
  const cardStyles = {
    // Background selon univers
    bg: tokens.colors[50],
    borderWidth: "2px",
    borderColor: tokens.colors[200],
    // BorderRadius selon tokens
    borderRadius: tokens.borderRadius.base,
    // Typography selon tokens
    fontFamily: tokens.typography.fontFamily.body,
    // Padding responsive
    p: cardPadding,
    // Responsive width management
    w: "100%",
    minW: { base: "280px", sm: "300px", md: "320px" },
    maxW: { base: "100%", sm: "400px" },
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
      cursor={isAdminMode ? "default" : "pointer"}
      onClick={() => !isAdminMode && onView?.(product)}
      height="100%"
      display="flex"
      flexDirection="column"
      {...signature.getSignatureProps()}
    >
      {/* Image avec interactions spécifiques */}
      <Box position="relative" mb={3}>
        <Image
          src={getProductImageUrl(product.imageUrl)}
          alt={product.name}
          w="100%"
          h={imageHeight}
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
            fontSize={{ base: "xs", sm: "xs" }}
            fontWeight={tokens.typography.fontWeight.bold}
            px={{ base: 1, sm: 2 }}
            py={1}
          >
            {product.stockStatus === "in_stock"
              ? "En stock"
              : product.stockStatus === "low_stock"
              ? "Stock limité"
              : "Rupture"}
          </Badge>
        )}

        {/* Bouton de modification en mode admin */}
        {isAdminMode && showActions && onEdit && (
          <IconButton
            aria-label="Modifier le produit"
            icon={<EditIcon />}
            position="absolute"
            top={2}
            left={2}
            size="sm"
            colorScheme={tokens.meta.colorScheme}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
          />
        )}
      </Box>

      {/* Contenu produit avec responsive typography */}
      <VStack align="start" spacing={{ base: 2, sm: 3 }} flex={1}>
        <Text
          fontSize={{ base: "md", sm: "lg" }}
          fontWeight={tokens.typography.fontWeight.bold}
          color={colors.text.primary}
          lineHeight="1.2"
          noOfLines={2}
        >
          {product.name}
        </Text>

        {product.description && (
          <Text
            fontSize={{ base: "xs", sm: "sm" }}
            color={colors.text.subtle}
            lineHeight="1.4"
            noOfLines={{ base: 2, sm: 3 }}
          >
            {product.description}
          </Text>
        )}

        {/* Catégorie avec badge responsive */}
        {product.category && (
          <Badge
            colorScheme={tokens.meta.colorScheme}
            fontSize={{ base: "xs", sm: "xs" }}
            px={{ base: 1, sm: 2 }}
            py={1}
            borderRadius={tokens.borderRadius.base}
          >
            {product.category.name}
          </Badge>
        )}

        {/* Prix et actions avec layout responsive */}
        <Box w="100%" mt="auto">
          <HStack
            justify="space-between"
            align="center"
            w="100%"
            flexWrap="wrap"
            gap={2}
          >
            <Text
              fontSize={{ base: "lg", sm: "xl" }}
              fontWeight={tokens.typography.fontWeight.heavy}
              color={colors.primary}
              fontFamily={tokens.typography.fontFamily.heading}
            >
              {displayPrice}
            </Text>

            {!isAdminMode && onAddToCart && (
              <Button
                {...getPrimaryProps()}
                size={buttonSize}
                fontSize={fontSize}
                px={{ base: 3, sm: 4 }}
                py={{ base: 2, sm: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                isDisabled={product.stockStatus === "out_of_stock"}
                minW={{ base: "auto", sm: "120px" }}
                flexShrink={0}
              >
                Ajouter
              </Button>
            )}
          </HStack>
        </Box>
      </VStack>
    </MotionBox>
  );
};
