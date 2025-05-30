import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isCollapsed, onToggle: onToggleCollapse } = useDisclosure();

  return (
    <Flex h="100vh" bg="gray.50">
      <AdminSidebar
        isOpen={isOpen}
        onToggle={onToggle}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />

      <Box flex="1" overflow="auto" bg="gray.50">
        <Box p={{ base: 4, md: 6 }}>{children || <Outlet />}</Box>
      </Box>
    </Flex>
  );
}
