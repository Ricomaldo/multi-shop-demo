import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAdminShop } from "../../hooks";
import { getUniverseTokens } from "../../theme/universeTokens";

interface BreadcrumbConfig {
  label: string;
  icon?: string;
  path: string;
}

const breadcrumbItems: Record<string, BreadcrumbConfig> = {
  "/admin": {
    label: "Dashboard",
    icon: "🏠",
    path: "/admin",
  },
  "/admin/products": {
    label: "Produits",
    icon: "📦",
    path: "/admin/products",
  },
  "/admin/categories": {
    label: "Catégories",
    icon: "🏷️",
    path: "/admin/categories",
  },
  "/admin/settings": {
    label: "Paramètres",
    icon: "⚙️",
    path: "/admin/settings",
  },
};

export default function AdminBreadcrumb() {
  const location = useLocation();

  const tokens = getUniverseTokens(shop?.shopType || "brewery");
  const colorScheme = tokens.meta.colorScheme;

  // Styles conditionnels
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const activeColor = useColorModeValue(
    `${colorScheme}.600`,
    `${colorScheme}.300`
  );

  // Déterminer l'item actuel
  const currentPath = location.pathname;
  const currentItem = breadcrumbItems[currentPath];

  // Si pas de page connue, ne rien afficher
  if (!currentItem) return null;

  // Générer le chemin de navigation
  const generateBreadcrumbPath = () => {
    const paths = [breadcrumbItems["/admin"]]; // Toujours commencer par Dashboard

    if (currentPath !== "/admin") {
      paths.push(currentItem);
    }

    return paths;
  };

  const breadcrumbPath = generateBreadcrumbPath();

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={{ base: 4, md: 6 }}
      py={3}
    >
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color={textColor} w={3} h={3} />}
      >
        {breadcrumbPath.map((item, index) => {
          const isLast = index === breadcrumbPath.length - 1;

          return (
            <BreadcrumbItem key={item.path} isCurrentPage={isLast}>
              {isLast ? (
                <Text
                  color={activeColor}
                  fontWeight="semibold"
                  fontSize="sm"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </Text>
              ) : (
                <BreadcrumbLink
                  as={Link}
                  to={item.path}
                  color={textColor}
                  fontSize="sm"
                  _hover={{ color: activeColor }}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  transition="color 0.2s"
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Box>
  );
}
