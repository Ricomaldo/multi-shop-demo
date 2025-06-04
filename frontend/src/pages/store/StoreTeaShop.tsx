import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product, Shop } from "../../../../shared/types";
import { SharedProductPreviewCard } from "../../components/shared/SharedProductPreviewCard";
import StoreHeader from "../../components/store/StoreHeader";
import StoreLayout from "../../components/store/StoreLayout";
import { useShopByType, useShopData, useStoreHandlers } from "../../hooks";

const StoreTeaShop = () => {
  const navigate = useNavigate();
  const { shop: initialShop, loading: shopLoading } = useShopByType("teaShop");
  const { shops, products: allProducts, refreshData } = useShopData();

  // État local pour la boutique courante (permet le changement)
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const { handleAddToCart, handleViewProduct } = useStoreHandlers(
    currentShop || undefined
  );

  // Initialiser la boutique courante
  useEffect(() => {
    if (!shopLoading && initialShop) {
      setCurrentShop(initialShop);
    } else if (!shopLoading && !initialShop) {
      navigate("/404");
    }
  }, [shopLoading, initialShop, navigate]);

  // Filtrer les produits de la boutique courante
  const products = currentShop
    ? allProducts.filter((p) => p.shopId === currentShop.id)
    : [];

  // Grouper les produits par catégorie
  const productsByCategory = useMemo(() => {
    if (!currentShop) return {};
    const grouped: Record<string, Product[]> = {};
    products.forEach((product) => {
      const category = product.category?.name || "Autres";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [products, currentShop]);

  // Si chargement ou pas de boutique, afficher un loader
  if (shopLoading || !currentShop) {
    return <Box>Chargement...</Box>;
  }

  // Handler pour changement de boutique avec navigation
  const handleShopChange = async (newShop: Shop) => {
    setCurrentShop(newShop);
    // Refresh des données pour la nouvelle boutique
    await refreshData();
  };

  return (
    <StoreLayout shop={currentShop}>
      {/* VARIANT HERO - Image tea-hero.jpg en background */}
      <StoreHeader
        shop={currentShop}
        title={currentShop.name}
        subtitle="Découvrez notre sélection de thés d'exception - Voyage gustatif à travers les jardins du monde"
        availableShops={shops}
        onShopChange={handleShopChange}
        variant="hero"
        imagePath="/images/store/tea-hero.jpg"
        height="75vh"
      />

      <VStack spacing={8} py={8}>
        <Text
          fontSize="lg"
          color="green.700"
          textAlign="center"
          fontStyle="italic"
          maxW="2xl"
          mx="auto"
        >
          Explorez nos collections de thés par catégorie - Chaque tasse raconte
          une histoire
        </Text>

        <Accordion
          allowMultiple
          w="full"
          defaultIndex={[0]}
          maxW="1400px"
          mx="auto"
        >
          {Object.entries(productsByCategory).map(([category, products]) => (
            <AccordionItem
              key={category}
              border="1px solid"
              borderColor="green.100"
              borderRadius="lg"
              mb={4}
            >
              <AccordionButton
                bg="green.50"
                _hover={{ bg: "green.100" }}
                _expanded={{ bg: "green.100", borderBottomRadius: 0 }}
                borderRadius="lg"
                py={4}
              >
                <Box flex="1" textAlign="left">
                  <Heading
                    as="h2"
                    size="lg"
                    color="green.700"
                    fontWeight="medium"
                  >
                    {category}
                  </Heading>
                  <Text fontSize="sm" color="green.600" mt={1}>
                    {products.length} produit
                    {products.length > 1 ? "s" : ""}
                  </Text>
                </Box>
                <AccordionIcon color="green.600" />
              </AccordionButton>

              <AccordionPanel pb={4} bg="white">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {products.map((product) => (
                    <SharedProductPreviewCard
                      key={product.id}
                      product={product}
                      shop={currentShop}
                      onAddToCart={handleAddToCart}
                      onView={handleViewProduct}
                    />
                  ))}
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bouton catalogue complet */}
        <Button
          as={Link}
          to={`/store/${currentShop.shopType}/products`}
          colorScheme="green"
          size="lg"
          variant="outline"
          px={8}
          py={6}
        >
          Découvrir tout le catalogue
        </Button>
      </VStack>
    </StoreLayout>
  );
};

export default StoreTeaShop;
