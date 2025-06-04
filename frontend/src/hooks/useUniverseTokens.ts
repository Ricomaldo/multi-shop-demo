import { useContext } from "react";
import { UniverseContext } from "../contexts/UniverseContext";
import { getUniverseTokens } from "../theme/universeTokens";

/**
 * Hook personnalisé pour accéder aux tokens de l'univers actuel
 * Retourne les tokens complets pour l'univers sélectionné
 */
export const useUniverseTokens = () => {
  const context = useContext(UniverseContext);

  if (!context) {
    throw new Error("useUniverseTokens must be used within a UniverseProvider");
  }

  const { universe } = context;
  const tokens = getUniverseTokens(universe);

  return {
    tokens,
    universe,
    colorScheme: context.getColorScheme(),
  };
};
