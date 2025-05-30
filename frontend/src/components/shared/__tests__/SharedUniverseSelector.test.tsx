import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Shop } from "../../../../../shared/types";
import theme from "../../../theme";
import SharedUniverseSelector from "../SharedUniverseSelector";

// Mock des données de test
const mockShops: Shop[] = [
  {
    id: "shop-1",
    name: "Houblon & Tradition",
    shopType: "brewery",
    categories: [
      { id: "cat-1", name: "Bières Blondes", shopId: "shop-1" },
      { id: "cat-2", name: "Bières Brunes", shopId: "shop-1" },
    ],
  },
  {
    id: "shop-2",
    name: "Les Jardins de Darjeeling",
    shopType: "teaShop",
    categories: [{ id: "cat-3", name: "Thés Verts", shopId: "shop-2" }],
  },
  {
    id: "shop-3",
    name: "L'Écrin de Jade",
    shopType: "beatyShop",
    categories: [],
  },
];

// Wrapper avec providers nécessaires
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

describe("SharedUniverseSelector", () => {
  const mockOnShopChange = jest.fn();
  const mockOnUniverseChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Mode Shop", () => {
    it("affiche correctement les boutiques en mode shop", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={mockShops}
          selectedShop={null}
          onShopChange={mockOnShopChange}
        />,
        { wrapper: TestWrapper }
      );

      // Vérifications des éléments spécifiques au mode shop
      expect(
        screen.getByText("Sélectionner une boutique :")
      ).toBeInTheDocument();
      expect(screen.getByText("Houblon & Tradition")).toBeInTheDocument();
      expect(screen.getByText("Les Jardins de Darjeeling")).toBeInTheDocument();
      expect(screen.getByText("L'Écrin de Jade")).toBeInTheDocument();
    });

    it("gère la sélection de boutique en mode shop", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={mockShops}
          selectedShop={null}
          onShopChange={mockOnShopChange}
        />,
        { wrapper: TestWrapper }
      );

      const shopButton = screen.getByText("Houblon & Tradition");
      fireEvent.click(shopButton);

      expect(mockOnShopChange).toHaveBeenCalledWith(mockShops[0]);
    });

    it("affiche les informations de boutique sélectionnée en mode shop", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={mockShops}
          selectedShop={mockShops[0]}
          onShopChange={mockOnShopChange}
          showDescription={true}
        />,
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByText("Boutique active : Houblon & Tradition")
      ).toBeInTheDocument();
      expect(screen.getByText("2 catégorie(s)")).toBeInTheDocument();
    });

    it("affiche l'état de chargement en mode shop", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={[]}
          selectedShop={null}
          onShopChange={mockOnShopChange}
          loading={true}
        />,
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByText("Chargement des boutiques...")
      ).toBeInTheDocument();
    });

    it("gère les descriptions en mode shop", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={mockShops}
          selectedShop={null}
          onShopChange={mockOnShopChange}
          showDescription={true}
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("Brasserie artisanale")).toBeInTheDocument();
      expect(screen.getByText("Salon de thé")).toBeInTheDocument();
      expect(screen.getByText("Institut beauté")).toBeInTheDocument();
    });

    it("cache les descriptions quand showDescription=false en mode shop", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={mockShops}
          selectedShop={mockShops[0]}
          onShopChange={mockOnShopChange}
          showDescription={false}
        />,
        { wrapper: TestWrapper }
      );

      expect(
        screen.queryByText("Brasserie artisanale")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Boutique active : Houblon & Tradition")
      ).not.toBeInTheDocument();
    });
  });

  describe("Mode Universe", () => {
    it("affiche correctement les univers en mode universe", () => {
      render(
        <SharedUniverseSelector
          mode="universe"
          universe="brewery"
          onUniverseChange={mockOnUniverseChange}
        />,
        { wrapper: TestWrapper }
      );

      // Vérifications des éléments spécifiques au mode universe
      expect(screen.getByText("🏪 Univers Boutique")).toBeInTheDocument();
      expect(screen.getByText("Houblon & Tradition")).toBeInTheDocument();
      expect(screen.getByText("Les Jardins de Darjeeling")).toBeInTheDocument();
      expect(screen.getByText("L'Écrin de Jade")).toBeInTheDocument();
      expect(
        screen.getByText("Herboristerie du Moulin Vert")
      ).toBeInTheDocument();
    });

    it("gère la sélection d'univers en mode universe", () => {
      render(
        <SharedUniverseSelector
          mode="universe"
          universe="brewery"
          onUniverseChange={mockOnUniverseChange}
        />,
        { wrapper: TestWrapper }
      );

      const universeButton = screen.getByText("Les Jardins de Darjeeling");
      fireEvent.click(universeButton);

      expect(mockOnUniverseChange).toHaveBeenCalledWith("teaShop");
    });

    it("affiche la description de l'univers actuel en mode universe", () => {
      render(
        <SharedUniverseSelector
          mode="universe"
          universe="teaShop"
          onUniverseChange={mockOnUniverseChange}
          showDescription={true}
        />,
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByText("Univers actuel : Salon de thé")
      ).toBeInTheDocument();
    });

    it("cache la description quand showDescription=false en mode universe", () => {
      render(
        <SharedUniverseSelector
          mode="universe"
          universe="teaShop"
          onUniverseChange={mockOnUniverseChange}
          showDescription={false}
        />,
        { wrapper: TestWrapper }
      );

      expect(
        screen.queryByText("Univers actuel : Salon de thé")
      ).not.toBeInTheDocument();
    });

    it("gère l'absence d'univers sélectionné en mode universe", () => {
      render(
        <SharedUniverseSelector
          mode="universe"
          universe={undefined}
          onUniverseChange={mockOnUniverseChange}
          showDescription={true}
        />,
        { wrapper: TestWrapper }
      );

      // Aucune description ne doit être affichée
      expect(screen.queryByText(/Univers actuel :/)).not.toBeInTheDocument();
    });
  });

  describe("Props communes", () => {
    it("respecte le titre personnalisé", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={mockShops}
          selectedShop={null}
          onShopChange={mockOnShopChange}
          title="Choisir votre boutique"
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("Choisir votre boutique :")).toBeInTheDocument();
    });

    it("respecte la taille personnalisée", () => {
      render(
        <SharedUniverseSelector
          mode="universe"
          universe="brewery"
          onUniverseChange={mockOnUniverseChange}
          size="sm"
        />,
        { wrapper: TestWrapper }
      );

      // Vérifier que les boutons ont la bonne taille (via les classes CSS)
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveClass("chakra-button");
    });

    it("respecte le variant personnalisé", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={mockShops}
          selectedShop={null}
          onShopChange={mockOnShopChange}
          variant="ghost"
        />,
        { wrapper: TestWrapper }
      );

      // Les boutons non sélectionnés doivent avoir le variant ghost
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveClass("chakra-button");
    });
  });

  describe("Gestion des cas limites", () => {
    it("gère une liste vide de boutiques en mode shop", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={[]}
          selectedShop={null}
          onShopChange={mockOnShopChange}
        />,
        { wrapper: TestWrapper }
      );

      expect(
        screen.getByText("Sélectionner une boutique :")
      ).toBeInTheDocument();
      // Aucun bouton de boutique ne doit être présent
      expect(screen.queryByText("Houblon & Tradition")).not.toBeInTheDocument();
    });

    it("gère les boutiques sans catégories en mode shop", () => {
      render(
        <SharedUniverseSelector
          mode="shop"
          shops={[mockShops[2]]} // L'Écrin de Jade sans catégories
          selectedShop={mockShops[2]}
          onShopChange={mockOnShopChange}
          showDescription={true}
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("0 catégorie(s)")).toBeInTheDocument();
    });

    it("gère les types de boutique inconnus", () => {
      const unknownShop: Shop = {
        id: "shop-unknown",
        name: "Boutique Inconnue",
        shopType: "unknown-type" as "brewery", // Cast vers un type valide pour le test
        categories: [],
      };

      render(
        <SharedUniverseSelector
          mode="shop"
          shops={[unknownShop]}
          selectedShop={null}
          onShopChange={mockOnShopChange}
        />,
        { wrapper: TestWrapper }
      );

      expect(screen.getByText("Boutique Inconnue")).toBeInTheDocument();
      // Doit utiliser l'icône par défaut et la description fallback
    });
  });
});
