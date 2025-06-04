import { Box, VStack } from "@chakra-ui/react";

interface StorePageContentProps {
  /** Contenu de la page */
  children: React.ReactNode;
  /** Espacement entre sections */
  spacing?: number;
  /** Padding vertical */
  py?: number;
  /** Largeur maximale (override du layout parent) */
  maxW?: string;
  /** Centrer le contenu */
  centerContent?: boolean;
}

/**
 * Wrapper standardisé pour le contenu des pages store
 *
 * Usage :
 * <StoreLayout shop={shop}>
 *   <StoreHeader variant="hero" ... />
 *   <StorePageContent>
 *     <Section1 />
 *     <Section2 />
 *   </StorePageContent>
 * </StoreLayout>
 */
export default function StorePageContent({
  children,
  spacing = 8,
  py = 8,
  maxW,
  centerContent = false,
}: StorePageContentProps) {
  const ContentWrapper = maxW ? Box : "div";
  const wrapperProps = maxW ? { maxW, mx: "auto", w: "full" } : {};

  return (
    <ContentWrapper {...wrapperProps}>
      <VStack
        spacing={spacing}
        py={py}
        align={centerContent ? "center" : "stretch"}
        w="full"
      >
        {children}
      </VStack>
    </ContentWrapper>
  );
}
