import { AdminDashboard } from "@/components/features/admin/dashboard/AdminDashboard";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/formatPrice";
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
import { useAdminContext } from "../../hooks";
import { useStoreDataQuery } from "../../hooks/useStoreDataQuery";
import { getUniverseTokens } from "../../theme/universeTokens";

export default function Dashboard() {
  const { selectedShopType, selectedShop, loading, error } = useAdminContext();

  // 🚀 Récupérer les produits via React Query
  const { products } = useStoreDataQuery();
  const tokens = getUniverseTokens(selectedShopType);

  const [shopProducts, setShopProducts] = useState<Product[]>([]);

  // Filtrer les produits de la boutique active
  const activeShopProducts = useMemo(() => {
    if (!selectedShop) return [];
    return products.filter((p) => p.shopId === selectedShop.id);
  }, [selectedShop, products]);

  // Stats de la boutique active
  const shopStats = useMemo(() => {
    if (!selectedShop) return null;

    const totalProducts = activeShopProducts.length;
    const averagePrice =
      totalProducts > 0
        ? activeShopProducts.reduce((sum, p) => sum + p.price, 0) /
          totalProducts
        : 0;

    return {
      totalProducts,
      averagePrice,
      shopName: selectedShop.name,
      shopType: selectedShop.shopType,
    };
  }, [selectedShop, activeShopProducts]);

  useEffect(() => {
    if (selectedShop && products.length > 0) {
      setShopProducts(activeShopProducts);
    }
  }, [selectedShop, activeShopProducts, products]);

  if (loading) {
    return (
      <VStack spacing={4} align="center" justify="center" h="400px">
        <Text fontSize="lg">Chargement du tableau de bord...</Text>
      </VStack>
    );
  }

  if (error || !selectedShop || !shopStats) {
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
          {tokens.meta.icon} Tableau de Bord
        </Heading>
        <Text color="gray.600" fontSize="md" mb={6}>
          {selectedShop.name} • Boutique active
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Produits en ligne</StatLabel>
            <StatNumber color="blue.500">{shopStats.totalProducts}</StatNumber>
            <StatHelpText>Dans cette boutique</StatHelpText>
          </Stat>

          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Prix moyen</StatLabel>
            <StatNumber color="green.500">
              {formatPrice(shopStats.averagePrice)}
            </StatNumber>
            <StatHelpText>Catalogue actuel</StatHelpText>
          </Stat>

          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Univers</StatLabel>
            <StatNumber color="purple.500">{selectedShop.shopType}</StatNumber>
            <StatHelpText>Type de boutique</StatHelpText>
          </Stat>
        </SimpleGrid>

        <AdminDashboard
          shops={selectedShop ? [selectedShop] : []}
          products={shopProducts}
        />
      </Box>
    </VStack>
  );
}
