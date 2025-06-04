import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import type { Shop, ShopType } from "../../../../shared/types";
import { StoreHeader, StoreLayout } from "../../components/store";
import { useShopData } from "../../hooks";
import { getUniverseTokens } from "../../theme/universeTokens";

export default function StoreContact() {
  const { shopType } = useParams<{ shopType: ShopType }>();
  const navigate = useNavigate();
  const { shops, loading } = useShopData();

  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [availableShops, setAvailableShops] = useState<Shop[]>([]);

  useEffect(() => {
    if (loading || !shopType) return;

    const shopsOfType = shops.filter((shop) => shop.shopType === shopType);
    setAvailableShops(shopsOfType);

    if (shopsOfType.length > 0) {
      setCurrentShop(shopsOfType[0]);
    } else {
      navigate("/");
    }
  }, [shops, shopType, loading, navigate]);

  if (loading || !currentShop) {
    return <div>Chargement...</div>;
  }

  const handleShopChange = (shop: Shop) => {
    setCurrentShop(shop);
  };

  const tokens = getUniverseTokens(currentShop.shopType);

  return (
    <StoreLayout shop={currentShop}>
      <StoreHeader
        shop={currentShop}
        availableShops={availableShops}
        onShopChange={handleShopChange}
        variant="nav-only"
      />

      <Container maxW="4xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading
            as="h1"
            size="xl"
            textAlign="center"
            color={tokens.colors[800]}
            fontFamily={tokens.typography.fontFamily.heading}
          >
            Nous contacter
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box
              p={6}
              bg={tokens.colors[50]}
              borderRadius={tokens.borderRadius.lg}
              borderWidth={1}
              borderColor={tokens.colors[200]}
            >
              <VStack spacing={4} align="start">
                <Heading
                  size="md"
                  color={tokens.colors[700]}
                  fontFamily={tokens.typography.fontFamily.heading}
                >
                  Informations de contact
                </Heading>

                {currentShop.address && (
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color={tokens.colors[600]} />
                    <Text color={tokens.colors[600]}>
                      {currentShop.address}
                    </Text>
                  </HStack>
                )}

                {currentShop.phone && (
                  <HStack>
                    <Icon as={FaPhone} color={tokens.colors[600]} />
                    <Text color={tokens.colors[600]}>{currentShop.phone}</Text>
                  </HStack>
                )}

                {currentShop.email && (
                  <HStack>
                    <Icon as={FaEnvelope} color={tokens.colors[600]} />
                    <Link
                      href={`mailto:${currentShop.email}`}
                      color={tokens.colors[600]}
                      _hover={{ color: tokens.colors[700] }}
                    >
                      {currentShop.email}
                    </Link>
                  </HStack>
                )}

                {currentShop.website && (
                  <HStack>
                    <Icon as={FaGlobe} color={tokens.colors[600]} />
                    <Link
                      href={currentShop.website}
                      isExternal
                      color={tokens.colors[600]}
                      _hover={{ color: tokens.colors[700] }}
                    >
                      {currentShop.website}
                    </Link>
                  </HStack>
                )}
              </VStack>
            </Box>

            <Box
              p={6}
              bg="white"
              borderRadius={tokens.borderRadius.lg}
              borderWidth={1}
              borderColor={tokens.colors[200]}
              shadow="sm"
            >
              <VStack spacing={4}>
                <Heading
                  size="md"
                  color={tokens.colors[700]}
                  fontFamily={tokens.typography.fontFamily.heading}
                >
                  Envoyez-nous un message
                </Heading>

                <Button
                  colorScheme={tokens.meta.colorScheme}
                  size="lg"
                  w="full"
                  borderRadius={tokens.borderRadius.base}
                  fontFamily={tokens.typography.fontFamily.body}
                  fontWeight={tokens.typography.fontWeight.bold}
                >
                  Nous contacter
                </Button>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </StoreLayout>
  );
}
