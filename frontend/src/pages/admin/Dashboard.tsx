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
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import type { Shop } from "../../../../shared/types";
import AdminShopForm from "../../components/admin/AdminShopForm";
import { useUniverse } from "../../contexts/UniverseContext";
import { shopTypeToUniverse } from "../../utils/universeMapping";

interface ShopWithStats {
  id: string;
  name: string;
  shopType: string;
  categories: unknown[];
  productCount: number;
  // Nouvelles infos business
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  openingHours: string;
}

export default function Dashboard() {
  const [allStats, setAllStats] = useState({
    totalProducts: 0,
    totalShops: 0,
    totalCategories: 0,
    allShops: [] as ShopWithStats[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [shopFormLoading, setShopFormLoading] = useState(false);

  const { universe } = useUniverse();

  // Filtrer les statistiques selon l'univers sélectionné
  const filteredStats = useMemo(() => {
    const universeShops = allStats.allShops.filter(
      (shop) => shopTypeToUniverse(shop.shopType) === universe
    );

    return {
      totalShops: universeShops.length,
      totalProducts: universeShops.reduce(
        (sum, shop) => sum + (shop.productCount || 0),
        0
      ),
      totalCategories: universeShops.reduce(
        (sum, shop) => sum + (shop.categories?.length || 0),
        0
      ),
      shops: universeShops,
    };
  }, [allStats, universe]);

  useEffect(() => {
    loadStats();
  }, []);

  // Ajout d'un useEffect pour recharger quand l'univers change
  useEffect(() => {
    loadStats();
    // Réinitialiser la boutique sélectionnée
    setSelectedShop(null);
  }, [universe]);

  useEffect(() => {
    // Sélectionner automatiquement la première boutique de l'univers
    if (filteredStats.shops.length > 0 && !selectedShop) {
      const firstShop = filteredStats.shops[0];
      // Conversion en objet Shop complet
      setSelectedShop({
        id: firstShop.id,
        name: firstShop.name,
        shopType: firstShop.shopType,
        categories: firstShop.categories,
        address: firstShop.address,
        phone: firstShop.phone,
        email: firstShop.email,
        website: firstShop.website,
        description: firstShop.description,
        openingHours: firstShop.openingHours,
      } as Shop);
    }
  }, [filteredStats.shops, selectedShop]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const shopsResponse = await axios.get("http://localhost:3001/api/shops");
      const shops = shopsResponse.data;

      let totalProducts = 0;
      let totalCategories = 0;
      const shopDetails: ShopWithStats[] = [];

      for (const shop of shops) {
        const productsResponse = await axios.get(
          `http://localhost:3001/api/shops/${shop.id}/products`
        );
        const products = productsResponse.data;
        const productCount = products.length;
        totalProducts += productCount;
        totalCategories += shop.categories.length;

        // Calculer les stats de stock pour chaque boutique
        let lowStock = 0;
        let outOfStock = 0;

        products.forEach((product: { attributes?: string }) => {
          if (product.attributes) {
            try {
              const attrs = JSON.parse(product.attributes);
              const stock = attrs.stock || 0;
              if (stock === 0) outOfStock++;
              else if (stock <= 3) lowStock++;
            } catch {
              // Ignore les erreurs de parsing
            }
          }
        });

        // Ajouter toutes les informations de la boutique
        shopDetails.push({
          id: shop.id,
          name: shop.name,
          shopType: shop.shopType,
          categories: shop.categories,
          productCount,
          // Ajout des infos business
          address: shop.address,
          phone: shop.phone,
          email: shop.email,
          website: shop.website,
          description: shop.description,
          openingHours: shop.openingHours,
        });
      }

      setAllStats({
        totalProducts,
        totalShops: shops.length,
        totalCategories,
        allShops: shopDetails,
      });
      setError(null);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de charger les statistiques");
    } finally {
      setLoading(false);
    }
  };

  const handleShopSave = async (shopData: Partial<Shop>) => {
    if (!selectedShop) return;

    setShopFormLoading(true);
    try {
      // Simuler la sauvegarde API
      await axios.put(
        `http://localhost:3001/api/shops/${selectedShop.id}`,
        shopData
      );

      // Recharger les données
      await loadStats();

      // Mettre à jour la boutique sélectionnée
      setSelectedShop((prev) => (prev ? { ...prev, ...shopData } : null));
    } finally {
      setShopFormLoading(false);
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
      <Box>
        <Heading size="lg" mb={6}>
          📊 Tableau de Bord
        </Heading>

        {/* Statistiques filtrées par univers */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Boutiques Actives</StatLabel>
            <StatNumber color="blue.500">{filteredStats.totalShops}</StatNumber>
            <StatHelpText>Univers {universe}</StatHelpText>
          </Stat>

          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Produits Total</StatLabel>
            <StatNumber color="green.500">
              {filteredStats.totalProducts}
            </StatNumber>
            <StatHelpText>Cet univers</StatHelpText>
          </Stat>

          <Stat p={6} bg="white" borderRadius="md" shadow="sm">
            <StatLabel>Catégories</StatLabel>
            <StatNumber color="purple.500">
              {filteredStats.totalCategories}
            </StatNumber>
            <StatHelpText>Cet univers</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Formulaire de gestion boutique */}
        {selectedShop && (
          <AdminShopForm
            shop={selectedShop}
            onSave={handleShopSave}
            isLoading={shopFormLoading}
          />
        )}
      </Box>
    </VStack>
  );
}
