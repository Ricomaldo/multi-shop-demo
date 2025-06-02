import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../../../../shared/types";
import { SharedHeroHeader } from "../../components/shared/SharedHeroHeader";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopByType } from "../../hooks/useShopByType";

const HERB_CATEGORIES = [
  { id: "digestion", name: "Digestion", icon: "🌱" },
  { id: "sommeil", name: "Sommeil", icon: "🌙" },
  { id: "immunite", name: "Immunité", icon: "💪" },
  { id: "stress", name: "Stress", icon: "🍃" },
];

const StoreHerbShop = () => {
  const navigate = useNavigate();
  const { shop, products, loading } = useShopByType("herbShop");

  useEffect(() => {
    if (loading) {
      navigate("/404");
    }
  }, [loading, navigate]);

  // Grouper les produits par usage
  const productsByUsage = useMemo(() => {
    const grouped: Record<string, typeof products> = {};
    HERB_CATEGORIES.forEach(({ id }) => {
      grouped[id] = products.filter(
        (p) => p.attributes?.usage_traditionnel === id
      );
    });
    return grouped;
  }, [products]);

  if (loading || !shop) {
    return <Box>Chargement...</Box>;
  }

  const handleAddToCart = (product: Product) => {
    console.log("Ajouter au panier:", product);
  };

  const handleViewProduct = (product: Product) => {
    console.log("Voir produit:", product);
  };

  return (
    <Box>
      <SharedHeroHeader
        title={shop.name}
        subtitle="Le meilleur de la nature pour votre bien-être"
        imagePath="/images/store/herb-banner.jpg"
        imageAlt="Bannière de l'herboristerie"
      />

      <VStack spacing={8} p={8}>
        <Box textAlign="center" maxW="2xl" mx="auto">
          <Heading size="lg" mb={4} color="green.600">
            Nos Plantes & Préparations
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Des remèdes naturels traditionnels pour chaque besoin
          </Text>
        </Box>

        <Tabs
          variant="soft-rounded"
          colorScheme="green"
          align="center"
          w="full"
          maxW="1400px"
          mx="auto"
        >
          <TabList mb={8}>
            {HERB_CATEGORIES.map(({ id, name, icon }) => (
              <Tab key={id} fontSize="lg">
                {icon} {name}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {HERB_CATEGORIES.map(({ id }) => (
              <TabPanel key={id}>
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  spacing={6}
                >
                  {productsByUsage[id].map((product) => (
                    <SharedProductCard
                      key={product.id}
                      product={product}
                      shop={shop}
                    />
                  ))}
                </SimpleGrid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </VStack>

      <StoreHeroHeader
        shop={shop}
        imageSrc="/images/store/herb-hero.jpg"
        imageAlt="Herboristerie du Moulin Vert - Plantes médicinales et préparations naturelles"
        overlayOpacity={0.4}
        overlayColor="green"
        height="75vh"
        ctaText="Découvrir nos plantes"
        onCtaClick={() => navigate("/store/herbShop/products")}
      />

      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={12} py={12}>
          {/* Système d'onglets */}
          <VStack spacing={8} w="full">
            <VStack spacing={2} textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                Nos Plantes Médicinales
              </Text>
              <Text color="gray.600">
                Une sélection de plantes aux vertus millénaires
              </Text>
            </VStack>

            <Tabs
              variant="soft-rounded"
              colorScheme="teal"
              align="center"
              w="full"
              isLazy
            >
              <TabList
                overflowX="auto"
                overflowY="hidden"
                whiteSpace="nowrap"
                css={{
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
                p={2}
              >
                {HERB_CATEGORIES.map((category) => (
                  <Tab
                    key={category.id}
                    px={6}
                    py={3}
                    fontWeight="medium"
                    _selected={{
                      color: "teal.800",
                      bg: "teal.100",
                    }}
                  >
                    <Text mr={2} display="inline">
                      {category.icon}
                    </Text>
                    {category.name}
                  </Tab>
                ))}
              </TabList>

              <TabPanels mt={8}>
                {HERB_CATEGORIES.map((category) => (
                  <TabPanel key={category.id}>
                    <VStack spacing={6} align="stretch">
                      <Text
                        fontSize="lg"
                        color="teal.700"
                        textAlign="center"
                        fontStyle="italic"
                      >
                        {category.description}
                      </Text>

                      <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 3 }}
                        spacing={8}
                        py={4}
                      >
                        {productsByUsage[category.id].map((product) => (
                          <SharedProductCard
                            key={product.id}
                            product={product}
                            shop={shop}
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
          </VStack>

          {/* Footer naturel */}
          <Box
            as="footer"
            w="full"
            bg="green.50"
            p={12}
            borderRadius="none"
            textAlign="center"
            borderTop="1px solid"
            borderColor="green.100"
          >
            <VStack spacing={4}>
              <Text fontSize="2xl" color="green.800" fontFamily="body">
                L'Herbier Traditionnel
              </Text>
              <Text>
                <span role="img" aria-label="plante">
                  🌿
                </span>{" "}
                Herboristerie & Conseils
              </Text>
              <Text>
                <span role="img" aria-label="localisation">
                  📍
                </span>{" "}
                23 rue des Plantes, 75014 Paris
              </Text>
              <Text>Cueillette et préparations artisanales</Text>
              <Button
                as={Link}
                to="/store/contact"
                colorScheme="teal"
                size="lg"
                variant="outline"
                px={8}
                _hover={{ bg: "green.50" }}
              >
                Nous contacter
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default StoreHerbShop;
