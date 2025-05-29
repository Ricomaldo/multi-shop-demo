import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
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
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  SimpleGrid,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import type { Product, Shop } from "../../../../shared/types";
import type { ProductFilters } from "../../services/adminProductService";

interface SharedAdvancedFiltersProps {
  shop: Shop;
  filters: ProductFilters;
  searchTerm: string;
  onFiltersChange: (filters: ProductFilters) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  mode?: "admin" | "store"; // Différenciation interface
  variant?: "compact" | "full"; // Variantes d'affichage
  products?: Product[]; // Ajout pour génération dynamique des filtres
}

/**
 * Composant partagé universel pour les filtres avancés
 * Unifie AdminAdvancedFilters et StoreAdvancedFilters
 * S'adapte automatiquement au thème et aux attributs métier de chaque univers
 */
export const SharedAdvancedFilters: React.FC<SharedAdvancedFiltersProps> = ({
  shop,
  filters,
  searchTerm,
  onFiltersChange,
  onSearchChange,
  onReset,
  mode = "store",
  variant = "full",
  products = [],
}) => {
  const { isOpen, onToggle } = useDisclosure();

  // Thématisation automatique selon l'univers
  const getThemeColor = () => {
    switch (shop.shopType) {
      case "brewery":
        return "orange";
      case "tea-shop":
        return "green";
      case "beauty-shop":
        return "pink";
      case "herb-shop":
        return "teal";
      default:
        return "blue";
    }
  };

  const themeColor = getThemeColor();

  // Extraction dynamique des options depuis les produits
  const dynamicOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    products.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);

          // Extraction des types de houblon
          if (attrs.type_houblon && shop.shopType === "brewery") {
            if (!options.type_houblon) options.type_houblon = new Set();
            options.type_houblon.add(attrs.type_houblon);
          }

          // Extraction des origines de plantation pour le thé
          if (attrs.origine_plantation && shop.shopType === "tea-shop") {
            if (!options.origine_plantation)
              options.origine_plantation = new Set();
            options.origine_plantation.add(attrs.origine_plantation);
          }

          // Extraction des usages traditionnels pour l'herboristerie
          if (attrs.usage_traditionnel && shop.shopType === "herb-shop") {
            if (!options.usage_traditionnel)
              options.usage_traditionnel = new Set();
            options.usage_traditionnel.add(attrs.usage_traditionnel);
          }
        } catch (e) {
          // Ignore les erreurs de parsing JSON
        }
      }
    });

    // Conversion des Sets en Arrays triés
    const result: Record<string, string[]> = {};
    Object.keys(options).forEach((key) => {
      result[key] = Array.from(options[key]).sort();
    });

    return result;
  }, [products, shop.shopType]);

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
          <VStack spacing={mode === "admin" ? 4 : 6} align="stretch">
            <Text
              fontWeight="medium"
              color={`${themeColor}.600`}
              fontSize={mode === "admin" ? "md" : "lg"}
            >
              🍺 Filtres Brasserie
            </Text>

            {/* Degré d'alcool - Filtres par plages prédéfinies */}
            <Box>
              <Text fontSize="sm" mb={3} fontWeight="medium">
                Degré d'alcool
              </Text>
              {mode === "store" ? (
                <CheckboxGroup
                  value={filters.degre_alcool_ranges || []}
                  onChange={(values) =>
                    handleFilterChange("degre_alcool_ranges", values)
                  }
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
              )}
            </Box>

            {/* Amertume IBU - Filtres par plages prédéfinies */}
            <Box>
              <Text fontSize="sm" mb={3} fontWeight="medium">
                Amertume IBU
              </Text>
              {mode === "store" ? (
                <CheckboxGroup
                  value={filters.amertume_ibu_ranges || []}
                  onChange={(values) =>
                    handleFilterChange("amertume_ibu_ranges", values)
                  }
                >
                  <SimpleGrid columns={2} spacing={2}>
                    <Checkbox value="low" colorScheme={themeColor}>
                      Douce (10-25 IBU)
                    </Checkbox>
                    <Checkbox value="medium" colorScheme={themeColor}>
                      Équilibrée (25-45 IBU)
                    </Checkbox>
                    <Checkbox value="high" colorScheme={themeColor}>
                      Amère (45-70 IBU)
                    </Checkbox>
                    <Checkbox value="very-high" colorScheme={themeColor}>
                      Très amère (70+ IBU)
                    </Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              ) : (
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
              )}
            </Box>

            {/* Type de houblon - Options dynamiques */}
            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Type de houblon
              </Text>
              {mode === "store" ? (
                <Select
                  placeholder="Tous les houblons"
                  value={filters.type_houblon || ""}
                  onChange={(e) =>
                    handleFilterChange("type_houblon", e.target.value)
                  }
                  bg="white"
                >
                  {dynamicOptions.type_houblon?.length > 0 ? (
                    dynamicOptions.type_houblon.map((houblon) => (
                      <option key={houblon} value={houblon}>
                        {houblon}
                      </option>
                    ))
                  ) : (
                    // Options par défaut si pas de données dynamiques
                    <>
                      <option value="Cascade">Cascade</option>
                      <option value="Centennial">Centennial</option>
                      <option value="Chinook">Chinook</option>
                      <option value="Columbus">Columbus</option>
                      <option value="Fuggle">Fuggle</option>
                      <option value="Goldings">Goldings</option>
                      <option value="Hallertau">Hallertau</option>
                      <option value="Saaz">Saaz</option>
                    </>
                  )}
                </Select>
              ) : (
                <Input
                  size="sm"
                  placeholder="Ex: Cascade, Centennial"
                  value={filters.type_houblon || ""}
                  onChange={(e) =>
                    handleFilterChange("type_houblon", e.target.value)
                  }
                />
              )}
            </Box>
          </VStack>
        );

      case "tea-shop":
        return (
          <VStack spacing={4} align="stretch">
            <Text
              fontWeight="medium"
              color={`${themeColor}.600`}
              fontSize={mode === "admin" ? "md" : "lg"}
            >
              🍵 Filtres Salon de Thé
            </Text>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Origine plantation
              </Text>
              {mode === "store" ? (
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
              ) : (
                <Input
                  size="sm"
                  placeholder="Ex: Darjeeling, Ceylan"
                  value={filters.origine_plantation || ""}
                  onChange={(e) =>
                    handleFilterChange("origine_plantation", e.target.value)
                  }
                />
              )}
            </Box>

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
                onChange={(e) =>
                  handleFilterChange("grade_qualite", e.target.value)
                }
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

      case "beauty-shop":
        return (
          <VStack spacing={4} align="stretch">
            <Text
              fontWeight="medium"
              color={`${themeColor}.600`}
              fontSize={mode === "admin" ? "md" : "lg"}
            >
              💄 Filtres Institut Beauté
            </Text>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Type de peau
              </Text>
              <Select
                size={mode === "admin" ? "sm" : "md"}
                placeholder={
                  mode === "store"
                    ? "Tous types de peau"
                    : "Sélectionner un type"
                }
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
            <Text
              fontWeight="medium"
              color={`${themeColor}.600`}
              fontSize={mode === "admin" ? "md" : "lg"}
            >
              🌿 Filtres Herboristerie
            </Text>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Usage traditionnel
              </Text>
              {mode === "store" ? (
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
              ) : (
                <Input
                  size="sm"
                  placeholder="Ex: Digestion, Sommeil"
                  value={filters.usage_traditionnel || ""}
                  onChange={(e) =>
                    handleFilterChange("usage_traditionnel", e.target.value)
                  }
                />
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb={2} fontWeight="medium">
                Forme galénique
              </Text>
              <Select
                size={mode === "admin" ? "sm" : "md"}
                placeholder={
                  mode === "store"
                    ? "Toutes les formes"
                    : "Sélectionner une forme"
                }
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
    <Box
      bg="white"
      p={mode === "admin" ? 4 : 6}
      borderRadius={mode === "admin" ? "lg" : "xl"}
      shadow={mode === "admin" ? "sm" : "lg"}
      borderWidth="1px"
    >
      <VStack spacing={mode === "admin" ? 4 : 6} align="stretch">
        {/* Recherche textuelle */}
        <InputGroup size={mode === "admin" ? "md" : "lg"}>
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            borderRadius={mode === "admin" ? "md" : "lg"}
            _focus={{
              borderColor: `${themeColor}.400`,
              boxShadow: `0 0 0 1px var(--chakra-colors-${themeColor}-400)`,
            }}
          />
        </InputGroup>

        {/* Filtres de base */}
        {mode === "store" ? (
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

            {/* Fourchette de prix avec slider */}
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
        ) : (
          <HStack spacing={4} wrap="wrap">
            <Select
              placeholder="Filtrer par stock"
              size="sm"
              maxW="200px"
              value={filters.stockStatus || ""}
              onChange={(e) =>
                handleFilterChange("stockStatus", e.target.value)
              }
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
          </HStack>
        )}

        {/* Bouton pour afficher/masquer les filtres avancés */}
        <HStack justify="space-between">
          <Button
            variant="outline"
            colorScheme={themeColor}
            onClick={onToggle}
            size={mode === "admin" ? "sm" : "md"}
          >
            {mode === "admin" ? "Filtres avancés" : "Filtres spécialisés"}{" "}
            {isOpen ? "▲" : "▼"}
          </Button>

          {hasActiveFilters && (
            <Button
              size={mode === "admin" ? "sm" : "md"}
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
            <Divider mb={mode === "admin" ? 4 : 6} />
            {renderSpecializedFilters()}
          </Box>
        </Collapse>
      </VStack>
    </Box>
  );
};

export default SharedAdvancedFilters;
