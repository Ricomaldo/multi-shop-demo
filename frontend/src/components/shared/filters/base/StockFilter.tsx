import { Box, Select, Text } from "@chakra-ui/react";
import type { ProductFilters } from "../../../../services/adminProductService";

interface StockFilterProps {
  value: ProductFilters["stockStatus"];
  onChange: (value: string) => void;
  mode?: "admin" | "store";
}

export const StockFilter: React.FC<StockFilterProps> = ({
  value,
  onChange,
  mode = "store",
}) => {
  return mode === "store" ? (
    <Box>
      <Text fontSize="sm" mb={2} fontWeight="medium">
        Disponibilité
      </Text>
      <Select
        placeholder="Toute disponibilité"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        bg="white"
      >
        <option value="in_stock">En stock</option>
        <option value="low_stock">Stock faible</option>
        <option value="out_of_stock">Rupture</option>
      </Select>
    </Box>
  ) : (
    <Select
      placeholder="Filtrer par stock"
      size="sm"
      maxW="200px"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="in_stock">En stock</option>
      <option value="low_stock">Stock faible</option>
      <option value="out_of_stock">Rupture</option>
    </Select>
  );
};
