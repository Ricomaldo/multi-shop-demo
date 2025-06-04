import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Shop } from "../../../../shared/types";
import { useOpeningStatus } from "../../hooks/useOpeningStatus";
import { getUniverseTokens } from "../../theme/universeTokens";

interface StoreShopSelectorProps {
  shops: Shop[];
  currentShop: Shop;
  onShopChange?: (shop: Shop) => void;
  showOpeningStatus?: boolean;
  variant?: "compact" | "full" | "minimal";
}

// Composant wrapper pour pouvoir utiliser le hook useOpeningStatus
interface ShopMenuItemProps {
  shop: Shop;
  currentShop: Shop;
  onShopChange?: (shop: Shop) => void;
  showOpeningStatus: boolean;
  variant: "compact" | "full" | "minimal";
  styles: {
    menuItem: Record<string, unknown>;
  };
}

function ShopMenuItem({
  shop,
  currentShop,
  onShopChange,
  showOpeningStatus,
  variant,
  styles,
}: ShopMenuItemProps) {
  const { isOpen, nextOpeningTime } = useOpeningStatus(shop.openingHours);

  if (variant === "compact") {
    return (
      <MenuItem
        key={shop.id}
        onClick={() => onShopChange?.(shop)}
        {...styles.menuItem}
        isDisabled={shop.id === currentShop.id}
      >
        <VStack align="start" spacing={2} w="full">
          <Text fontSize="sm" fontWeight="medium">
            {shop.name}
          </Text>
          {showOpeningStatus && (
            <HStack spacing={2} wrap="wrap">
              <Badge
                colorScheme={isOpen ? "green" : "red"}
                borderRadius="full"
                fontSize="xs"
                px={2}
                py={1}
              >
                {isOpen ? "Ouvert" : "Fermé"}
              </Badge>
            </HStack>
          )}
          {showOpeningStatus && !isOpen && nextOpeningTime && (
            <Text fontSize="xs" color="gray.500" lineHeight="1.2">
              Prochaine ouverture : {nextOpeningTime}
            </Text>
          )}
        </VStack>
      </MenuItem>
    );
  }

  if (variant === "full") {
    return (
      <MenuItem
        key={shop.id}
        onClick={() => onShopChange?.(shop)}
        {...styles.menuItem}
        isDisabled={shop.id === currentShop.id}
      >
        <VStack align="start" spacing={3} w="full">
          <HStack justify="space-between" w="full">
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
              {shop.name}
            </Text>
            {showOpeningStatus && (
              <Badge
                colorScheme={isOpen ? "green" : "red"}
                borderRadius="full"
                fontSize="xs"
                px={2}
                py={1}
              >
                {isOpen ? "Ouvert" : "Fermé"}
              </Badge>
            )}
          </HStack>
          <Text fontSize="xs" color="gray.600">
            {shop.description || shop.address || "Boutique disponible"}
          </Text>
          {showOpeningStatus && !isOpen && nextOpeningTime && (
            <Text
              fontSize="xs"
              color="gray.500"
              fontStyle="italic"
              lineHeight="1.2"
            >
              Prochaine ouverture : {nextOpeningTime}
            </Text>
          )}
        </VStack>
      </MenuItem>
    );
  }

  // variant === "minimal"
  return (
    <MenuItem
      key={shop.id}
      onClick={() => onShopChange?.(shop)}
      {...styles.menuItem}
      isDisabled={shop.id === currentShop.id}
      fontSize="xs"
    >
      <HStack justify="space-between" w="full">
        <Text>{shop.name}</Text>
        {showOpeningStatus && (
          <Badge
            colorScheme={isOpen ? "green" : "red"}
            borderRadius="full"
            fontSize="xs"
            px={1}
          >
            {isOpen ? "●" : "●"}
          </Badge>
        )}
      </HStack>
    </MenuItem>
  );
}

