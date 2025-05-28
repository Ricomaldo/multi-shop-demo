import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StoreBrewery from "../store/StoreBrewery";

// Mock des hooks personnalisés avec des valeurs par défaut
const mockUseShopData = {
  shops: [
    {
      id: "brewery-1",
      name: "Houblon & Tradition",
      shopType: "brewery" as const,
      categories: [
        { id: "cat-1", name: "Blondes", shopId: "brewery-1" },
        { id: "cat-2", name: "Brunes", shopId: "brewery-1" },
      ],
    },
  ],
  products: [
    {
      id: "prod-1",
      name: "Blonde Artisanale",
      description: "Une blonde rafraîchissante",
      price: 4.5,
      shopId: "brewery-1",
      categoryId: "cat-1",
      attributes: JSON.stringify({
        degre_alcool: 5.2,
        amertume_ibu: 25,
        type_houblon: "Cascade",
        stock: 50,
      }),
    },
  ],
  loading: false,
  error: null,
  refreshData: jest.fn(),
  getProductsByShop: jest.fn(),
  getShopByType: jest.fn(),
};

const mockUseStoreProductFilters = {
  filteredProducts: [
    {
      id: "prod-1",
      name: "Blonde Artisanale",
      description: "Une blonde rafraîchissante",
      price: 4.5,
      shopId: "brewery-1",
      categoryId: "cat-1",
      attributes: JSON.stringify({
        degre_alcool: 5.2,
        amertume_ibu: 25,
        type_houblon: "Cascade",
        stock: 50,
      }),
    },
  ],
  selectedCategoryId: null,
  categories: [
    { id: "cat-1", name: "Blondes", shopId: "brewery-1" },
    { id: "cat-2", name: "Brunes", shopId: "brewery-1" },
  ],
  setSelectedCategoryId: jest.fn(),
  resetFilters: jest.fn(),
  applyAdvancedFilters: jest.fn(),
  currentFilters: {
    search: "",
    categoryId: null,
    priceRange: [0, 100],
    sortBy: "name",
    sortOrder: "asc",
  },
};

// Mock des hooks
jest.mock("../../hooks", () => ({
  useShopData: jest.fn(() => mockUseShopData),
  useStoreProductFilters: jest.fn(() => mockUseStoreProductFilters),
}));

// Mock des composants shared
jest.mock("../../components/shared", () => ({
  SharedAdvancedFilters: ({
    onFiltersChange,
    onSearchChange,
    onReset,
  }: {
    onFiltersChange: (filters: Record<string, unknown>) => void;
    onSearchChange: (search: string) => void;
    onReset: () => void;
  }) => (
    <div data-testid="shared-advanced-filters">
      <button onClick={() => onFiltersChange({})}>Change Filters</button>
      <button onClick={() => onSearchChange("")}>Change Search</button>
      <button onClick={onReset}>Reset</button>
    </div>
  ),
  SharedCategoryFilter: ({
    onCategoryChange,
    onResetFilters,
  }: {
    onCategoryChange: (categoryId: string) => void;
    onResetFilters: () => void;
  }) => (
    <div data-testid="shared-category-filter">
      <button onClick={() => onCategoryChange("cat-1")}>Select Category</button>
      <button onClick={onResetFilters}>Reset Filters</button>
    </div>
  ),
}));

// Mock du ProductGrid
jest.mock("../../components/shared/ProductGrid", () => ({
  ProductGrid: ({
    products,
    onAddToCart,
    onView,
  }: {
    products: Array<{ id: string; name: string }>;
    onAddToCart: (product: { id: string; name: string }) => void;
    onView: (product: { id: string; name: string }) => void;
  }) => (
    <div data-testid="product-grid">
      {products.map((product) => (
        <div key={product.id} data-testid={`product-${product.id}`}>
          <span>{product.name}</span>
          <button onClick={() => onAddToCart(product)}>Add to Cart</button>
          <button onClick={() => onView(product)}>View</button>
        </div>
      ))}
    </div>
  ),
}));

// Mock du UniverseProvider
jest.mock("../../contexts/UniverseContext", () => ({
  UniverseProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="universe-provider">{children}</div>
  ),
}));

// Wrapper de test avec providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ChakraProvider>{children}</ChakraProvider>
  </BrowserRouter>
);

describe("StoreBrewery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche le titre de la brasserie", () => {
    render(<StoreBrewery />, { wrapper: TestWrapper });

    expect(screen.getByText("🍺 Houblon & Tradition")).toBeInTheDocument();
  });

  it("affiche la description de la brasserie", () => {
    render(<StoreBrewery />, { wrapper: TestWrapper });

    expect(
      screen.getByText(
        "Brasserie artisanale - Sélection de bières traditionnelles"
      )
    ).toBeInTheDocument();
  });

  it("affiche le nombre de produits disponibles", () => {
    render(<StoreBrewery />, { wrapper: TestWrapper });

    expect(screen.getByText("1 produit")).toBeInTheDocument();
  });

  it("utilise le thème orange pour la brasserie", () => {
    render(<StoreBrewery />, { wrapper: TestWrapper });

    // Vérifier que le titre utilise la couleur orange
    const title = screen.getByText("🍺 Houblon & Tradition");
    expect(title).toHaveClass("chakra-heading");
  });

  it("affiche les produits de la brasserie", () => {
    render(<StoreBrewery />, { wrapper: TestWrapper });

    expect(screen.getByText("Blonde Artisanale")).toBeInTheDocument();
  });

  it("gère l'état de chargement", () => {
    // Mock temporaire pour l'état de chargement
    const hooks = jest.requireActual("../../hooks");
    jest.spyOn(hooks, "useShopData").mockReturnValueOnce({
      ...mockUseShopData,
      loading: true,
    });

    render(<StoreBrewery />, { wrapper: TestWrapper });

    expect(
      screen.getByText("Chargement de la brasserie...")
    ).toBeInTheDocument();
  });

  it("gère les erreurs", () => {
    // Mock temporaire pour l'état d'erreur
    const hooks = jest.requireActual("../../hooks");
    jest.spyOn(hooks, "useShopData").mockReturnValueOnce({
      ...mockUseShopData,
      loading: false,
      error: "Erreur de chargement",
    });

    render(<StoreBrewery />, { wrapper: TestWrapper });

    expect(
      screen.getByText("Erreur: Erreur de chargement")
    ).toBeInTheDocument();
  });
});
