import { StorePageWrapper } from "@/components/features/store/content/StorePageWrapper";
import type { Product } from "@/types";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SharedProductDetailView } from "../../components/business/product/SharedProductDetailView";
import { useStoreHandlers, useStorePage } from "../../hooks";
import { getUniverseTokens } from "../../theme/universeTokens";

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

  const tokens = getUniverseTokens(currentShop.shopType);

  return (
    <StorePageWrapper headerVariant="nav-only">
      <Box py={tokens.spacing.section}>
        {/* Bouton retour seulement */}
        <Box w="full" mb={tokens.spacing.component}>
          <Button onClick={handleGoBack} variant="ghost" size="sm">
            ← Retour
          </Button>
        </Box>

        {/* Layout principal : contenu + sidebar */}
        <Flex
          gap={tokens.spacing.section}
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
        </Flex>
      </Box>
    </StorePageWrapper>
  );
}
