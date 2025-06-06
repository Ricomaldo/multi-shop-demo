import { useUniverseSignature } from "@/hooks/useUniverseSignature";
import { getUniverseTokens } from "@/theme/universeTokens";
import type { Shop } from "@/types";
import {
  Badge,
  Box,
  Button,
  Link as ChakraLink,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import {
  FaClock,
  FaEnvelope,
  FaGlobe,
  FaHeart,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface StoreFooterProps {
  shop: Shop;
}

/**
 * 🎨 StoreFooter - Footers magnifiques différenciés par shopType
 * ✅ Aussi beaux et personnalisés que les headers
 * ✅ Design unique adapté à chaque univers
 * ✅ Animations et styling premium par shopType
 */
export default function StoreFooter({ shop }: StoreFooterProps) {
  const tokens = getUniverseTokens(shop.shopType);
  const signature = useUniverseSignature(shop.shopType);

  // 🆕 RESPONSIVE VALUES
  const sectionSpacing = useBreakpointValue({ base: 4, md: 6 });

  // Navigation links pour le footer
  const footerLinks = [
    { label: "Accueil", path: `/store/${shop.shopType}` },
    { label: "Catalogue", path: `/store/${shop.shopType}/products` },
    { label: "Contact", path: `/store/${shop.shopType}/contact` },
  ];

  // Styles spécifiques par shopType - Design premium
  const getFooterStyles = () => {
    switch (shop.shopType) {
      case "brewery":
        // Footer industriel - Robuste, avec caractère
        return {
          bg: `linear-gradient(180deg, ${tokens.colors[900]} 0%, ${tokens.colors[800]} 100%)`,
          color: "white",
          borderTop: `4px solid ${tokens.colors[600]}`,
          patternOverlay: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${tokens.colors[700]}20 10px, ${tokens.colors[700]}20 20px)`,
            pointerEvents: "none" as const,
          },
          sectionStyle: {
            bg: `${tokens.colors[800]}60`,
            borderRadius: tokens.borderRadius.base,
            border: `1px solid ${tokens.colors[700]}`,
            backdropFilter: "blur(10px)",
          },
          linkStyle: {
            color: tokens.colors[200],
            fontWeight: tokens.typography.fontWeight.heavy,
            textTransform: "uppercase" as const,
            letterSpacing: "wide",
            _hover: { color: tokens.colors[400], transform: "none" },
          },
          iconColor: tokens.colors[400],
          badgeScheme: "orange",
        };

      case "teaShop":
        // Footer zen - Élégant, apaisant
        return {
          bg: `linear-gradient(180deg, ${tokens.colors[50]} 0%, ${tokens.colors[100]} 100%)`,
          color: tokens.colors[800],
          borderTop: `2px solid ${tokens.colors[300]}`,
          patternOverlay: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 80%, ${tokens.colors[200]}30 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${tokens.colors[300]}20 0%, transparent 50%)`,
            pointerEvents: "none" as const,
          },
          sectionStyle: {
            bg: "white",
            borderRadius: tokens.borderRadius.xl,
            border: `1px solid ${tokens.colors[200]}`,
            shadow: "lg",
            backdropFilter: "blur(20px)",
          },
          linkStyle: {
            color: tokens.colors[600],
            fontFamily: tokens.typography.fontFamily.heading,
            _hover: {
              color: tokens.colors[700],
              transform: "translateY(-2px)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          iconColor: tokens.colors[500],
          badgeScheme: "green",
        };

      case "beautyShop":
        // Footer premium - Sophistiqué, moderne
        return {
          bg: `linear-gradient(135deg, ${tokens.colors[900]} 0%, ${tokens.colors[800]} 50%, ${tokens.colors[900]} 100%)`,
          color: "white",
          borderTop: `3px solid ${tokens.colors[500]}`,
          patternOverlay: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(45deg, transparent 30%, ${tokens.colors[700]}10 50%, transparent 70%)`,
            pointerEvents: "none" as const,
          },
          sectionStyle: {
            bg: `${tokens.colors[800]}80`,
            borderRadius: tokens.borderRadius.lg,
            border: `1px solid ${tokens.colors[600]}40`,
            backdropFilter: "blur(15px) saturate(150%)",
            position: "relative" as const,
            overflow: "hidden",
            _before: {
              content: '""',
              position: "absolute",
              top: "-2px",
              left: "-2px",
              right: "-2px",
              bottom: "-2px",
              background: `linear-gradient(45deg, ${tokens.colors[500]}, ${tokens.colors[600]}, ${tokens.colors[500]})`,
              borderRadius: tokens.borderRadius.lg,
              zIndex: -1,
            },
          },
          linkStyle: {
            color: tokens.colors[200],
            fontFamily: tokens.typography.fontFamily.heading,
            fontWeight: tokens.typography.fontWeight.bold,
            _hover: {
              color: tokens.colors[400],
              transform: "scale(1.05)",
              transition: "all 0.2s ease",
            },
          },
          iconColor: tokens.colors[400],
          badgeScheme: "pink",
        };

      case "herbShop":
        // Footer bio - Naturel, authentique
        return {
          bg: `linear-gradient(180deg, ${tokens.colors[100]} 0%, ${tokens.colors[200]} 100%)`,
          color: tokens.colors[800],
          borderTop: `3px solid ${tokens.colors[500]}`,
          patternOverlay: {
            position: "absolute" as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${tokens.colors[400].replace(
              "#",
              "%23"
            )}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: "none" as const,
          },
          sectionStyle: {
            bg: tokens.colors[50],
            borderRadius: tokens.borderRadius.md,
            border: `2px solid ${tokens.colors[300]}`,
            shadow: "md",
          },
          linkStyle: {
            color: tokens.colors[700],
            fontFamily: tokens.typography.fontFamily.body,
            _hover: {
              color: tokens.colors[800],
              transform: "scale(1.02)",
              transition: "all 0.2s ease",
            },
          },
          iconColor: tokens.colors[600],
          badgeScheme: "green",
        };

      default:
        return getFooterStyles();
    }
  };

  const styles = getFooterStyles();

  return (
    <Box
      as="footer"
      w="full"
      bg={styles.bg}
      color={styles.color}
      borderTop={styles.borderTop}
      py={tokens.spacing.section}
      mt={tokens.spacing.section}
      position="relative"
      overflow="hidden"
    >
      {/* Pattern overlay */}
      <Box {...styles.patternOverlay} />

      <Container
        maxW="7xl"
        position="relative"
        zIndex={1}
        px={{ base: 4, md: 6 }}
      >
        {/* Version Mobile Simplifiée */}
        <Box display={{ base: "block", md: "none" }}>
          <VStack spacing={6} align="center" textAlign="center">
            {/* Info principale seulement */}
            <VStack spacing={2}>
              <HStack spacing={2}>
                <Text fontSize="lg">{tokens.meta.icon}</Text>
                <Text fontSize="md" fontWeight="bold">
                  {shop.name}
                </Text>
              </HStack>
              <Text fontSize="xs" opacity={0.8} maxW="250px">
                {shop.description || tokens.meta.description}
              </Text>
            </VStack>

            {/* Navigation simplifiée */}
            <HStack spacing={4} wrap="wrap" justify="center">
              {footerLinks.map((link) => (
                <Button
                  key={link.path}
                  as={Link}
                  to={link.path}
                  variant="link"
                  size="xs"
                  {...styles.linkStyle}
                >
                  {link.label}
                </Button>
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* Version Desktop */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={sectionSpacing}
          display={{ base: "none", md: "grid" }}
        >
          {/* Section Boutique */}
          <GridItem>
            <Box {...styles.sectionStyle} p={6}>
              <VStack spacing={6} align="start">
                <HStack spacing={3}>
                  <Text fontSize="2xl">{tokens.meta.icon}</Text>
                  <VStack align="start" spacing={1}>
                    <Text
                      fontWeight={tokens.typography.fontWeight.heavy}
                      fontSize="lg"
                      fontFamily={tokens.typography.fontFamily.heading}
                    >
                      {shop.name}
                    </Text>
                    <Badge colorScheme={styles.badgeScheme} size="sm">
                      {signature.signature.description}
                    </Badge>
                  </VStack>
                </HStack>

                <Text fontSize="sm" opacity={0.9} lineHeight="tall">
                  {shop.description || tokens.meta.description}
                </Text>

                <Text fontSize="xs" opacity={0.7}>
                  {signature.getDifferentiatorText()}
                </Text>
              </VStack>
            </Box>
          </GridItem>

          {/* Section Navigation */}
          <GridItem>
            <Box {...styles.sectionStyle} p={6}>
              <VStack spacing={6} align="start">
                <Text
                  fontWeight={tokens.typography.fontWeight.bold}
                  fontSize="md"
                  fontFamily={tokens.typography.fontFamily.heading}
                >
                  Navigation
                </Text>

                <VStack spacing={2} align="start">
                  {footerLinks.map((link) => (
                    <Button
                      key={link.path}
                      as={Link}
                      to={link.path}
                      variant="ghost"
                      size="sm"
                      justifyContent="flex-start"
                      {...styles.linkStyle}
                      h="auto"
                      p={1}
                      minW="120px"
                    >
                      {link.label}
                    </Button>
                  ))}
                </VStack>
              </VStack>
            </Box>
          </GridItem>

          {/* Section Contact */}
          <GridItem>
            <Box {...styles.sectionStyle} p={6}>
              <VStack spacing={6} align="start">
                <Text
                  fontWeight={tokens.typography.fontWeight.bold}
                  fontSize="md"
                  fontFamily={tokens.typography.fontFamily.heading}
                >
                  Contact
                </Text>

                <VStack spacing={2} align="start">
                  {shop.address && (
                    <HStack spacing={2}>
                      <Icon as={FaMapMarkerAlt} color={styles.iconColor} />
                      <Text fontSize="sm">{shop.address}</Text>
                    </HStack>
                  )}

                  {shop.phone && (
                    <HStack spacing={2}>
                      <Icon as={FaPhone} color={styles.iconColor} />
                      <ChakraLink
                        href={`tel:${shop.phone}`}
                        fontSize="sm"
                        {...styles.linkStyle}
                      >
                        {shop.phone}
                      </ChakraLink>
                    </HStack>
                  )}

                  {shop.email && (
                    <HStack spacing={2}>
                      <Icon as={FaEnvelope} color={styles.iconColor} />
                      <ChakraLink
                        href={`mailto:${shop.email}`}
                        fontSize="sm"
                        {...styles.linkStyle}
                      >
                        {shop.email}
                      </ChakraLink>
                    </HStack>
                  )}

                  {shop.website && (
                    <HStack spacing={2}>
                      <Icon as={FaGlobe} color={styles.iconColor} />
                      <ChakraLink
                        href={shop.website}
                        isExternal
                        fontSize="sm"
                        {...styles.linkStyle}
                      >
                        Visiter le site
                      </ChakraLink>
                    </HStack>
                  )}

                  {shop.openingHours && (
                    <HStack spacing={2}>
                      <Icon as={FaClock} color={styles.iconColor} />
                      <Text fontSize="xs" opacity={0.8}>
                        Ouvert selon horaires
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        {/* Footer bottom */}
        <Divider
          my={tokens.spacing.component}
          borderColor={
            shop.shopType === "teaShop" || shop.shopType === "herbShop"
              ? tokens.colors[300]
              : "whiteAlpha.300"
          }
        />

        {/* Footer Bottom - Mobile Simple */}
        <Box display={{ base: "block", md: "none" }}>
          <VStack spacing={2} align="center" fontSize="xs" opacity={0.8}>
            <Text textAlign="center">
              © {new Date().getFullYear()} {shop.name}
            </Text>
            <Text fontSize="xs" color={styles.iconColor}>
              Powered by DemoForge
            </Text>
          </VStack>
        </Box>

        {/* Footer Bottom - Desktop */}
        <Flex
          justify="space-between"
          align="center"
          fontSize="sm"
          opacity={0.8}
          display={{ base: "none", md: "flex" }}
        >
          <Text>
            © {new Date().getFullYear()} {shop.name} — Fait avec{" "}
            <Icon as={FaHeart} color={styles.iconColor} mx={1} />
            par DemoForge
          </Text>

          <HStack spacing={4}>
            <Text fontSize="xs">Powered by {tokens.meta.displayName}</Text>
            <Text fontSize="lg">{signature.signature.visualElement}</Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
