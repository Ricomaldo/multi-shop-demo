import type { Product, Shop } from "@/types";
import {
  Box,
  Button,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SharedProductPreviewCard } from "../../components/business/product/SharedProductPreviewCard";
import StoreHeader from "../../components/layout/store/StoreHeader";
import StoreLayout from "../../components/layout/store/StoreLayout";
import { useShopByType, useShopData, useStoreHandlers } from "../../hooks";

const StoreHerbShop = () => {
  const navigate = useNavigate();
  const { shop: initialShop, loading: shopLoading } = useShopByType("herbShop");
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

  // Grouper les produits par catégorie (simple et fiable)
  const productsByCategory = useMemo(() => {
    const grouped: Record<
      string,
      { products: Product[]; icon: string; description: string }
    > = {};

    products.forEach((product) => {
      // Utiliser la catégorie du produit, plus fiable que les attributs
      const categoryName = product.category?.name || "Plantes Médicinales";

      // Mapping des icônes par catégorie
      const categoryMapping: Record<
        string,
        { icon: string; description: string }
      > = {
        "Plantes Digestives": {
          icon: "🌿",
          description: "Plantes pour le bien-être digestif",
        },
        "Plantes Relaxantes": {
          icon: "🕯️",
          description: "Herbes apaisantes et relaxantes",
        },
        "Plantes Immunité": {
          icon: "🛡️",
          description: "Renforcement des défenses naturelles",
        },
        "Plantes Détox": {
          icon: "🌱",
          description: "Purification et drainage",
        },
        "Plantes Sommeil": {
          icon: "🌙",
          description: "Favorise un sommeil réparateur",
        },
        "Plantes Énergisantes": {
          icon: "⚡",
          description: "Vitalité et tonus naturel",
        },
        "Plantes Médicinales": {
          icon: "🌺",
          description: "Plantes aux vertus thérapeutiques",
        },
      };

      const { icon, description } = categoryMapping[categoryName] || {
        icon: "🌿",
        description: "Plantes aux vertus naturelles",
      };

      if (!grouped[categoryName]) {
        grouped[categoryName] = { products: [], icon, description };
      }
      grouped[categoryName].products.push(product);
    });

    return grouped;
  }, [products]);

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
      {/* CORRECTION: VARIANT HERO avec image herb-hero.jpg */}
      <StoreHeader
        shop={currentShop}
        title={currentShop.name}
        subtitle="Herboristerie traditionnelle - Plantes médicinales et préparations naturelles depuis 1952"
        availableShops={shops}
        onShopChange={handleShopChange}
        variant="hero"
        imagePath="/images/store/herb-hero.jpg"
        height="75vh"
      />

      <VStack spacing={8} py={8}>
        <Text
          fontSize="lg"
          color="teal.700"
          textAlign="center"
          fontStyle="italic"
          maxW="3xl"
          mx="auto"
        >
          Découvrez notre pharmacopée naturelle organisée par familles de
          plantes
        </Text>

        {Object.keys(productsByCategory).length > 0 ? (
          <Tabs
            variant="soft-rounded"
            colorScheme="teal"
            w="full"
            maxW="1400px"
            mx="auto"
          >
            <TabList flexWrap="wrap" justifyContent="center" gap={2}>
              {Object.entries(productsByCategory).map(([category, data]) => (
                <Tab key={category} fontSize="sm">
                  {data.icon} {category}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {Object.entries(productsByCategory).map(([category, data]) => (
                <TabPanel key={category} px={0}>
                  <VStack spacing={6}>
                    <Text
                      fontSize="md"
                      color="teal.600"
                      textAlign="center"
                      fontStyle="italic"
                    >
                      {data.description}
                    </Text>

                    <SimpleGrid
                      columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                      spacing={6}
                      w="full"
                    >
                      {data.products.map((product) => (
                        <SharedProductPreviewCard
                          key={product.id}
                          product={product}
                          shop={currentShop}
                          onAddToCart={handleAddToCart}
                          onView={handleViewProduct}
                        />
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        ) : (
          <VStack spacing={6} py={12}>
            <Text textAlign="center" color="gray.500" fontSize="lg">
              Aucun produit disponible pour le moment
            </Text>

            {/* FALLBACK: Afficher TOUS les produits de la boutique sans filtrage */}
            {products.length > 0 && (
              <VStack spacing={6} w="full" maxW="1400px" mx="auto">
                <Text color="teal.600" textAlign="center">
                  Voici tous nos produits disponibles ({products.length}{" "}
                  articles)
                </Text>
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  spacing={6}
                  w="full"
                >
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
              </VStack>
            )}
          </VStack>
        )}

        {/* Bouton catalogue complet */}
        <Button
          as={Link}
          to={`/store/${currentShop.shopType}/products`}
          colorScheme="teal"
          size="lg"
          variant="outline"
          px={8}
          py={6}
        >
          Explorer toute l'herboristerie
        </Button>
      </VStack>
    </StoreLayout>
  );
};

export default StoreHerbShop;
