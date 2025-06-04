import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product, Shop, ShopType } from "../../../../shared/types";
import { SharedProductDetailView } from "../../components/shared/SharedProductDetailView";
import {
  StoreHeader,
  StoreLayout,
  StorePageContent,
  StoreShopInfoBadge,
} from "../../components/store";
import { useShopData, useStoreHandlers } from "../../hooks";

export default function StoreProductDetail() {
  const { shopType, productId } = useParams<{
    shopType: string;
    productId: string;
  }>();
  const navigate = useNavigate();
  const { products, loading, getShopByType, shops, refreshData } =
    useShopData();

  const [product, setProduct] = useState<Product | null>(null);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const { handleAddToCart } = useStoreHandlers(currentShop || undefined);

  // Récupérer le produit et la boutique
  useEffect(() => {
    if (!loading && shopType && productId) {
      // Récupérer la boutique par type
      const shop = getShopByType(shopType as ShopType);
      if (!shop) {
        navigate("/404");
        return;
      }

      // Récupérer le produit par ID dans cette boutique
      const foundProduct = products.find(
        (p) => p.id === productId && p.shopId === shop.id
      );
      if (!foundProduct) {
        navigate("/404");
        return;
      }

      setCurrentShop(shop);
      setProduct(foundProduct);
    }
  }, [loading, shopType, productId, products, getShopByType, navigate]);

  // Fonction pour retourner d'où l'utilisateur vient
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handler pour changement de boutique avec navigation
  const handleShopChange = async (newShop: Shop) => {
    // Naviguer vers le même produit dans la nouvelle boutique
    navigate(`/store/${newShop.shopType}/product/${productId}`);
    await refreshData();
  };

  if (loading || !currentShop || !product) {
    return <div>Chargement...</div>;
  }

  return (
    <StoreLayout shop={currentShop}>
      {/* VARIANT NAV-ONLY - Navigation boutique seule avec sélecteur intégré */}
      <StoreHeader
        shop={currentShop}
        availableShops={shops}
        onShopChange={handleShopChange}
        variant="nav-only"
      />

      <StorePageContent spacing={8}>
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
      </StorePageContent>
    </StoreLayout>
  );
}
