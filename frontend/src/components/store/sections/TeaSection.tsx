import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { storeAnimations } from "../../../theme/components/shared";

const MotionBox = motion.create(Box);

export default function TeaSection() {
  const animation = storeAnimations.teaShop;

  return (
    <MotionBox as="section" py={16} {...animation}>
      <Heading
        as="h2"
        size="xl"
        mb={8}
        color="green.700"
        fontFamily="serif"
        textAlign="center"
      >
        Rituels du thé
      </Heading>

      <Text
        fontSize="lg"
        mb={12}
        color="gray.600"
        textAlign="center"
        maxW="2xl"
        mx="auto"
      >
        Explorez l'art millénaire de la préparation du thé à travers nos
        cérémonies traditionnelles.
      </Text>

      <Stack spacing={8} align="center">
        <Box
          bg="green.50"
          p={8}
          borderRadius="sm"
          maxW="3xl"
          textAlign="center"
        >
          <Heading size="md" mb={4} color="green.600" fontFamily="serif">
            L'art de la dégustation
          </Heading>
          <Text>
            Apprenez à reconnaître les subtilités des grands thés et à apprécier
            leurs notes uniques.
          </Text>
        </Box>

        <Box
          bg="green.50"
          p={8}
          borderRadius="sm"
          maxW="3xl"
          textAlign="center"
        >
          <Heading size="md" mb={4} color="green.600" fontFamily="serif">
            Cérémonie du thé
          </Heading>
          <Text>
            Découvrez les gestes ancestraux et le sens profond de la cérémonie
            du thé.
          </Text>
        </Box>
      </Stack>
    </MotionBox>
  );
}
