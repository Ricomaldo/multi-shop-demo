import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AdminStockTransferForm } from "../../components/onwork/AdminStockTransferForm";
import LoadingState from "../../components/shared/LoadingState";
import { useShopData } from "../../hooks/useShopData";
import {
  getUniverseIcon,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

interface StockTransfer {
  id: string;
  sourceShopId: string;
  destinationShopId: string;
  productId: string;
  productName: string;
  quantity: number;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
}

export default function StockTransfer() {
  const { shops, products, loading } = useShopData();
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Simuler quelques transferts d'historique
  useEffect(() => {
    if (shops.length > 0) {
      setTransfers([
        {
          id: "t1",
          sourceShopId: shops[0]?.id || "",
          destinationShopId: shops[1]?.id || "",
          productId: "prod1",
          productName: "Bière IPA Houblonnée",
          quantity: 10,
          timestamp: new Date(Date.now() - 3600000),
          status: "completed",
        },
        {
          id: "t2",
          sourceShopId: shops[1]?.id || "",
          destinationShopId: shops[0]?.id || "",
          productId: "prod2",
          productName: "Thé Earl Grey Premium",
          quantity: 5,
          timestamp: new Date(Date.now() - 7200000),
          status: "completed",
        },
      ]);
    }
  }, [shops]);

  const handleStockTransfer = async (
    sourceShopId: string,
    destinationShopId: string,
    productId: string,
    quantity: number
  ) => {
    setIsTransferring(true);
    try {
      // Simulation de l'API - Dans un vrai projet, appel backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const product = products.find((p) => p.id === productId);
      const newTransfer: StockTransfer = {
        id: `t${Date.now()}`,
        sourceShopId,
        destinationShopId,
        productId,
        productName: product?.name || "Produit inconnu",
        quantity,
        timestamp: new Date(),
        status: "completed",
      };

      setTransfers((prev) => [newTransfer, ...prev]);

      toast({
        title: "Transfert effectué",
        description: `${quantity} unités de "${product?.name}" transférées avec succès`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Erreur transfert",
        description: "Impossible d'effectuer le transfert",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const getShopName = (shopId: string) => {
    return shops.find((s) => s.id === shopId)?.name || "Boutique inconnue";
  };

  const getShopIcon = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    if (!shop) return "🏪";
    const universe = shopTypeToUniverse(shop.shopType);
    return getUniverseIcon(universe);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "pending":
        return "yellow";
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "pending":
        return "En cours";
      case "failed":
        return "Échec";
      default:
        return "Inconnu";
    }
  };

  if (loading) {
    return (
      <LoadingState
        message="Chargement des données de transfert..."
        height="60vh"
      />
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>
            📦 Transferts de Stock
          </Heading>
          <Text color="gray.600">
            Gérez les transferts de stock entre vos boutiques
          </Text>
        </Box>

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Nouveau Transfert</Tab>
            <Tab>Historique ({transfers.length})</Tab>
          </TabList>

          <TabPanels>
            {/* Onglet Nouveau Transfert */}
            <TabPanel>
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
              >
                {shops.length < 2 ? (
                  <Alert status="warning">
                    <AlertIcon />
                    Il faut au moins 2 boutiques pour effectuer un transfert
                  </Alert>
                ) : (
                  <AdminStockTransferForm
                    shops={shops}
                    products={products}
                    onTransfer={handleStockTransfer}
                    isLoading={isTransferring}
                  />
                )}
              </Box>
            </TabPanel>

            {/* Onglet Historique */}
            <TabPanel>
              <Box
                bg={cardBg}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
              >
                {transfers.length === 0 ? (
                  <Box p={8} textAlign="center">
                    <Text color="gray.500">Aucun transfert effectué</Text>
                  </Box>
                ) : (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>Produit</Th>
                        <Th>De</Th>
                        <Th>Vers</Th>
                        <Th>Quantité</Th>
                        <Th>Statut</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {transfers.map((transfer) => (
                        <Tr key={transfer.id}>
                          <Td>
                            <Text fontSize="sm">
                              {transfer.timestamp.toLocaleDateString("fr-FR")}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {transfer.timestamp.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" fontWeight="medium">
                              {transfer.productName}
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Text fontSize="lg">
                                {getShopIcon(transfer.sourceShopId)}
                              </Text>
                              <Text fontSize="sm">
                                {getShopName(transfer.sourceShopId)}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Text fontSize="lg">
                                {getShopIcon(transfer.destinationShopId)}
                              </Text>
                              <Text fontSize="sm">
                                {getShopName(transfer.destinationShopId)}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge variant="outline" fontSize="sm">
                              {transfer.quantity} unités
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getStatusBadgeColor(transfer.status)}
                              variant="subtle"
                            >
                              {getStatusText(transfer.status)}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
}
