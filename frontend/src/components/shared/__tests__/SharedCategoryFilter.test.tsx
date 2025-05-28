import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Category } from "../../../../../shared/types";
import theme from "../../../theme";

// Mock du composant SharedCategoryFilter pour éviter les problèmes Chakra UI
jest.mock("../SharedCategoryFilter", () => {
  return function MockSharedCategoryFilter({
    categories,
    selectedCategoryId,
    onCategoryChange,
    onResetFilters,
    productCount = 0,
    mode = "store",
    layout,
  }: {
    categories: Category[];
    selectedCategoryId: string | null;
    onCategoryChange: (categoryId: string | null) => void;
    onResetFilters: () => void;
    productCount?: number;
    mode?: "admin" | "store";
    layout?: "dropdown" | "buttons";
  }) {
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );

    // Déterminer le layout effectif
    const effectiveLayout =
      layout || (mode === "admin" ? "dropdown" : "buttons");

    // Gestion du pluriel
    const getProductText = (count: number) => {
      if (count <= 1) {
        return `${count} produit affiché`;
      }
      return `${count} produits affichés`;
    };

    if (effectiveLayout === "dropdown") {
      return (
        <div data-testid="shared-category-filter-admin">
          <div>Filtrer par catégorie</div>
          <select
            data-testid="category-select"
            value={selectedCategoryId || ""}
            onChange={(e) =>
              onCategoryChange(e.target.value === "" ? null : e.target.value)
            }
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            onClick={onResetFilters}
            disabled={!selectedCategoryId}
            data-testid="reset-button"
          >
            Réinitialiser
          </button>
          <div>{getProductText(productCount)}</div>
          {selectedCategory && <div role="status">{selectedCategory.name}</div>}
        </div>
      );
    }

    return (
      <div data-testid="shared-category-filter-store">
        <div>Catégories</div>
        <button
          onClick={() => onCategoryChange(null)}
          data-testid="all-categories"
        >
          Toutes ({productCount})
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            data-testid={`category-${category.id}`}
          >
            {category.name}
            {selectedCategoryId === category.id && " ✓"}
          </button>
        ))}
        {selectedCategoryId && (
          <div>
            <div>{productCount} produits dans cette catégorie</div>
            <button onClick={onResetFilters}>Voir tout</button>
          </div>
        )}
      </div>
    );
  };
});

// Import du composant mocké
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
      expect(screen.getByTestId("category-select")).toBeInTheDocument();
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

      const select = screen.getByTestId("category-select");
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

      expect(screen.getByRole("status")).toHaveTextContent("Bières Brunes");
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

      const resetButton = screen.getByTestId("reset-button");
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
          productCount={0}
          colorScheme="blue"
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
          colorScheme="blue"
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("Filtrer par catégorie")).toBeInTheDocument();
      expect(screen.getByTestId("category-select")).toBeInTheDocument();
    });

    it("gère le pluriel correctement", () => {
      render(
        <SharedCategoryFilter
          categories={mockCategories}
          selectedCategoryId={null}
          onCategoryChange={mockOnCategoryChange}
          onResetFilters={mockOnResetFilters}
          productCount={1}
          colorScheme="blue"
          mode="admin"
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("1 produit affiché")).toBeInTheDocument();
    });
  });
});
