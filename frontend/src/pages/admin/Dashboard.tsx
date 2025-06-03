import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../../../shared/types";
import { AdminDashboard } from "../../components/admin";
import { useAdminShop, useShopData } from "../../hooks";
import {
  getShopDisplayName,
  getUniverseIcon,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

export default function Dashboard() {
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { shop: activeShop } = useAdminShop();
  const { products } = useShopData();

  // Filtrer les produits de la boutique active
  const activeShopProducts = useMemo(() => {
    if (!activeShop) return [];
    return products.filter((p) => p.shopId === activeShop.id);
  }, [activeShop, products]);

  // Stats de la boutique active
  const shopStats = useMemo(() => {
    if (!activeShop) return null;

    const totalProducts = activeShopProducts.length;
    const averagePrice =
      totalProducts > 0
        ? activeShopProducts.reduce((sum, p) => sum + p.price, 0) /
          totalProducts
        : 0;

    return {
      totalProducts,
      averagePrice,
      shopName: activeShop.name,
      shopType: activeShop.shopType,
      universe: shopTypeToUniverse(activeShop.shopType),
    };
  }, [activeShop, activeShopProducts]);

  useEffect(() => {
    if (activeShop && products.length > 0) {
      setShopProducts(activeShopProducts);
      setLoading(false);
      setError(null);
    } else if (!activeShop) {
      setError("Aucune boutique sélectionnée");
      setLoading(false);
    }
  }, [activeShop, activeShopProducts, products]);

  if (loading) {
    return (
      <VStack spacing={4} align="center" justify="center" h="400px">
        <Text fontSize="lg">Chargement du tableau de bord...</Text>
      </VStack>
    );
  }

  if (error || !activeShop || !shopStats) {
    return (
      <VStack spacing={4} align="stretch">
        <Alert status="warning">
          <AlertIcon />
          {error ||
            "Veuillez sélectionner une boutique pour voir le tableau de bord"}
        </Alert>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>
          {getUniverseIcon(shopStats.universe)} Tableau de Bord
        </Heading>
        <Text color="gray.600" fontSize="md" mb={6}>
          {getShopDisplayName(shopStats.universe)} • Boutique active
        </Text>

        {/* Statistiques de la boutique active */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Produits en ligne</StatLabel>
            <StatNumber color="blue.500">{shopStats.totalProducts}</StatNumber>
            <StatHelpText>Dans cette boutique</StatHelpText>
          </Stat>

          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Prix moyen</StatLabel>
            <StatNumber color="green.500">
              {shopStats.averagePrice.toFixed(2)} €
            </StatNumber>
            <StatHelpText>Catalogue actuel</StatHelpText>
          </Stat>

          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Univers</StatLabel>
            <StatNumber color="purple.500">{shopStats.universe}</StatNumber>
            <StatHelpText>Type de boutique</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Dashboard détaillé pour la boutique active */}
        <AdminDashboard
          shops={activeShop ? [activeShop] : []}
          products={shopProducts}
        />
      </Box>
    </VStack>
  );
}
