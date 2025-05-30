import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import type { Shop } from "../../../../shared/types";
import type { UniverseType } from "../../contexts/UniverseContext";
import {
  getUniverseColorScheme,
  getUniverseIcon,
  getUniverseName,
} from "../../utils/universeMapping";

interface AdminShopsManagerProps {
  selectedUniverse: UniverseType;
  shops: Shop[];
  selectedShopId?: string | null;
  onShopSelect: (shop: Shop) => void;
  onCreateShop?: () => void;
}

/**
 * Page de gestion des boutiques pour un univers sélectionné
 * Affiche la liste des boutiques de l'univers avec selection et actions
 */
const AdminShopsManager: React.FC<AdminShopsManagerProps> = ({
  selectedUniverse,
  shops,
  selectedShopId,
  onShopSelect,
  onCreateShop,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const colorScheme = getUniverseColorScheme(selectedUniverse);
  const universeIcon = getUniverseIcon(selectedUniverse);
  const universeName = getUniverseName(selectedUniverse);

  // Filtrer les boutiques par univers
  const universeShops = shops.filter(
    (shop) => shop.shopType === selectedUniverse
  );

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* En-tête */}
        <Box>
          <HStack spacing={3} mb={2}>
            <Text fontSize="2xl">{universeIcon}</Text>
            <Heading size="lg" color={`${colorScheme}.600`}>
              Gestion des boutiques - {universeName}
            </Heading>
          </HStack>
          <Text color="gray.600">
            Sélectionnez une boutique pour gérer ses produits et paramètres
          </Text>
        </Box>

        {/* Actions */}
        <HStack justify="space-between">
          <Badge colorScheme={colorScheme} px={3} py={1}>
            {universeShops.length} boutique
            {universeShops.length !== 1 ? "s" : ""} {universeName.toLowerCase()}
          </Badge>
          {onCreateShop && (
            <Button colorScheme={colorScheme} size="sm" onClick={onCreateShop}>
              + Créer une boutique
            </Button>
          )}
        </HStack>

        {/* Grille des boutiques */}
        {universeShops.length > 0 ? (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={4}
          >
            {universeShops.map((shop) => {
              const isSelected = selectedShopId === shop.id;
              return (
                <Card
                  key={shop.id}
                  bg={cardBg}
                  borderColor={isSelected ? `${colorScheme}.300` : borderColor}
                  borderWidth={isSelected ? "2px" : "1px"}
                  cursor="pointer"
                  onClick={() => onShopSelect(shop)}
                  _hover={{
                    borderColor: `${colorScheme}.300`,
                    shadow: "md",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  <CardHeader pb={3}>
                    <HStack justify="space-between">
                      <HStack spacing={2}>
                        <Text fontSize="lg">{universeIcon}</Text>
                        <Text fontWeight="bold" color={`${colorScheme}.600`}>
                          {shop.name}
                        </Text>
                      </HStack>
                      {isSelected && (
                        <Badge colorScheme={colorScheme} variant="solid">
                          Sélectionnée
                        </Badge>
                      )}
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={2} align="start">
                      <Text fontSize="sm" color="gray.600">
                        {shop.categories?.length || 0} catégorie
                        {(shop.categories?.length || 0) !== 1 ? "s" : ""}
                      </Text>
                      <Text fontSize="xs" color="gray.500" noOfLines={2}>
                        Boutique {universeName.toLowerCase()} - Cliquez pour
                        gérer
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </Grid>
        ) : (
          <Card
            bg={`${colorScheme}.50`}
            borderColor={`${colorScheme}.200`}
            borderWidth="1px"
          >
            <CardBody textAlign="center" py={8}>
              <VStack spacing={3}>
                <Text fontSize="3xl">{universeIcon}</Text>
                <Text
                  fontSize="lg"
                  fontWeight="medium"
                  color={`${colorScheme}.700`}
                >
                  Aucune boutique {universeName.toLowerCase()}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Créez votre première boutique pour commencer
                </Text>
                {onCreateShop && (
                  <Button
                    colorScheme={colorScheme}
                    onClick={onCreateShop}
                    mt={2}
                  >
                    Créer ma première boutique
                  </Button>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
};

export default AdminShopsManager;
