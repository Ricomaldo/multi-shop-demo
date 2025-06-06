import ProductAttributes from "@/components/ui/ProductAttributes";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { Product, Shop } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
import { getProductImageUrl } from "@/utils/imageUtils";
import { hasLowStock, isOutOfStock } from "@/utils/productAttributes";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";

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

  // Modal pour lightbox
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              {/* Image produit avec lightbox */}
              <Box
                height={imageHeight}
                borderRadius={tokens.borderRadius.lg}
                position="relative"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
                bg={tokens.colors[50]}
                cursor={product.imageUrl ? "zoom-in" : "default"}
                onClick={product.imageUrl ? onOpen : undefined}
                transition="transform 0.2s ease"
                _hover={product.imageUrl ? { transform: "scale(1.02)" } : {}}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {product.imageUrl ? (
                  <>
                    <img
                      src={getProductImageUrl(product.imageUrl)}
                      alt={product.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        userSelect: "none",
                      }}
                    />

                    {/* Indicateur de zoom */}
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      bg="blackAlpha.600"
                      color="white"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                      opacity={0.8}
                    >
                      🔍 Cliquer pour agrandir
                    </Box>
                  </>
                ) : (
                  <Text fontSize="8xl" opacity={0.3}>
                    {tokens.meta.icon}
                  </Text>
                )}
              </Box>

              {/* Lightbox Modal */}
              <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
                <ModalOverlay bg="blackAlpha.800" />
                <ModalContent
                  bg="transparent"
                  boxShadow="none"
                  maxW="90vw"
                  maxH="90vh"
                >
                  <ModalCloseButton
                    color="white"
                    bg="blackAlpha.600"
                    _hover={{ bg: "blackAlpha.800" }}
                    size="lg"
                    top={4}
                    right={4}
                    zIndex={10}
                  />
                  <ModalBody
                    p={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {product.imageUrl && (
                      <img
                        src={getProductImageUrl(product.imageUrl)}
                        alt={product.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          borderRadius: tokens.borderRadius.lg,
                        }}
                      />
                    )}
                  </ModalBody>
                </ModalContent>
              </Modal>

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
                  {formatPrice(product.price)}
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
              <ProductAttributes
                product={product}
                shop={shop}
                variant="detail"
              />
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};
