import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <VStack spacing={8} textAlign="center" p={8}>
        <Heading size="4xl" color="gray.600">
          404
        </Heading>
        <Heading size="lg" color="gray.700">
          Page introuvable
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="md">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </Text>
        <VStack spacing={4}>
          <Button as={Link} to="/" colorScheme="blue" size="lg">
            Retour à l'accueil
          </Button>
          <Button as={Link} to="/admin" variant="outline" size="md">
            Accès administration
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
