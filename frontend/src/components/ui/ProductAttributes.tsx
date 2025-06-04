import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import type { ShopType } from "@/types";
import { getUniverseTokens } from "../../theme/universeTokens";

interface ProductAttributesProps {
  attributes: Record<string, unknown>;
  shopType: ShopType;
  size?: "sm" | "md";
}

export default function ProductAttributes({
  attributes,
  shopType,
  size = "md",
}: ProductAttributesProps) {
  const tokens = getUniverseTokens(shopType);

  const attributeEntries = Object.entries(attributes).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  if (attributeEntries.length === 0) {
    return null;
  }

  return (
    <Box
      p={size === "sm" ? 3 : 4}
      bg={tokens.colors[50]}
      borderRadius={tokens.borderRadius.base}
      borderWidth={1}
      borderColor={tokens.colors[200]}
    >
      <Text
        fontWeight={tokens.typography.fontWeight.bold}
        mb={3}
        color={tokens.colors[700]}
        fontSize={size === "sm" ? "sm" : "md"}
        fontFamily={tokens.typography.fontFamily.heading}
      >
        Caractéristiques
      </Text>
      <VStack spacing={size === "sm" ? 1 : 2} align="stretch">
        {attributeEntries.map(([key, value]) => (
          <HStack
            key={key}
            justify="space-between"
            fontSize={size === "sm" ? "xs" : "sm"}
          >
            <Text
              color={tokens.colors[600]}
              fontFamily={tokens.typography.fontFamily.body}
              textTransform="capitalize"
            >
              {key.replace(/_/g, " ")}
            </Text>
            <Text
              fontWeight={tokens.typography.fontWeight.normal}
              color={tokens.colors[800]}
              fontFamily={tokens.typography.fontFamily.body}
            >
              {String(value)}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
