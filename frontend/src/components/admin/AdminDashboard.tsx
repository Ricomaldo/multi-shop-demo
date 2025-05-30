import { WarningIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import type { Product, Shop } from "../../../../shared/types";
import {
  hasLowStock,
  isBeautyShopAttributes,
  isBreweryAttributes,
  isHerbShopAttributes,
  isOutOfStock,
  isTeaShopAttributes,
  parseProductAttributes,
} from "../../utils/productAttributes";
import { type UniverseIcon } from "../../utils/universeMapping";

interface AdminDashboardProps {
  shops: Shop[];
  products: Product[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  shops,
  products,
}) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Calculs des statistiques générales
  const totalProducts = products.length;
  const lowStockProducts = products.filter(hasLowStock).length;
  const outOfStockProducts = products.filter(isOutOfStock).length;
  const averagePrice =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0;

  // Statistiques par type de boutique
  const getShopTypeStats = (shopType: string) => {
    const shopProducts = products.filter((p) => {
      const shop = shops.find((s) => s.id === p.shopId);
      return shop?.shopType === shopType;
    });

    if (shopProducts.length === 0) return null;

    const stats = {
      totalProducts: shopProducts.length,
      averagePrice:
        shopProducts.reduce((sum, p) => sum + p.price, 0) / shopProducts.length,
      lowStock: shopProducts.filter(hasLowStock).length,
      outOfStock: shopProducts.filter(isOutOfStock).length,
    };

    // Statistiques spécialisées selon le type
    switch (shopType) {
      case "brewery": {
        const breweryProducts = shopProducts
          .map((p) => ({
            product: p,
            attributes: parseProductAttributes(p),
          }))
          .filter(
            ({ attributes }) => attributes && isBreweryAttributes(attributes)
          );

        if (breweryProducts.length > 0) {
          const avgAlcohol =
            breweryProducts.reduce(
              (sum, { attributes }) =>
                sum +
                (isBreweryAttributes(attributes!)
                  ? attributes.degre_alcool
                  : 0),
              0
            ) / breweryProducts.length;

          const hopTypes = breweryProducts.reduce((acc, { attributes }) => {
            if (isBreweryAttributes(attributes!)) {
              const hop = attributes.type_houblon;
              acc[hop] = (acc[hop] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          const mostPopularHop =
            Object.entries(hopTypes).sort(([, a], [, b]) => b - a)[0]?.[0] ||
            "N/A";

          return {
            ...stats,
            specialized: {
              avgAlcohol: avgAlcohol.toFixed(1),
              mostPopularHop,
              hopVarieties: Object.keys(hopTypes).length,
            },
          };
        }
        break;
      }

      case "teaShop": {
        const teaProducts = shopProducts
          .map((p) => ({
            product: p,
            attributes: parseProductAttributes(p),
          }))
          .filter(
            ({ attributes }) => attributes && isTeaShopAttributes(attributes)
          );

        if (teaProducts.length > 0) {
          const origins = teaProducts.reduce((acc, { attributes }) => {
            if (isTeaShopAttributes(attributes!)) {
              const origin = attributes.origine_plantation;
              acc[origin] = (acc[origin] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          const topOrigin =
            Object.entries(origins).sort(([, a], [, b]) => b - a)[0]?.[0] ||
            "N/A";

          return {
            ...stats,
            specialized: {
              topOrigin,
              originVarieties: Object.keys(origins).length,
              premiumTeas: teaProducts.filter(
                ({ attributes }) =>
                  isTeaShopAttributes(attributes!) &&
                  attributes.grade_qualite.includes("FTGFOP")
              ).length,
            },
          };
        }
        break;
      }

      case "beautyShop": {
        const beautyProducts = shopProducts
          .map((p) => ({
            product: p,
            attributes: parseProductAttributes(p),
          }))
          .filter(
            ({ attributes }) => attributes && isBeautyShopAttributes(attributes)
          );

        if (beautyProducts.length > 0) {
          const bioProducts = beautyProducts.filter(
            ({ attributes }) =>
              isBeautyShopAttributes(attributes!) &&
              attributes.certification_bio
          ).length;

          const avgVolume =
            beautyProducts.reduce(
              (sum, { attributes }) =>
                sum +
                (isBeautyShopAttributes(attributes!)
                  ? attributes.contenance_ml
                  : 0),
              0
            ) / beautyProducts.length;

          return {
            ...stats,
            specialized: {
              bioPercentage: (
                (bioProducts / beautyProducts.length) *
                100
              ).toFixed(0),
              avgVolume: avgVolume.toFixed(0),
              bioProducts,
            },
          };
        }
        break;
      }

      case "herbShop": {
        const herbProducts = shopProducts
          .map((p) => ({
            product: p,
            attributes: parseProductAttributes(p),
          }))
          .filter(
            ({ attributes }) => attributes && isHerbShopAttributes(attributes)
          );

        if (herbProducts.length > 0) {
          const certifications = herbProducts.reduce((acc, { attributes }) => {
            if (isHerbShopAttributes(attributes!)) {
              const cert = attributes.certification;
              acc[cert] = (acc[cert] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          const topCertification =
            Object.entries(certifications).sort(
              ([, a], [, b]) => b - a
            )[0]?.[0] || "N/A";

          return {
            ...stats,
            specialized: {
              topCertification,
              certificationTypes: Object.keys(certifications).length,
              organicProducts: herbProducts.filter(
                ({ attributes }) =>
                  isHerbShopAttributes(attributes!) &&
                  attributes.certification.includes("Biologique")
              ).length,
            },
          };
        }
        break;
      }
    }

    return stats;
  };

  // Icônes par type de boutique
  const getShopIcon = (shopType: string): UniverseIcon => {
    switch (shopType) {
      case "brewery":
        return { emoji: "🍺", label: "bière" };
      case "teaShop":
        return { emoji: "🍵", label: "thé" };
      case "beautyShop":
        return { emoji: "💄", label: "beauté" };
      case "herbShop":
        return { emoji: "🌿", label: "herbes" };
      default:
        return { emoji: "🛍️", label: "boutique" };
    }
  };

  const getShopTypeName = (shopType: string) => {
    switch (shopType) {
      case "brewery":
        return "Brasseries";
      case "teaShop":
        return "Salons de thé";
      case "beautyShop":
        return "Instituts beauté";
      case "herbShop":
        return "Herboristeries";
      default:
        return "Boutiques";
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Statistiques générales */}
      <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
        <CardHeader>
          <Heading size="md">
            <span role="img" aria-label="statistiques">
              📊
            </span>{" "}
            Vue d'ensemble DemoForge
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Stat>
              <StatLabel>Total produits</StatLabel>
              <StatNumber>{totalProducts}</StatNumber>
              <StatHelpText>Tous univers confondus</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Prix moyen</StatLabel>
              <StatNumber>{averagePrice.toFixed(2)} €</StatNumber>
              <StatHelpText>Toutes boutiques</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Stock faible</StatLabel>
              <StatNumber color="orange.500">{lowStockProducts}</StatNumber>
              <StatHelpText>
                <Icon as={WarningIcon} color="orange.500" mr={1} />
                Moins de 10 unités
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Ruptures</StatLabel>
              <StatNumber color="red.500">{outOfStockProducts}</StatNumber>
              <StatHelpText>
                <Icon as={WarningIcon} color="red.500" mr={1} />
                Stock épuisé
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Statistiques par univers */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {["brewery", "teaShop", "beautyShop", "herbShop"].map((shopType) => {
          const stats = getShopTypeStats(shopType);
          if (!stats) return null;

          return (
            <Card
              key={shopType}
              bg={cardBg}
              borderColor={borderColor}
              borderWidth="1px"
            >
              <CardHeader>
                <HStack>
                  <Text fontSize="2xl">
                    <span role="img" aria-label={getShopIcon(shopType).label}>
                      {getShopIcon(shopType).emoji}
                    </span>
                  </Text>
                  <Heading size="md">{getShopTypeName(shopType)}</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {/* Stats de base */}
                  <SimpleGrid columns={2} spacing={4}>
                    <Stat size="sm">
                      <StatLabel>Produits</StatLabel>
                      <StatNumber>{stats.totalProducts}</StatNumber>
                    </Stat>
                    <Stat size="sm">
                      <StatLabel>Prix moyen</StatLabel>
                      <StatNumber>{stats.averagePrice.toFixed(2)} €</StatNumber>
                    </Stat>
                  </SimpleGrid>

                  {/* Alertes stock */}
                  {(stats.lowStock > 0 || stats.outOfStock > 0) && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Alertes stock :
                      </Text>
                      <HStack spacing={2}>
                        {stats.outOfStock > 0 && (
                          <Badge colorScheme="red" variant="solid">
                            {stats.outOfStock} rupture
                            {stats.outOfStock > 1 ? "s" : ""}
                          </Badge>
                        )}
                        {stats.lowStock > 0 && (
                          <Badge colorScheme="orange" variant="solid">
                            {stats.lowStock} stock
                            {stats.lowStock > 1 ? "s" : ""} faible
                            {stats.lowStock > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </HStack>
                    </Box>
                  )}

                  <Divider />

                  {/* Stats spécialisées */}
                  {"specialized" in stats && stats.specialized && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Métriques métier :
                      </Text>
                      <VStack spacing={2} align="stretch">
                        {shopType === "brewery" &&
                          "avgAlcohol" in stats.specialized && (
                            <>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Degré moyen</Text>
                                <Badge>{stats.specialized.avgAlcohol}°</Badge>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Houblon populaire</Text>
                                <Badge variant="outline">
                                  {stats.specialized.mostPopularHop}
                                </Badge>
                              </HStack>
                            </>
                          )}

                        {shopType === "teaShop" &&
                          "topOrigin" in stats.specialized && (
                            <>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Origine principale</Text>
                                <Badge>{stats.specialized.topOrigin}</Badge>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Thés premium</Text>
                                <Badge colorScheme="green">
                                  {stats.specialized.premiumTeas}
                                </Badge>
                              </HStack>
                            </>
                          )}

                        {shopType === "beautyShop" &&
                          "bioPercentage" in stats.specialized && (
                            <>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Produits bio</Text>
                                <Badge colorScheme="green">
                                  {stats.specialized.bioPercentage}%
                                </Badge>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Volume moyen</Text>
                                <Badge>{stats.specialized.avgVolume}ml</Badge>
                              </HStack>
                            </>
                          )}

                        {shopType === "herbShop" &&
                          "topCertification" in stats.specialized && (
                            <>
                              <HStack justify="space-between">
                                <Text fontSize="sm">
                                  Certification principale
                                </Text>
                                <Badge variant="outline">
                                  {stats.specialized.topCertification}
                                </Badge>
                              </HStack>
                              <HStack justify="space-between">
                                <Text fontSize="sm">Produits bio</Text>
                                <Badge colorScheme="green">
                                  {stats.specialized.organicProducts}
                                </Badge>
                              </HStack>
                            </>
                          )}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};
