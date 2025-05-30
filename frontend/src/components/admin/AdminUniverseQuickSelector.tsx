import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React from "react";
import type { UniverseType } from "../../contexts/UniverseContext";
import {
  getUniverseColorScheme,
  getUniverseIcon,
  getUniverseName,
} from "../../utils/universeMapping";

interface AdminUniverseQuickSelectorProps {
  selectedUniverse?: UniverseType | null;
  onUniverseChange: (universe: UniverseType) => void;
  loading?: boolean;
}

const universeOptions: UniverseType[] = [
  "brewery",
  "teaShop",
  "beautyShop",
  "herbShop",
];

/**
 * Sélecteur compact d'univers pour la sidebar admin
 * Permet de choisir l'univers métier (brasserie, salon de thé, etc.)
 * La gestion des boutiques se fait ensuite dans les pages dédiées
 */
const AdminUniverseQuickSelector: React.FC<AdminUniverseQuickSelectorProps> = ({
  selectedUniverse,
  onUniverseChange,
  loading = false,
}) => {
  if (loading) {
    return <Spinner size="sm" color="gray.500" />;
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        w="full"
        colorScheme={
          selectedUniverse ? getUniverseColorScheme(selectedUniverse) : "gray"
        }
        variant="outline"
        size="sm"
        px={3}
        py={2}
      >
        <HStack spacing={2}>
          <Text fontSize="lg">
            {selectedUniverse ? getUniverseIcon(selectedUniverse) : "🌟"}
          </Text>
          <Text fontWeight="medium" isTruncated fontSize="sm">
            {selectedUniverse
              ? getUniverseName(selectedUniverse)
              : "Choisir un univers"}
          </Text>
          {selectedUniverse && (
            <Badge
              colorScheme={getUniverseColorScheme(selectedUniverse)}
              fontSize="0.7em"
            >
              Actif
            </Badge>
          )}
        </HStack>
      </MenuButton>
      <MenuList zIndex={2000}>
        {universeOptions.map((universe) => {
          const isSelected = selectedUniverse === universe;
          return (
            <MenuItem
              key={universe}
              onClick={() => onUniverseChange(universe)}
              color={
                isSelected
                  ? `${getUniverseColorScheme(universe)}.600`
                  : undefined
              }
              fontWeight={isSelected ? "bold" : "normal"}
              bg={
                isSelected
                  ? `${getUniverseColorScheme(universe)}.50`
                  : undefined
              }
            >
              <HStack spacing={2}>
                <Text fontSize="lg">{getUniverseIcon(universe)}</Text>
                <Text>{getUniverseName(universe)}</Text>
                {isSelected && (
                  <Badge
                    colorScheme={getUniverseColorScheme(universe)}
                    fontSize="0.7em"
                  >
                    ✓
                  </Badge>
                )}
              </HStack>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default AdminUniverseQuickSelector;
