import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Category } from "../../../../../shared/types";
import theme from "../../../theme";
import SharedCategoryFilter from "../SharedCategoryFilter";

// Mock des données de test
const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Bières Blondes",
    shopId: "shop-1",
  },
  {
    id: "cat-2",
    name: "Bières Brunes",
    shopId: "shop-1",
  },
  {
    id: "cat-3",
    name: "Bières IPA",
    shopId: "shop-1",
  },
];

// Wrapper avec providers nécessaires
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

describe("SharedCategoryFilter", () => {
  const mockOnCategoryChange = jest.fn();
  const mockOnResetFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Mode Store (boutons)", () => {
    it("affiche correctement les catégories en mode store", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={10}
          colorScheme="orange"
          mode="store"
        />,
        { wrapper: TestWrapper }
      );

      // Vérifications des éléments spécifiques au mode store
      expect(screen.getByText("Catégories")).toBeInTheDocument();
      expect(screen.getByText("Toutes (10)")).toBeInTheDocument();
      expect(screen.getByText("Bières Blondes")).toBeInTheDocument();
      expect(screen.getByText("Bières Brunes")).toBeInTheDocument();
      expect(screen.getByText("Bières IPA")).toBeInTheDocument();
    });

    it("gère la sélection de catégorie en mode store", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={10}
          colorScheme="orange"
          mode="store"
        />,
        { wrapper: TestWrapper }
      );

      const categoryButton = screen.getByText("Bières Blondes");
      fireEvent.click(categoryButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith("cat-1");
    });

    it("affiche les informations de catégorie sélectionnée en mode store", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId="cat-1"
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={5}
          colorScheme="orange"
          mode="store"
        />,
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByText("5 produits dans cette catégorie")
      ).toBeInTheDocument();
      expect(screen.getByText("Voir tout")).toBeInTheDocument();
    });

    it("gère le reset en mode store", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId="cat-1"
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={5}
          colorScheme="orange"
          mode="store"
        />,
        { wrapper: TestWrapper }
      );

      const resetButton = screen.getByText("Voir tout");
      fireEvent.click(resetButton);

      expect(mockOnResetFilters).toHaveBeenCalled();
    });
  });

  describe("Mode Admin (dropdown)", () => {
    it("affiche correctement les catégories en mode admin", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={10}
          colorScheme="blue"
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      // Vérifications des éléments spécifiques au mode admin
      expect(screen.getByText("Filtrer par catégorie")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument(); // Select
      expect(screen.getByText("Réinitialiser")).toBeInTheDocument();
      expect(screen.getByText("10 produits affichés")).toBeInTheDocument();
    });

    it("gère la sélection de catégorie en mode admin", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={10}
          colorScheme="blue"
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "cat-2" } });

      expect(mockOnCategoryChange).toHaveBeenCalledWith("cat-2");
    });

    it("affiche le badge de catégorie sélectionnée en mode admin", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId="cat-2"
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={3}
          colorScheme="blue"
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByRole("status")).toHaveTextContent("Bières Brunes"); // Badge
      expect(screen.getByText("3 produits affichés")).toBeInTheDocument();
    });

    it("désactive le bouton reset quand aucune catégorie sélectionnée en mode admin", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={10}
          colorScheme="blue"
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      const resetButton = screen.getByText("Réinitialiser");
      expect(resetButton).toBeDisabled();
    });

    it("active le bouton reset quand une catégorie est sélectionnée en mode admin", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId="cat-1"
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={5}
          colorScheme="blue"
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      const resetButton = screen.getByText("Réinitialiser");
      expect(resetButton).not.toBeDisabled();

      fireEvent.click(resetButton);
      expect(mockOnResetFilters).toHaveBeenCalled();
    });
  });

  describe("Layout automatique", () => {
    it("utilise dropdown automatiquement en mode admin", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      // Doit afficher le dropdown (mode admin)
      expect(screen.getByText("Filtrer par catégorie")).toBeInTheDocument();
      expect(screen.queryByText("Catégories")).not.toBeInTheDocument();
    });

    it("utilise boutons automatiquement en mode store", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          mode="store"
        />,
        { wrapper: TestWrapper }
      );

      // Doit afficher les boutons (mode store)
      expect(screen.getByText("Catégories")).toBeInTheDocument();
      expect(
        screen.queryByText("Filtrer par catégorie")
      ).not.toBeInTheDocument();
    });

    it("respecte le layout forcé même si différent du mode", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          mode="admin"
          layout="buttons"
        />,
        { wrapper: TestWrapper }
      );

      // Doit afficher les boutons malgré le mode admin
      expect(screen.getByText("Catégories")).toBeInTheDocument();
      expect(
        screen.queryByText("Filtrer par catégorie")
      ).not.toBeInTheDocument();
    });
  });

  describe("Gestion des cas limites", () => {
    it("gère une liste vide de catégories", () => {
      render(
        <SharedCategoryFilter
          categories={[]}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={0}
          mode="store"
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("Toutes (0)")).toBeInTheDocument();
    });

    it("gère le pluriel correctement", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={1}
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("1 produit affiché")).toBeInTheDocument();
    });
  });
});
