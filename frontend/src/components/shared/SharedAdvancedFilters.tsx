import {
  Box,
  Button,
  Collapse,
  Divider,
  HStack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import type { Product, Shop } from "../../../../shared/types";
import type { ProductFilters } from "../../services/adminProductService";
import { getUniverseColorScheme } from "../../utils/universeMapping";
import { PriceRangeFilter, SearchFilter, StockFilter } from "./filters/base";
import {
  BeautyShopFilters,
  BreweryFilters,
  HerbShopFilters,
  TeaShopFilters,
} from "./filters/specialized";

interface SharedAdvancedFiltersProps {
  shop: Shop;
  filters: ProductFilters;
  searchTerm: string;
  onFiltersChange: (filters: ProductFilters) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  mode?: "admin" | "store";
  products?: Product[];
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
  products = [],
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const themeColor = getUniverseColorScheme(shop.shopType);

  // Extraction dynamique des options depuis les produits
  const dynamicOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    products.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);
          Object.entries(attrs).forEach(([key, value]) => {
            if (!options[key]) options[key] = new Set();
            options[key].add(value as string);
          });
        } catch {
          // Ignore les erreurs de parsing JSON
        }
      }
    });

    return Object.fromEntries(
      Object.entries(options).map(([key, set]) => [key, Array.from(set).sort()])
    );
  }, [products]);

  const handleFilterChange = (key: keyof ProductFilters, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const renderSpecializedFilters = () => {
    const commonProps = {
      filters,
      onFilterChange: handleFilterChange,
      mode,
      themeColor,
      dynamicOptions,
    };

    switch (shop.shopType) {
      case "brewery":
        return <BreweryFilters {...commonProps} />;
      case "teaShop":
        return <TeaShopFilters {...commonProps} />;
      case "beautyShop":
        return <BeautyShopFilters {...commonProps} />;
      case "herbShop":
        return <HerbShopFilters {...commonProps} />;
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
        <SearchFilter
          value={searchTerm}
          onChange={onSearchChange}
          mode={mode}
          themeColor={themeColor}
        />

        {/* Filtres de base */}
        {mode === "store" ? (
          <VStack spacing={4} align="stretch">
            <StockFilter
              value={filters.stockStatus}
              onChange={(value) => handleFilterChange("stockStatus", value)}
              mode={mode}
            />

            <PriceRangeFilter
              minPrice={filters.minPrice || 3}
              maxPrice={filters.maxPrice || 15}
              onChange={(min, max) => {
                handleFilterChange("minPrice", min);
                handleFilterChange("maxPrice", max);
              }}
              mode={mode}
              themeColor={themeColor}
            />
          </VStack>
        ) : (
          <HStack spacing={4} wrap="wrap">
            <StockFilter
              value={filters.stockStatus}
              onChange={(value) => handleFilterChange("stockStatus", value)}
              mode={mode}
            />

            <PriceRangeFilter
              minPrice={filters.minPrice || 0}
              maxPrice={filters.maxPrice || 0}
              onChange={(min, max) => {
                handleFilterChange("minPrice", min);
                handleFilterChange("maxPrice", max);
              }}
              mode={mode}
              themeColor={themeColor}
            />
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
