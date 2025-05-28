import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import type { Product, Shop } from "../../../../../shared/types";
import { ProductGrid } from "../ProductGrid";

// Mock du composant SharedProductCard
jest.mock("../SharedProductCard", () => ({
  SharedProductCard: ({
    product,
    shop,
    isAdminMode,
  }: {
    product: Product;
    shop: Shop;
    isAdminMode?: boolean;
  }) => (
    <div data-testid={`product-card-${product.id}`}>
      <span>{product.name}</span>
      <span>{shop.name}</span>
      <span>{isAdminMode ? "admin" : "store"}</span>
    </div>
  ),
}));

const mockShop: Shop = {
  id: "shop-1",
  name: "Test Shop",
  shopType: "brewery",
  categories: [],
};

const mockProducts: Product[] = [
  {
    id: "product-1",
    name: "Produit 1",
    description: "Description 1",
    price: 10.99,
    shopId: "shop-1",
    categoryId: "cat-1",
  },
  {
    id: "product-2",
    name: "Produit 2",
    description: "Description 2",
    price: 15.99,
    shopId: "shop-1",
    categoryId: "cat-1",
  },
];

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("ProductGrid", () => {
  it("affiche une grille de produits", () => {
    renderWithChakra(<ProductGrid products={mockProducts} shop={mockShop} />);

    expect(screen.getByTestId("product-card-product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-product-2")).toBeInTheDocument();
    expect(screen.getByText("Produit 1")).toBeInTheDocument();
    expect(screen.getByText("Produit 2")).toBeInTheDocument();
  });

  it("affiche un message quand aucun produit", () => {
    renderWithChakra(<ProductGrid products={[]} shop={mockShop} />);

    expect(screen.getByText("Aucun produit disponible")).toBeInTheDocument();
  });

  it("affiche un message personnalisé quand vide", () => {
    renderWithChakra(
      <ProductGrid
        products={[]}
        shop={mockShop}
        emptyMessage="Aucun résultat"
        emptySubMessage="Essayez d'autres filtres"
      />
    );

    expect(screen.getByText("Aucun résultat")).toBeInTheDocument();
    expect(screen.getByText("Essayez d'autres filtres")).toBeInTheDocument();
  });

  it("passe les props correctement à SharedProductCard", () => {
    renderWithChakra(
      <ProductGrid products={mockProducts} shop={mockShop} isAdminMode={true} />
    );

    // Vérifie que le mode admin est passé
    expect(screen.getAllByText("admin")).toHaveLength(2);
    expect(screen.queryByText("store")).not.toBeInTheDocument();
  });

  it("utilise les colonnes par défaut", () => {
    const { container } = renderWithChakra(
      <ProductGrid products={mockProducts} shop={mockShop} />
    );

    // Vérifie que SimpleGrid est rendu
    const grid = container.querySelector(".chakra-simple-grid");
    expect(grid).toBeInTheDocument();
  });

  it("gère les callbacks d'actions", () => {
    const mockOnAddToCart = jest.fn();
    const mockOnEdit = jest.fn();

    renderWithChakra(
      <ProductGrid
        products={mockProducts}
        shop={mockShop}
        onAddToCart={mockOnAddToCart}
        onEdit={mockOnEdit}
      />
    );

    // Les callbacks sont passés aux cartes produit
    expect(screen.getByTestId("product-card-product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-product-2")).toBeInTheDocument();
  });

  it("gère le mode vitrine par défaut", () => {
    renderWithChakra(<ProductGrid products={mockProducts} shop={mockShop} />);

    // Vérifie que le mode store est utilisé par défaut
    expect(screen.getAllByText("store")).toHaveLength(2);
  });

  it("affiche les actions par défaut", () => {
    renderWithChakra(<ProductGrid products={mockProducts} shop={mockShop} />);

    // Les cartes sont rendues (showActions=true par défaut)
    expect(screen.getByTestId("product-card-product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-product-2")).toBeInTheDocument();
  });
});
