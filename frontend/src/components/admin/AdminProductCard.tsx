import { EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import type { Product, Shop } from "../../../../shared/types";
import { getUniverseColorScheme } from "../../utils/universeMapping";
import { ProductAttributes } from "../shared/ProductAttributes";
import { AdminStockCarousel } from "./AdminStockCarousel";

interface AdminProductCardProps {
  /** Produit à afficher */
  product: Product;
  /** Boutique actuelle */
  shop: Shop;
  /** Callback d'édition */
  onEdit?: (product: Product) => void;
}

/**
 * Carte produit complète pour l'admin
 * Affiche tous les attributs + carrousel stock
 */
export const AdminProductCard: React.FC<AdminProductCardProps> = ({
  product,
  shop,
  onEdit,
}) => {
  const colorScheme = getUniverseColorScheme(shop.shopType);

  return (
    <Card>
      <CardBody>
        <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={6}>
          {/* Image produit */}
          <GridItem>
            <Image
              src={product.imageUrl}
              alt={product.name}
              height="200px"
              width="100%"
              objectFit="cover"
              borderRadius="md"
            />
          </GridItem>

          {/* Infos produit */}
          <GridItem>
            <Stack spacing={4}>
              {/* En-tête avec nom et actions */}
              <HStack justify="space-between" align="start">
                <Box>
                  <Text fontSize="xl" fontWeight="bold">
                    {product.name}
                  </Text>
                  <HStack spacing={2} mt={1}>
                    <Badge colorScheme={colorScheme}>
                      {product.category?.name}
                    </Badge>
                    <Badge variant="outline">{product.price.toFixed(2)}€</Badge>
                  </HStack>
                </Box>
                {onEdit && (
                  <Tooltip label="Modifier le produit">
                    <IconButton
                      aria-label="Modifier"
                      icon={<EditIcon />}
                      onClick={() => onEdit(product)}
                      size="sm"
                      colorScheme={colorScheme}
                      variant="ghost"
                    />
                  </Tooltip>
                )}
              </HStack>

              {/* Description */}
              <Text color="gray.600">{product.description}</Text>

              {/* Attributs spécialisés selon univers */}
              <ProductAttributes product={product} shopType={shop.shopType} />

              {/* Carrousel stock par boutique */}
              <Box mt={4}>
                <Text fontWeight="medium" mb={2}>
                  Stock par boutique
                </Text>
                <AdminStockCarousel
                  productId={product.id}
                  currentShopId={shop.id}
                />
              </Box>
            </Stack>
          </GridItem>
        </Grid>
      </CardBody>
    </Card>
  );
};
