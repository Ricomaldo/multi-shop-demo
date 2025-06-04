import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
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
import { getUniverseTokens } from "../../theme/universeTokens";
import {
  getAllFormattedAttributes,
  getStockBadgeColor,
  getStockBadgeText,
  hasLowStock,
  isOutOfStock,
} from "../../utils/productAttributes";

interface SharedProductDetailViewProps {
  product: Product;
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  responsive?: boolean;
}

/**
 * Vue détaillée d'un produit pour page dédiée
 * Composant page complète sans wrapper Modal
 * Utilise la thématisation automatique selon l'univers de la boutique
 */
export const SharedProductDetailView: React.FC<
  SharedProductDetailViewProps
> = ({ product, shop, onAddToCart, responsive = true }) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");

  // 🎯 TOKENS DIRECTS - Plus de mapping !
  const tokens = getUniverseTokens(shop.shopType);

  const allAttributes = getAllFormattedAttributes(product, shop);
  const stockBadgeColor = getStockBadgeColor(product);
  const stockBadgeText = getStockBadgeText(product);
  const outOfStock = isOutOfStock(product);
  const lowStock = hasLowStock(product);

  // Configuration du grid selon responsive
  const gridTemplateColumns = responsive
    ? { base: "1fr", lg: "1fr 1fr" }
    : "1fr 1fr";

  const gridGap = 8;
  const vStackSpacing = 6;
  const imageHeight = "400px";

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={vStackSpacing} align="stretch">
        {/* Navigation breadcrumb */}
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href={`/store/${shop.shopType}`}>
              {tokens.meta.displayName} {shop.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Contenu principal */}
        <Grid templateColumns={gridTemplateColumns} gap={gridGap}>
          {/* Colonne gauche - Image et infos principales */}
          <GridItem>
            <VStack spacing={vStackSpacing} align="stretch">
              {/* Image produit */}
              <Box
                height={imageHeight}
                bg={tokens.colors[50]}
                borderRadius={tokens.borderRadius.lg}
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
              >
                {product.imageUrl ? (
                  <Box
                    as="img"
                    src={product.imageUrl}
                    alt={product.name}
                    maxH="360px"
                    maxW="100%"
                    objectFit="contain"
                    m="auto"
                    borderRadius={tokens.borderRadius.md}
                    boxShadow="md"
                    bg="white"
                  />
                ) : (
                  <Text fontSize="8xl" opacity={0.3}>
                    {tokens.meta.icon}
                  </Text>
                )}

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
                  borderRadius={tokens.borderRadius.base}
                >
                  {stockBadgeText}
                </Badge>
              </Box>

              {/* Alertes stock */}
              {(outOfStock || lowStock) && (
                <Alert
                  status={outOfStock ? "error" : "warning"}
                  size="md"
                  borderRadius={tokens.borderRadius.base}
                >
                  <AlertIcon />
                  <Text fontSize="md">
                    {outOfStock
                      ? "Ce produit est actuellement en rupture de stock."
                      : "Attention : stock faible pour ce produit."}
                  </Text>
                </Alert>
              )}

              {/* Actions */}
              <VStack spacing={3}>
                {onAddToCart && (
                  <Button
                    colorScheme={tokens.meta.colorScheme}
                    size="lg"
                    width="full"
                    isDisabled={outOfStock}
                    onClick={() => onAddToCart(product)}
                    borderRadius={tokens.borderRadius.base}
                    fontFamily={tokens.typography.fontFamily.body}
                    fontWeight={tokens.typography.fontWeight.bold}
                  >
                    {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
                  </Button>
                )}
              </VStack>
            </VStack>
          </GridItem>

          {/* Colonne droite - Détails produit */}
          <GridItem>
            <VStack spacing={vStackSpacing} align="stretch">
              {/* En-tête produit */}
              <Box>
                <HStack mb={2}>
                  <Text fontSize="lg">{tokens.meta.icon}</Text>
                  <Text
                    fontSize="sm"
                    color={textColor}
                    fontWeight="medium"
                    fontFamily={tokens.typography.fontFamily.body}
                  >
                    {tokens.meta.displayName} • {shop.name}
                  </Text>
                </HStack>

                <Heading
                  size="xl"
                  color={tokens.colors[600]}
                  mb={3}
                  fontFamily={tokens.typography.fontFamily.heading}
                  fontWeight={tokens.typography.fontWeight.bold}
                >
                  {product.name}
                </Heading>

                <Text
                  fontSize="3xl"
                  fontWeight={tokens.typography.fontWeight.heavy}
                  color={tokens.colors[500]}
                  fontFamily={tokens.typography.fontFamily.heading}
                >
                  {product.price}€
                </Text>
              </Box>

              {/* Description complète */}
              {product.description && (
                <Text
                  fontSize="md"
                  color={textColor}
                  lineHeight="tall"
                  fontFamily={tokens.typography.fontFamily.body}
                >
                  {product.description}
                </Text>
              )}

              {/* Détails produit */}
              <SimpleGrid columns={2} spacing={4}>
                {allAttributes.map((attr, idx) => (
                  <Box key={attr.label + String(attr.value) + idx}>
                    <Text
                      fontSize="sm"
                      color={textColor}
                      fontWeight="medium"
                      fontFamily={tokens.typography.fontFamily.body}
                    >
                      {attr.label}
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight={tokens.typography.fontWeight.bold}
                      color={tokens.colors[700]}
                      fontFamily={tokens.typography.fontFamily.body}
                    >
                      {attr.value}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};
