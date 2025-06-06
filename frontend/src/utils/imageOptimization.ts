/**
 * 🖼️ OPTIMISATION DES IMAGES POUR PERFORMANCE
 *
 * Utilitaires simples pour améliorer le chargement des images
 */

import React from "react";

/**
 * Obtenir l'URL optimisée d'une image
 */
export const getOptimizedImageUrl = (imagePath: string): string => {
  // Pour la production, vous pourriez utiliser un service comme Cloudinary
  // Pour maintenant, on garde l'image originale
  return imagePath;
};

/**
 * Ajouter des attributs d'optimisation à une image
 */
export const getImageProps = (src: string, priority = false) => ({
  src: getOptimizedImageUrl(src),
  loading: priority ? ("eager" as const) : ("lazy" as const),
  decoding: "async" as const,
});

/**
 * Props pour les images optimisées
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  borderRadius?: string | number;
}

/**
 * Obtenir les props optimisées pour une image
 */
export const getOptimizedImageProps = ({
  src,
  alt,
  width,
  height,
  priority = false,
}: OptimizedImageProps) => {
  const optimizedSrc = getOptimizedImageUrl(src);

  return {
    src: optimizedSrc,
    alt,
    width: width || "100%",
    height: height || "auto",
    loading: priority ? ("eager" as const) : ("lazy" as const),
    style: {
      width: width || "100%",
      height: height || "auto",
      objectFit: "cover" as const,
      display: "block" as const,
    },
  };
};

/**
 * Hook pour précharger des images critiques
 */
export const useImagePreload = (imageSources: string[]) => {
  React.useEffect(() => {
    const links: HTMLLinkElement[] = [];

    imageSources.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getOptimizedImageUrl(src);
      document.head.appendChild(link);
      links.push(link);
    });

    // Nettoyer au démontage
    return () => {
      links.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [imageSources]);
};

/**
 * Générer des images placeholder pour éviter les layout shifts
 */
export const generatePlaceholder = (
  width: number,
  height: number,
  color = "#f0f0f0"
) => {
  if (typeof window === "undefined") return "";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL();
};
