import {
  useUniverseButton,
  useUniverseColors,
  useUniverseInput,
  useUniverseLayout,
} from "@/hooks";
import type { ShopType } from "@/types";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUniverseAnimations } from "../../hooks";
import { getUniverseTokens } from "../../theme/universeTokens";

/**
 * 🔘📝🎨📐 DÉMONSTRATION COMPLÈTE DU SYSTÈME ÉMOTIONNEL
 *
 * Montre tous les variants : boutons, inputs, couleurs ET layouts
 * spécifiques par univers en temps réel
 */

interface UniverseComponentShowcaseProps {
  shopType: ShopType;
}

const UniverseComponentShowcase: React.FC<UniverseComponentShowcaseProps> = ({
  shopType,
}) => {
  const { getPrimaryProps, getSecondaryProps, getGhostProps, emotions, meta } =
    useUniverseButton(shopType);
  const { getInputProps, getPlaceholder, getErrorMessage } =
    useUniverseInput(shopType);
  const colors = useUniverseColors(shopType);
  const layout = useUniverseLayout(shopType);
  const tokens = getUniverseTokens(shopType);
  const animations = useUniverseAnimations(shopType);

  // État pour la démonstration des inputs
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};

    // Validation simple pour la démo
    if (!formData.email) newErrors.email = true;
    if (!formData.name) newErrors.name = true;
    if (!formData.message) newErrors.message = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert(`✅ Formulaire ${meta.displayName} soumis avec succès !`);
      setFormData({ email: "", name: "", message: "" });
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Header avec infos émotionnelles */}
      <Box
        p={6}
        bg={colors.backgrounds.card}
        borderRadius={tokens.borderRadius.lg}
        border="2px solid"
        borderColor={colors.borders.light}
        {...animations.getEntranceProps()}
      >
        <VStack spacing={4} align="start">
          <Flex align="center" gap={3}>
            <Text fontSize="2xl">{meta.icon}</Text>
            <Heading
              size="lg"
              color={colors.text.primary}
              fontFamily={tokens.typography.fontFamily.heading}
            >
              {meta.displayName}
            </Heading>
          </Flex>

          <Text fontSize="sm" color={colors.text.secondary} fontStyle="italic">
            Personnalité: {emotions.personality} • Énergie: {emotions.energy} •
            Rythme: {emotions.rhythm} • Texture: {emotions.texture}
          </Text>
        </VStack>
      </Box>

      {/* Layout émotionnel */}
      <Card {...animations.getHoverProps()}>
        <CardHeader>
          <Heading size="md" color={colors.text.primary}>
            📐 Layout Émotionnel
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <VStack spacing={3} align="start">
              <Text fontSize="sm" color={colors.text.secondary}>
                <strong>Container:</strong>{" "}
                {tokens.emotions.texture === "refined"
                  ? "Large (1400px)"
                  : tokens.emotions.texture === "rough"
                  ? "Compact (1200px)"
                  : tokens.emotions.texture === "smooth"
                  ? "Équilibré (1300px)"
                  : "Naturel (1250px)"}
              </Text>
              <Text fontSize="sm" color={colors.text.secondary}>
                <strong>Grid:</strong>{" "}
                {tokens.emotions.personality === "sophisticated"
                  ? "Sophistiqué (320px min)"
                  : tokens.emotions.personality === "serene"
                  ? "Zen (280px min)"
                  : tokens.emotions.personality === "authentic"
                  ? "Robuste (300px min)"
                  : "Naturel (290px min)"}
              </Text>
              <Text fontSize="sm" color={colors.text.secondary}>
                <strong>Spacing:</strong>{" "}
                {tokens.emotions.rhythm === "slow"
                  ? "Aéré (gap: 8)"
                  : tokens.emotions.rhythm === "precise"
                  ? "Précis (gap: 6)"
                  : tokens.emotions.rhythm === "natural"
                  ? "Organique (gap: 7)"
                  : "Standard (gap: 5)"}
              </Text>
            </VStack>

            {/* Démonstration interactive du layout */}
            <VStack spacing={4} w="full">
              <Text fontSize="sm" color={colors.text.primary} fontWeight="bold">
                🎯 Test Interactif du Layout
              </Text>

              <Box {...layout.getGridProps()} w="full">
                {/* Carte produit simulée */}
                <Box
                  h="80px"
                  bg={colors.backgrounds.card}
                  borderRadius={tokens.borderRadius.md}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  color={colors.text.primary}
                  border="2px solid"
                  borderColor={colors.borders.light}
                  p={3}
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    borderColor: tokens.colors[400],
                    bg: tokens.colors[100],
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  _active={{
                    transform: "translateY(0px)",
                  }}
                >
                  <Text fontSize="lg" mb={1}>
                    {tokens.meta.icon}
                  </Text>
                  <Text fontWeight="bold">Produit</Text>
                </Box>

                {/* Carte category simulée */}
                <Box
                  h="80px"
                  bg={colors.backgrounds.subtle}
                  borderRadius={tokens.borderRadius.md}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  color={colors.text.primary}
                  border="2px solid"
                  borderColor={colors.borders.medium}
                  p={3}
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{
                    borderColor: tokens.colors[500],
                    bg: tokens.colors[200],
                    transform: "scale(1.05)",
                    boxShadow: "lg",
                  }}
                  _active={{
                    transform: "scale(0.98)",
                  }}
                >
                  <Text fontSize="lg" mb={1}>
                    📂
                  </Text>
                  <Text fontWeight="bold">Catégorie</Text>
                </Box>
              </Box>

              <Text
                fontSize="xs"
                color={colors.text.secondary}
                textAlign="center"
                fontStyle="italic"
              >
                ✨ Survolez les éléments pour tester les animations
                émotionnelles
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Couleurs contextuelles */}
      <Card {...animations.getHoverProps()}>
        <CardHeader>
          <Heading size="md" color={colors.text.primary}>
            🎨 Couleurs Contextuelles
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={4} spacing={3}>
            <VStack spacing={2}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={colors.text.secondary}
              >
                Statut
              </Text>
              <HStack>
                <Badge
                  bg={colors.status.open.bg}
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                >
                  <Box w="6px" h="6px" bg="white" borderRadius="full" mr={1} />
                  Ouvert
                </Badge>
                <Badge
                  bg={colors.status.closed.bg}
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                >
                  <Box w="6px" h="6px" bg="white" borderRadius="full" mr={1} />
                  Fermé
                </Badge>
              </HStack>
            </VStack>

            <VStack spacing={2}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={colors.text.secondary}
              >
                Système
              </Text>
              <VStack spacing={1}>
                <Box
                  w="16px"
                  h="6px"
                  bg={colors.system.success}
                  borderRadius="sm"
                />
                <Box
                  w="16px"
                  h="6px"
                  bg={colors.system.warning}
                  borderRadius="sm"
                />
                <Box
                  w="16px"
                  h="6px"
                  bg={colors.system.error}
                  borderRadius="sm"
                />
              </VStack>
            </VStack>

            <VStack spacing={2}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={colors.text.secondary}
              >
                Neutres
              </Text>
              <VStack spacing={1}>
                <Box
                  w="16px"
                  h="6px"
                  bg={colors.gray.light}
                  borderRadius="sm"
                />
                <Box
                  w="16px"
                  h="6px"
                  bg={colors.gray.medium}
                  borderRadius="sm"
                />
                <Box w="16px" h="6px" bg={colors.gray.dark} borderRadius="sm" />
              </VStack>
            </VStack>

            <VStack spacing={2}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={colors.text.secondary}
              >
                Texte
              </Text>
              <VStack spacing={1} align="start">
                <Text fontSize="xs" color={colors.text.primary}>
                  Principal
                </Text>
                <Text fontSize="xs" color={colors.text.secondary}>
                  Secondaire
                </Text>
                <Text fontSize="xs" color={colors.text.subtle}>
                  Subtil
                </Text>
              </VStack>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Démonstration des boutons */}
      <Card {...animations.getHoverProps()}>
        <CardHeader>
          <Heading size="md" color={colors.text.primary}>
            🔘 Boutons Émotionnels
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={3} spacing={4}>
            <VStack spacing={3}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={colors.text.secondary}
              >
                Primary
              </Text>
              <Button {...getPrimaryProps()} {...animations.getClickProps()}>
                Action principale
              </Button>
            </VStack>

            <VStack spacing={3}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={colors.text.secondary}
              >
                Secondary
              </Text>
              <Button {...getSecondaryProps()} {...animations.getClickProps()}>
                Action secondaire
              </Button>
            </VStack>

            <VStack spacing={3}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={colors.text.secondary}
              >
                Ghost
              </Text>
              <Button {...getGhostProps()} {...animations.getClickProps()}>
                Action subtile
              </Button>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Démonstration des inputs */}
      <Card {...animations.getHoverProps()}>
        <CardHeader>
          <Heading size="md" color={colors.text.primary}>
            📝 Inputs Émotionnels
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.email}>
              <FormLabel
                color={colors.text.primary}
                fontWeight={tokens.typography.fontWeight.bold}
              >
                Email
              </FormLabel>
              <Input
                {...getInputProps()}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={getPlaceholder("email")}
              />
              {errors.email && (
                <FormErrorMessage>{getErrorMessage("Email")}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors.name}>
              <FormLabel
                color={colors.text.primary}
                fontWeight={tokens.typography.fontWeight.bold}
              >
                Nom
              </FormLabel>
              <Input
                {...getInputProps()}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={getPlaceholder("nom")}
              />
              {errors.name && (
                <FormErrorMessage>{getErrorMessage("Nom")}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors.message}>
              <FormLabel
                color={colors.text.primary}
                fontWeight={tokens.typography.fontWeight.bold}
              >
                Message
              </FormLabel>
              <Input
                {...getInputProps()}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder={getPlaceholder("message")}
              />
              {errors.message && (
                <FormErrorMessage>
                  {getErrorMessage("Message")}
                </FormErrorMessage>
              )}
            </FormControl>

            <Button
              {...getPrimaryProps()}
              {...animations.getClickProps()}
              onClick={handleSubmit}
              mt={2}
            >
              Valider le formulaire
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export const UniverseButtonDemo: React.FC = () => {
  const universes: ShopType[] = [
    "brewery",
    "teaShop",
    "beautyShop",
    "herbShop",
  ];

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={8}>
        <Box textAlign="center" mb={8}>
          <Heading size="2xl" mb={4} color="gray.800">
            🔘📝🎨📐 Système de Design Émotionnel
          </Heading>
          <Text color="gray.600" maxW="900px" mx="auto" fontSize="lg">
            Système complet sans hardcode ! Chaque univers a ses propres layouts
            émotionnels, couleurs contextuelles, micro-interactions et
            personnalité. Testez les interactions sur chaque élément.
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={12}
          w="full"
          maxW="7xl"
        >
          {universes.map((shopType) => (
            <UniverseComponentShowcase key={shopType} shopType={shopType} />
          ))}
        </SimpleGrid>

        {/* Instructions finales */}
        <Box
          textAlign="center"
          py={8}
          px={6}
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.200"
          maxW="4xl"
          mx="auto"
        >
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold" color="gray.700">
              🎯 Système Émotionnel DemoForge
            </Text>
            <Text color="gray.600" fontSize="md" maxW="2xl">
              Chaque univers possède sa propre <strong>personnalité</strong>,
              son
              <strong> énergie</strong>, son <strong>rythme</strong> et sa{" "}
              <strong>texture</strong> uniques.
            </Text>
            <Text color="gray.500" fontStyle="italic" fontSize="sm">
              ✨ Chaque interaction reflète cette personnalité unique. Survolez
              et cliquez sur tous les éléments ci-dessus !
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
