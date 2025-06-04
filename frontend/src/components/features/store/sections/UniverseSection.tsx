import { useShopContent } from "@/hooks";
import { storeAnimations } from "@/theme/components/shared";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { ShopType } from "@/types";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

interface UniverseSectionProps {
  shopType: ShopType;
}

export default function UniverseSection({ shopType }: UniverseSectionProps) {
  const animation = storeAnimations[shopType as keyof typeof storeAnimations];
  const { mainSection } = useShopContent(shopType);
  const tokens = getUniverseTokens(shopType);

  if (!mainSection) return null;

  return (
    <MotionBox as="section" py={12} {...animation}>
      <Heading
        as="h2"
        size="xl"
        mb={6}
        color={tokens.colors[700]}
        fontFamily={tokens.typography.fontFamily.heading}
      >
        {mainSection.title}
      </Heading>

      <Text
        fontSize="lg"
        mb={8}
        color="gray.600"
        fontFamily={tokens.typography.fontFamily.body}
      >
        {mainSection.description}
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {mainSection.cards.map((card, index) => (
          <Box
            key={index}
            bg={tokens.colors[50]}
            p={6}
            borderRadius={tokens.borderRadius.lg}
            borderWidth={1}
            borderColor={tokens.colors[200]}
          >
            <Heading
              size="md"
              mb={4}
              color={tokens.colors[600]}
              fontFamily={tokens.typography.fontFamily.heading}
            >
              {card.title}
            </Heading>
            <Text fontFamily={tokens.typography.fontFamily.body}>
              {card.content}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </MotionBox>
  );
}
