import { getUniverseTokens } from "@/theme/universeTokens";
import type { Product, Shop } from "@/types";
import { getAllFormattedAttributes } from "@/utils/productAttributes";
import {
  Box,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

interface ProductAttributesProps {
  product: Product;
  shop: Shop;
  size?: "sm" | "md" | "lg";
  variant?: "card" | "detail";
}

export default function ProductAttributes({
  product,
  shop,
  size = "md",
  variant = "card",
}: ProductAttributesProps) {
  const textColor = useColorModeValue("gray.600", "gray.300");

  // Vérification de sécurité plus robuste
  if (!product || !shop || !shop.shopType) {
    return null;
  }

  const tokens = getUniverseTokens(shop.shopType);
  const allAttributes = getAllFormattedAttributes(product, shop);

  if (allAttributes.length === 0) {
    return null;
  }

  // Style pour la variante "card"
  if (variant === "card") {
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
          {allAttributes.map((attr, idx) => (
            <Box key={attr.label + String(attr.value) + idx}>
              <Text
                fontSize={size === "sm" ? "xs" : "sm"}
                color={tokens.colors[600]}
                fontFamily={tokens.typography.fontFamily.body}
              >
                {attr.label}
              </Text>
              <Text
                fontSize={size === "sm" ? "sm" : "md"}
                fontWeight={tokens.typography.fontWeight.bold}
                color={tokens.colors[800]}
                fontFamily={tokens.typography.fontFamily.body}
              >
                {attr.value}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  // Style pour la variante "detail" (comme dans SharedProductDetailView)
  return (
    <SimpleGrid columns={2} spacing={4}>
      {allAttributes.map((attr, idx) => (
        <Box key={attr.label + String(attr.value) + idx}>
          <Text
            fontSize="sm"
            color={textColor}
            fontWeight="medium"
            fontFamily={tokens.typography.fontFamily.body}
          >
            {attr.label}
          </Text>
          <Text
            fontSize="md"
            fontWeight={tokens.typography.fontWeight.bold}
            color={tokens.colors[700]}
            fontFamily={tokens.typography.fontFamily.body}
          >
            {attr.value}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
