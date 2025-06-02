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
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiPackage,
  FiSettings,
  FiTag
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useAdminShop } from "../../contexts/AdminContext";
import { useShopData } from "../../hooks";
import AdminShopSelector from "./AdminShopSelector";

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
  const { shops } = useShopData();
  const {
    universe,
    setUniverse,
    shop,
    setShop,
  } = useAdminShop();

  // Responsive
  const sidebarWidth = useBreakpointValue({ base: "full", md: isCollapsed ? "80px" : "280px" });
  const showLabels = !isCollapsed;

  return (
    <Box
      as="nav"
      pos="fixed"
      top={0}
      left={isOpen ? 0 : "-100%"}
      h="100vh"
      w={sidebarWidth}
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      transition="all 0.3s"
      zIndex={20}
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
      }}
    >
      <VStack h="full" spacing={0}>
        {/* Header avec bouton toggle */}
        <Flex
          w="full"
          h="16"
          align="center"
          justify="space-between"
          px={4}
          borderBottom="1px"
          borderColor="gray.200"
          _dark={{ borderColor: "gray.700" }}
        >
          {showLabels && (
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="gray.800"
              _dark={{ color: "white" }}
            >
              DemoForge Admin
            </Text>
          )}
          <IconButton
            aria-label={isCollapsed ? "Étendre le menu" : "Réduire le menu"}
            icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
          />
        </Flex>

        {/* Sélecteur de boutique */}
        <Box w="full" p={4} borderBottom="1px" borderColor="gray.200">
          <AdminShopSelector
            selectedUniverse={universe}
            selectedShop={shop}
            shops={shops}
            onUniverseChange={setUniverse}
            onShopChange={setShop}
            size="sm"
            isCollapsed={isCollapsed}
          />
        </Box>

        {/* Menu principal */}
        <VStack spacing={1} align="stretch" flex={1} w="full" py={4}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={item.path}
                label={item.label}
                placement="right"
                isDisabled={showLabels}
              >
                <Box
                  as={Link}
                  to={item.path}
                  px={4}
                  py={3}
                  display="flex"
                  alignItems="center"
                  color={isActive ? "blue.500" : "gray.600"}
                  bg={isActive ? "blue.50" : "transparent"}
                  _hover={{
                    bg: "gray.50",
                    color: "blue.500",
                  }}
                  _dark={{
                    color: isActive ? "blue.200" : "gray.300",
                    bg: isActive ? "gray.700" : "transparent",
                    _hover: {
                      bg: "gray.700",
                      color: "blue.200",
                    },
                  }}
                >
                  <Icon as={item.icon} boxSize={5} />
                  {showLabels && (
                    <Text ml={4} fontSize="sm">
                      {item.label}
                    </Text>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
}
