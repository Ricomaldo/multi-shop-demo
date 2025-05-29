import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const shopTypes = [
  {
    id: "brewery",
    name: "Brasserie",
    color: "brewery",
    description: "Houblon & Tradition",
  },
  {
    id: "teaShop",
    name: "Salon de Thé",
    color: "teaShop",
    description: "Les Jardins de Darjeeling",
  },
  {
    id: "beautyShop",
    name: "Institut Beauté",
    color: "beautyShop",
    description: "L'Écrin de Jade",
  },
  {
    id: "herbShop",
    name: "Herboristerie",
    color: "herbShop",
    description: "Herboristerie du Moulin Vert",
  },
];

export default function Home() {
  // const { getColorScheme } = useUniverse();
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
          {shopTypes.map((shop) => (
            <VStack
              key={shop.id}
              p={6}
              borderWidth={2}
              borderRadius="lg"
              borderColor={`${shop.color}.200`}
              bg={`${shop.color}.50`}
              spacing={4}
            >
              <Heading size="md" color={`${shop.color}.700`}>
                {shop.name}
              </Heading>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                {shop.description}
              </Text>
              <Button
                as={Link}
                to={`/store/${shop.id}`}
                colorScheme={shop.color}
                size="sm"
                w="full"
              >
                Voir la vitrine
              </Button>
            </VStack>
          ))}
        </SimpleGrid>

        <Box mt={8} p={4} bg="blue.50" borderRadius="md">
          <Button as={Link} to="/admin" colorScheme="blue" size="lg">
            🔧 Interface Administration
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
