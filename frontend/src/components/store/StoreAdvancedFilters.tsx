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
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import type { Shop } from "../../../../shared/types";
import type { ProductFilters } from "../../services/adminProductService";

interface StoreAdvancedFiltersProps {
  shop: Shop;
  filters: ProductFilters;
  searchTerm: string;
  onFiltersChange: (filters: ProductFilters) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export const StoreAdvancedFilters: React.FC<StoreAdvancedFiltersProps> = ({
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

  const handlePriceRangeChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  // Rendu des filtres spécialisés selon l'univers
  const renderSpecializedFilters = () => {
    switch (shop.shopType) {
      case "brewery":
        return (
          <VStack spacing={6} align="stretch">
            <Text fontWeight="medium" color={`${themeColor}.600`} fontSize="lg">
              🍺 Filtres Brasserie
            </Text>

            {/* Degré d'alcool avec slider */}
            <Box>
              <Text fontSize="sm" mb={3} fontWeight="medium">
                Degré d'alcool : {filters.degre_alcool_min || 3}° -{" "}
                {filters.degre_alcool_max || 12}°
              </Text>
              <RangeSlider
                min={3}
                max={12}
                step={0.1}
                value={[
                  filters.degre_alcool_min || 3,
                  filters.degre_alcool_max || 12,
                ]}
                onChange={(values) => {
                  handleFilterChange("degre_alcool_min", values[0]);
                  handleFilterChange("degre_alcool_max", values[1]);
                }}
                colorScheme={themeColor}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Box>

            {/* Amertume IBU avec slider */}
            <Box>
              <Text fontSize="sm" mb={3} fontWeight="medium">
                Amertume IBU : {filters.amertume_ibu_min || 10} -{" "}
                {filters.amertume_ibu_max || 90}
              </Text>
              <RangeSlider
                min={10}
                max={90}
                step={1}
                value={[
                  filters.amertume_ibu_min || 10,
                  filters.amertume_ibu_max || 90,
                ]}
                onChange={(values) => {
                  handleFilterChange("amertume_ibu_min", values[0]);
                  handleFilterChange("amertume_ibu_max", values[1]);
                }}
                colorScheme={themeColor}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Box>

            {/* Type de houblon */}
            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Type de houblon
              </Text>
              <Select
                placeholder="Tous les houblons"
                value={filters.type_houblon || ""}
                onChange={(e) =>
                  handleFilterChange("type_houblon", e.target.value)
                }
                bg="white"
              >
                <option value="Cascade">Cascade</option>
                <option value="Centennial">Centennial</option>
                <option value="Chinook">Chinook</option>
                <option value="Columbus">Columbus</option>
                <option value="Fuggle">Fuggle</option>
                <option value="Goldings">Goldings</option>
                <option value="Hallertau">Hallertau</option>
                <option value="Saaz">Saaz</option>
              </Select>
            </Box>
          </VStack>
        );

      case "tea-shop":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={`${themeColor}.600`} fontSize="lg">
              🍵 Filtres Salon de Thé
            </Text>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Origine plantation
              </Text>
              <Select
                placeholder="Toutes les origines"
                value={filters.origine_plantation || ""}
                onChange={(e) =>
                  handleFilterChange("origine_plantation", e.target.value)
                }
                bg="white"
              >
                <option value="Darjeeling">Darjeeling</option>
                <option value="Assam">Assam</option>
                <option value="Ceylan">Ceylan</option>
                <option value="Chine">Chine</option>
                <option value="Japon">Japon</option>
              </Select>
            </Box>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Grade qualité
              </Text>
              <Select
                placeholder="Tous les grades"
                value={filters.grade_qualite || ""}
                onChange={(e) =>
                  handleFilterChange("grade_qualite", e.target.value)
                }
                bg="white"
              >
                <option value="FTGFOP">
                  FTGFOP (Finest Tippy Golden Flowery Orange Pekoe)
                </option>
                <option value="SFTGFOP">
                  SFTGFOP (Super Fine Tippy Golden Flowery Orange Pekoe)
                </option>
                <option value="OP">OP (Orange Pekoe)</option>
                <option value="Pekoe">Pekoe</option>
                <option value="Broken">Broken</option>
              </Select>
            </Box>
          </VStack>
        );

      case "beauty-shop":
        return (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium" color={`${themeColor}.600`} fontSize="lg">
              💄 Filtres Institut Beauté
            </Text>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Type de peau
              </Text>
              <Select
                placeholder="Tous types de peau"
                value={filters.type_peau || ""}
                onChange={(e) =>
                  handleFilterChange("type_peau", e.target.value)
                }
                bg="white"
              >
                <option value="Tous types">Tous types</option>
                <option value="Peau sèche">Peau sèche</option>
                <option value="Peau grasse">Peau grasse</option>
                <option value="Peau mixte">Peau mixte</option>
                <option value="Peau sensible">Peau sensible</option>
                <option value="Peau mature">Peau mature</option>
              </Select>
            </Box>

            <HStack spacing={4} align="center">
              <Text fontSize="sm" fontWeight="medium">
                Certification bio
              </Text>
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
            <Text fontWeight="medium" color={`${themeColor}.600`} fontSize="lg">
              🌿 Filtres Herboristerie
            </Text>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Usage traditionnel
              </Text>
              <Select
                placeholder="Tous les usages"
                value={filters.usage_traditionnel || ""}
                onChange={(e) =>
                  handleFilterChange("usage_traditionnel", e.target.value)
                }
                bg="white"
              >
                <option value="Digestion">Digestion</option>
                <option value="Sommeil">Sommeil</option>
                <option value="Stress">Stress</option>
                <option value="Immunité">Immunité</option>
                <option value="Circulation">Circulation</option>
                <option value="Détox">Détox</option>
              </Select>
            </Box>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Forme galénique
              </Text>
              <Select
                placeholder="Toutes les formes"
                value={filters.forme_galenique || ""}
                onChange={(e) =>
                  handleFilterChange("forme_galenique", e.target.value)
                }
                bg="white"
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
    <Box bg="white" p={6} borderRadius="xl" shadow="lg" borderWidth="1px">
      <VStack spacing={6} align="stretch">
        {/* Recherche textuelle */}
        <InputGroup size="lg">
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            borderRadius="lg"
            _focus={{
              borderColor: `${themeColor}.400`,
              boxShadow: `0 0 0 1px var(--chakra-colors-${themeColor}-400)`,
            }}
          />
        </InputGroup>

        {/* Filtres de base */}
        <VStack spacing={4} align="stretch">
          {/* Filtre par stock */}
          <Box>
            <Text fontSize="sm" mb={2} fontWeight="medium">
              Disponibilité
            </Text>
            <Select
              placeholder="Toute disponibilité"
              value={filters.stockStatus || ""}
              onChange={(e) =>
                handleFilterChange("stockStatus", e.target.value)
              }
              bg="white"
            >
              <option value="in_stock">En stock</option>
              <option value="low_stock">Stock faible</option>
              <option value="out_of_stock">Rupture</option>
            </Select>
          </Box>

          {/* Fourchette de prix */}
          <Box>
            <Text fontSize="sm" mb={3} fontWeight="medium">
              Prix : {filters.minPrice || 3}€ - {filters.maxPrice || 15}€
            </Text>
            <RangeSlider
              min={3}
              max={15}
              step={0.1}
              value={[filters.minPrice || 3, filters.maxPrice || 15]}
              onChange={handlePriceRangeChange}
              colorScheme={themeColor}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </Box>
        </VStack>

        {/* Bouton pour afficher/masquer les filtres avancés */}
        <HStack justify="space-between">
          <Button
            variant="outline"
            colorScheme={themeColor}
            onClick={onToggle}
            size="md"
          >
            Filtres spécialisés {isOpen ? "▲" : "▼"}
          </Button>

          {hasActiveFilters && (
            <Button
              size="md"
              variant="ghost"
              colorScheme={themeColor}
              onClick={onReset}
            >
              Effacer les filtres
            </Button>
          )}
        </HStack>

        {/* Filtres avancés spécialisés */}
        <Collapse in={isOpen} animateOpacity>
          <Box pt={4}>
            <Divider mb={6} />
            {renderSpecializedFilters()}
          </Box>
        </Collapse>
      </VStack>
    </Box>
  );
};

export default StoreAdvancedFilters;
