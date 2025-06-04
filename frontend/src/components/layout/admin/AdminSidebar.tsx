import AdminShopSelector from "@/components/business/shop/AdminShopSelector";
import { useAdminShop, useShopData } from "@/hooks";
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
  FiTag,
  FiX,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: FiHome, label: "Dashboard", path: "/admin" },
  { icon: FiPackage, label: "Produits", path: "/admin/products" },
  { icon: FiTag, label: "Catégories", path: "/admin/categories" },
  { icon: FiSettings, label: "Paramètres", path: "/admin/settings" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Sidebar admin avec thématisation dynamique par univers
 * Intègre le sélecteur d'univers et adapte les couleurs
 * Responsive: overlay sur mobile, sidebar fixe sur desktop
 */
export default function AdminSidebar({
  isOpen,
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const location = useLocation();
  const { shops } = useShopData();
  const { universe, setUniverse, shop, setShop } = useAdminShop();

  // Responsive
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarWidth = useBreakpointValue({
    base: "280px", // Fixed width on mobile
    md: isCollapsed ? "80px" : "280px",
  });
  const showLabels = isMobile || !isCollapsed;

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
      transition="all 0.3s ease"
      zIndex={20}
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
      }}
      boxShadow={isMobile ? "xl" : "none"}
    >
      <VStack h="full" spacing={0}>
        {/* Header avec bouton toggle */}
        <Flex
          w="full"
          h="16"
          align="center"
          justify={isCollapsed && !isMobile ? "center" : "space-between"}
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
            aria-label={
              isMobile
                ? "Fermer le menu"
                : isCollapsed
                ? "Étendre le menu"
                : "Réduire le menu"
            }
            icon={
              isMobile ? (
                <FiX />
              ) : isCollapsed ? (
                <FiChevronRight />
              ) : (
                <FiChevronLeft />
              )
            }
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
          />
        </Flex>

        {/* Sélecteur de boutique */}
        {showLabels && (
          <Box w="full" p={4} borderBottom="1px" borderColor="gray.200">
            <AdminShopSelector
              selectedShopType={universe}
              selectedShop={shop}
              shops={shops}
              onShopTypeChange={setUniverse}
              onShopChange={setShop}
              size="sm"
              isCollapsed={isCollapsed && !isMobile}
            />
          </Box>
        )}

        {/* Menu principal */}
        <VStack spacing={1} align="stretch" flex={1} w="full" py={4}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const shouldCenter = isCollapsed && !isMobile;

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
                  px={shouldCenter ? 2 : 4}
                  py={3}
                  mx={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent={shouldCenter ? "center" : "flex-start"}
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
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} boxSize={5} />
                  {showLabels && (
                    <Text ml={4} fontSize="sm" fontWeight="medium">
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
