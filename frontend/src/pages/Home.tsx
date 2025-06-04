import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getUniverseTokens, type ShopType } from "../theme/universeTokens";

// Configuration des univers pour la page d'accueil
const universeConfigs: Array<{
  id: ShopType;
  description: string;
}> = [
  {
    id: "brewery",
    description: "Brasserie artisanale authentique",
  },
  {
    id: "teaShop",
    description: "Salon de thé zen et raffinement",
  },
  {
    id: "beautyShop",
    description: "Institut de beauté premium",
  },
  {
    id: "herbShop",
    description: "Plantes médicinales bio et naturelles",
  },
];

export default function Home() {
  return (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={8}>
        <Heading size="xl" textAlign="center">
          🛍️ DemoForge - Vitrine Multi-Boutiques
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          Démonstration interactive de solutions e-commerce sur-mesure
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
          {universeConfigs.map((universe) => {
            const tokens = getUniverseTokens(universe.id);

            return (
              <VStack
                key={universe.id}
                p={6}
                borderWidth={2}
                borderRadius={tokens.borderRadius.lg}
                borderColor={tokens.colors[200]}
                bg={tokens.colors[50]}
                spacing={4}
                transition={tokens.animations.transition}
                _hover={{
                  transform: tokens.animations.enableOnMobile
                    ? "none"
                    : "translateY(-2px)",
                  boxShadow: "lg",
                  borderColor: tokens.colors[300],
                }}
              >
                <VStack spacing={2}>
                  <Text fontSize="3xl">{tokens.meta.icon}</Text>
                  <Heading
                    size="md"
                    color={tokens.colors[700]}
                    fontFamily={tokens.typography.fontFamily.heading}
                    fontWeight={tokens.typography.fontWeight.bold}
                  >
                    {tokens.meta.displayName}
                  </Heading>
                </VStack>
                <Text
                  fontSize="sm"
                  textAlign="center"
                  color={tokens.colors[600]}
                  fontFamily={tokens.typography.fontFamily.body}
                >
                  {tokens.meta.description}
                </Text>
                <Button
                  as={Link}
                  to={`/store/${universe.id}`}
                  colorScheme={tokens.meta.colorScheme}
                  size="sm"
                  w="full"
                  borderRadius={tokens.borderRadius.base}
                  fontFamily={tokens.typography.fontFamily.body}
                  fontWeight={tokens.typography.fontWeight.bold}
                  transition={tokens.animations.transition}
                  _hover={{
                    transform: tokens.animations.enableOnMobile
                      ? "none"
                      : "scale(1.05)",
                  }}
                >
                  Voir la vitrine
                </Button>
              </VStack>
            );
          })}
        </SimpleGrid>

        <Box
          mt={8}
          p={6}
          bg="blue.50"
          borderRadius="lg"
          borderWidth={1}
          borderColor="blue.200"
        >
          <Button
            as={Link}
            to="/admin"
            colorScheme="blue"
            size="lg"
            fontSize="lg"
            fontWeight="bold"
          >
            🔧 Interface Administration
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
