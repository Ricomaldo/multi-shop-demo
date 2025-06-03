import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { storeAnimations } from "../../../theme/components/shared";

const MotionBox = motion.create(Box);

export default function BrewerySection() {
  const animation = storeAnimations.brewery;

  return (
    <MotionBox as="section" py={12} {...animation}>
      <Heading as="h2" size="xl" mb={6} color="orange.700">
        Nos brassages du moment
      </Heading>

      <Text fontSize="lg" mb={8} color="gray.600">
        Découvrez notre sélection de bières artisanales, brassées avec passion
        dans le respect des traditions.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Box bg="orange.50" p={6} borderRadius="lg">
          <Heading size="md" mb={4} color="orange.600">
            Processus de brassage
          </Heading>
          <Text>
            Suivez en direct l'évolution de nos brassins et découvrez les
            secrets de fabrication de nos bières artisanales.
          </Text>
        </Box>

        <Box bg="orange.50" p={6} borderRadius="lg">
          <Heading size="md" mb={4} color="orange.600">
            Notes de dégustation
          </Heading>
          <Text>
            Apprenez à reconnaître les arômes et saveurs qui font la signature
            de nos bières.
          </Text>
        </Box>
      </SimpleGrid>
    </MotionBox>
  );
}
