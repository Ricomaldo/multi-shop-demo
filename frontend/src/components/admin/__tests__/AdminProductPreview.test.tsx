import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { UniverseProvider } from "../../../contexts/UniverseContext";
import AdminProductPreview from "../AdminProductPreview";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>
    <UniverseProvider defaultUniverse="brewery">{children}</UniverseProvider>
  </ChakraProvider>
);

describe("AdminProductPreview", () => {
  const mockProductData = {
    name: "Blonde de Garde",
    description:
      "Bière blonde traditionnelle brassée selon les méthodes ancestrales",
    price: "4.50",
    category: "Blondes",
  };

  test("affiche les données du produit correctement", () => {
    render(<AdminProductPreview productData={mockProductData} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("Blonde de Garde")).toBeInTheDocument();
    expect(screen.getByText(/Bière blonde traditionnelle/)).toBeInTheDocument();
    expect(screen.getByText("4.50€")).toBeInTheDocument();
    expect(screen.getByText("Blondes")).toBeInTheDocument();
  });

  test("affiche le nom de la boutique", () => {
    render(<AdminProductPreview productData={mockProductData} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("🍺 Houblon & Tradition")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Aperçu vitrine - Voici comment votre produit apparaîtra"
      )
    ).toBeInTheDocument();
  });

  test("affiche l'indicateur de changements quand hasChanges est true", () => {
    render(
      <AdminProductPreview productData={mockProductData} hasChanges={true} />,
      { wrapper: TestWrapper }
    );

    expect(
      screen.getByText("✨ Aperçu mis à jour en temps réel")
    ).toBeInTheDocument();
  });

  test("n'affiche pas l'indicateur de changements quand hasChanges est false", () => {
    render(
      <AdminProductPreview productData={mockProductData} hasChanges={false} />,
      { wrapper: TestWrapper }
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

    render(<AdminProductPreview productData={emptyProductData} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("Nom du produit")).toBeInTheDocument();
    expect(screen.getByText("Description du produit...")).toBeInTheDocument();
    expect(screen.getByText("0.00€")).toBeInTheDocument();
  });

  test("convertit correctement les prix string en number", () => {
    const productWithStringPrice = {
      ...mockProductData,
      price: "5.75",
    };

    render(<AdminProductPreview productData={productWithStringPrice} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("5.75€")).toBeInTheDocument();
  });

  test("gère les prix numériques", () => {
    const productWithNumberPrice = {
      ...mockProductData,
      price: 6.25,
    };

    render(<AdminProductPreview productData={productWithNumberPrice} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("6.25€")).toBeInTheDocument();
  });

  test("affiche le bouton d'ajout au panier", () => {
    render(<AdminProductPreview productData={mockProductData} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("🛒 Ajouter")).toBeInTheDocument();
  });

  test("affiche les autres produits simulés", () => {
    render(<AdminProductPreview productData={mockProductData} />, {
      wrapper: TestWrapper,
    });

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

    render(<AdminProductPreview productData={productWithoutCategory} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText("Produit sans catégorie")).toBeInTheDocument();
    // Vérifier qu'aucun badge de catégorie n'est affiché
    expect(screen.queryByText("Blondes")).not.toBeInTheDocument();
  });

  test("applique le thème brewery correctement", () => {
    const { container } = render(
      <AdminProductPreview productData={mockProductData} />,
      { wrapper: TestWrapper }
    );

    // Vérifier que le composant est rendu avec les styles Chakra
    const previewContainer = container.querySelector(".chakra-stack");
    expect(previewContainer).toBeInTheDocument();
  });
});
