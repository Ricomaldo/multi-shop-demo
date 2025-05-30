import { Box, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { storeAnimations } from "../../../theme/components/shared";

const MotionBox = motion(Box);

export default function HerbSection() {
  const animation = storeAnimations.herb;

  return (
    <MotionBox as="section" py={16} {...animation}>
      <VStack spacing={12} align="stretch">
        <Box>
          <Heading as="h2" size="xl" mb={6} color="green.800">
            Vertus des plantes
          </Heading>

          <Text fontSize="lg" color="gray.600" maxW="3xl">
            Découvrez les bienfaits des plantes médicinales, sélectionnées avec
            soin pour leurs propriétés thérapeutiques.
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={8}
          bg="green.50"
          p={8}
          borderRadius="lg"
        >
          <Box>
            <Heading size="md" mb={4} color="green.700">
              Plantes du moment
            </Heading>
            <Text>
              Notre sélection de plantes de saison, cueillies au meilleur moment
              pour préserver leurs principes actifs.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={4} color="green.700">
              Conseils d'utilisation
            </Heading>
            <Text>
              Des recommandations d'experts pour une utilisation optimale des
              plantes médicinales.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={4} color="green.700">
              Préparations traditionnelles
            </Heading>
            <Text>
              Les méthodes ancestrales de préparation pour tirer le meilleur des
              plantes.
            </Text>
          </Box>

          <Box>
            <Heading size="md" mb={4} color="green.700">
              Bienfaits naturels
            </Heading>
            <Text>
              Les vertus thérapeutiques des plantes, validées par la tradition
              et la science.
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </MotionBox>
  );
}
