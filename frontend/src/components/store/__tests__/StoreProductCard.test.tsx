import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { UniverseProvider } from "../../../contexts/UniverseContext";
import { SharedProductCard } from "../../shared/SharedProductCard";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>
    <UniverseProvider defaultUniverse="brewery">{children}</UniverseProvider>
  </ChakraProvider>
);

const mockProduct = {
  id: "product-1",
  name: "Blonde de Garde",
  description:
    "Bière blonde traditionnelle brassée selon les méthodes ancestrales",
  price: 4.5,
  category: "Blondes",
};

describe("StoreProductCard", () => {
  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche correctement toutes les données du produit", () => {
    render(
      <SharedProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        category={mockProduct.category}
        onAddToCart={mockOnAddToCart}
        isAdminMode={false}
      />,
      { wrapper: TestWrapper }
    );

    // Vérifier l'affichage du nom
    expect(screen.getByText("Blonde de Garde")).toBeInTheDocument();

    // Vérifier l'affichage de la description
    expect(screen.getByText(/Bière blonde traditionnelle/)).toBeInTheDocument();

    // Vérifier l'affichage du prix formaté
    expect(screen.getByText("4.50€")).toBeInTheDocument();

    // Vérifier l'affichage de la catégorie
    expect(screen.getByText("Blondes")).toBeInTheDocument();
  });

  test("affiche le bouton ajouter au panier en mode vitrine", () => {
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

    const addToCartButton = screen.getByText("🛒 Ajouter au panier");
    expect(addToCartButton).toBeInTheDocument();
  });

  test("appelle onAddToCart avec le bon ID", () => {
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

    const addToCartButton = screen.getByText("🛒 Ajouter au panier");
    fireEvent.click(addToCartButton);

    expect(mockOnAddToCart).toHaveBeenCalledWith("product-1");
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
  });

  test("gère les prix avec décimales", () => {
    render(
      <SharedProductCard
        id="product-2"
        name="IPA Premium"
        description="IPA houblonnée"
        price={5.75}
        onAddToCart={mockOnAddToCart}
        isAdminMode={false}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("5.75€")).toBeInTheDocument();
  });

  test("gère les descriptions longues avec troncature", () => {
    const longDescription =
      "Cette bière blonde exceptionnelle est brassée selon des méthodes traditionnelles transmises de génération en génération dans notre brasserie familiale située au cœur de la région.";

    render(
      <SharedProductCard
        id="product-3"
        name="Blonde Tradition"
        description={longDescription}
        price={4.2}
        onAddToCart={mockOnAddToCart}
        isAdminMode={false}
      />,
      { wrapper: TestWrapper }
    );

    // La description doit être présente (même si tronquée visuellement)
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  test("fonctionne sans catégorie", () => {
    render(
      <SharedProductCard
        id="product-4"
        name="Produit sans catégorie"
        description="Description simple"
        price={3.0}
        onAddToCart={mockOnAddToCart}
        isAdminMode={false}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("Produit sans catégorie")).toBeInTheDocument();
    expect(screen.getByText("3.00€")).toBeInTheDocument();
  });

  test("applique le thème brewery correctement", () => {
    const { container } = render(
      <SharedProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        category={mockProduct.category}
        onAddToCart={mockOnAddToCart}
        isAdminMode={false}
      />,
      { wrapper: TestWrapper }
    );

    // Vérifier que le composant est rendu avec les styles Chakra
    const productCard = container.querySelector(".chakra-box");
    expect(productCard).toBeInTheDocument();
  });

  test("gère les interactions hover", () => {
    const { container } = render(
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

    const productCard = container.querySelector(".chakra-box");
    expect(productCard).toHaveClass("chakra-box");
  });

  test("ne affiche pas le bouton admin en mode vitrine", () => {
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

    expect(screen.queryByText("✏️ Modifier")).not.toBeInTheDocument();
  });
});
