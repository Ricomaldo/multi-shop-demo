import { UniverseButtonDemo } from "@/components/demo/UniverseButtonDemo";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

/**
 * Page dédiée pour la démonstration du système émotionnel
 * Contient tous les tests et exemples d'interaction
 */
export default function EmotionalSystemDemo() {
  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="full" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Header avec navigation retour */}
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
          >
            <VStack spacing={4} align="start">
              <Button
                as={Link}
                to="/"
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                colorScheme="blue"
                size="sm"
                _hover={{
                  bg: "blue.50",
                  transform: "translateX(-2px)",
                }}
                transition="all 0.2s ease"
              >
                Retour à l'accueil
              </Button>

              <VStack spacing={2} align="start">
                <Heading size="xl" color="gray.800">
                  🎨 Démonstration du Système Émotionnel
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  Explorez les différentes personnalités, animations et
                  interactions de chaque univers de DemoForge.
                </Text>
              </VStack>
            </VStack>
          </Box>

          {/* Composant de demo */}
          <UniverseButtonDemo />
        </VStack>
      </Container>
    </Box>
  );
}