/**
 * Sélecteur de boutique premium différencié par shopType DIRECT
 * 🎯 APPLICATION DIRECTE shopType → tokens (plus de mapping !)
 */
export default function StoreShopSelector({
  shops,
  currentShop,
  onShopChange,
  showOpeningStatus = true,
  variant = "full",
}: StoreShopSelectorProps) {
  // 🎯 APPLICATION DIRECTE shopType → tokens (plus de mapping !)
  const tokens = getUniverseTokens(currentShop.shopType);

  // 🎯 Statut d'ouverture de la boutique courante
  const { isOpen: currentShopIsOpen } = useOpeningStatus(
    currentShop.openingHours
  );

  // Styles sophistiqués par shopType DIRECT
  const getSelectorStyles = () => {
    switch (currentShop.shopType) {
      case "brewery":
        // Sélecteur industriel - Robuste, avec caractère
        return {
          button: {
            bg: `linear-gradient(135deg, ${tokens.colors[200]}, ${tokens.colors[100]})`,
            border: `2px solid ${tokens.colors[400]}`,
            borderRadius: tokens.borderRadius.base,
            color: tokens.colors[800],
            fontFamily: tokens.typography.fontFamily.body,
            fontWeight: tokens.typography.fontWeight.heavy,
            textTransform: "uppercase" as const,
            letterSpacing: "wide",
            px: 6,
            py: 4,
            minH: tokens.heights.touchTarget, // Touch target 44px
            _hover: {
              bg: `linear-gradient(135deg, ${tokens.colors[300]}, ${tokens.colors[200]})`,
              borderColor: tokens.colors[500],
              transform: "none", // Pas de flottement - solidité
            },
            _active: {
              transform: "scale(0.98)",
            },
          },
          badge: {
            bg: tokens.colors[600],
            color: "white",
            borderRadius: tokens.borderRadius.base,
            fontSize: "xs",
            fontWeight: tokens.typography.fontWeight.heavy,
            textTransform: "uppercase" as const,
          },
          menu: {
            bg: tokens.colors[50],
            border: `2px solid ${tokens.colors[300]}`,
            borderRadius: tokens.borderRadius.md,
            shadow: "xl",
          },
          menuItem: {
            _hover: {
              bg: tokens.colors[200],
              color: tokens.colors[900],
            },
            fontWeight: tokens.typography.fontWeight.bold,
            minH: tokens.heights.touchTarget, // Touch target 44px
            py: 3,
          },
        };

      case "teaShop":
        // Sélecteur zen - Élégant, minimaliste
        return {
          button: {
            bg: `linear-gradient(to right, ${tokens.colors[100]}, white, ${tokens.colors[100]})`,
            border: `1px solid ${tokens.colors[300]}`,
            borderRadius: tokens.borderRadius.xl,
            color: tokens.colors[700],
            fontFamily: tokens.typography.fontFamily.heading,
            fontWeight: tokens.typography.fontWeight.normal,
            px: 8,
            py: 4,
            minH: tokens.heights.touchTarget, // Touch target 44px
            backdropFilter: "blur(20px)",
            _hover: {
              bg: `linear-gradient(to right, ${tokens.colors[200]}, ${tokens.colors[50]}, ${tokens.colors[200]})`,
              borderColor: tokens.colors[400],
              transform: tokens.animations.enableOnMobile
                ? "none"
                : "translateY(-2px)",
              boxShadow: `0 8px 25px ${tokens.colors[200]}60`,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
          badge: {
            bg: `linear-gradient(45deg, ${tokens.colors[500]}, ${tokens.colors[600]})`,
            color: "white",
            borderRadius: tokens.borderRadius.lg,
            fontSize: "xs",
            fontWeight: tokens.typography.fontWeight.normal,
            px: 3,
            py: 1,
          },
          menu: {
            bg: "white",
            border: `1px solid ${tokens.colors[200]}`,
            borderRadius: tokens.borderRadius.xl,
            shadow: "2xl",
            backdropFilter: "blur(20px) saturate(150%)",
          },
          menuItem: {
            _hover: {
              bg: tokens.colors[100],
              color: tokens.colors[800],
            },
            fontFamily: tokens.typography.fontFamily.heading,
            borderRadius: tokens.borderRadius.md,
            mx: 2,
            my: 1,
            minH: tokens.heights.touchTarget, // Touch target 44px
            py: 3,
          },
        };

      case "beautyShop":
        // Sélecteur premium - Sophistiqué, moderne
        return {
          button: {
            bg: `linear-gradient(145deg, white, ${tokens.colors[50]})`,
            border: `1px solid ${tokens.colors[300]}`,
            borderRadius: tokens.borderRadius.lg,
            color: tokens.colors[700],
            fontFamily: tokens.typography.fontFamily.heading,
            fontWeight: tokens.typography.fontWeight.bold,
            px: 6,
            py: 4,
            minH: tokens.heights.touchTarget, // Touch target 44px
            position: "relative" as const,
            overflow: "hidden",
            _before: {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              bg: `linear-gradient(90deg, transparent, ${tokens.colors[100]}40, transparent)`,
              transition: "left 0.5s ease",
            },
            _hover: {
              bg: `linear-gradient(145deg, ${tokens.colors[50]}, ${tokens.colors[100]})`,
              borderColor: tokens.colors[400],
              transform: tokens.animations.enableOnMobile
                ? "none"
                : "translateY(-1px)",
              boxShadow: `0 6px 20px ${tokens.colors[200]}50`,
              _before: {
                left: "100%",
              },
            },
          },
          badge: {
            bg: `linear-gradient(135deg, ${tokens.colors[500]}, ${tokens.colors[600]})`,
            color: "white",
            borderRadius: tokens.borderRadius.lg,
            fontSize: "xs",
            fontWeight: tokens.typography.fontWeight.bold,
            px: 3,
            boxShadow: "sm",
          },
          menu: {
            bg: "white",
            border: `1px solid ${tokens.colors[200]}`,
            borderRadius: tokens.borderRadius.lg,
            shadow: "2xl",
          },
          menuItem: {
            _hover: {
              bg: `linear-gradient(90deg, ${tokens.colors[50]}, ${tokens.colors[100]})`,
              color: tokens.colors[800],
            },
            borderRadius: tokens.borderRadius.md,
            mx: 2,
            my: 1,
            fontWeight: tokens.typography.fontWeight.bold,
            minH: tokens.heights.touchTarget, // Touch target 44px
            py: 3,
          },
        };

      case "herbShop":
        // Sélecteur bio - Naturel, authentique
        return {
          button: {
            bg: `linear-gradient(to bottom, ${tokens.colors[100]}, ${tokens.colors[50]})`,
            border: `2px solid ${tokens.colors[300]}`,
            borderRadius: tokens.borderRadius.md,
            color: tokens.colors[700],
            fontFamily: tokens.typography.fontFamily.body,
            fontWeight: tokens.typography.fontWeight.normal,
            px: 6,
            py: 4,
            minH: tokens.heights.touchTarget, // Touch target 44px
            _hover: {
              bg: `linear-gradient(to bottom, ${tokens.colors[200]}, ${tokens.colors[100]})`,
              borderColor: tokens.colors[400],
              transform: tokens.animations.enableOnMobile
                ? "none"
                : "scale(1.02)",
            },
          },
          badge: {
            bg: tokens.colors[600],
            color: "white",
            borderRadius: tokens.borderRadius.md,
            fontSize: "xs",
            fontWeight: tokens.typography.fontWeight.normal,
          },
          menu: {
            bg: tokens.colors[50],
            border: `1px solid ${tokens.colors[200]}`,
            borderRadius: tokens.borderRadius.md,
            shadow: "lg",
          },
          menuItem: {
            _hover: {
              bg: tokens.colors[100],
              color: tokens.colors[800],
            },
            borderRadius: tokens.borderRadius.base,
            minH: tokens.heights.touchTarget, // Touch target 44px
            py: 3,
          },
        };

      default:
        // Style par défaut brewery
        return getSelectorStyles();
    }
  };

  const styles = getSelectorStyles();

  // Version compacte - simple et efficace
  const renderCompactVersion = () => (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        {...styles.button}
        size="sm"
        transition={tokens.animations.transition}
      >
        <HStack spacing={2}>
          <Text fontSize="sm">{tokens.meta.icon}</Text>
          <Text fontSize="sm" isTruncated maxW="120px">
            {currentShop.name}
          </Text>
          {showOpeningStatus && (
            <Badge
              {...styles.badge}
              colorScheme={currentShopIsOpen ? "green" : "red"}
              fontSize="xs"
              px={2}
              py={0.5}
            >
              {currentShopIsOpen ? "●" : "●"}
            </Badge>
          )}
        </HStack>
      </MenuButton>

      <MenuList {...styles.menu} minW="200px">
        {shops.map((shop) => (
          <ShopMenuItem
            key={shop.id}
            shop={shop}
            currentShop={currentShop}
            onShopChange={onShopChange}
            showOpeningStatus={showOpeningStatus}
            variant="compact"
            styles={styles}
          />
        ))}
      </MenuList>
    </Menu>
  );

  // Version complète - avec toutes les informations
  const renderFullVersion = () => (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        {...styles.button}
        minW="250px"
        transition={tokens.animations.transition}
      >
        <Flex justify="space-between" align="center" w="full">
          <VStack align="start" spacing={1} flex={1}>
            <HStack spacing={2}>
              <Text fontSize="lg">{tokens.meta.icon}</Text>
              <Text fontSize="sm" fontWeight="bold" isTruncated>
                {currentShop.name}
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.500" isTruncated>
              {tokens.meta.description}
            </Text>
          </VStack>

          {showOpeningStatus && (
            <Badge
              {...styles.badge}
              colorScheme={currentShopIsOpen ? "green" : "red"}
              ml={3}
            >
              {currentShopIsOpen ? "Ouvert" : "Fermé"}
            </Badge>
          )}
        </Flex>
      </MenuButton>

      <MenuList {...styles.menu} minW="300px">
        {shops.map((shop) => (
          <ShopMenuItem
            key={shop.id}
            shop={shop}
            currentShop={currentShop}
            onShopChange={onShopChange}
            showOpeningStatus={showOpeningStatus}
            variant="full"
            styles={styles}
          />
        ))}
      </MenuList>
    </Menu>
  );

  // Version minimale - ultra-compact
  const renderMinimalVersion = () => (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        {...styles.button}
        size="sm"
        variant="outline"
        transition={tokens.animations.transition}
      >
        <HStack spacing={1}>
          <Text fontSize="sm">{tokens.meta.icon}</Text>
          <Text fontSize="xs" fontWeight="bold">
            {currentShop.name.substring(0, 10)}...
          </Text>
          {showOpeningStatus && (
            <Badge
              colorScheme={currentShopIsOpen ? "green" : "red"}
              fontSize="xs"
              w="8px"
              h="8px"
              borderRadius="full"
              p={0}
            >
              ●
            </Badge>
          )}
        </HStack>
      </MenuButton>

      <MenuList {...styles.menu} minW="180px">
        {shops.map((shop) => (
          <ShopMenuItem
            key={shop.id}
            shop={shop}
            currentShop={currentShop}
            onShopChange={onShopChange}
            showOpeningStatus={showOpeningStatus}
            variant="minimal"
            styles={styles}
          />
        ))}
      </MenuList>
    </Menu>
  );

  // Rendu selon la variante
  switch (variant) {
    case "compact":
      return renderCompactVersion();
    case "minimal":
      return renderMinimalVersion();
    default:
      return renderFullVersion();
  }
}
