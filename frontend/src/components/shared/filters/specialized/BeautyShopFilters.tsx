import { Box, HStack, Select, Switch, Text, VStack } from "@chakra-ui/react";
import type { ProductFilters } from "../../../../services/adminProductService";

interface BeautyShopFiltersProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: unknown) => void;
  mode?: "admin" | "store";
  themeColor: string;
  dynamicOptions?: Record<string, string[]>;
}

export const BeautyShopFilters: React.FC<BeautyShopFiltersProps> = ({
  filters,
  onFilterChange,
  mode = "store",
  themeColor,
  dynamicOptions = {},
}) => {
  return (
    <VStack spacing={4} align="stretch">
      <Text
        fontWeight="medium"
        color={`${themeColor}.600`}
        fontSize={mode === "admin" ? "md" : "lg"}
      >
        💄 Filtres Institut Beauté
      </Text>

      {/* Type de peau */}
      <Box>
        <Text fontSize="sm" mb={2} fontWeight="medium">
          Type de peau
        </Text>
        <Select
          size={mode === "admin" ? "sm" : "md"}
          placeholder={
            mode === "store" ? "Tous types de peau" : "Sélectionner un type"
          }
          value={filters.type_peau || ""}
          onChange={(e) => onFilterChange("type_peau", e.target.value)}
          bg="white"
        >
          {dynamicOptions.type_peau?.length > 0 ? (
            dynamicOptions.type_peau.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))
          ) : (
            <>
              <option value="Tous types">Tous types</option>
              <option value="Peau sèche">Peau sèche</option>
              <option value="Peau grasse">Peau grasse</option>
              <option value="Peau mixte">Peau mixte</option>
              <option value="Peau sensible">Peau sensible</option>
              <option value="Peau mature">Peau mature</option>
            </>
          )}
        </Select>
      </Box>

      {/* Certification bio */}
      <HStack spacing={4} align="center">
        <Text fontSize="sm" fontWeight="medium">
          Certification bio
        </Text>
        <Switch
          colorScheme={themeColor}
          isChecked={filters.certification_bio || false}
          onChange={(e) =>
            onFilterChange("certification_bio", e.target.checked)
          }
        />
      </HStack>
    </VStack>
  );
};
