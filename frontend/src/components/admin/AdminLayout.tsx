import {
  Box,
  Flex,
  IconButton,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import AdminBreadcrumb from "./AdminBreadcrumb";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isOpen: isCollapsed, onToggle: onToggleCollapse } = useDisclosure();
  const {
    isOpen: isSidebarOpen,
    onOpen: onSidebarOpen,
    onClose: onSidebarClose,
  } = useDisclosure();

  // Responsive: sidebar behavior changes on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarML = useBreakpointValue({
    base: 0, // No margin on mobile (overlay)
    md: isCollapsed ? "80px" : "280px",
  });

  return (
    <Flex h="100vh" bg="gray.50" position="relative">
      {/* Mobile Header with Hamburger */}
      {isMobile && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          h="16"
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
          zIndex={30}
          display="flex"
          alignItems="center"
          px={4}
        >
          <IconButton
            aria-label="Ouvrir le menu"
            icon={<FiMenu />}
            onClick={onSidebarOpen}
            variant="ghost"
            size="md"
          />
        </Box>
      )}

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={19}
          onClick={onSidebarClose}
        />
      )}

      <AdminSidebar
        isOpen={isMobile ? isSidebarOpen : true}
        isCollapsed={isMobile ? false : isCollapsed}
        onToggleCollapse={isMobile ? onSidebarClose : onToggleCollapse}
      />

      <Box
        flex="1"
        overflow="auto"
        bg="gray.50"
        ml={sidebarML}
        pt={{ base: "16", md: 0 }} // Add top padding on mobile for header
        transition="margin-left 0.3s"
      >
        <AdminBreadcrumb />
        <Box p={{ base: 4, md: 6 }}>{children || <Outlet />}</Box>
      </Box>
    </Flex>
  );
}
