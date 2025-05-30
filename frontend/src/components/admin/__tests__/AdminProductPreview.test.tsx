import { render, screen } from "@testing-library/react";
import AdminProductPreview from "../AdminProductPreview";

// Mock framer-motion avec support de motion(Component)
jest.mock("framer-motion", () => ({
  motion: (Component: React.ComponentType) => Component,
}));

// Mock Chakra UI complètement
jest.mock("@chakra-ui/react", () => ({
  Box: ({ children, ...props }: React.ComponentProps<"div">) => (
    <div {...props}>{children}</div>
  ),
  VStack: ({ children, ...props }: React.ComponentProps<"div">) => (
    <div {...props}>{children}</div>
  ),
  Heading: ({ children, ...props }: React.ComponentProps<"h1">) => (
    <h1 {...props}>{children}</h1>
  ),
  Text: ({ children, ...props }: React.ComponentProps<"p">) => (
    <p {...props}>{children}</p>
  ),
}));

// Mock SharedProductCard pour éviter les dépendances complexes
jest.mock("../../shared/SharedProductCard", () => ({
  SharedProductCard: ({
    product,
    shop,
    isAdminMode,
  }: {
    product: {
      name?: string;
      description?: string;
      price?: number;
      category?: { name: string };
    };
    shop: { name: string };
    isAdminMode: boolean;
  }) => {
    const price = typeof product.price === "number" ? product.price : 0;
    return (
      <div data-testid="shared-product-card">
        <div data-testid="product-name">{product.name || "Nom du produit"}</div>
        <div data-testid="product-description">
          {product.description || "Description du produit..."}
        </div>
        <div data-testid="product-price">{price.toFixed(2)}€</div>
        {product.category && (
          <div data-testid="product-category">{product.category.name}</div>
        )}
        <div data-testid="admin-mode">{isAdminMode ? "admin" : "vitrine"}</div>
        <div data-testid="shop-name">{shop.name}</div>
      </div>
    );
  },
}));

// Mock UniverseProvider pour simplifier
jest.mock("../../../contexts/UniverseContext", () => ({
  UniverseProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="universe-provider">{children}</div>
  ),
}));

