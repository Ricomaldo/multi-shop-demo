import {
  Box,
  Flex,
  IconButton,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const { isOpen, onToggle } = useDisclosure(); // Pour mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Pour desktop
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Flex h="100vh" overflow="hidden">
      <AdminSidebar
        isOpen={isOpen}
        onToggle={onToggle}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <Box flex="1" overflow="auto" position="relative">
        {/* Header mobile avec bouton menu */}
        {isMobile && (
          <Box
            position="sticky"
            top="0"
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            p={4}
            zIndex="997"
          >
            <IconButton
              aria-label="Ouvrir menu"
              icon={<FiMenu />}
              variant="ghost"
              onClick={onToggle}
            />
          </Box>
        )}

        {/* Contenu principal */}
        <Box p={{ base: 4, md: 6, lg: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
