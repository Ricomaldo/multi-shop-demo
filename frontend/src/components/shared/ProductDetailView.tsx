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

interface ProductDetailViewProps {
  product: Product;
  shop: Shop;
  onAddToCart?: (product: Product) => void;
  onGoBack?: () => void;
}

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

  // Couleur thématique selon le type de boutique
  const getThemeColor = () => {
    switch (shop.shopType) {
      case "brewery":
        return "orange";
      case "tea-shop":
        return "green";
      case "beauty-shop":
        return "pink";
      case "herb-shop":
        return "green";
      default:
        return "blue";
    }
  };

  // Icône selon le type de boutique
  const getShopTypeIcon = () => {
    switch (shop.shopType) {
      case "brewery":
        return "🍺";
      case "tea-shop":
        return "🍵";
      case "beauty-shop":
        return "💄";
      case "herb-shop":
        return "🌿";
      default:
        return "🏪";
    }
  };

  const getShopTypeName = () => {
    switch (shop.shopType) {
      case "brewery":
        return "Brasserie";
      case "tea-shop":
        return "Salon de thé";
      case "beauty-shop":
        return "Institut beauté";
      case "herb-shop":
        return "Herboristerie";
      default:
        return "Boutique";
    }
  };

  const themeColor = getThemeColor();

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
                {getShopTypeName()} {shop.name}
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
                  {getShopTypeIcon()}
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
                  <Text fontSize="lg">{getShopTypeIcon()}</Text>
                  <Text fontSize="sm" color={textColor} fontWeight="medium">
                    {getShopTypeName()} • {shop.name}
                  </Text>
                </HStack>

                <Heading size="xl" color={`${themeColor}.600`} mb={3}>
                  {product.name}
                </Heading>

                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color={`${themeColor}.500`}
                  mb={4}
                >
                  {product.price.toFixed(2)} €
                </Text>

                {product.description && (
                  <Text color={textColor} fontSize="lg" lineHeight="tall">
                    {product.description}
                  </Text>
                )}
              </Box>

              <Divider />

              {/* Attributs métier par catégorie */}
              <VStack spacing={4} align="stretch">
                <Heading size="md" color={`${themeColor}.600`}>
                  Caractéristiques détaillées
                </Heading>

                {Object.entries(attributesByCategory).map(
                  ([category, attributes]) => (
                    <Card
                      key={category}
                      bg={cardBg}
                      borderColor={borderColor}
                      borderWidth="1px"
                    >
                      <CardHeader pb={2}>
                        <Heading size="sm" color={`${themeColor}.500`}>
                          {category}
                        </Heading>
                      </CardHeader>
                      <CardBody pt={0}>
                        <SimpleGrid columns={1} spacing={3}>
                          {attributes.map((attr, index) => (
                            <HStack
                              key={index}
                              justify="space-between"
                              align="start"
                            >
                              <Text
                                fontSize="sm"
                                color={textColor}
                                fontWeight="medium"
                                flex={1}
                              >
                                {attr.label}
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                textAlign="right"
                                flex={1}
                              >
                                {attr.value}
                              </Text>
                            </HStack>
                          ))}
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  )
                )}
              </VStack>

              {/* Informations complémentaires */}
              <Card
                bg={`${themeColor}.50`}
                borderColor={`${themeColor}.200`}
                borderWidth="1px"
              >
                <CardBody>
                  <VStack spacing={2} align="start">
                    <Heading size="sm" color={`${themeColor}.700`}>
                      Informations produit
                    </Heading>
                    <Text fontSize="sm" color={`${themeColor}.600`}>
                      Référence : {product.id.slice(-8).toUpperCase()}
                    </Text>
                    <Text fontSize="sm" color={`${themeColor}.600`}>
                      Boutique : {shop.name}
                    </Text>
                    <Text fontSize="sm" color={`${themeColor}.600`}>
                      Univers : {getShopTypeName()}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};
