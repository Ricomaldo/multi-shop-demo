import {
  Badge,
  Box,
  Button,
  HStack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { Category } from "../../../../shared/types";

interface StoreCategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onResetFilters: () => void;
  productCount?: number;
  colorScheme?: string;
}

/**
 * Composant de filtrage par catégorie pour les vitrines
 * Interface plus visuelle avec boutons de catégories
 */
export default function StoreCategoryFilter({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onResetFilters,
  productCount = 0,
  colorScheme = "blue",
}: StoreCategoryFilterProps) {
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
