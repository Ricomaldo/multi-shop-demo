import { Box, Input, Select, Text, VStack } from "@chakra-ui/react";
import type { ProductFilters } from "../../../../services/adminProductService";

interface HerbShopFiltersProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: unknown) => void;
  mode?: "admin" | "store";
  themeColor: string;
  dynamicOptions?: Record<string, string[]>;
}

export const HerbShopFilters: React.FC<HerbShopFiltersProps> = ({
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
        🌿 Filtres Herboristerie
      </Text>

      {/* Usage traditionnel */}
      <Box>
        <Text fontSize="sm" mb={2} fontWeight="medium">
          Usage traditionnel
        </Text>
        {mode === "store" ? (
          <Select
            placeholder="Tous les usages"
            value={filters.usage_traditionnel || ""}
            onChange={(e) =>
              onFilterChange("usage_traditionnel", e.target.value)
            }
            bg="white"
          >
            {dynamicOptions.usage_traditionnel?.length > 0 ? (
              dynamicOptions.usage_traditionnel.map((usage) => (
                <option key={usage} value={usage}>
                  {usage}
                </option>
              ))
            ) : (
              <>
                <option value="Digestion">Digestion</option>
                <option value="Sommeil">Sommeil</option>
                <option value="Stress">Stress</option>
                <option value="Immunité">Immunité</option>
                <option value="Circulation">Circulation</option>
                <option value="Détox">Détox</option>
              </>
            )}
          </Select>
        ) : (
          <Input
            size="sm"
            placeholder="Ex: Digestion, Sommeil"
            value={filters.usage_traditionnel || ""}
            onChange={(e) =>
              onFilterChange("usage_traditionnel", e.target.value)
            }
          />
        )}
      </Box>

      {/* Forme galénique */}
      <Box>
        <Text fontSize="sm" mb={2} fontWeight="medium">
          Forme galénique
        </Text>
        <Select
          size={mode === "admin" ? "sm" : "md"}
          placeholder={
            mode === "store" ? "Toutes les formes" : "Sélectionner une forme"
          }
          value={filters.forme_galenique || ""}
          onChange={(e) => onFilterChange("forme_galenique", e.target.value)}
          bg="white"
        >
          {dynamicOptions.forme_galenique?.length > 0 ? (
            dynamicOptions.forme_galenique.map((forme) => (
              <option key={forme} value={forme}>
                {forme}
              </option>
            ))
          ) : (
            <>
              <option value="Gélules">Gélules</option>
              <option value="Tisane">Tisane</option>
              <option value="Teinture mère">Teinture mère</option>
              <option value="Huile essentielle">Huile essentielle</option>
              <option value="Poudre">Poudre</option>
              <option value="Comprimés">Comprimés</option>
            </>
          )}
        </Select>
      </Box>
    </VStack>
  );
};
