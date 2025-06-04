import StorePageContent from "@/components/features/store/content/StorePageContent";
import StoreHeader from "@/components/layout/store/StoreHeader";
import StoreLayout from "@/components/layout/store/StoreLayout";
import { StoreSkeleton } from "@/components/skeletons/StoreSkeleton";
import { useStorePage } from "@/hooks/useStorePage";
import { Box, Container } from "@chakra-ui/react";
import React from "react";

interface StorePageWrapperProps {
  children: React.ReactNode;
  headerVariant?: "nav-only" | "simple";
  headerProps?: {
    title?: string;
    subtitle?: string;
    imagePath?: string;
    height?: string;
  };
  contentWrapper?: "page-content" | "container" | "none";
  redirectOnShopChange?: boolean;
}

export function StorePageWrapper({
  children,
  headerVariant = "nav-only",
  headerProps,
  contentWrapper = "page-content",
  redirectOnShopChange = false,
}: StorePageWrapperProps) {
  const { currentShop, availableShops, isReady, isChanging, handleShopChange } =
    useStorePage({ redirectOnShopChange });

  // Wrapper de contenu conditionnel - avant le return conditionnel
  const ContentWrapper = React.useMemo(() => {
    switch (contentWrapper) {
      case "container":
        return Container;
      case "page-content":
        return StorePageContent;
      case "none":
        return React.Fragment;
      default:
        return StorePageContent;
    }
  }, [contentWrapper]);

  // État de chargement initial
  if (!isReady) {
    return <StoreSkeleton />;
  }

  return (
    <StoreLayout shop={currentShop!}>
      <StoreHeader
        shop={currentShop!}
        availableShops={availableShops}
        onShopChange={handleShopChange}
        variant={headerVariant}
        {...headerProps}
      />

      <ContentWrapper>
        {/* Transition anti-FOUC */}
        {isChanging ? (
          <StoreSkeleton />
        ) : (
          <Box opacity={isReady ? 1 : 0} transition="opacity 0.3s ease-in-out">
            {children}
          </Box>
        )}
      </ContentWrapper>
    </StoreLayout>
  );
}

// Hook exposé pour les pages qui ont besoin d'accès direct aux données
export { useStorePage } from "@/hooks/useStorePage";
