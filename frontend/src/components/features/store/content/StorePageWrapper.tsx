import StorePageContent from "@/components/features/store/content/StorePageContent";
import StoreHeader from "@/components/layout/store/StoreHeader";
import StoreLayout from "@/components/layout/store/StoreLayout";
import { StoreSkeleton } from "@/components/skeletons/StoreSkeleton";
import { useStorePage } from "@/hooks/useStorePage";
import { Box, Container } from "@chakra-ui/react";
import React from "react";

/**
 * 🏪 COMPOSANT PRINCIPAL - Wrapper unifié pour toutes les pages store
 *
 * ✅ USAGE STANDARD pour toutes les pages vitrine DemoForge
 * ✅ Architecture flexible avec 3 variants de wrapper de contenu
 * ✅ Transitions anti-FOUC intégrées pour navigation fluide
 * ✅ Compatible hooks émotionnels et tokens d'univers
 * ✅ Gestion automatique des états de chargement et changement boutique
 *
 * @example Usage Standard
 * <StorePageWrapper headerVariant="nav-only" contentWrapper="page-content">
 *   <MonContenuPage />
 * </StorePageWrapper>
 *
 * @example Landing avec Hero
 * <StorePageWrapper
 *   headerVariant="simple"
 *   headerProps={{ title: "Ma Boutique", subtitle: "Description", height: "80vh" }}
 *   contentWrapper="none"
 * >
 *   <SectionsPersonnalisees />
 * </StorePageWrapper>
 */
interface StorePageWrapperProps {
  /** Contenu de la page à afficher */
  children: React.ReactNode;

  /** Variant d'en-tête
   * - "nav-only": Navigation seule (pages internes)
   * - "simple": Navigation + Hero section (pages d'accueil) */
  headerVariant?: "nav-only" | "simple";

  /** Propriétés de l'en-tête (titre, sous-titre, image de fond, hauteur) */
  headerProps?: {
    title?: string;
    subtitle?: string;
    imagePath?: string;
    height?: string;
  };

  /** Type de wrapper pour le contenu
   * - "page-content": Wrapper standardisé avec espacement (défaut)
   * - "container": Container Chakra UI simple
   * - "none": Pas de wrapper, contrôle total */
  contentWrapper?: "page-content" | "container" | "none";

  /** Rediriger automatiquement l'URL lors du changement de boutique */
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
