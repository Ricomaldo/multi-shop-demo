import {
  Box,
  Link as ChakraLink,
  Container,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import {
  getUniverseColorScheme,
  getUniverseIcon,
} from "../../utils/universeMapping";
import OpeningBadge from "./OpeningBadge";

interface SharedFooterProps {
  shop: Shop;
}

export default function SharedFooter({ shop }: SharedFooterProps) {
  const colorScheme = getUniverseColorScheme(shop.shopType);
  const icon = getUniverseIcon(shop.shopType);

  return (
    <Box
      as="footer"
      w="full"
      bg={`${colorScheme}.50`}
      py={10}
      mt={16}
      borderTopWidth={1}
      borderColor={`${colorScheme}.100`}
    >
      <Container maxW="6xl">
        <VStack spacing={4} align="start">
          <HStack spacing={3}>
            <Text fontSize="2xl">{icon}</Text>
            <Text fontWeight="bold" fontSize="lg" color={`${colorScheme}.700`}>
              {shop.name}
            </Text>
          </HStack>
          <Text color="gray.600">{shop.description}</Text>
          <HStack spacing={8} flexWrap="wrap" pt={2}>
            {shop.address && (
              <HStack>
                <Text>📍</Text>
                <Text>{shop.address}</Text>
              </HStack>
            )}
            {shop.phone && (
              <HStack>
                <Text>📞</Text>
                <Text>{shop.phone}</Text>
              </HStack>
            )}
            {shop.email && (
              <HStack>
                <Text>✉️</Text>
                <ChakraLink
                  href={`mailto:${shop.email}`}
                  color={`${colorScheme}.600`}
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
                  color={`${colorScheme}.600`}
                >
                  {shop.website}
                </ChakraLink>
              </HStack>
            )}
            {shop.openingHours && (
              <HStack>
                <Text>🕒</Text>
                <OpeningBadge openingHours={shop.openingHours} size="md" />
              </HStack>
            )}
          </HStack>
          <Text color="gray.400" fontSize="sm" pt={4}>
            © {new Date().getFullYear()} {shop.name} — Tous droits réservés
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
