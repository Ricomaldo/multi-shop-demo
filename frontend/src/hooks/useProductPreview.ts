import { useEffect, useRef, useState } from "react";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
}

interface UseProductPreviewReturn {
  /** Données formatées pour l'aperçu */
  previewData: {
    name: string;
    description: string;
    price: string | number;
    category?: string;
  };
  /** Indique si les données ont changé récemment */
  hasChanges: boolean;
  /** Met à jour les données d'aperçu */
  updatePreview: (formData: ProductFormData, category?: string) => void;
  /** Réinitialise l'état des changements */
  resetChanges: () => void;
}

/**
 * Hook pour gérer l'aperçu temps réel d'un produit en cours d'édition
 * Détecte automatiquement les changements et gère les animations
 */
export function useProductPreview(
  initialData?: ProductFormData,
  initialCategory?: string
): UseProductPreviewReturn {
  const [previewData, setPreviewData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "0.00",
    category: initialCategory,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const previousDataRef = useRef(previewData);
  const changeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePreview = (formData: ProductFormData, category?: string) => {
    const newData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category,
    };

    // Vérifier si les données ont réellement changé
    const hasActualChanges =
      newData.name !== previousDataRef.current.name ||
      newData.description !== previousDataRef.current.description ||
      newData.price !== previousDataRef.current.price ||
      newData.category !== previousDataRef.current.category;

    if (hasActualChanges) {
      setPreviewData(newData);
      setHasChanges(true);
      previousDataRef.current = newData;

      // Réinitialiser l'état des changements après un délai
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
      changeTimeoutRef.current = setTimeout(() => {
        setHasChanges(false);
      }, 1500);
    }
  };

  const resetChanges = () => {
    setHasChanges(false);
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current);
    }
  };

  // Nettoyage du timeout à la destruction du composant
  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, []);

  return {
    previewData,
    hasChanges,
    updatePreview,
    resetChanges,
  };
}
