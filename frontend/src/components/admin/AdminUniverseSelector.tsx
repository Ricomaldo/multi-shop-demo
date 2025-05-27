import { Box, Button, Flex, Text } from "@chakra-ui/react";
import type { UniverseType } from "../../contexts/UniverseContext";
import { useUniverse } from "../../contexts/UniverseContext";

interface UniverseOption {
  type: UniverseType;
  label: string;
  icon: string;
  description: string;
}

const universeOptions: UniverseOption[] = [
  {
    type: "brewery",
    label: "Houblon & Tradition",
    icon: "🍺",
    description: "Brasserie artisanale",
  },
  {
    type: "tea-shop",
    label: "Les Jardins de Darjeeling",
    icon: "🍵",
    description: "Salon de thé",
  },
  {
    type: "beauty-shop",
    label: "L'Écrin de Jade",
    icon: "💄",
    description: "Institut beauté",
  },
  {
    type: "herb-shop",
    label: "Herboristerie du Moulin Vert",
    icon: "🌿",
    description: "Herboristerie traditionnelle",
  },
];

/**
 * Sélecteur d'univers pour l'interface admin
 * Permet de changer le thème et le contexte métier
 */
export const AdminUniverseSelector: React.FC = () => {
  const { universe, setUniverse, getColorScheme } = useUniverse();
  const currentColorScheme = getColorScheme();

  return (
    <Box p={4} bg="gray.50" borderRadius="md">
      <Text
        mb={3}
        fontWeight="bold"
        color="gray.700"
        fontSize={{ base: "sm", md: "md" }}
      >
        🏪 Univers Boutique
      </Text>
      <Flex direction="column" gap={2}>
        {universeOptions.map((option) => (
          <Button
            key={option.type}
            size={{ base: "sm", md: "sm" }}
            colorScheme={option.type === universe ? currentColorScheme : "gray"}
            variant={option.type === universe ? "solid" : "outline"}
            onClick={() => setUniverse(option.type)}
            leftIcon={<span>{option.icon}</span>}
            justifyContent="flex-start"
            w="full"
            fontSize={{ base: "xs", md: "sm" }}
          >
            <Text noOfLines={1}>{option.label}</Text>
          </Button>
        ))}
      </Flex>
      <Text mt={2} fontSize={{ base: "xs", md: "sm" }} color="gray.600">
        Univers actuel :{" "}
        {universeOptions.find((o) => o.type === universe)?.description}
      </Text>
    </Box>
  );
};
