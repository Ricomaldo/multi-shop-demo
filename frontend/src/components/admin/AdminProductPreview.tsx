import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUniverse } from "../../contexts/UniverseContext";

interface AdminProductPreviewProps {
  /** Données du produit en cours d'édition */
  productData: {
    name: string;
    description: string;
    price: string | number;
    category?: string;
  };
  /** Indique si les données ont changé (pour animation) */
  hasChanges?: boolean;
}

const MotionBox = motion(Box);

/**
 * Aperçu temps réel d'un produit en cours d'édition
 * Simule l'affichage côté vitrine avec animations de changement
 */
export default function AdminProductPreview({
  productData,
  hasChanges = false,
}: AdminProductPreviewProps) {
  const { getColorScheme } = useUniverse();
  const colorScheme = getColorScheme();
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Animation de highlight quand les données changent
  useEffect(() => {
    if (hasChanges) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasChanges, productData]);

  const price =
    typeof productData.price === "string"
      ? parseFloat(productData.price) || 0
      : productData.price;

  const highlightVariants = {
    normal: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      borderColor: "rgba(229, 231, 235, 1)",
    },
    highlighted: {
      scale: 1.02,
      boxShadow: "0 10px 25px -3px rgba(59, 130, 246, 0.3)",
      borderColor: "rgba(59, 130, 246, 0.5)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <VStack spacing={6} align="stretch" p={6}>
      {/* En-tête de l'aperçu */}
      <Box textAlign="center">
        <Heading size="lg" color={`${colorScheme}.700`} mb={2}>
          🍺 Houblon & Tradition
        </Heading>
        <Text color="gray.600">
          Aperçu vitrine - Voici comment votre produit apparaîtra
        </Text>
      </Box>

      {/* Carte produit avec animation */}
      <MotionBox
        variants={highlightVariants}
        animate={isHighlighted ? "highlighted" : "normal"}
        p={6}
        bg="white"
        borderRadius="lg"
        borderWidth={2}
        borderColor="gray.200"
        shadow="md"
        maxW="400px"
        mx="auto"
        w="full"
      >
        <VStack spacing={4} align="stretch">
          {/* Badge catégorie */}
          <Flex justify="space-between" align="start">
            {productData.category && (
              <Badge colorScheme={colorScheme} fontSize="xs">
                {productData.category}
              </Badge>
            )}
          </Flex>

          {/* Nom et description */}
          <VStack spacing={2} align="start">
            <Heading
              size="md"
              color={`${colorScheme}.800`}
              minH="32px"
              display="flex"
              alignItems="center"
            >
              {productData.name || "Nom du produit"}
            </Heading>
            <Text fontSize="sm" color="gray.600" noOfLines={3} minH="60px">
              {productData.description || "Description du produit..."}
            </Text>
          </VStack>

          {/* Prix et bouton */}
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold" color={`${colorScheme}.600`}>
              {price.toFixed(2)}€
            </Text>
            <Button
              size="sm"
              colorScheme={colorScheme}
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              🛒 Ajouter
            </Button>
          </Flex>
        </VStack>
      </MotionBox>

      {/* Indicateur de changements */}
      {hasChanges && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          textAlign="center"
          p={3}
          bg="blue.50"
          borderRadius="md"
          border="1px"
          borderColor="blue.200"
        >
          <Text fontSize="sm" color="blue.700" fontWeight="medium">
            ✨ Aperçu mis à jour en temps réel
          </Text>
        </MotionBox>
      )}

      {/* Simulation d'autres produits */}
      <VStack spacing={3} opacity={0.4}>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Autres produits de la boutique
        </Text>
        {[1, 2].map((i) => (
          <Box
            key={i}
            p={4}
            bg="gray.50"
            borderRadius="md"
            w="full"
            maxW="400px"
            mx="auto"
          >
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Autre produit {i}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Description courte...
                </Text>
              </VStack>
              <Text fontSize="sm" fontWeight="bold" color="gray.600">
                {(4.5 + i).toFixed(2)}€
              </Text>
            </Flex>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
