/**
 * Utilitaires pour la gestion des images
 */

const BACKEND_URL = "http://localhost:3001";

/**
 * Retourne l'URL d'une image produit avec fallback
 * @param imageUrl URL de l'image (peut être null/undefined)
 * @returns URL complète de l'image ou placeholder
 */
export function getProductImageUrl(imageUrl?: string | null): string {
  if (imageUrl) {
    // Si l'URL commence déjà par http, on la retourne telle quelle
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }
    // Sinon, on ajoute l'URL du backend
    return `${BACKEND_URL}${imageUrl}`;
  }

  // Fallback vers le placeholder dans le backend
  return `${BACKEND_URL}/uploads/product-placeholder.jpg`;
}

/**
 * Retourne l'URL d'une image de boutique/hero
 * @param imagePath Chemin de l'image
 * @returns URL complète
 */
export function getShopImageUrl(imagePath: string): string {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Les images de boutique restent dans le frontend public
  return imagePath;
}
