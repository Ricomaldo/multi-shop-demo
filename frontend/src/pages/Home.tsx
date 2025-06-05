import {
  Box,
  Button,
  Container,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getUniverseTokens, type ShopType } from "../theme/universeTokens";
const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);

// Configuration des univers pour la page d'accueil
const universeConfigs: Array<{
  id: ShopType;
  description: string;
}> = [
  {
    id: "brewery",
    description: "Brasserie artisanale authentique",
  },
  {
    id: "teaShop",
    description: "Salon de thé zen et raffinement",
  },
  {
    id: "beautyShop",
    description: "Institut de beauté premium",
  },
  {
    id: "herbShop",
    description: "Plantes médicinales bio et naturelles",
  },
];

export default function Home() {
  // Responsive values
  const gridColumns = useBreakpointValue({
    base: 1,
    sm: 2,
    lg: 4,
  });

  const heroSpacing = useBreakpointValue({
    base: 6,
    md: 8,
    lg: 12,
  });

  const cardSpacing = useBreakpointValue({
    base: 4,
    md: 6,
  });

  const containerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  return (
    <Container maxW="1400px" px={{ base: 4, md: 6, lg: 8 }}>
      <MotionVStack
        spacing={heroSpacing}
        py={{ base: 8, md: 12, lg: 16 }}
        {...containerAnimation}
      >
        {/* Hero Section */}
        <VStack spacing={{ base: 4, md: 6 }} textAlign="center" maxW="4xl">
          <Heading
            size={{ base: "xl", md: "2xl", lg: "3xl" }}
            bgGradient="linear(to-r, blue.600, purple.600, pink.600)"
            bgClip="text"
            fontWeight="black"
            letterSpacing="tight"
            lineHeight="shorter"
          >
            🛍️ DemoForge
          </Heading>

          <Heading
            size={{ base: "lg", md: "xl" }}
            color="gray.700"
            fontWeight="semibold"
            letterSpacing="tight"
          >
            Vitrine Multi-Univers
          </Heading>

          <Text
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            color="gray.600"
            fontWeight="medium"
            maxW="2xl"
            lineHeight="relaxed"
          >
            Démonstration interactive de solutions e-commerce sur-mesure
            <br />
            <Text
              as="span"
              fontSize={{ base: "sm", md: "md" }}
              color="gray.500"
            >
              4 expériences utilisateur uniques, 1 architecture technique
            </Text>
          </Text>
        </VStack>

        {/* Divider */}
        <Divider maxW="200px" borderColor="gray.300" borderWidth="2px" />

        {/* Universe Cards Grid */}
        <MotionBox
          w="full"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <SimpleGrid
            columns={gridColumns}
            spacing={cardSpacing}
            w="full"
            alignItems="stretch"
          >
            {universeConfigs.map((universe) => {
              const tokens = getUniverseTokens(universe.id);

              return (
                <MotionVStack
                  key={universe.id}
                  variants={cardAnimation}
                  p={{ base: 5, md: 6, lg: 7 }}
                  borderWidth="2px"
                  borderRadius={tokens.borderRadius.lg}
                  borderColor={tokens.colors[200]}
                  bg={tokens.colors[50]}
                  spacing={{ base: 3, md: 4 }}
                  cursor="pointer"
                  height="full"
                  position="relative"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "xl",
                    borderColor: tokens.colors[400],
                    bg: tokens.colors[100],
                  }}
                  _active={{
                    transform: "translateY(-2px)",
                  }}
                  style={{
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Header Card */}
                  <VStack spacing={{ base: 2, md: 3 }}>
                    <Box
                      fontSize={{ base: "4xl", md: "5xl" }}
                      lineHeight="1"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                    >
                      {tokens.meta.icon}
                    </Box>
                    <Heading
                      size={{ base: "sm", md: "md" }}
                      color={tokens.colors[700]}
                      fontFamily={tokens.typography.fontFamily.heading}
                      fontWeight={tokens.typography.fontWeight.bold}
                      textAlign="center"
                      letterSpacing="tight"
                    >
                      {tokens.meta.displayName}
                    </Heading>
                  </VStack>

                  {/* Description */}
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    textAlign="center"
                    color={tokens.colors[600]}
                    fontFamily={tokens.typography.fontFamily.body}
                    lineHeight="relaxed"
                    flex="1"
                    display="flex"
                    alignItems="center"
                  >
                    {tokens.meta.description}
                  </Text>

                  {/* CTA Button */}
                  <Button
                    as={Link}
                    to={`/store/${universe.id}`}
                    colorScheme={tokens.meta.colorScheme}
                    size={{ base: "sm", md: "md" }}
                    w="full"
                    borderRadius={tokens.borderRadius.base}
                    fontFamily={tokens.typography.fontFamily.body}
                    fontWeight={tokens.typography.fontWeight.bold}
                    transition="all 0.2s ease"
                    _hover={{
                      transform: "scale(1.02)",
                    }}
                    _active={{
                      transform: "scale(0.98)",
                    }}
                  >
                    Découvrir
                  </Button>
                </MotionVStack>
              );
            })}
          </SimpleGrid>
        </MotionBox>

        {/* Admin Section */}
        <MotionBox
          mt={{ base: 8, md: 12 }}
          p={{ base: 6, md: 8 }}
          bg="linear-gradient(135deg, blue.50, indigo.50)"
          borderRadius="xl"
          borderWidth="2px"
          borderColor="blue.200"
          textAlign="center"
          w="full"
          maxW="600px"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          _hover={{
            borderColor: "blue.300",
            bg: "linear-gradient(135deg, blue.100, indigo.100)",
          }}
        >
          <VStack spacing={{ base: 3, md: 4 }}>
            <Heading
              size={{ base: "sm", md: "md" }}
              color="blue.700"
              fontWeight="bold"
            >
              Interface d'Administration
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="blue.600"
              fontWeight="medium"
            >
              Gérez vos produits, catégories et paramètres
            </Text>
            <Button
              as={Link}
              to="/admin"
              colorScheme="blue"
              size={{ base: "md", md: "lg" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              px={{ base: 6, md: 8 }}
              leftIcon={<Text>🔧</Text>}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
            >
              Accéder à l'admin
            </Button>
          </VStack>
        </MotionBox>

        {/* Demo Système Émotionnel */}
        <MotionBox
          mt={{ base: 6, md: 8 }}
          p={{ base: 6, md: 8 }}
          bg="linear-gradient(135deg, purple.50, pink.50)"
          borderRadius="xl"
          borderWidth="2px"
          borderColor="purple.200"
          textAlign="center"
          w="full"
          maxW="600px"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          _hover={{
            borderColor: "purple.300",
            bg: "linear-gradient(135deg, purple.100, pink.100)",
          }}
        >
          <VStack spacing={{ base: 3, md: 4 }}>
            <Heading
              size={{ base: "sm", md: "md" }}
              color="purple.700"
              fontWeight="bold"
            >
              🎨 Système Émotionnel
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="purple.600"
              fontWeight="medium"
            >
              Découvrez les couleurs, animations et interactions de chaque
              univers
            </Text>
            <Button
              as={Link}
              to="/demo"
              colorScheme="purple"
              size={{ base: "md", md: "lg" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              px={{ base: 6, md: 8 }}
              leftIcon={<Text>✨</Text>}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
            >
              Tester les interactions
            </Button>
          </VStack>
        </MotionBox>
      </MotionVStack>
    </Container>
  );
}
