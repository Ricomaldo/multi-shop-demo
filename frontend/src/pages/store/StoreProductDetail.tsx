import StoreShopInfoBadge from "@/components/business/shop/StoreShopInfoBadge";
import { StorePageWrapper } from "@/components/features/store/content/StorePageWrapper";
import type { Product } from "@/types";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SharedProductDetailView } from "../../components/business/product/SharedProductDetailView";
import { useStoreHandlers, useStorePage } from "../../hooks";

export default function StoreProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { currentShop, shopProducts } = useStorePage();
  const { handleAddToCart } = useStoreHandlers(currentShop || undefined);
  const [product, setProduct] = useState<Product | null>(null);

  // Récupérer le produit par ID dans cette boutique
  useEffect(() => {
    if (currentShop && productId) {
      const foundProduct = shopProducts.find((p) => p.id === productId);
      if (!foundProduct) {
        navigate("/404");
        return;
      }
      setProduct(foundProduct);
    }
  }, [currentShop, productId, shopProducts, navigate]);

  // Fonction pour retourner d'où l'utilisateur vient
  const handleGoBack = () => {
    navigate(-1);
  };

  if (!currentShop || !product) {
    return null;
  }

  return (
    <StorePageWrapper headerVariant="nav-only">
      {/* Breadcrumb et retour */}
      <Box w="full">
        <HStack spacing={4} mb={6}>
          <Button onClick={handleGoBack} variant="ghost" size="sm">
            ← Retour
          </Button>
          <Text color="gray.500" fontSize="sm">
            {currentShop.name} / {product.category?.name || "Produits"} /{" "}
            {product.name}
          </Text>
        </HStack>
      </Box>

      {/* Layout principal : contenu + sidebar */}
      <Flex
        gap={8}
        direction={{ base: "column", lg: "row" }}
        align="flex-start"
        w="full"
      >
        {/* Contenu principal */}
        <Box flex="1" minW="0">
          <SharedProductDetailView
            product={product}
            shop={currentShop}
            onAddToCart={handleAddToCart}
          />
        </Box>

        {/* Sidebar avec informations boutique */}
        <Box
          w={{ base: "full", lg: "350px" }}
          flexShrink={0}
          order={{ base: -1, lg: 1 }}
        >
          <StoreShopInfoBadge shop={currentShop} variant="full" />
        </Box>
      </Flex>
    </StorePageWrapper>
  );
}
