import type { Shop } from "@/types";
import { getUniverseTokens } from "@/theme/universeTokens";
import {
  Box,
  Link as ChakraLink,
  Container,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

interface StoreFooterProps {
  shop: Shop;
}

export default function StoreFooter({ shop }: StoreFooterProps) {
  const tokens = getUniverseTokens(shop.shopType);

  return (
    <Box
      as="footer"
      w="full"
      bg={tokens.colors[50]}
      py={10}
      mt={16}
      borderTopWidth={1}
      borderColor={tokens.colors[100]}
    >
      <Container maxW="6xl">
        <VStack spacing={4} align="start">
          <HStack spacing={3}>
            <Text fontSize="2xl">{tokens.meta.icon}</Text>
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={tokens.colors[700]}
              fontFamily={tokens.typography.fontFamily.heading}
            >
              {shop.name}
            </Text>
          </HStack>
          <Text
            color={tokens.colors[600]}
            fontFamily={tokens.typography.fontFamily.body}
          >
            {shop.description || tokens.meta.description}
          </Text>
          <HStack spacing={8} flexWrap="wrap" pt={2}>
            {shop.address && (
              <HStack>
                <Text>📍</Text>
                <Text color={tokens.colors[600]}>{shop.address}</Text>
              </HStack>
            )}
            {shop.phone && (
              <HStack>
                <Text>📞</Text>
                <Text color={tokens.colors[600]}>{shop.phone}</Text>
              </HStack>
            )}
            {shop.email && (
              <HStack>
                <Text>✉️</Text>
                <ChakraLink
                  href={`mailto:${shop.email}`}
                  color={tokens.colors[600]}
                  _hover={{ color: tokens.colors[700] }}
                >
                  {shop.email}
                </ChakraLink>
              </HStack>
            )}
            {shop.website && (
              <HStack>
                <Text>🌐</Text>
                <ChakraLink
                  href={shop.website}
                  isExternal
                  color={tokens.colors[600]}
                  _hover={{ color: tokens.colors[700] }}
                >
                  {shop.website}
                </ChakraLink>
              </HStack>
            )}
          </HStack>
          <Text
            color={tokens.colors[400]}
            fontSize="sm"
            pt={4}
            fontFamily={tokens.typography.fontFamily.body}
          >
            © {new Date().getFullYear()} {shop.name} — Tous droits réservés
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
