import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Product } from "../../../../../shared/types";
import { UniverseProvider } from "../../../contexts/UniverseContext";
import AdminProductList from "../AdminProductList";

// Mock du composant SharedProductCard
jest.mock("../../shared/SharedProductCard", () => ({
  SharedProductCard: ({
    id,
    name,
    price,
    onEdit,
    isAdminMode,
  }: {
    id: string;
    name: string;
    price: number;
    onEdit: (id: string) => void;
    isAdminMode: boolean;
  }) => (
    <div data-testid={`product-card-${id}`}>
      <span>{name}</span>
      <span>{price}€</span>
      {isAdminMode && <button onClick={() => onEdit(id)}>Modifier</button>}
    </div>
  ),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>
    <UniverseProvider>{children}</UniverseProvider>
  </ChakraProvider>
);

const mockProducts: Product[] = [
  {
    id: "product-1",
    name: "Blonde de Garde",
    description: "Bière blonde traditionnelle",
    price: 4.5,
    categoryId: "cat-1",
    shopId: "shop-1",
    category: { id: "cat-1", name: "Blondes", shopId: "shop-1" },
    shop: {
      id: "shop-1",
      name: "Houblon & Tradition",
      shopType: "brewery",
      categories: [],
    },
  },
  {
    id: "product-2",
    name: "IPA Américaine",
    description: "IPA houblonnée",
    price: 5.5,
    categoryId: "cat-2",
    shopId: "shop-1",
    category: { id: "cat-2", name: "IPA", shopId: "shop-1" },
    shop: {
      id: "shop-1",
      name: "Houblon & Tradition",
      shopType: "brewery",
      categories: [],
    },
  },
];

describe("AdminProductList", () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche la liste des produits correctement", () => {
    render(<AdminProductList products={mockProducts} onEdit={mockOnEdit} />, {
      wrapper: TestWrapper,
    });

    // Vérifier que tous les produits sont affichés
    expect(screen.getByTestId("product-card-product-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-product-2")).toBeInTheDocument();

    // Vérifier les noms et prix
    expect(screen.getByText("Blonde de Garde")).toBeInTheDocument();
    expect(screen.getByText("IPA Américaine")).toBeInTheDocument();
    expect(screen.getByText("4.5€")).toBeInTheDocument();
    expect(screen.getByText("5.5€")).toBeInTheDocument();
  });

  test("gère les props correctement", () => {
    render(<AdminProductList products={mockProducts} onEdit={mockOnEdit} />, {
      wrapper: TestWrapper,
    });

    // Vérifier que les boutons de modification sont présents (mode admin)
    const editButtons = screen.getAllByText("Modifier");
    expect(editButtons).toHaveLength(2);
  });

  test("appelle onEdit avec le bon produit", () => {
    render(<AdminProductList products={mockProducts} onEdit={mockOnEdit} />, {
      wrapper: TestWrapper,
    });

    // Cliquer sur le premier bouton modifier
    const firstEditButton = screen.getAllByText("Modifier")[0];
    fireEvent.click(firstEditButton);

    // Vérifier que onEdit est appelé avec le bon produit
    expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  test("gère une liste vide", () => {
    render(<AdminProductList products={[]} onEdit={mockOnEdit} />, {
      wrapper: TestWrapper,
    });

    // Vérifier qu'aucun produit n'est affiché
    expect(screen.queryByTestId(/product-card-/)).not.toBeInTheDocument();
  });

  test("utilise VStack avec les bonnes props", () => {
    const { container } = render(
      <AdminProductList products={mockProducts} onEdit={mockOnEdit} />,
      { wrapper: TestWrapper }
    );

    // Vérifier la structure VStack
    const vstack = container.querySelector(".chakra-stack");
    expect(vstack).toBeInTheDocument();
  });

  test("passe isAdminMode=true aux cartes produit", () => {
    render(<AdminProductList products={mockProducts} onEdit={mockOnEdit} />, {
      wrapper: TestWrapper,
    });

    // Vérifier que les boutons admin sont présents
    expect(screen.getAllByText("Modifier")).toHaveLength(2);
  });

  test("gère un produit sans catégorie", () => {
    const productWithoutCategory: Product = {
      id: "product-3",
      name: "Produit sans catégorie",
      description: "Description",
      price: 3.0,
      categoryId: "cat-3",
      shopId: "shop-1",
    };

    render(
      <AdminProductList
        products={[productWithoutCategory]}
        onEdit={mockOnEdit}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("Produit sans catégorie")).toBeInTheDocument();
  });
});
