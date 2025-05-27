import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import type { Shop } from "../../../../shared/types";
import type { ProductFilters } from "../../services/adminProductService";

interface AdminAdvancedFiltersProps {
  shop: Shop;
  filters: ProductFilters;
  searchTerm: string;
  onFiltersChange: (filters: ProductFilters) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export const AdminAdvancedFilters: React.FC<AdminAdvancedFiltersProps> = ({
  shop,
  filters,
  searchTerm,
  onFiltersChange,
  onSearchChange,
  onReset,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  // Couleur thématique selon l'univers
  const getThemeColor = () => {
    switch (shop.shopType) {
      case "brewery":
        return "orange";
      case "tea-shop":
        return "green";
      case "beauty-shop":
        return "pink";
      case "herb-shop":
        return "green";
      default:
        return "blue";
    }
  };

  const themeColor = getThemeColor();

  // Gestionnaires de changement
  const handleFilterChange = (key: keyof ProductFilters, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    onFiltersChange({
      ...filters,
      [type === "min" ? "minPrice" : "maxPrice"]: value,
    });
  };

  // Rendu des filtres spécialisés selon l'univers
  const renderSpecializedFilters = () => {
    switch (shop.shopType) {
      case "brewery":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={`${themeColor}.600`}>
              🍺 Filtres Brasserie
            </Text>

            <HStack spacing={4}>
              <Box>
                <Text fontSize="sm" mb={1}>
                  Degré d'alcool min
                </Text>
                <NumberInput
                  size="sm"
                  min={0}
                  max={20}
                  step={0.1}
                  value={filters.degre_alcool_min || ""}
                  onChange={(_, value) =>
                    handleFilterChange("degre_alcool_min", value)
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
                  Degré d'alcool max
                </Text>
                <NumberInput
                  size="sm"
                  min={0}
                  max={20}
                  step={0.1}
                  value={filters.degre_alcool_max || ""}
                  onChange={(_, value) =>
                    handleFilterChange("degre_alcool_max", value)
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

            <HStack spacing={4}>
              <Box>
                <Text fontSize="sm" mb={1}>
                  Amertume IBU min
                </Text>
                <NumberInput
                  size="sm"
                  min={0}
                  max={100}
                  value={filters.amertume_ibu_min || ""}
                  onChange={(_, value) =>
                    handleFilterChange("amertume_ibu_min", value)
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
                  Amertume IBU max
                </Text>
                <NumberInput
                  size="sm"
                  min={0}
                  max={100}
                  value={filters.amertume_ibu_max || ""}
                  onChange={(_, value) =>
                    handleFilterChange("amertume_ibu_max", value)
                  }
                >
                  <NumberInputField placeholder="100" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </HStack>

            <Box>
              <Text fontSize="sm" mb={1}>
                Type de houblon
              </Text>
              <Input
                size="sm"
                placeholder="Ex: Cascade, Centennial"
                value={filters.type_houblon || ""}
                onChange={(e) =>
                  handleFilterChange("type_houblon", e.target.value)
                }
              />
            </Box>
          </VStack>
        );

      case "tea-shop":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={`${themeColor}.600`}>
              🍵 Filtres Salon de Thé
            </Text>

            <Box>
              <Text fontSize="sm" mb={1}>
                Origine plantation
              </Text>
              <Input
                size="sm"
                placeholder="Ex: Darjeeling, Ceylan"
                value={filters.origine_plantation || ""}
                onChange={(e) =>
                  handleFilterChange("origine_plantation", e.target.value)
                }
              />
            </Box>

            <Box>
              <Text fontSize="sm" mb={1}>
                Grade qualité
              </Text>
              <Select
                size="sm"
                placeholder="Sélectionner un grade"
                value={filters.grade_qualite || ""}
                onChange={(e) =>
                  handleFilterChange("grade_qualite", e.target.value)
                }
              >
                <option value="FTGFOP">FTGFOP</option>
                <option value="SFTGFOP">SFTGFOP</option>
                <option value="OP">OP</option>
                <option value="Pekoe">Pekoe</option>
                <option value="Broken">Broken</option>
              </Select>
            </Box>
          </VStack>
        );

      case "beauty-shop":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={`${themeColor}.600`}>
              💄 Filtres Institut Beauté
            </Text>

            <Box>
              <Text fontSize="sm" mb={1}>
                Type de peau
              </Text>
              <Select
                size="sm"
                placeholder="Sélectionner un type"
                value={filters.type_peau || ""}
                onChange={(e) =>
                  handleFilterChange("type_peau", e.target.value)
                }
              >
                <option value="Tous types">Tous types</option>
                <option value="Peau sèche">Peau sèche</option>
                <option value="Peau grasse">Peau grasse</option>
                <option value="Peau mixte">Peau mixte</option>
                <option value="Peau sensible">Peau sensible</option>
                <option value="Peau mature">Peau mature</option>
              </Select>
            </Box>

            <HStack spacing={4} align="end">
              <Text fontSize="sm">Certification bio</Text>
              <Switch
                colorScheme={themeColor}
                isChecked={filters.certification_bio || false}
                onChange={(e) =>
                  handleFilterChange("certification_bio", e.target.checked)
                }
              />
            </HStack>
          </VStack>
        );

      case "herb-shop":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={`${themeColor}.600`}>
              🌿 Filtres Herboristerie
            </Text>

            <Box>
              <Text fontSize="sm" mb={1}>
                Usage traditionnel
              </Text>
              <Input
                size="sm"
                placeholder="Ex: Digestion, Sommeil"
                value={filters.usage_traditionnel || ""}
                onChange={(e) =>
                  handleFilterChange("usage_traditionnel", e.target.value)
                }
              />
            </Box>

            <Box>
              <Text fontSize="sm" mb={1}>
                Forme galénique
              </Text>
              <Select
                size="sm"
                placeholder="Sélectionner une forme"
                value={filters.forme_galenique || ""}
                onChange={(e) =>
                  handleFilterChange("forme_galenique", e.target.value)
                }
              >
                <option value="Gélules">Gélules</option>
                <option value="Tisane">Tisane</option>
                <option value="Teinture mère">Teinture mère</option>
                <option value="Huile essentielle">Huile essentielle</option>
                <option value="Poudre">Poudre</option>
                <option value="Comprimés">Comprimés</option>
              </Select>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm;

  return (
    <Box bg="white" p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
      <VStack spacing={4} align="stretch">
        {/* Recherche textuelle */}
        <InputGroup>
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </InputGroup>

        {/* Filtres de base */}
        <HStack spacing={4} wrap="wrap">
          <Select
            placeholder="Filtrer par stock"
            size="sm"
            maxW="200px"
            value={filters.stockStatus || ""}
            onChange={(e) => handleFilterChange("stockStatus", e.target.value)}
          >
            <option value="in_stock">En stock</option>
            <option value="low_stock">Stock faible</option>
            <option value="out_of_stock">Rupture</option>
          </Select>

          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              Prix :
            </Text>
            <NumberInput
              size="sm"
              maxW="80px"
              min={0}
              value={filters.minPrice || ""}
              onChange={(_, value) => handlePriceChange("min", value || 0)}
            >
              <NumberInputField placeholder="Min" />
            </NumberInput>
            <Text fontSize="sm" color="gray.600">
              -
            </Text>
            <NumberInput
              size="sm"
              maxW="80px"
              min={0}
              value={filters.maxPrice || ""}
              onChange={(_, value) => handlePriceChange("max", value || 0)}
            >
              <NumberInputField placeholder="Max" />
            </NumberInput>
            <Text fontSize="sm" color="gray.600">
              €
            </Text>
          </HStack>

          <Button
            size="sm"
            variant="outline"
            colorScheme={themeColor}
            onClick={onToggle}
          >
            Filtres avancés {isOpen ? "▲" : "▼"}
          </Button>

          {hasActiveFilters && (
            <Button size="sm" variant="ghost" onClick={onReset}>
              Effacer les filtres
            </Button>
          )}
        </HStack>

        {/* Filtres avancés spécialisés */}
        <Collapse in={isOpen} animateOpacity>
          <Box pt={4}>
            <Divider mb={4} />
            {renderSpecializedFilters()}
          </Box>
        </Collapse>
      </VStack>
    </Box>
  );
};

export default AdminAdvancedFilters;
