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
import axios from "axios";
import { useEffect, useState } from "react";
import { SharedUniverseSelector } from "../../components/shared";
import { useAdminShop } from "../../contexts/AdminShopContext";
import { useShopData } from "../../hooks";

export default function Dashboard() {
  const { selectedShop, setSelectedShop } = useAdminShop();
  const { shops, loading: shopsLoading } = useShopData();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalShops: 0,
    totalCategories: 0,
    shopProducts: 0,
    shopCategories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [selectedShop]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const shopsResponse = await axios.get("http://localhost:3001/api/shops");
      const shops = shopsResponse.data;

      let totalProducts = 0;
      let totalCategories = 0;

      for (const shop of shops) {
        const productsResponse = await axios.get(
          `http://localhost:3001/api/shops/${shop.id}/products`
        );
        totalProducts += productsResponse.data.length;
        totalCategories += shop.categories.length;
      }

      // Statistiques pour la boutique sélectionnée
      let shopProducts = 0;
      let shopCategories = 0;
      if (selectedShop) {
        const selectedShopData = shops.find(
          (s: { id: string; categories: unknown[] }) => s.id === selectedShop.id
        );
        if (selectedShopData) {
          const shopProductsResponse = await axios.get(
            `http://localhost:3001/api/shops/${selectedShop.id}/products`
          );
          shopProducts = shopProductsResponse.data.length;
          shopCategories = selectedShopData.categories.length;
        }
      }

      setStats({
        totalProducts,
        totalShops: shops.length,
        totalCategories,
        shopProducts,
        shopCategories,
      });
      setError(null);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de charger les statistiques");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box>Chargement...</Box>;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Sélecteur de boutique */}
      <SharedUniverseSelector
        mode="shop"
        shops={shops}
        selectedShop={selectedShop}
        onShopChange={setSelectedShop}
        loading={shopsLoading}
        title="Sélectionner une boutique"
      />

      <Box>
        <Heading size="lg" mb={6}>
          📊 Tableau de Bord
        </Heading>

        {/* Statistiques globales */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Boutiques Actives</StatLabel>
            <StatNumber color="blue.500">{stats.totalShops}</StatNumber>
            <StatHelpText>Brasserie, Salon de thé</StatHelpText>
          </Stat>

          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Produits Total</StatLabel>
            <StatNumber color="green.500">{stats.totalProducts}</StatNumber>
            <StatHelpText>Toutes boutiques confondues</StatHelpText>
          </Stat>

          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Catégories</StatLabel>
            <StatNumber color="purple.500">{stats.totalCategories}</StatNumber>
            <StatHelpText>4 par boutique</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Statistiques de la boutique sélectionnée */}
        {selectedShop && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
            <Stat p={6} bg="white" borderRadius="md" shadow="sm">
              <StatLabel>Produits - {selectedShop.name}</StatLabel>
              <StatNumber color="orange.500">{stats.shopProducts}</StatNumber>
              <StatHelpText>Dans cette boutique</StatHelpText>
            </Stat>

            <Stat p={6} bg="white" borderRadius="md" shadow="sm">
              <StatLabel>Catégories - {selectedShop.name}</StatLabel>
              <StatNumber color="purple.500">{stats.shopCategories}</StatNumber>
              <StatHelpText>Catégories actives</StatHelpText>
            </Stat>
          </SimpleGrid>
        )}

        <Box p={6} bg="blue.50" borderRadius="md">
          <Heading size="md" mb={4} color="blue.700">
            🎯 Prochaines étapes
          </Heading>
          <Text>
            • Modifier un produit et voir le changement en temps réel
            <br />
            • Ajouter les boutiques Cosmétiques et Herboristerie
            <br />
            • Implémenter la gestion des catégories
            <br />• Créer les interfaces vitrines pour tous les univers
          </Text>
        </Box>
      </Box>
    </VStack>
  );
}
