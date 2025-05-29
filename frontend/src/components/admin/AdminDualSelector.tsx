import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import type { Shop } from "../../../../shared/types";
import type { UniverseType } from "../../contexts/UniverseContext";

interface AdminDualSelectorProps {
  shops: Shop[];
  selectedShop?: Shop | null;
  onShopChange: (shop: Shop) => void;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

interface UniverseOption {
  type: UniverseType;
  shopType: string;
  label: string;
  icon: string;
  description: string;
  colorScheme: string;
}

const universeOptions: UniverseOption[] = [
  {
    type: "brewery",
    shopType: "brewery",
    label: "Houblon & Tradition",
    icon: "🍺",
    description: "Brasserie artisanale - Découvrez nos bières traditionnelles",
    colorScheme: "orange",
  },
  {
    type: "teaShop",
    shopType: "teaShop",
    label: "Les Jardins de Darjeeling",
    icon: "🍵",
    description: "Salon de thé - Thés d'exception du monde entier",
    colorScheme: "green",
  },
  {
    type: "beautyShop",
    shopType: "beautyShop",
    label: "L'Écrin de Jade",
    icon: "💄",
    description: "Institut beauté - Cosmétiques de luxe et soins premium",
    colorScheme: "pink",
  },
  {
    type: "herbShop",
    shopType: "herbShop",
    label: "Herboristerie du Moulin Vert",
    icon: "🌿",
    description: "Herboristerie - Plantes médicinales et bien-être naturel",
    colorScheme: "teal",
  },
];

/**
 * Composant de sélection en deux étapes pour l'admin
 * Étape 1: Sélection de l'univers métier
 * Étape 2: Sélection de la boutique dans cet univers
 * Interface intuitive et moderne
 */
export const AdminDualSelector: React.FC<AdminDualSelectorProps> = ({
  shops,
  selectedShop,
  onShopChange,
  loading = false,
  size = "md",
}) => {
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseType | null>(
    selectedShop ? (selectedShop.shopType as UniverseType) : null
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Boutiques filtrées par univers sélectionné
  const filteredShops = useMemo(() => {
    if (!selectedUniverse) return [];
    return shops.filter((shop) => shop.shopType === selectedUniverse);
  }, [shops, selectedUniverse]);

  // Statistiques par univers
  const universeStats = useMemo(() => {
    const stats: Record<string, number> = {};
    universeOptions.forEach((universe) => {
      stats[universe.type] = shops.filter(
        (shop) => shop.shopType === universe.shopType
      ).length;
    });
    return stats;
  }, [shops]);

  const handleUniverseSelect = (universe: UniverseType) => {
    setSelectedUniverse(universe);
    // Reset la sélection de boutique si on change d'univers
    if (selectedShop && selectedShop.shopType !== universe) {
      const firstShopInUniverse = shops.find(
        (shop) => shop.shopType === universe
      );
      if (firstShopInUniverse) {
        onShopChange(firstShopInUniverse);
      }
    }
  };

  const handleShopSelect = (shop: Shop) => {
    onShopChange(shop);
  };

  if (loading) {
    return (
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <Text fontSize={size === "sm" ? "sm" : "md"}>
            🔄 Chargement des boutiques...
          </Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Étape 1: Sélection de l'univers */}
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardHeader pb={3}>
          <Heading size="sm" color="gray.700">
            🌟 Étape 1 : Choisir l'univers métier
          </Heading>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            {universeOptions.map((universe) => {
              const isSelected = selectedUniverse === universe.type;
              const shopCount = universeStats[universe.type] || 0;

              return (
                <Button
                  key={universe.type}
                  variant={isSelected ? "solid" : "outline"}
                  colorScheme={universe.colorScheme}
                  onClick={() => handleUniverseSelect(universe.type)}
                  h="auto"
                  p={4}
                  justifyContent="flex-start"
                  borderWidth={isSelected ? "2px" : "1px"}
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "md",
                  }}
                  transition="all 0.2s"
                >
                  <VStack spacing={2} align="start" w="full">
                    <HStack w="full" justify="space-between">
                      <HStack>
                        <Text fontSize="lg">{universe.icon}</Text>
                        <Text
                          fontWeight="semibold"
                          fontSize={size === "sm" ? "sm" : "md"}
                          noOfLines={1}
                        >
                          {universe.label}
                        </Text>
                      </HStack>
                      <Badge
                        colorScheme={universe.colorScheme}
                        variant={isSelected ? "solid" : "subtle"}
                      >
                        {shopCount} boutique{shopCount !== 1 ? "s" : ""}
                      </Badge>
                    </HStack>
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      textAlign="left"
                      noOfLines={2}
                    >
                      {universe.description}
                    </Text>
                  </VStack>
                </Button>
              );
            })}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Étape 2: Sélection de la boutique */}
      {selectedUniverse && (
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader pb={3}>
            <HStack justify="space-between" align="center">
              <Heading size="sm" color="gray.700">
                🏪 Étape 2 : Sélectionner la boutique
              </Heading>
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Univers :
                </Text>
                <Badge
                  colorScheme={
                    universeOptions.find((u) => u.type === selectedUniverse)
                      ?.colorScheme
                  }
                >
                  {
                    universeOptions.find((u) => u.type === selectedUniverse)
                      ?.icon
                  }{" "}
                  {
                    universeOptions.find((u) => u.type === selectedUniverse)
                      ?.label
                  }
                </Badge>
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            {filteredShops.length > 0 ? (
              <VStack spacing={2} align="stretch">
                {filteredShops.map((shop) => {
                  const isSelected = selectedShop?.id === shop.id;
                  const universe = universeOptions.find(
                    (u) => u.shopType === shop.shopType
                  );

                  return (
                    <Button
                      key={shop.id}
                      variant={isSelected ? "solid" : "outline"}
                      colorScheme={universe?.colorScheme || "gray"}
                      onClick={() => handleShopSelect(shop)}
                      justifyContent="space-between"
                      h="auto"
                      p={4}
                      borderWidth={isSelected ? "2px" : "1px"}
                      _hover={{
                        transform: "translateY(-1px)",
                        shadow: "sm",
                      }}
                      transition="all 0.2s"
                    >
                      <HStack spacing={3}>
                        <Text fontSize="md">{universe?.icon}</Text>
                        <VStack spacing={0} align="start">
                          <Text
                            fontWeight="semibold"
                            fontSize={size === "sm" ? "sm" : "md"}
                          >
                            {shop.name}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {shop.categories?.length || 0} catégorie
                            {(shop.categories?.length || 0) !== 1 ? "s" : ""}
                          </Text>
                        </VStack>
                      </HStack>

                      {isSelected && (
                        <Badge
                          colorScheme={universe?.colorScheme}
                          variant="solid"
                        >
                          ✓ Active
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </VStack>
            ) : (
              <Box
                p={6}
                textAlign="center"
                bg="gray.50"
                borderRadius="md"
                _dark={{ bg: "gray.700" }}
              >
                <Text color="gray.600" fontSize="sm">
                  😔 Aucune boutique disponible dans cet univers
                </Text>
                <Text color="gray.500" fontSize="xs" mt={1}>
                  Veuillez choisir un autre univers
                </Text>
              </Box>
            )}
          </CardBody>
        </Card>
      )}

      {/* Résumé de la sélection */}
      {selectedShop && (
        <Card
          bg={`${
            universeOptions.find((u) => u.shopType === selectedShop.shopType)
              ?.colorScheme
          }.50`}
          borderColor={`${
            universeOptions.find((u) => u.shopType === selectedShop.shopType)
              ?.colorScheme
          }.200`}
          borderWidth="2px"
        >
          <CardBody>
            <VStack spacing={2} align="start">
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                🎯 Boutique sélectionnée
              </Text>
              <Divider />
              <HStack w="full" justify="space-between">
                <HStack>
                  <Text fontSize="lg">
                    {
                      universeOptions.find(
                        (u) => u.shopType === selectedShop.shopType
                      )?.icon
                    }
                  </Text>
                  <VStack spacing={0} align="start">
                    <Text fontWeight="bold">{selectedShop.name}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {
                        universeOptions.find(
                          (u) => u.shopType === selectedShop.shopType
                        )?.description
                      }
                    </Text>
                  </VStack>
                </HStack>
                <Badge
                  colorScheme={
                    universeOptions.find(
                      (u) => u.shopType === selectedShop.shopType
                    )?.colorScheme
                  }
                  variant="solid"
                  fontSize="xs"
                >
                  🚀 Prêt à administrer
                </Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default AdminDualSelector;
