import {
  Badge,
  Box,
  Button,
  HStack,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Category } from "../../../../shared/types";

interface AdminCategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onResetFilters: () => void;
  productCount?: number;
  colorScheme?: string;
}

/**
 * Composant de filtrage par catégorie pour l'interface admin
 * Utilise Chakra UI avec thématisation automatique selon l'univers
 */
export default function AdminCategoryFilter({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onResetFilters,
  productCount = 0,
  colorScheme = "blue",
}: AdminCategoryFilterProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onCategoryChange(value === "" ? null : value);
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      bg="gray.50"
      _dark={{ bg: "gray.700" }}
    >
      <VStack spacing={3} align="stretch">
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="gray.600"
          _dark={{ color: "gray.300" }}
        >
          Filtrer par catégorie
        </Text>

        <HStack spacing={3}>
          <Select
            placeholder="Toutes les catégories"
            value={selectedCategoryId || ""}
            onChange={handleSelectChange}
            size="sm"
            bg="white"
            _dark={{ bg: "gray.600" }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Button
            size="sm"
            variant="outline"
            colorScheme={colorScheme}
            onClick={onResetFilters}
            isDisabled={!selectedCategoryId}
          >
            Réinitialiser
          </Button>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="xs" color="gray.500">
            {productCount} produit{productCount !== 1 ? "s" : ""} affiché
            {productCount !== 1 ? "s" : ""}
          </Text>

          {selectedCategory && (
            <Badge colorScheme={colorScheme} size="sm">
              {selectedCategory.name}
            </Badge>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
