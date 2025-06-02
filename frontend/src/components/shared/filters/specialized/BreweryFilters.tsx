import {
  Box,
  Checkbox,
  CheckboxGroup,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ProductFilters } from "../../../../services/adminProductService";

interface BreweryFiltersProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: unknown) => void;
  mode?: "admin" | "store";
  themeColor: string;
  dynamicOptions?: Record<string, string[]>;
}

export const BreweryFilters: React.FC<BreweryFiltersProps> = ({
  filters,
  onFilterChange,
  mode = "store",
  themeColor,
  dynamicOptions = {},
}) => {
  return (
    <VStack spacing={mode === "admin" ? 4 : 6} align="stretch">
      <Text
        fontWeight="medium"
        color={`${themeColor}.600`}
        fontSize={mode === "admin" ? "md" : "lg"}
      >
        🍺 Filtres Brasserie
      </Text>

      {/* Degré d'alcool */}
      <Box>
        <Text fontSize="sm" mb={3} fontWeight="medium">
          Degré d'alcool
        </Text>
        {mode === "store" ? (
          <CheckboxGroup
            value={filters.degre_alcool_ranges || []}
            onChange={(values) => onFilterChange("degre_alcool_ranges", values)}
          >
            <SimpleGrid columns={2} spacing={2}>
              <Checkbox value="light" colorScheme={themeColor}>
                Légère (3-5°)
              </Checkbox>
              <Checkbox value="medium" colorScheme={themeColor}>
                Modérée (5-7°)
              </Checkbox>
              <Checkbox value="strong" colorScheme={themeColor}>
                Forte (7-10°)
              </Checkbox>
              <Checkbox value="very-strong" colorScheme={themeColor}>
                Très forte (10°+)
              </Checkbox>
            </SimpleGrid>
          </CheckboxGroup>
        ) : (
          <HStack spacing={4}>
            <Box>
              <Text fontSize="sm" mb={1}>
                Degré min
              </Text>
              <NumberInput
                size="sm"
                min={0}
                max={20}
                step={0.1}
                value={filters.degre_alcool_min || ""}
                onChange={(_, value) =>
                  onFilterChange("degre_alcool_min", value)
                }
              >
                <NumberInputField placeholder="0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>

            <Box>
              <Text fontSize="sm" mb={1}>
                Degré max
              </Text>
              <NumberInput
                size="sm"
                min={0}
                max={20}
                step={0.1}
                value={filters.degre_alcool_max || ""}
                onChange={(_, value) =>
                  onFilterChange("degre_alcool_max", value)
                }
              >
                <NumberInputField placeholder="20" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </HStack>
        )}
      </Box>

      {/* Type de houblon */}
      <Box>
        <Text fontSize="sm" mb={2} fontWeight="medium">
          Type de houblon
        </Text>
        {mode === "store" ? (
          <Select
            placeholder="Tous les houblons"
            value={filters.type_houblon || ""}
            onChange={(e) => onFilterChange("type_houblon", e.target.value)}
            bg="white"
          >
            {dynamicOptions.type_houblon?.length > 0 ? (
              dynamicOptions.type_houblon.map((houblon) => (
                <option key={houblon} value={houblon}>
                  {houblon}
                </option>
              ))
            ) : (
              <>
                <option value="Cascade">Cascade</option>
                <option value="Centennial">Centennial</option>
                <option value="Chinook">Chinook</option>
                <option value="Saaz">Saaz</option>
              </>
            )}
          </Select>
        ) : (
          <Input
            size="sm"
            placeholder="Ex: Cascade, Centennial"
            value={filters.type_houblon || ""}
            onChange={(e) => onFilterChange("type_houblon", e.target.value)}
          />
        )}
      </Box>
    </VStack>
  );
};
