import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product, Shop, ShopType } from "../../../../shared/types";
import { SharedProductDetailView } from "../../components/shared/SharedProductDetailView";
import StoreHeader from "../../components/store/StoreHeader";
import StoreLayout from "../../components/store/StoreLayout";
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
    return <Box>Chargement...</Box>;
  }

  return (
    <StoreLayout shop={currentShop}>
      {/* VARIANT NAV-ONLY - Navigation boutique seule */}
      <StoreHeader
        shop={currentShop}
        availableShops={shops}
        onShopChange={handleShopChange}
        variant="nav-only"
      />

      <VStack spacing={8} py={8} align="stretch">
        {/* Breadcrumb et retour */}
        <Box maxW="1400px" mx="auto" w="full">
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

        {/* Vue détaillée du produit */}
        <Box maxW="1400px" mx="auto" w="full">
          <SharedProductDetailView
            product={product}
            shop={currentShop}
            onAddToCart={handleAddToCart}
            onGoBack={handleGoBack}
          />
        </Box>
      </VStack>
    </StoreLayout>
  );
}
