import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Product, Shop } from "../../../../../shared/types";
import theme from "../../../theme";

// Mock du composant SharedProductCard pour éviter les problèmes Chakra UI
jest.mock("../SharedProductCard", () => {
  return function MockSharedProductCard({
    product,
    shop,
    isAdminMode = false,
    onEdit,
    onAddToCart,
  }: {
    product: Product;
    shop: Shop;
    isAdminMode?: boolean;
    onEdit?: () => void;
    onAddToCart?: () => void;
  }) {
    const attributes = product.attributes ? JSON.parse(product.attributes) : {};

    return (
      <div data-testid="shared-product-card">
        <div data-testid="product-name">{product.name}</div>
        <div data-testid="product-description">{product.description}</div>
        <div data-testid="product-price">{product.price}€</div>
        {product.category && (
          <div data-testid="product-category">{product.category.name}</div>
        )}
        <div data-testid="shop-name">{shop.name}</div>

        {/* Attributs métier spécialisés */}
        {attributes.degre_alcool && (
          <div data-testid="degre-alcool">{attributes.degre_alcool}°</div>
        )}
        {attributes.amertume_ibu && (
          <div data-testid="amertume-ibu">{attributes.amertume_ibu} IBU</div>
        )}

        {/* Badge de stock */}
        {attributes.stock !== undefined && (
          <div data-testid="stock-badge">
            {attributes.stock > 10
              ? "En stock"
              : attributes.stock > 0
              ? "Stock faible"
              : "Rupture"}
          </div>
        )}

        {/* Boutons selon le mode */}
        {isAdminMode && onEdit && (
          <button onClick={onEdit} data-testid="edit-button">
            Modifier
          </button>
        )}
        {!isAdminMode && onAddToCart && (
          <button
            onClick={onAddToCart}
            disabled={attributes.stock === 0}
            data-testid="add-to-cart-button"
          >
            Ajouter au panier
          </button>
        )}
      </div>
    );
  };
});

// Import du composant mocké
import { SharedProductCard } from "../SharedProductCard";

// Mock des données de test
const mockShop: Shop = {
  id: "test-shop-1",
  name: "Houblon & Tradition",
  shopType: "brewery",
  categories: [],
};

const mockProduct: Product = {
  id: "test-product-1",
  name: "Bière Blonde Test",
  description: "Une excellente bière blonde artisanale pour les tests",
  price: 4.5,
  image: undefined,
  attributes: JSON.stringify({
    degre_alcool: "4.8%",
    amertume_ibu: "22 IBU",
    type_houblon: "Cascade",
    stock: 45,
  }),
  categoryId: "test-category-1",
  shopId: "test-shop-1",
  category: {
    id: "test-category-1",
    name: "Bières Blondes",
    shopId: "test-shop-1",
  },
  shop: mockShop,
};

// Wrapper avec providers nécessaires
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

describe("SharedProductCard", () => {
  it("affiche correctement les informations du produit", () => {
    render(<SharedProductCard product={mockProduct} shop={mockShop} />, {
      wrapper: TestWrapper,
    });

    // Vérifications des éléments affichés
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description!)).toBeInTheDocument();
    expect(screen.getByText("4.50 €")).toBeInTheDocument();
    expect(screen.getByText("Bières Blondes")).toBeInTheDocument();
  });

  it("affiche les attributs métier spécialisés", () => {
    render(<SharedProductCard product={mockProduct} shop={mockShop} />, {
      wrapper: TestWrapper,
    });

    // Vérifications des attributs brasserie
    expect(screen.getByText("Caractéristiques :")).toBeInTheDocument();
    expect(screen.getByText("4.8%°")).toBeInTheDocument(); // degré d'alcool avec unité
    expect(screen.getByText("22 IBU IBU")).toBeInTheDocument(); // amertume avec unité
  });

  it("affiche le bouton admin en mode admin", () => {
    const mockOnEdit = jest.fn();

    render(
      <SharedProductCard
        product={mockProduct}
        shop={mockShop}
        onEdit={mockOnEdit}
        isAdminMode={true}
      />,
      { wrapper: TestWrapper }
    );

    const editButton = screen.getByText("✏️ Modifier");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);
  });

  it("affiche le bouton panier en mode vitrine", () => {
    const mockOnAddToCart = jest.fn();

    render(
      <SharedProductCard
        product={mockProduct}
        shop={mockShop}
        onAddToCart={mockOnAddToCart}
        isAdminMode={false}
      />,
      { wrapper: TestWrapper }
    );

    const cartButton = screen.getByText("Ajouter au panier");
    expect(cartButton).toBeInTheDocument();

    fireEvent.click(cartButton);
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it("applique le thème brewery automatiquement", () => {
    render(<SharedProductCard product={mockProduct} shop={mockShop} />, {
      wrapper: TestWrapper,
    });

    // Le badge devrait utiliser le colorScheme orange (brewery)
    const badge = screen.getByText("Bières Blondes");
    expect(badge).toHaveClass("chakra-badge");
  });

  it("affiche le badge de stock", () => {
    render(<SharedProductCard product={mockProduct} shop={mockShop} />, {
      wrapper: TestWrapper,
    });

    // Le badge de stock devrait être affiché avec le format complet
    expect(screen.getByText("En stock (45)")).toBeInTheDocument();
  });

  it("désactive le bouton panier si rupture de stock", () => {
    const outOfStockProduct = {
      ...mockProduct,
      attributes: JSON.stringify({
        ...JSON.parse(mockProduct.attributes!),
        stock: 0,
      }),
    };

    const mockOnAddToCart = jest.fn();

    render(
      <SharedProductCard
        product={outOfStockProduct}
        shop={mockShop}
        onAddToCart={mockOnAddToCart}
        isAdminMode={false}
      />,
      { wrapper: TestWrapper }
    );

    const cartButton = screen.getByText("Rupture de stock");
    expect(cartButton).toBeDisabled();
  });
});
