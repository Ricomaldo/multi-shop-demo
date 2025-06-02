import { Box, Input, Select, Text, VStack } from "@chakra-ui/react";
import type { ProductFilters } from "../../../../services/adminProductService";

interface TeaShopFiltersProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: unknown) => void;
  mode?: "admin" | "store";
  themeColor: string;
  dynamicOptions?: Record<string, string[]>;
}

export const TeaShopFilters: React.FC<TeaShopFiltersProps> = ({
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
        🍵 Filtres Salon de Thé
      </Text>

      {/* Origine plantation */}
      <Box>
        <Text fontSize="sm" mb={2} fontWeight="medium">
          Origine plantation
        </Text>
        {mode === "store" ? (
          <Select
            placeholder="Toutes les origines"
            value={filters.origine_plantation || ""}
            onChange={(e) =>
              onFilterChange("origine_plantation", e.target.value)
            }
            bg="white"
          >
            {dynamicOptions.origine_plantation?.length > 0 ? (
              dynamicOptions.origine_plantation.map((origine) => (
                <option key={origine} value={origine}>
                  {origine}
                </option>
              ))
            ) : (
              <>
                <option value="Darjeeling">Darjeeling</option>
                <option value="Assam">Assam</option>
                <option value="Ceylan">Ceylan</option>
                <option value="Chine">Chine</option>
                <option value="Japon">Japon</option>
              </>
            )}
          </Select>
        ) : (
          <Input
            size="sm"
            placeholder="Ex: Darjeeling, Ceylan"
            value={filters.origine_plantation || ""}
            onChange={(e) =>
              onFilterChange("origine_plantation", e.target.value)
            }
          />
        )}
      </Box>

      {/* Grade qualité */}
      <Box>
        <Text fontSize="sm" mb={2} fontWeight="medium">
          Grade qualité
        </Text>
        <Select
          size={mode === "admin" ? "sm" : "md"}
          placeholder={
            mode === "store" ? "Tous les grades" : "Sélectionner un grade"
          }
          value={filters.grade_qualite || ""}
          onChange={(e) => onFilterChange("grade_qualite", e.target.value)}
          bg="white"
        >
          <option value="FTGFOP">
            {mode === "store"
              ? "FTGFOP (Finest Tippy Golden Flowery Orange Pekoe)"
              : "FTGFOP"}
          </option>
          <option value="SFTGFOP">
            {mode === "store"
              ? "SFTGFOP (Super Fine Tippy Golden Flowery Orange Pekoe)"
              : "SFTGFOP"}
          </option>
          <option value="OP">
            OP {mode === "store" ? "(Orange Pekoe)" : ""}
          </option>
          <option value="Pekoe">Pekoe</option>
          <option value="Broken">Broken</option>
        </Select>
      </Box>
    </VStack>
  );
};
