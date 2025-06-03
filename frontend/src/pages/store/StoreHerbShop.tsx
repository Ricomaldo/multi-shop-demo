import {
  Box,
  Button,
  Container,
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
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import { useShopByType, useShopData, useStoreHandlers } from "../../hooks";

const HERB_CATEGORIES = [
  {
    id: "digestion",
    name: "Digestion",
    icon: "🌱",
    description:
      "Plantes pour faciliter la digestion et soulager les troubles digestifs",
  },
  {
    id: "sommeil",
    name: "Sommeil",
    icon: "🌙",
    description:
      "Plantes relaxantes pour retrouver un sommeil naturel et réparateur",
  },
  {
    id: "immunite",
    name: "Immunité",
    icon: "💪",
    description: "Plantes fortifiantes pour renforcer les défenses naturelles",
  },
  {
    id: "stress",
    name: "Stress",
    icon: "🍃",
    description: "Plantes adaptogènes pour gérer le stress et l'anxiété",
  },
];

const StoreHerbShop = () => {
  const navigate = useNavigate();
  const { shop, products, loading } = useShopByType("herbShop");
  const { handleAddToCart, handleViewProduct } = useStoreHandlers();
  const { shops } = useShopData();

  useEffect(() => {
    if (!loading && !shop) {
      navigate("/404");
    }
  }, [loading, shop, navigate]);

  // Grouper les produits par usage
  const productsByUsage = useMemo(() => {
    const grouped: Record<string, typeof products> = {};
    HERB_CATEGORIES.forEach(({ id }) => {
      grouped[id] = products.filter((p) => {
        if (!p.attributes) return false;
        try {
          const attrs = JSON.parse(p.attributes);
          return attrs.usage_traditionnel === id;
        } catch {
          return false;
        }
      });
    });
    return grouped;
  }, [products]);

  if (loading || !shop) {
    return <Box>Chargement...</Box>;
  }

  return (
    <Box as="main">
      <StoreHeroHeader
        shop={shop}
        title="L'Herbier Traditionnel"
        subtitle="Plantes médicinales et préparations naturelles"
        availableShops={shops}
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
