import { act, renderHook } from "@testing-library/react";
import type { Category, Product } from "../../../../shared/types";
import type { ProductFilters } from "../../services/adminProductService";
import { useAdvancedProductFilters } from "../useAdvancedProductFilters";

// Mock du service admin
jest.mock("../../services/adminProductService", () => ({
  __esModule: true,
  default: {
    getFilteredProducts: jest.fn(),
  },
}));

import adminProductService from "../../services/adminProductService";

const mockAdminProductService = adminProductService as jest.Mocked<
  typeof adminProductService
>;

// Mock data
const mockCategory1: Category = {
  id: "cat1",
  name: "Bières",
  shopId: "shop1",
};

const mockCategory2: Category = {
  id: "cat2",
  name: "Accessoires",
  shopId: "shop1",
};

const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Bière IPA",
    description: "Une excellente bière houblonnée",
    price: 4.5,
    shopId: "shop1",
    categoryId: "cat1",
    category: mockCategory1,
    attributes: JSON.stringify({
      degre_alcool: 6.5,
      amertume_ibu: 45,
      type_houblon: "Cascade",
      stock: 25,
    }),
  },
  {
    id: "prod2",
    name: "Bière Blonde",
    description: "Bière légère et rafraîchissante",
    price: 3.8,
    shopId: "shop1",
    categoryId: "cat1",
    category: mockCategory1,
    attributes: JSON.stringify({
      degre_alcool: 4.2,
      amertume_ibu: 20,
      type_houblon: "Saaz",
      stock: 5,
    }),
  },
  {
    id: "prod3",
    name: "Verre à bière",
    description: "Verre spécialisé pour la dégustation",
    price: 12.0,
    shopId: "shop1",
    categoryId: "cat2",
    category: mockCategory2,
    attributes: JSON.stringify({
      stock: 0,
    }),
  },
];

describe("useAdvancedProductFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devrait initialiser avec les bonnes valeurs par défaut", () => {
    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    expect(result.current.selectedCategoryId).toBeNull();
    expect(result.current.filteredProducts).toEqual(mockProducts);
    expect(result.current.categories).toHaveLength(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("devrait filtrer localement sans filtres avancés", async () => {
    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    await act(async () => {
      result.current.applyAdvancedFilters({}, "IPA");
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière IPA");
    expect(mockAdminProductService.getFilteredProducts).not.toHaveBeenCalled();
  });

  it("devrait utiliser le service pour les filtres avancés", async () => {
    mockAdminProductService.getFilteredProducts.mockResolvedValue({
      products: [mockProducts[0]],
      total: 1,
      shopType: "brewery",
      shopName: "Test Brewery",
    });

    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    const advancedFilters: ProductFilters = {
      degre_alcool_min: 6.0,
    };

    await act(async () => {
      result.current.applyAdvancedFilters(advancedFilters, "");
    });

    expect(mockAdminProductService.getFilteredProducts).toHaveBeenCalledWith(
      "shop1",
      {
        degre_alcool_min: 6.0,
        search: "",
        category: undefined,
      }
    );
  });

  it("devrait utiliser le service pour les filtres de prix", async () => {
    mockAdminProductService.getFilteredProducts.mockResolvedValue({
      products: mockProducts,
      total: 3,
      shopType: "brewery",
      shopName: "Test Brewery",
    });

    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    const priceFilters: ProductFilters = {
      minPrice: 4.0,
      maxPrice: 10.0,
    };

    await act(async () => {
      result.current.applyAdvancedFilters(priceFilters, "");
    });

    expect(mockAdminProductService.getFilteredProducts).toHaveBeenCalledWith(
      "shop1",
      {
        minPrice: 4.0,
        maxPrice: 10.0,
        search: "",
        category: undefined,
      }
    );
  });

  it("devrait filtrer par catégorie sélectionnée", async () => {
    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    act(() => {
      result.current.setSelectedCategoryId("cat1");
    });

    // Attendre que l'effet se déclenche
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.filteredProducts).toHaveLength(2);
    expect(
      result.current.filteredProducts.every((p) => p.categoryId === "cat1")
    ).toBe(true);
  });

  it("devrait gérer les erreurs du service avec fallback local", async () => {
    mockAdminProductService.getFilteredProducts.mockRejectedValue(
      new Error("Erreur réseau")
    );

    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    const advancedFilters: ProductFilters = {
      degre_alcool_min: 6.0,
    };

    await act(async () => {
      result.current.applyAdvancedFilters(advancedFilters, "");
    });

    expect(result.current.error).toBe("Erreur réseau");
    // Le fallback local devrait avoir fonctionné
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Bière IPA");
  });

  it("devrait réinitialiser tous les filtres", () => {
    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    // Appliquer des filtres
    act(() => {
      result.current.setSelectedCategoryId("cat1");
    });

    // Réinitialiser
    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.selectedCategoryId).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.filteredProducts).toEqual(mockProducts);
  });

  it("devrait combiner catégorie et filtres avancés", async () => {
    mockAdminProductService.getFilteredProducts.mockResolvedValue({
      products: [mockProducts[0]],
      total: 1,
      shopType: "brewery",
      shopName: "Test Brewery",
    });

    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    act(() => {
      result.current.setSelectedCategoryId("cat1");
    });

    const advancedFilters: ProductFilters = {
      degre_alcool_min: 6.0,
    };

    await act(async () => {
      result.current.applyAdvancedFilters(advancedFilters, "");
    });

    expect(mockAdminProductService.getFilteredProducts).toHaveBeenCalledWith(
      "shop1",
      {
        degre_alcool_min: 6.0,
        search: "",
        category: "Bières", // Nom de la catégorie sélectionnée
      }
    );
  });

  it("devrait gérer l'absence de shopId", async () => {
    const { result } = renderHook(
      () => useAdvancedProductFilters(mockProducts) // Pas de shopId
    );

    await act(async () => {
      result.current.applyAdvancedFilters({ degre_alcool_min: 6.0 }, "");
    });

    // Ne devrait pas appeler le service sans shopId
    expect(mockAdminProductService.getFilteredProducts).not.toHaveBeenCalled();
  });

  it("devrait gérer les états de chargement", async () => {
    // Mock avec délai pour tester l'état loading
    let resolvePromise: (value: {
      products: Product[];
      total: number;
      shopType: string;
      shopName: string;
    }) => void;
    const promise = new Promise<{
      products: Product[];
      total: number;
      shopType: string;
      shopName: string;
    }>((resolve) => {
      resolvePromise = resolve;
    });

    mockAdminProductService.getFilteredProducts.mockReturnValue(promise);

    const { result } = renderHook(() =>
      useAdvancedProductFilters(mockProducts, "shop1")
    );

    // Déclencher l'appel async
    act(() => {
      result.current.applyAdvancedFilters({ degre_alcool_min: 6.0 }, "");
    });

    // Vérifier l'état de chargement
    expect(result.current.loading).toBe(true);

    // Résoudre la promesse
    await act(async () => {
      resolvePromise!({
        products: [],
        total: 0,
        shopType: "brewery",
        shopName: "Test Brewery",
      });
      await promise;
    });

    // Après le chargement
    expect(result.current.loading).toBe(false);
  });
});
