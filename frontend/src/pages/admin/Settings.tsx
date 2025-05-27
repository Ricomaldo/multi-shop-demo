import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
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
  HStack,
  Input,
  Select,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useShopData } from "../../hooks";

interface ShopSettings {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  allowOrders: boolean;
  currency: string;
  timezone: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<ShopSettings>({
    name: "Houblon & Tradition",
    description: "Brasserie artisanale depuis 1995",
    email: "contact@houblon-tradition.fr",
    phone: "+33 1 23 45 67 89",
    address: "123 Rue de la Brasserie, 75001 Paris",
    isActive: true,
    allowOrders: true,
    currency: "EUR",
    timezone: "Europe/Paris",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const toast = useToast();

  const { shops, products } = useShopData();
  const currentShop = shops[0];
  const colorScheme = "purple";

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
      // Simulation d'API call
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

  const handleReset = () => {
    setSettings({
      name: "Houblon & Tradition",
      description: "Brasserie artisanale depuis 1995",
      email: "contact@houblon-tradition.fr",
      phone: "+33 1 23 45 67 89",
      address: "123 Rue de la Brasserie, 75001 Paris",
      isActive: true,
      allowOrders: true,
      currency: "EUR",
      timezone: "Europe/Paris",
    });
    setHasChanges(false);
  };

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
                Configuration générale • {currentShop?.name}
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
              <StatNumber>
                {products.filter((p) => p.shopId === currentShop?.id).length}
              </StatNumber>
              <StatHelpText>Total en ligne</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Catégories</StatLabel>
              <StatNumber>{currentShop?.categories?.length || 0}</StatNumber>
              <StatHelpText>Organisées</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Alerte de statut */}
      {!settings.isActive && (
        <Alert status="warning">
          <AlertIcon />
          <Box>
            <AlertTitle>Boutique inactive !</AlertTitle>
            <AlertDescription>
              Votre boutique n'est pas visible par les clients. Activez-la pour
              commencer à vendre.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <Heading size="md">📋 Informations générales</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Nom de la boutique</FormLabel>
                <Input
                  value={settings.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nom de votre boutique"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={settings.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Décrivez votre boutique..."
                  rows={3}
                />
                <FormHelperText>
                  Cette description apparaîtra sur votre vitrine
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Email de contact</FormLabel>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@votreboutique.fr"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Téléphone</FormLabel>
                <Input
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Adresse</FormLabel>
                <Textarea
                  value={settings.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Adresse complète de votre boutique"
                  rows={2}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Configuration technique */}
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
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleInputChange("timezone", e.target.value)
                  }
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

              {/* Zone de danger */}
              <Box
                p={4}
                borderWidth={1}
                borderColor="red.200"
                borderRadius="md"
                bg="red.50"
              >
                <VStack spacing={3} align="stretch">
                  <HStack>
                    <WarningIcon color="red.500" />
                    <Text fontWeight="bold" color="red.700">
                      Zone de danger
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="red.600">
                    Actions irréversibles qui affectent définitivement votre
                    boutique
                  </Text>
                  <Button colorScheme="red" variant="outline" size="sm">
                    Supprimer la boutique
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );
}
