// Re-export des types partagés
export * from "../../../shared/types";

// Types spécifiques au frontend peuvent être ajoutés ici
export interface UIState {
  isLoading: boolean;
  error?: string;
}
