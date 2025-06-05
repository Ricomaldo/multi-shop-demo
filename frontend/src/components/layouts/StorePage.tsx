import { StoreSkeleton } from "@/components/skeletons/StoreSkeleton";
import { useStorePage } from "@/hooks";
import React from "react";
import StoreHeader from "../layout/store/StoreHeader";
import StoreLayout from "../layout/store/StoreLayout";

interface StorePageProps {
  variant: "landing" | "catalog" | "detail" | "contact";
  headerProps?: {
    title?: string;
    subtitle?: string;
    imagePath?: string;
    height?: string;
  };
  children: React.ReactNode;
  contentWrapper?: "container" | "none";
  redirectOnShopChange?: boolean;
}

export default function StorePage({
  variant,
  headerProps,
  children,
  contentWrapper = "container",
  redirectOnShopChange = false,
}: StorePageProps) {
  const { currentShop, availableShops, isReady, isChanging, handleShopChange } =
    useStorePage({ redirectOnShopChange });

  if (!isReady || !currentShop) return <StoreSkeleton />;

  // Header variant mapping
  let headerVariant: "nav-only" | "simple" = "nav-only";
  if (variant === "landing") headerVariant = "simple";
  if (variant === "catalog" || variant === "detail" || variant === "contact")
    headerVariant = "nav-only";

  // Content wrapper
  const Wrapper = contentWrapper === "container" ? "div" : React.Fragment;
  const wrapperProps =
    contentWrapper === "container"
      ? { style: { width: "100%", maxWidth: 1400, margin: "0 auto" } }
      : {};

  return (
    <StoreLayout shop={currentShop}>
      <StoreHeader
        shop={currentShop}
        availableShops={availableShops}
        onShopChange={handleShopChange}
        variant={headerVariant}
        {...headerProps}
      />
      <Wrapper {...wrapperProps}>
        {isChanging ? <StoreSkeleton /> : children}
      </Wrapper>
      {/* StoreFooter est déjà inclus dans StoreLayout */}
    </StoreLayout>
  );
}
