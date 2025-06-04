import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { storeAnimations } from "../../../theme/components/shared";

const MotionBox = motion.create(Box);

export default function BeautySection() {
  const animation = storeAnimations.beautyShop;

  return (
    <MotionBox as="section" py={20} {...animation}>
      <Heading as="h2" size="xl" mb={6} color="pink.600" textAlign="center">
        Conseils beauté
      </Heading>

      <Text
        fontSize="lg"
        mb={12}
        color="gray.600"
        textAlign="center"
        maxW="2xl"
        mx="auto"
      >
        Des conseils personnalisés pour sublimer votre beauté naturelle.
      </Text>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={8}
        maxW="6xl"
        mx="auto"
      >
        <Box
          bg="pink.50"
          p={6}
          borderRadius="md"
          textAlign="center"
          border="1px solid"
          borderColor="pink.100"
        >
          <Heading size="md" mb={4} color="pink.500">
            Diagnostic personnalisé
          </Heading>
          <Text>Une analyse experte de votre peau pour des soins adaptés.</Text>
        </Box>

        <Box
          bg="pink.50"
          p={6}
          borderRadius="md"
          textAlign="center"
          border="1px solid"
          borderColor="pink.100"
        >
          <Heading size="md" mb={4} color="pink.500">
            Rituels de soin
          </Heading>
          <Text>
            Des protocoles de soin efficaces pour une peau rayonnante.
          </Text>
        </Box>

        <Box
          bg="pink.50"
          p={6}
          borderRadius="md"
          textAlign="center"
          border="1px solid"
          borderColor="pink.100"
        >
          <Heading size="md" mb={4} color="pink.500">
            Conseils experts
          </Heading>
          <Text>
            Les secrets de nos esthéticiennes pour une beauté durable.
          </Text>
        </Box>
      </Grid>
    </MotionBox>
  );
}
