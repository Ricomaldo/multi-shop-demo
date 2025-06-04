import type { Shop } from "@/types";
import type { ProductFilters } from "@/services/adminProductService";
import { getUniverseTokens } from "@/theme/universeTokens";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
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
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

interface SharedProductFiltersProps {
  shop: Shop;
  filters: ProductFilters;
  searchTerm: string;
  onFiltersChange: (filters: ProductFilters) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  mode?: "admin" | "store";
}

export const SharedProductFilters: React.FC<SharedProductFiltersProps> = ({
  shop,
  filters,
  searchTerm,
  onFiltersChange,
  onSearchChange,
  onReset,
  mode = "store",
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const tokens = getUniverseTokens(shop.shopType || "brewery");
  const colorScheme = tokens.meta.colorScheme;

  const handleFilterChange = (key: string, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value } as ProductFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm;

  const renderShopSpecificFilters = () => {
    switch (shop.shopType) {
      case "brewery":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="medium">
              🍺 Filtres Brasserie
            </Text>

            <Box>
              <Text fontSize="sm" mb={2}>
                Degré d'alcool (%)
              </Text>
              <HStack spacing={4}>
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
                  <NumberInputField placeholder="Min" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
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
                  <NumberInputField placeholder="Max" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
            </Box>

            <Box>
              <Text fontSize="sm" mb={2}>
                Type de houblon
              </Text>
              <Select
                size="sm"
                placeholder="Tous les houblons"
                value={filters.type_houblon || ""}
                onChange={(e) =>
                  handleFilterChange("type_houblon", e.target.value)
                }
              >
                <option value="Cascade">Cascade</option>
                <option value="Centennial">Centennial</option>
                <option value="Chinook">Chinook</option>
                <option value="Saaz">Saaz</option>
              </Select>
            </Box>
          </VStack>
        );

      case "teaShop":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="medium">
              🍵 Filtres Salon de Thé
            </Text>

            <Box>
              <Text fontSize="sm" mb={2}>
                Type de thé
              </Text>
              <Select
                size="sm"
                placeholder="Tous les thés"
                value={filters.type_the || ""}
                onChange={(e) => handleFilterChange("type_the", e.target.value)}
              >
                <option value="Vert">Thé vert</option>
                <option value="Noir">Thé noir</option>
                <option value="Blanc">Thé blanc</option>
                <option value="Oolong">Oolong</option>
              </Select>
            </Box>

            <HStack spacing={4}>
              <Text fontSize="sm">Origine bio</Text>
              <Switch
                colorScheme={colorScheme}
                isChecked={filters.origine_bio || false}
                onChange={(e) =>
                  handleFilterChange("origine_bio", e.target.checked)
                }
              />
            </HStack>
          </VStack>
        );

      case "beautyShop":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="medium">
              💄 Filtres Institut Beauté
            </Text>

            <Box>
              <Text fontSize="sm" mb={2}>
                Type de peau
              </Text>
              <Select
                size="sm"
                placeholder="Tous types de peau"
                value={filters.type_peau || ""}
                onChange={(e) =>
                  handleFilterChange("type_peau", e.target.value)
                }
              >
                <option value="Sèche">Peau sèche</option>
                <option value="Grasse">Peau grasse</option>
                <option value="Mixte">Peau mixte</option>
                <option value="Sensible">Peau sensible</option>
              </Select>
            </Box>

            <HStack spacing={4}>
              <Text fontSize="sm">Certification bio</Text>
              <Switch
                colorScheme={colorScheme}
                isChecked={filters.certification_bio || false}
                onChange={(e) =>
                  handleFilterChange("certification_bio", e.target.checked)
                }
              />
            </HStack>
          </VStack>
        );

      case "herbShop":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="medium">
              🌿 Filtres Herboristerie
            </Text>

            <Box>
              <Text fontSize="sm" mb={2}>
                Propriété thérapeutique
              </Text>
              <Select
                size="sm"
                placeholder="Toutes propriétés"
                value={filters.propriete_therapeutique || ""}
                onChange={(e) =>
                  handleFilterChange("propriete_therapeutique", e.target.value)
                }
              >
                <option value="Digestive">Digestive</option>
                <option value="Relaxante">Relaxante</option>
                <option value="Tonifiante">Tonifiante</option>
                <option value="Anti-inflammatoire">Anti-inflammatoire</option>
              </Select>
            </Box>

            <HStack spacing={4}>
              <Text fontSize="sm">Culture biologique</Text>
              <Switch
                colorScheme={colorScheme}
                isChecked={filters.culture_bio || false}
                onChange={(e) =>
                  handleFilterChange("culture_bio", e.target.checked)
                }
              />
            </HStack>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box bg="white" p={4} borderRadius="lg" shadow="sm" borderWidth="1px">
      <VStack spacing={4} align="stretch">
        {/* Recherche */}
        <InputGroup size={mode === "admin" ? "md" : "lg"}>
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            _focus={{
              borderColor: `${colorScheme}.400`,
              boxShadow: `0 0 0 1px var(--chakra-colors-${colorScheme}-400)`,
            }}
          />
        </InputGroup>

        {/* Filtres de base */}
        <HStack spacing={4} wrap="wrap">
          <Box>
            <Text fontSize="sm" mb={2}>
              Stock
            </Text>
            <Select
              size="sm"
              value={filters.stockStatus || ""}
              onChange={(e) =>
                handleFilterChange("stockStatus", e.target.value)
              }
            >
              <option value="">Tous</option>
              <option value="available">En stock</option>
              <option value="low">Stock faible</option>
              <option value="out">Rupture</option>
            </Select>
          </Box>

          <Box>
            <Text fontSize="sm" mb={2}>
              Prix (€)
            </Text>
            <HStack spacing={2}>
              <NumberInput
                size="sm"
                min={0}
                value={filters.minPrice || ""}
                onChange={(_, value) => handleFilterChange("minPrice", value)}
              >
                <NumberInputField placeholder="Min" />
              </NumberInput>
              <NumberInput
                size="sm"
                min={0}
                value={filters.maxPrice || ""}
                onChange={(_, value) => handleFilterChange("maxPrice", value)}
              >
                <NumberInputField placeholder="Max" />
              </NumberInput>
            </HStack>
          </Box>
        </HStack>

        {/* Bouton filtres avancés */}
        <HStack justify="space-between">
          <Button
            variant="outline"
            colorScheme={colorScheme}
            onClick={onToggle}
            size="sm"
          >
            Filtres spécialisés {isOpen ? "▲" : "▼"}
          </Button>

          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme={colorScheme}
              onClick={onReset}
            >
              Effacer
            </Button>
          )}
        </HStack>

        {/* Filtres spécialisés */}
        <Collapse in={isOpen} animateOpacity>
          <Box pt={4} borderTop="1px solid" borderColor="gray.200">
            {renderShopSpecificFilters()}
          </Box>
        </Collapse>
      </VStack>
    </Box>
  );
};