describe("AdminProductPreview", () => {
  const mockProductData = {
    name: "Blonde de Garde",
    description:
      "Bière blonde traditionnelle brassée selon les méthodes ancestrales",
    price: "4.50",
    category: "Blondes",
  };

  test("affiche les données du produit via SharedProductCard", () => {
    render(<AdminProductPreview productData={mockProductData} />);

    expect(screen.getByTestId("shared-product-card")).toBeInTheDocument();
    expect(screen.getByTestId("product-name")).toHaveTextContent(
      "Blonde de Garde"
    );
    expect(screen.getByTestId("product-description")).toHaveTextContent(
      "Bière blonde traditionnelle brassée selon les méthodes ancestrales"
    );
    expect(screen.getByTestId("product-price")).toHaveTextContent("4.50€");
    expect(screen.getByTestId("product-category")).toHaveTextContent("Blondes");
  });

  test("utilise le mode vitrine pour SharedProductCard", () => {
    render(<AdminProductPreview productData={mockProductData} />);

    expect(screen.getByTestId("admin-mode")).toHaveTextContent("vitrine");
  });

  test("affiche le nom de boutique brewery par défaut", () => {
    render(<AdminProductPreview productData={mockProductData} />);

    expect(screen.getByTestId("shop-name")).toHaveTextContent(
      "Houblon & Tradition"
    );
  });

  test("affiche le nom de boutique teaShop quand shopType est teaShop", () => {
    render(
      <AdminProductPreview productData={mockProductData} shopType="teaShop" />
    );

    expect(screen.getByTestId("shop-name")).toHaveTextContent(
      "Les Jardins de Darjeeling"
    );
  });

  test("affiche le nom de boutique beatyShop quand shopType est beatyShop", () => {
    render(
      <AdminProductPreview productData={mockProductData} shopType="beatyShop" />
    );

    expect(screen.getByTestId("shop-name")).toHaveTextContent(
      "L'Écrin de Jade"
    );
  });

  test("affiche le nom de boutique herbShop quand shopType est herbShop", () => {
    render(
      <AdminProductPreview productData={mockProductData} shopType="herbShop" />
    );

    expect(screen.getByTestId("shop-name")).toHaveTextContent(
      "Herboristerie du Moulin Vert"
    );
  });

  test("utilise brewery comme fallback pour shopType invalide", () => {
    render(
      <AdminProductPreview productData={mockProductData} shopType="invalid" />
    );

    expect(screen.getByTestId("shop-name")).toHaveTextContent(
      "Houblon & Tradition"
    );
  });

  test("affiche l'indicateur de changements quand hasChanges est true", () => {
    render(
      <AdminProductPreview productData={mockProductData} hasChanges={true} />
    );

    expect(
      screen.getByText("✨ Aperçu mis à jour en temps réel")
    ).toBeInTheDocument();
  });

  test("n'affiche pas l'indicateur de changements quand hasChanges est false", () => {
    render(
      <AdminProductPreview productData={mockProductData} hasChanges={false} />
    );

    expect(
      screen.queryByText("✨ Aperçu mis à jour en temps réel")
    ).not.toBeInTheDocument();
  });

  test("gère les données vides avec des valeurs par défaut", () => {
    const emptyProductData = {
      name: "",
      description: "",
      price: "",
    };

    render(<AdminProductPreview productData={emptyProductData} />);

    expect(screen.getByTestId("product-name")).toHaveTextContent(
      "Nom du produit"
    );
    expect(screen.getByTestId("product-description")).toHaveTextContent(
      "Description du produit..."
    );
    expect(screen.getByTestId("product-price")).toHaveTextContent("0.00€");
  });

  test("convertit correctement les prix string en number", () => {
    const productWithStringPrice = {
      ...mockProductData,
      price: "5.75",
    };

    render(<AdminProductPreview productData={productWithStringPrice} />);

    expect(screen.getByTestId("product-price")).toHaveTextContent("5.75€");
  });

  test("gère les prix numériques", () => {
    const productWithNumberPrice = {
      ...mockProductData,
      price: 6.25,
    };

    render(<AdminProductPreview productData={productWithNumberPrice} />);

    expect(screen.getByTestId("product-price")).toHaveTextContent("6.25€");
  });

  test("gère les prix invalides avec fallback à 0", () => {
    const productWithInvalidPrice = {
      ...mockProductData,
      price: "invalid",
    };

    render(<AdminProductPreview productData={productWithInvalidPrice} />);

    expect(screen.getByTestId("product-price")).toHaveTextContent("0.00€");
  });

  test("affiche les autres produits simulés pour le contexte", () => {
    render(<AdminProductPreview productData={mockProductData} />);

    expect(
      screen.getByText("Autres produits de la boutique")
    ).toBeInTheDocument();
    expect(screen.getByText("Autre produit 1")).toBeInTheDocument();
    expect(screen.getByText("Autre produit 2")).toBeInTheDocument();
  });

  test("n'affiche pas la catégorie si elle n'est pas fournie", () => {
    const productWithoutCategory = {
      name: "Produit sans catégorie",
      description: "Description",
      price: "3.00",
    };

    render(<AdminProductPreview productData={productWithoutCategory} />);

    expect(screen.getByTestId("product-name")).toHaveTextContent(
      "Produit sans catégorie"
    );
    expect(screen.queryByTestId("product-category")).not.toBeInTheDocument();
  });

  test("affiche le message d'aperçu vitrine", () => {
    render(<AdminProductPreview productData={mockProductData} />);

    expect(
      screen.getByText(
        "Aperçu vitrine - Voici comment votre produit apparaîtra"
      )
    ).toBeInTheDocument();
  });

  test("utilise UniverseProvider pour la thématisation", () => {
    render(<AdminProductPreview productData={mockProductData} />);

    expect(screen.getByTestId("universe-provider")).toBeInTheDocument();
  });
});
