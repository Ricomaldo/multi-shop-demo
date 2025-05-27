import { act, renderHook } from "@testing-library/react";
import { useProductPreview } from "../useProductPreview";

// Mock des timers
jest.useFakeTimers();

describe("useProductPreview", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test("initialise avec des données par défaut", () => {
    const { result } = renderHook(() => useProductPreview());

    expect(result.current.previewData).toEqual({
      name: "",
      description: "",
      price: "0.00",
      category: undefined,
    });
    expect(result.current.hasChanges).toBe(false);
  });

  test("initialise avec des données fournies", () => {
    const initialData = {
      name: "Blonde de Garde",
      description: "Bière blonde",
      price: "4.50",
    };
    const initialCategory = "Blondes";

    const { result } = renderHook(() =>
      useProductPreview(initialData, initialCategory)
    );

    expect(result.current.previewData).toEqual({
      name: "Blonde de Garde",
      description: "Bière blonde",
      price: "4.50",
      category: "Blondes",
    });
  });

  test("met à jour les données d'aperçu", () => {
    const { result } = renderHook(() => useProductPreview());

    const newFormData = {
      name: "IPA Américaine",
      description: "IPA houblonnée",
      price: "5.50",
    };

    act(() => {
      result.current.updatePreview(newFormData, "IPA");
    });

    expect(result.current.previewData).toEqual({
      name: "IPA Américaine",
      description: "IPA houblonnée",
      price: "5.50",
      category: "IPA",
    });
    expect(result.current.hasChanges).toBe(true);
  });

  test("détecte les changements correctement", () => {
    const initialData = {
      name: "Blonde de Garde",
      description: "Bière blonde",
      price: "4.50",
    };

    const { result } = renderHook(() => useProductPreview(initialData));

    // Pas de changement si les données sont identiques
    act(() => {
      result.current.updatePreview(initialData);
    });
    expect(result.current.hasChanges).toBe(false);

    // Changement détecté si les données diffèrent
    act(() => {
      result.current.updatePreview({
        ...initialData,
        name: "Nouveau nom",
      });
    });
    expect(result.current.hasChanges).toBe(true);
  });

  test("réinitialise hasChanges après un délai", () => {
    const { result } = renderHook(() => useProductPreview());

    act(() => {
      result.current.updatePreview({
        name: "Test",
        description: "Description",
        price: "1.00",
      });
    });

    expect(result.current.hasChanges).toBe(true);

    // Avancer le temps de 1500ms
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.hasChanges).toBe(false);
  });

  test("resetChanges fonctionne immédiatement", () => {
    const { result } = renderHook(() => useProductPreview());

    act(() => {
      result.current.updatePreview({
        name: "Test",
        description: "Description",
        price: "1.00",
      });
    });

    expect(result.current.hasChanges).toBe(true);

    act(() => {
      result.current.resetChanges();
    });

    expect(result.current.hasChanges).toBe(false);
  });

  test("annule le timeout précédent lors de nouveaux changements", () => {
    const { result } = renderHook(() => useProductPreview());

    // Premier changement
    act(() => {
      result.current.updatePreview({
        name: "Test 1",
        description: "Description",
        price: "1.00",
      });
    });

    expect(result.current.hasChanges).toBe(true);

    // Avancer de 1000ms (pas encore 1500ms)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.hasChanges).toBe(true);

    // Deuxième changement (doit réinitialiser le timer)
    act(() => {
      result.current.updatePreview({
        name: "Test 2",
        description: "Description",
        price: "1.00",
      });
    });

    // Avancer de 1000ms supplémentaires (total 2000ms depuis le premier changement)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Doit encore être true car le timer a été réinitialisé
    expect(result.current.hasChanges).toBe(true);

    // Avancer de 500ms supplémentaires pour atteindre 1500ms depuis le deuxième changement
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.hasChanges).toBe(false);
  });

  test("détecte les changements de catégorie", () => {
    const { result } = renderHook(() => useProductPreview());

    const formData = {
      name: "Test",
      description: "Description",
      price: "1.00",
    };

    // Premier appel avec catégorie
    act(() => {
      result.current.updatePreview(formData, "Catégorie 1");
    });

    expect(result.current.hasChanges).toBe(true);
    expect(result.current.previewData.category).toBe("Catégorie 1");

    // Réinitialiser
    act(() => {
      result.current.resetChanges();
    });

    // Changement de catégorie seulement
    act(() => {
      result.current.updatePreview(formData, "Catégorie 2");
    });

    expect(result.current.hasChanges).toBe(true);
    expect(result.current.previewData.category).toBe("Catégorie 2");
  });

  test("ne déclenche pas de changement pour des données identiques", () => {
    const { result } = renderHook(() => useProductPreview());

    const formData = {
      name: "Test",
      description: "Description",
      price: "1.00",
    };

    // Premier appel
    act(() => {
      result.current.updatePreview(formData, "Catégorie");
    });

    expect(result.current.hasChanges).toBe(true);

    // Réinitialiser
    act(() => {
      result.current.resetChanges();
    });

    // Même données
    act(() => {
      result.current.updatePreview(formData, "Catégorie");
    });

    expect(result.current.hasChanges).toBe(false);
  });
});
