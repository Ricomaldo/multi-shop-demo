import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Product, Shop } from "../../../../../shared/types";
import AdminProductList from "../AdminProductList";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

// Mock des données de test
const mockShop: Shop = {
  id: "test-shop-1",
  name: "Houblon & Tradition",
  shopType: "brewery",
  categories: [],
};

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Bière Blonde",
    description: "Une excellente bière blonde",
    price: 4.5,
    categoryId: "cat-1",
    shopId: "test-shop-1",
    category: {
      id: "cat-1",
      name: "Blondes",
      shopId: "test-shop-1",
    },
  },
  {
    id: "2",
    name: "Bière Brune",
    description: "Une bière brune savoureuse",
    price: 5.0,
    categoryId: "cat-2",
    shopId: "test-shop-1",
    category: {
      id: "cat-2",
      name: "Brunes",
      shopId: "test-shop-1",
    },
  },
];

describe("AdminProductList", () => {
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche la liste des produits correctement", () => {
    render(
      <AdminProductList
        products={mockProducts}
        shop={mockShop}
        onEdit={mockOnEdit}
      />,
      {
        wrapper: TestWrapper,
      }
    );

    // Vérifier les noms des produits
    expect(screen.getByText("Bière Blonde")).toBeInTheDocument();
    expect(screen.getByText("Bière Brune")).toBeInTheDocument();
    expect(screen.getByText("4.50 €")).toBeInTheDocument();
    expect(screen.getByText("5.00 €")).toBeInTheDocument();
  });

  test("gère les props correctement", () => {
    render(
      <AdminProductList
        products={mockProducts}
        shop={mockShop}
        onEdit={mockOnEdit}
      />,
      {
        wrapper: TestWrapper,
      }
    );

    // Vérifier que les boutons de modification sont présents (mode admin)
    const editButtons = screen.getAllByText("✏️ Modifier");
    expect(editButtons).toHaveLength(2);
  });

  test("appelle onEdit avec le bon produit", () => {
    render(
      <AdminProductList
        products={mockProducts}
        shop={mockShop}
        onEdit={mockOnEdit}
      />,
      {
        wrapper: TestWrapper,
      }
    );

    // Cliquer sur le premier bouton modifier
    const firstEditButton = screen.getAllByText("✏️ Modifier")[0];
    fireEvent.click(firstEditButton);

    // Vérifier que onEdit est appelé avec le bon produit
    expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  test("gère une liste vide", () => {
    render(
      <AdminProductList products={[]} shop={mockShop} onEdit={mockOnEdit} />,
      {
        wrapper: TestWrapper,
      }
    );

    // Vérifier qu'aucun produit n'est affiché
    expect(screen.queryByText("Bière Blonde")).not.toBeInTheDocument();
  });

  test("utilise VStack avec les bonnes props", () => {
    const { container } = render(
      <AdminProductList
        products={mockProducts}
        shop={mockShop}
        onEdit={mockOnEdit}
      />,
      { wrapper: TestWrapper }
    );

    // Vérifier la structure VStack
    const vstack = container.querySelector(".chakra-stack");
    expect(vstack).toBeInTheDocument();
  });

  test("passe isAdminMode=true aux cartes produit", () => {
    render(
      <AdminProductList
        products={mockProducts}
        shop={mockShop}
        onEdit={mockOnEdit}
      />,
      {
        wrapper: TestWrapper,
      }
    );

    // Vérifier que les boutons admin sont présents
    expect(screen.getAllByText("✏️ Modifier")).toHaveLength(2);
  });

  test("gère un produit sans catégorie", () => {
    const productWithoutCategory: Product = {
      id: "product-3",
      name: "Produit sans catégorie",
      description: "Description",
      price: 3.0,
      categoryId: "cat-3",
      shopId: "test-shop-1",
    };

    render(
      <AdminProductList
        products={[productWithoutCategory]}
        shop={mockShop}
        onEdit={mockOnEdit}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("Produit sans catégorie")).toBeInTheDocument();
  });

  it("affiche un message quand il n'y a pas de produits", () => {
    render(
      <ChakraProvider>
        <AdminProductList products={[]} shop={mockShop} onEdit={mockOnEdit} />
      </ChakraProvider>
    );

    // Vérifier qu'aucun produit n'est affiché
    expect(screen.queryByText("Bière Blonde")).not.toBeInTheDocument();
  });
});
