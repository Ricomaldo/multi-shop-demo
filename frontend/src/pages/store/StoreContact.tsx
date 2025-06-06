import { StorePageWrapper } from "@/components/features/store/content/StorePageWrapper";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useStorePage } from "../../hooks";
import { getUniverseTokens } from "../../theme/universeTokens";

export default function StoreContact() {
  const { currentShop } = useStorePage();

  if (!currentShop) return null;

  const tokens = getUniverseTokens(currentShop.shopType);

  return (
    <StorePageWrapper headerVariant="nav-only" contentWrapper="container">
      <Box py={tokens.spacing.section}>
        <VStack spacing={tokens.spacing.section} align="stretch">
          <Heading
            as="h1"
            size="xl"
            textAlign="center"
            color={tokens.colors[800]}
            fontFamily={tokens.typography.fontFamily.heading}
            mb={tokens.spacing.component}
          >
            Nous contacter
          </Heading>

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={tokens.spacing.section}
          >
            <Box
              p={tokens.spacing.section}
              bg={tokens.colors[50]}
              borderRadius={tokens.borderRadius.lg}
              borderWidth={1}
              borderColor={tokens.colors[200]}
            >
              <VStack spacing={tokens.spacing.component} align="start">
                <Heading
                  size="md"
                  color={tokens.colors[700]}
                  fontFamily={tokens.typography.fontFamily.heading}
                >
                  Informations de contact
                </Heading>

                {currentShop.address && (
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color={tokens.colors[600]} />
                    <Text color={tokens.colors[600]}>
                      {currentShop.address}
                    </Text>
                  </HStack>
                )}

                {currentShop.phone && (
                  <HStack>
                    <Icon as={FaPhone} color={tokens.colors[600]} />
                    <Text color={tokens.colors[600]}>{currentShop.phone}</Text>
                  </HStack>
                )}

                {currentShop.email && (
                  <HStack>
                    <Icon as={FaEnvelope} color={tokens.colors[600]} />
                    <Link
                      href={`mailto:${currentShop.email}`}
                      color={tokens.colors[600]}
                      _hover={{ color: tokens.colors[700] }}
                    >
                      {currentShop.email}
                    </Link>
                  </HStack>
                )}

                {currentShop.website && (
                  <HStack>
                    <Icon as={FaGlobe} color={tokens.colors[600]} />
                    <Link
                      href={currentShop.website}
                      isExternal
                      color={tokens.colors[600]}
                      _hover={{ color: tokens.colors[700] }}
                    >
                      {currentShop.website}
                    </Link>
                  </HStack>
                )}
              </VStack>
            </Box>

            <Box
              p={tokens.spacing.section}
              bg="white"
              borderRadius={tokens.borderRadius.lg}
              borderWidth={1}
              borderColor={tokens.colors[200]}
              shadow="sm"
            >
              <VStack spacing={tokens.spacing.component}>
                <Heading
                  size="md"
                  color={tokens.colors[700]}
                  fontFamily={tokens.typography.fontFamily.heading}
                >
                  Envoyez-nous un message
                </Heading>

                <Button
                  colorScheme={tokens.meta.colorScheme}
                  size="lg"
                  w="full"
                  borderRadius={tokens.borderRadius.base}
                  fontFamily={tokens.typography.fontFamily.body}
                  fontWeight={tokens.typography.fontWeight.bold}
                >
                  Nous contacter
                </Button>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>
    </StorePageWrapper>
  );
}
