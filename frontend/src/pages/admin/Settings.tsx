import { CheckIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import AdminShopForm from "../../components/features/admin/shop/AdminShopForm";
import LoadingState from "../../components/ui/LoadingState";
import { useAdminShop, useShopData } from "../../hooks";

interface ShopSettings {
  isActive: boolean;
  allowOrders: boolean;
  currency: string;
  timezone: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<ShopSettings>({
    isActive: true,
    allowOrders: true,
    currency: "EUR",
    timezone: "Europe/Paris",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [shopFormLoading, setShopFormLoading] = useState(false);
  const toast = useToast();

  const { shop: activeShop } = useAdminShop();
  const { products } = useShopData();

  const colorScheme = "purple";

  // Calculer les stats de la boutique active
  const shopStats = useMemo(() => {
    if (!activeShop) return { products: 0, categories: 0 };

    const shopProducts = products.filter((p) => p.shopId === activeShop.id);
    return {
      products: shopProducts.length,
      categories: 0, // Temporaire en attendant la correction des types
    };
  }, [activeShop, products]);

  const handleInputChange = (
    field: keyof ShopSettings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulation d'API call pour les settings techniques
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos modifications ont été enregistrées avec succès",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setHasChanges(false);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopSave = async () => {
    if (!activeShop) return;

    setShopFormLoading(true);
    try {
      // La logique de sauvegarde est gérée par AdminShopForm
      toast({
        title: "Boutique mise à jour",
        description: "Les informations ont été sauvegardées",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Erreur sauvegarde boutique:", error);
    } finally {
      setShopFormLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      isActive: true,
      allowOrders: true,
      currency: "EUR",
      timezone: "Europe/Paris",
    });
    setHasChanges(false);
  };

  if (!activeShop) {
    return (
      <LoadingState message="Initialisation des paramètres..." height="60vh" />
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* En-tête */}
      <Card>
        <CardBody>
          <Flex
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align={{ base: "stretch", lg: "center" }}
            wrap="wrap"
            gap={4}
          >
            <VStack align="start" spacing={1}>
              <Heading size={{ base: "md", md: "lg" }}>
                ⚙️ Paramètres de la boutique
              </Heading>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                Configuration générale • {activeShop.name}
              </Text>
            </VStack>

            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={3}
              align="center"
              w={{ base: "full", lg: "auto" }}
            >
              {hasChanges && (
                <Badge
                  colorScheme="orange"
                  p={2}
                  borderRadius="md"
                  fontSize={{ base: "xs", md: "sm" }}
                  textAlign="center"
                >
                  Modifications non sauvegardées
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={handleReset}
                isDisabled={!hasChanges}
                size={{ base: "sm", md: "md" }}
                w={{ base: "full", sm: "auto" }}
              >
                Réinitialiser
              </Button>
              <Button
                colorScheme={colorScheme}
                onClick={handleSave}
                isLoading={isLoading}
                loadingText="Sauvegarde..."
                leftIcon={<CheckIcon />}
                isDisabled={!hasChanges}
                size={{ base: "sm", md: "md" }}
                w={{ base: "full", sm: "auto" }}
              >
                Sauvegarder
              </Button>
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {/* Statistiques rapides */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Statut boutique</StatLabel>
              <StatNumber color={settings.isActive ? "green.500" : "red.500"}>
                {settings.isActive ? "Active" : "Inactive"}
              </StatNumber>
              <StatHelpText>État actuel</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Commandes</StatLabel>
              <StatNumber
                color={settings.allowOrders ? "green.500" : "orange.500"}
              >
                {settings.allowOrders ? "Ouvertes" : "Fermées"}
              </StatNumber>
              <StatHelpText>Acceptation commandes</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Produits</StatLabel>
              <StatNumber color="blue.500">{shopStats.products}</StatNumber>
              <StatHelpText>Total en ligne</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Catégories</StatLabel>
              <StatNumber>{shopStats.categories}</StatNumber>
              <StatHelpText>Organisées</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Formulaire informations boutique - AdminShopForm intégré */}
      <AdminShopForm
        shop={activeShop}
        onSave={handleShopSave}
        isLoading={shopFormLoading}
      />

      {/* Configuration technique uniquement */}
      <Card>
        <CardHeader>
          <Heading size="md">🔧 Configuration technique</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="shop-active" mb="0" flex={1}>
                Boutique active
              </FormLabel>
              <Switch
                id="shop-active"
                colorScheme={colorScheme}
                isChecked={settings.isActive}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.checked)
                }
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="allow-orders" mb="0" flex={1}>
                Accepter les commandes
              </FormLabel>
              <Switch
                id="allow-orders"
                colorScheme={colorScheme}
                isChecked={settings.allowOrders}
                onChange={(e) =>
                  handleInputChange("allowOrders", e.target.checked)
                }
              />
            </FormControl>

            <Divider />

            <FormControl>
              <FormLabel>Devise</FormLabel>
              <Select
                value={settings.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar US ($)</option>
                <option value="GBP">Livre Sterling (£)</option>
                <option value="CHF">Franc Suisse (CHF)</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Fuseau horaire</FormLabel>
              <Select
                value={settings.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
              >
                <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                <option value="Europe/London">Europe/London (UTC+0)</option>
                <option value="America/New_York">
                  America/New_York (UTC-5)
                </option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
              </Select>
              <FormHelperText>
                Utilisé pour l'affichage des dates et heures
              </FormHelperText>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
