import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  Tooltip,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiHome,
  FiMenu,
  FiPackage,
  FiSettings,
  FiTag,
  FiX,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import type { Shop } from "../../../../shared/types";
import { useShopData } from "../../hooks";
import AdminDualSelector from "./AdminDualSelector";

const menuItems = [
  { icon: FiHome, label: "Dashboard", path: "/admin" },
  { icon: FiPackage, label: "Produits", path: "/admin/products" },
  { icon: FiTag, label: "Catégories", path: "/admin/categories" },
  { icon: FiSettings, label: "Paramètres", path: "/admin/settings" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Sidebar admin avec thématisation dynamique par univers
 * Intègre le sélecteur d'univers et adapte les couleurs
 */
export default function AdminSidebar({
  isOpen,
  onToggle,
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { shops, loading } = useShopData();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const handleShopChange = (shop: Shop) => {
    setSelectedShop(shop);
    // TODO: Implémenter la logique de changement de boutique
    console.log("Boutique sélectionnée:", shop);
  };

  // Sur mobile, on utilise isOpen, sur desktop on utilise isCollapsed
  const shouldShowLabels = isMobile ? isOpen : !isCollapsed;
  const sidebarWidth = isMobile
    ? isOpen
      ? "250px"
      : "0px"
    : isCollapsed
    ? "70px"
    : "250px";

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="blackAlpha.600"
          zIndex="998"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <Box
        w={sidebarWidth}
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        h="100vh"
        position={isMobile ? "fixed" : "sticky"}
        top="0"
        left="0"
        zIndex="999"
        transition="all 0.3s ease"
        overflow="hidden"
        boxShadow={isMobile ? "lg" : "none"}
      >
        <VStack spacing={1} align="stretch" p={4}>
          {/* En-tête avec toggle */}
          <Flex justify="space-between" align="center" mb={4}>
            {shouldShowLabels && (
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="gray.700"
                noOfLines={1}
              >
                🏪 DemoForge
              </Text>
            )}

            {/* Toggle button - visible sur desktop seulement */}
            {!isMobile && (
              <Tooltip
                label={isCollapsed ? "Étendre" : "Réduire"}
                placement="right"
              >
                <IconButton
                  aria-label="Toggle sidebar"
                  icon={<FiMenu />}
                  size="sm"
                  variant="ghost"
                  onClick={onToggleCollapse}
                />
              </Tooltip>
            )}

            {/* Close button - visible sur mobile seulement */}
            {isMobile && (
              <IconButton
                aria-label="Fermer menu"
                icon={<FiX />}
                size="sm"
                variant="ghost"
                onClick={onToggle}
              />
            )}
          </Flex>

          {/* Sélecteur de boutique en deux étapes - masqué si collapsed */}
          {shouldShowLabels && (
            <AdminDualSelector
              shops={shops}
              selectedShop={selectedShop}
              onShopChange={handleShopChange}
              loading={loading}
              size="sm"
            />
          )}

          {/* Menu items */}
          <VStack spacing={1} align="stretch" mt={shouldShowLabels ? 4 : 2}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Tooltip
                  key={item.path}
                  label={item.label}
                  placement="right"
                  isDisabled={shouldShowLabels}
                >
                  <Box
                    as={Link}
                    to={item.path}
                    p={3}
                    borderRadius="md"
                    bg={isActive ? "blue.50" : "transparent"}
                    color={isActive ? "blue.600" : "gray.600"}
                    _hover={{
                      bg: isActive ? "blue.100" : "gray.50",
                      color: isActive ? "blue.700" : "gray.700",
                    }}
                    transition="all 0.2s"
                    onClick={isMobile ? onToggle : undefined}
                  >
                    <Flex
                      align="center"
                      gap={3}
                      justify={shouldShowLabels ? "flex-start" : "center"}
                    >
                      <Icon as={item.icon} boxSize={5} />
                      {shouldShowLabels && (
                        <Text
                          fontWeight={isActive ? "semibold" : "normal"}
                          noOfLines={1}
                        >
                          {item.label}
                        </Text>
                      )}
                    </Flex>
                  </Box>
                </Tooltip>
              );
            })}
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
