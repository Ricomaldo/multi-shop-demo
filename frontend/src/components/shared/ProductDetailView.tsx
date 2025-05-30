import { ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import type { Product, Shop } from "../../../../shared/types";
import {
  getAllFormattedAttributes,
  getStockBadgeColor,
  getStockBadgeText,
  hasLowStock,
  isOutOfStock,
} from "../../utils/productAttributes";
import {
  getUniverseColorScheme,
  getUniverseIcon,
  getUniverseName,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

interface ProductDetailViewProps {
  product: Product;
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  onGoBack?: () => void;
}

/**
 * Vue détaillée d'un produit pour la vitrine
 * Affiche toutes les informations et attributs métier du produit
 * Utilise la thématisation automatique selon l'univers de la boutique
 *
 * @param product - Produit à afficher
 * @param shop - Boutique pour la thématisation
 * @param onAddToCart - Callback pour ajouter au panier
 * @param onGoBack - Callback pour retour à la liste
 */
export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  shop,
  onAddToCart,
  onGoBack,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const allAttributes = getAllFormattedAttributes(product, shop);
  const stockBadgeColor = getStockBadgeColor(product);
  const stockBadgeText = getStockBadgeText(product);
  const outOfStock = isOutOfStock(product);
  const lowStock = hasLowStock(product);

  // Utilisation du helper centralisé pour l'univers
  const universe = shopTypeToUniverse(shop.shopType);
  const themeColor = getUniverseColorScheme(universe);
  const shopIcon = getUniverseIcon(universe);
  const shopTypeName = getUniverseName(universe);

  // Grouper les attributs par catégorie
  const attributesByCategory = allAttributes.reduce((acc, attr) => {
    if (!acc[attr.category]) {
      acc[attr.category] = [];
    }
    acc[attr.category].push(attr);
    return acc;
  }, {} as Record<string, typeof allAttributes>);

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Navigation */}
        <HStack justify="space-between" align="center">
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onGoBack} cursor="pointer">
                {shopTypeName} {shop.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {onGoBack && (
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={onGoBack}
            >
              Retour
            </Button>
          )}
        </HStack>

        {/* Contenu principal */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
          {/* Colonne gauche - Image et infos principales */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Image produit */}
              <Box
                height="400px"
                bg={`${themeColor}.50`}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                border="1px solid"
                borderColor={borderColor}
              >
                <Text fontSize="8xl" opacity={0.3}>
                  {shopIcon}
                </Text>

                {/* Badge stock en overlay */}
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme={stockBadgeColor}
                  variant="solid"
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  {stockBadgeText}
                </Badge>
              </Box>

              {/* Alertes stock */}
              {(outOfStock || lowStock) && (
                <Alert status={outOfStock ? "error" : "warning"}>
                  <AlertIcon />
                  {outOfStock
                    ? "Ce produit est actuellement en rupture de stock."
                    : "Attention : stock faible pour ce produit."}
                </Alert>
              )}

              {/* Actions */}
              <VStack spacing={3}>
                {onAddToCart && (
                  <Button
                    colorScheme={themeColor}
                    size="lg"
                    width="full"
                    isDisabled={outOfStock}
                    onClick={() => onAddToCart(product)}
                  >
                    {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
                  </Button>
                )}
              </VStack>
            </VStack>
          </GridItem>

          {/* Colonne droite - Détails produit */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* En-tête produit */}
              <Box>
                <HStack mb={2}>
                  <Text fontSize="lg">{shopIcon}</Text>
                  <Text fontSize="sm" color={textColor} fontWeight="medium">
                    {shopTypeName} • {shop.name}
                  </Text>
                </HStack>

                <Heading size="xl" color={`${themeColor}.600`} mb={3}>
                  {product.name}
                </Heading>

                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color={`${themeColor}.500`