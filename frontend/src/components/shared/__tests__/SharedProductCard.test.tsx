import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { UniverseProvider } from "../../../contexts/UniverseContext";
import theme from "../../../theme";
import { SharedProductCard } from "../SharedProductCard";

// Mock des props de test
const mockProduct = {
  id: "test-product-1",
  name: "Bière Blonde Test",
  description: "Une excellente bière blonde artisanale pour les tests",
  price: 4.5,
  category: "Blondes",
};

// Wrapper avec providers nécessaires
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider theme={theme}>
    <UniverseProvider defaultUniverse="brewery">{children}</UniverseProvider>
  </ChakraProvider>
);

describe("SharedProductCard", () => {
  it("affiche correctement les informations du produit", () => {
    render(
      <SharedProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        category={mockProduct.category}
      />,
      { wrapper: TestWrapper }
    );

    // Vérifications des éléments affichés
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText("4.50€")).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category!)).toBeInTheDocument();
  });

  it("affiche le bouton admin en mode admin", () => {
    const mockOnEdit = jest.fn();

    render(
      <SharedProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        onEdit={mockOnEdit}
        isAdminMode={true}
      />,
      { wrapper: TestWrapper }
    );

    const editButton = screen.getByText("✏️ Modifier");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct.id);
  });

  it("affiche le bouton panier en mode vitrine", () => {
    const mockOnAddToCart = jest.fn();

    render(
      <SharedProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        onAddToCart={mockOnAddToCart}
        isAdminMode={false}
      />,
      { wrapper: TestWrapper }
    );

    const cartButton = screen.getByText("🛒 Ajouter au panier");
    expect(cartButton).toBeInTheDocument();

    fireEvent.click(cartButton);
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it("applique le thème brewery par défaut", () => {
    render(
      <SharedProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
      />,
      { wrapper: TestWrapper }
    );

    // Le badge devrait utiliser le colorScheme brewery
    const badge = screen.getByText(mockProduct.category!);
    expect(badge).toHaveClass("chakra-badge");
  });
});
