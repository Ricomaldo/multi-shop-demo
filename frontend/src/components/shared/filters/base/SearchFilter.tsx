import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  mode?: "admin" | "store";
  themeColor: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  onChange,
  mode = "store",
  themeColor,
}) => {
  return (
    <InputGroup size={mode === "admin" ? "md" : "lg"}>
      <InputLeftElement>
        <SearchIcon color="gray.400" />
      </InputLeftElement>
      <Input
        placeholder="Rechercher un produit..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        borderRadius={mode === "admin" ? "md" : "lg"}
        _focus={{
          borderColor: `${themeColor}.400`,
          boxShadow: `0 0 0 1px var(--chakra-colors-${themeColor}-400)`,
        }}
      />
    </InputGroup>
  );
};
