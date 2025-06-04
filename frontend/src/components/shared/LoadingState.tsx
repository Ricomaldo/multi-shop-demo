import { Alert, AlertIcon, Box, Spinner, Text, VStack } from "@chakra-ui/react";
import type { ShopType } from "../../../../shared/types";
import { getUniverseTokens } from "../../theme/universeTokens";

interface LoadingStateProps {
  shopType?: ShopType;
  type?: "loading" | "error" | "empty";
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingState({
  shopType = "brewery",
  type = "loading",
  message,
  size = "md",
}: LoadingStateProps) {
  const tokens = getUniverseTokens(shopType);

  if (type === "error") {
    return (
      <Alert status="error" borderRadius={tokens.borderRadius.base}>
        <AlertIcon />
        {message || "Une erreur est survenue"}
      </Alert>
    );
  }

  if (type === "empty") {
    return (
      <Box textAlign="center" py={8}>
        <Text color={tokens.colors[500]} fontSize="lg">
          {message || "Aucun élément trouvé"}
        </Text>
      </Box>
    );
  }

  const spinnerSize = size === "sm" ? "md" : size === "lg" ? "xl" : "lg";

  return (
    <VStack spacing={4} py={8}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor={tokens.colors[100]}
        color={tokens.colors[500]}
        size={spinnerSize}
      />
      <Text
        color={tokens.colors[600]}
        fontFamily={tokens.typography.fontFamily.body}
      >
        {message || "Chargement..."}
      </Text>
    </VStack>
  );
}
