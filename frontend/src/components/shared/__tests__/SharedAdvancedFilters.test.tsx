import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Shop } from "../../../../../shared/types";
import type { ProductFilters } from "../../../services/adminProductService";
import theme from "../../../theme";
import { SharedAdvancedFilters } from "../SharedAdvancedFilters";

// Mock des données de test
const mockShop: Shop = {
  id: "test-shop-1",
  name: "Houblon & Tradition",
  shopType: "brewery",
  categories: [],
};

const mockFilters: ProductFilters = {
  stockStatus: "in_stock",
  minPrice: 3,
  maxPrice: 15,
};

// Wrapper avec providers nécessaires
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

describe("SharedAdvancedFilters", () => {
  const mockOnFiltersChange = jest.fn();
  const mockOnSearchChange = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche correctement les filtres en mode store", () => {
    render(
      <SharedAdvancedFilters
        shop={mockShop}
        filters={mockFilters}
        searchTerm=""
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
        mode="store"
      />,
      { wrapper: TestWrapper }
    );

    // Vérifications des éléments spécifiques au mode store
    expect(
      screen.getByPlaceholderText("Rechercher un produit...")
    ).toBeInTheDocument();
    expect(screen.getByText("Disponibilité")).toBeInTheDocument();
    expect(screen.getByText("Filtres spécialisés ▼")).toBeInTheDocument();
  });

  it("affiche correctement les filtres en mode admin", () => {
    render(
      <SharedAdvancedFilters
        shop={mockShop}
        filters={mockFilters}
        searchTerm=""
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
        mode="admin"
      />,
      { wrapper: TestWrapper }
    );

    // Vérifications des éléments spécifiques au mode admin
    expect(
      screen.getByPlaceholderText("Rechercher un produit...")
    ).toBeInTheDocument();
    expect(screen.getByText("Filtres avancés ▼")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Min")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max")).toBeInTheDocument();
  });

  it("applique le thème brewery automatiquement", () => {
    render(
      <SharedAdvancedFilters
        shop={mockShop}
        filters={mockFilters}
        searchTerm=""
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
      />,
      { wrapper: TestWrapper }
    );

    // Le bouton devrait utiliser le colorScheme orange (brewery)
    const filtersButton = screen.getByText("Filtres spécialisés ▼");
    expect(filtersButton).toBeInTheDocument();
  });

  it("affiche les filtres spécialisés brasserie quand développé", () => {
    render(
      <SharedAdvancedFilters
        shop={mockShop}
        filters={mockFilters}
        searchTerm=""
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
      />,
      { wrapper: TestWrapper }
    );

    // Cliquer pour développer les filtres spécialisés
    const filtersButton = screen.getByText("Filtres spécialisés ▼");
    fireEvent.click(filtersButton);

    // Vérifier les filtres spécifiques à la brasserie
    expect(screen.getByText("🍺 Filtres Brasserie")).toBeInTheDocument();
    expect(screen.getByText(/Degré d'alcool/)).toBeInTheDocument();
    expect(screen.getByText(/Amertume IBU/)).toBeInTheDocument();
    expect(screen.getByText("Type de houblon")).toBeInTheDocument();
  });

  it("gère les changements de recherche", () => {
    render(
      <SharedAdvancedFilters
        shop={mockShop}
        filters={mockFilters}
        searchTerm=""
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
      />,
      { wrapper: TestWrapper }
    );

    const searchInput = screen.getByPlaceholderText("Rechercher un produit...");
    fireEvent.change(searchInput, { target: { value: "blonde" } });

    expect(mockOnSearchChange).toHaveBeenCalledWith("blonde");
  });

  it("gère les changements de filtres", () => {
    render(
      <SharedAdvancedFilters
        shop={mockShop}
        filters={mockFilters}
        searchTerm=""
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
      />,
      { wrapper: TestWrapper }
    );

    const stockSelect = screen.getByDisplayValue("En stock");
    fireEvent.change(stockSelect, { target: { value: "low_stock" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      stockStatus: "low_stock",
    });
  });

  it("affiche le bouton reset quand il y a des filtres actifs", () => {
    render(
      <SharedAdvancedFilters
        shop={mockShop}
        filters={mockFilters}
        searchTerm="test"
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
      />,
      { wrapper: TestWrapper }
    );

    const resetButton = screen.getByText("Effacer les filtres");
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(mockOnReset).toHaveBeenCalled();
  });

  it("s'adapte aux différents types de boutique", () => {
    const teaShop: Shop = {
      ...mockShop,
      shopType: "tea-shop",
      name: "Les Jardins de Darjeeling",
    };

    render(
      <SharedAdvancedFilters
        shop={teaShop}
        filters={mockFilters}
        searchTerm=""
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
      />,
      { wrapper: TestWrapper }
    );

    // Développer les filtres spécialisés
    const filtersButton = screen.getByText("Filtres spécialisés ▼");
    fireEvent.click(filtersButton);

    // Vérifier les filtres spécifiques au salon de thé
    expect(screen.getByText("🍵 Filtres Salon de Thé")).toBeInTheDocument();
    expect(screen.getByText("Origine plantation")).toBeInTheDocument();
    expect(screen.getByText("Grade qualité")).toBeInTheDocument();
  });

  it("utilise les bonnes tailles selon le mode", () => {
    const { rerender } = render(
      <SharedAdvancedFilters
        shop={mockShop}
        filters={mockFilters}
        searchTerm=""
        onFiltersChange={mockOnFiltersChange}
        onSearchChange={mockOnSearchChange}
        onReset={mockOnReset}
        mode="admin"
      />,
      { wrapper: TestWrapper }
    );

    // En mode admin, les boutons sont plus petits
    expect(screen.getByText("Filtres avancés ▼")).toBeInTheDocument();

    rerender(
      <TestWrapper>
        <SharedAdvancedFilters
          shop={mockShop}
          filters={mockFilters}
          searchTerm=""
          onFiltersChange={mockOnFiltersChange}
          onSearchChange={mockOnSearchChange}
          onReset={mockOnReset}
          mode="store"
        />
      </TestWrapper>
    );

    // En mode store, les boutons sont plus grands
    expect(screen.getByText("Filtres spécialisés ▼")).toBeInTheDocument();
  });
});
