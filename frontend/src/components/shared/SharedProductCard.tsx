import { Badge, Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useUniverse } from "../../contexts/UniverseContext";

interface SharedProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  onAddToCart?: (id: string) => void;
  onEdit?: (id: string) => void;
  isAdminMode?: boolean;
}

/**
 * Composant partagé pour afficher une carte produit
 * S'adapte automatiquement au thème de l'univers actuel
 */
export const SharedProductCard: React.FC<SharedProductCardProps> = ({
  id,
  name,
  description,
  price,
  category,
  onAddToCart,
  onEdit,
  isAdminMode = false,
}) => {
  const { getColorScheme } = useUniverse();
  const colorScheme = getColorScheme();

  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      shadow="sm"
      border="1px"
      borderColor="gray.200"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1} flex={1}>
            <Text fontWeight="bold" fontSize="lg">
              {name}
            </Text>
            {category && (
              <Badge colorScheme={colorScheme} size="sm">
                {category}
              </Badge>
            )}
            {description && (
              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {description}
              </Text>
            )}
          </VStack>
          <Text color={`${colorScheme}.600`} fontWeight="bold" fontSize="lg">
            {price.toFixed(2)}€
          </Text>
        </HStack>

        <HStack spacing={2}>
          {isAdminMode && onEdit && (
            <Button
              size="sm"
              colorScheme={colorScheme}
              variant="outline"
              onClick={() => onEdit(id)}
              flex={1}
            >
              ✏️ Modifier
            </Button>
          )}
          {!isAdminMode && onAddToCart && (
            <Button
              size="sm"
              colorScheme={colorScheme}
              onClick={() => onAddToCart(id)}
              flex={1}
            >
              🛒 Ajouter au panier
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
