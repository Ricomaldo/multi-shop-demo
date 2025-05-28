import {
  Badge,
  Box,
  Button,
  HStack,
  Select,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { Category } from "../../../../shared/types";

interface SharedCategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onResetFilters: () => void;
  productCount?: number;
  colorScheme?: string;
  mode?: "admin" | "store"; // Interface admin vs vitrine
  layout?: "dropdown" | "buttons"; // Dropdown admin vs boutons vitrine
}

/**
 * Composant partagé universel pour le filtrage par catégorie
 * Unifie AdminCategoryFilter et StoreCategoryFilter
 * Mode admin: Interface compacte avec dropdown
 * Mode store: Interface visuelle avec boutons
 */
export default function SharedCategoryFilter({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onResetFilters,
  productCount = 0,
  colorScheme = "blue",
  mode = "store",
  layout,
}: SharedCategoryFilterProps) {
  // Déterminer le layout automatiquement selon le mode si non spécifié
  const effectiveLayout = layout || (mode === "admin" ? "dropdown" : "buttons");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onCategoryChange(value === "" ? null : value);
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  // Rendu en mode dropdown (admin)
  if (effectiveLayout === "dropdown") {
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
              <Badge colorScheme={colorScheme} size="sm" role="status">
                {selectedCategory.name}
              </Badge>
            )}
          </HStack>
        </VStack>
      </Box>
    );
  }

  // Rendu en mode boutons (store)
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      bg="white"
      shadow="sm"
      _dark={{ bg: "gray.800" }}
    >
      <Text
        fontSize="lg"
        fontWeight="semibold"
        mb={3}
        color="gray.700"
        _dark={{ color: "gray.200" }}
      >
        Catégories
      </Text>

      <Wrap spacing={2} mb={3}>
        <WrapItem>
          <Button
            size="sm"
            variant={selectedCategoryId === null ? "solid" : "outline"}
            colorScheme={colorScheme}
            onClick={() => onCategoryChange(null)}
          >
            Toutes ({productCount})
          </Button>
        </WrapItem>

        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <WrapItem key={category.id}>
              <Button
                size="sm"
                variant={isSelected ? "solid" : "outline"}
                colorScheme={colorScheme}
                onClick={() => onCategoryChange(category.id)}
                rightIcon={
                  isSelected ? (
                    <Badge
                      colorScheme={colorScheme}
                      variant="solid"
                      fontSize="xs"
                    >
                      ✓
                    </Badge>
                  ) : undefined
                }
              >
                {category.name}
              </Button>
            </WrapItem>
          );
        })}
      </Wrap>

      {selectedCategoryId && (
        <HStack
          justify="space-between"
          pt={2}
          borderTop="1px"
          borderColor="gray.200"
          _dark={{ borderColor: "gray.600" }}
        >
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
            {productCount} produit{productCount !== 1 ? "s" : ""} dans cette
            catégorie
          </Text>

          <Button
            size="xs"
            variant="ghost"
            colorScheme={colorScheme}
            onClick={onResetFilters}
          >
            Voir tout
          </Button>
        </HStack>
      )}
    </Box>
  );
}
