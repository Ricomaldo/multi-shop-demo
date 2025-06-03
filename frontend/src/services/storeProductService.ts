import type { Product, Shop } from "../../../shared/types";
import type { ProductFilters } from "./adminProductService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface StoreProductsResponse {
  products: Product[];
  total: number;
  shopType: string;
}

class StoreProductService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erreur réseau" }));
      throw new Error(error.error || `Erreur HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Récupérer tous les produits d'une boutique avec filtres
   */
  async getProducts(
    shopId: string,
    filters: ProductFilters = {}
  ): Promise<StoreProductsResponse> {
    const searchParams = new URLSearchParams();

    // Ajouter l'ID de la boutique
    searchParams.append("shopId", shopId);

    // Ajouter les filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/products?${queryString}`;

    return this.request<StoreProductsResponse>(endpoint);
  }

  /**
   * Récupérer un produit spécifique
   */
  async getProduct(productId: string): Promise<Product> {
    return this.request<Product>(`/products/${productId}`);
  }

  /**
   * Recherche par attributs métier selon l'univers de la boutique
   */
  async searchByBusinessAttributes(
    shop: Shop,
    attributes: Record<string, unknown>
  ): Promise<StoreProductsResponse> {
    const filters: ProductFilters = {};

    // Conversion des attributs métier en filtres selon l'univers
    switch (shop.shopType) {
      case "brewery":
        if (attributes.degre_alcool_min)
          filters.degre_alcool_min = Number(attributes.degre_alcool_min);
        if (attributes.degre_alcool_max)
          filters.degre_alcool_max = Number(attributes.degre_alcool_max);
        if (attributes.amertume_ibu_min)
          filters.amertume_ibu_min = Number(attributes.amertume_ibu_min);
        if (attributes.amertume_ibu_max)
          filters.amertume_ibu_max = Number(attributes.amertume_ibu_max);
        if (attributes.type_houblon)
          filters.type_houblon = String(attributes.type_houblon);
        break;

      case "teaShop":
        if (attributes.origine_plantation)
          filters.origine_plantation = String(attributes.origine_plantation);
        if (attributes.grade_qualite)
          filters.grade_qualite = String(attributes.grade_qualite);
        break;

      case "beautyShop":
        if (attributes.type_peau)
          filters.type_peau = String(attributes.type_peau);
        if (attributes.certification_bio !== undefined)
          filters.certification_bio = Boolean(attributes.certification_bio);
        break;

      case "herbShop":
        if (attributes.usage_traditionnel)
          filters.usage_traditionnel = String(attributes.usage_traditionnel);
        if (attributes.forme_galenique)
          filters.forme_galenique = String(attributes.forme_galenique);
        break;
    }

    return this.getProducts(shop.id, filters);
  }

  /**
   * Obtenir les suggestions de recherche basées sur les attributs
   */
  async getSearchSuggestions(shopId: string, query: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const response = await this.getProducts(shopId, { search: query });
      const suggestions = new Set<string>();

      response.products.forEach((product) => {
        // Ajouter le nom du produit s'il correspond
        if (product.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.name);
        }

        // Ajouter la catégorie si elle correspond
        if (
          product.category?.name &&
          product.category.name.toLowerCase().includes(query.toLowerCase())
        ) {
          suggestions.add(product.category.name);
        }

        // Ajouter des attributs métier pertinents
        if (product.attributes) {
          try {
            const attrs = JSON.parse(product.attributes || "{}");
            Object.entries(attrs).forEach(([, value]) => {
              if (
                typeof value === "string" &&
                value.toLowerCase().includes(query.toLowerCase())
              ) {
                suggestions.add(value);
              }
            });
          } catch {
            // Ignore les erreurs de parsing
          }
        }
      });

      return Array.from(suggestions).slice(0, 5);
    } catch {
      return [];
    }
  }

  /**
   * Obtenir les filtres populaires pour une boutique
   */
  async getPopularFilters(shopId: string): Promise<Record<string, string[]>> {
    try {
      const response = await this.getProducts(shopId);
      const popularFilters: Record<string, Set<string>> = {};

      response.products.forEach((product) => {
        if (product.attributes) {
          try {
            const attrs = JSON.parse(product.attributes || "{}");

            // Extraire les valeurs populaires selon le type de boutique
            Object.entries(attrs).forEach(([attributeKey, value]) => {
              if (typeof value === "string" && value.trim()) {
                if (!popularFilters[attributeKey]) {
                  popularFilters[attributeKey] = new Set();
                }
                popularFilters[attributeKey].add(value);
              }
            });
          } catch {
            // Ignore les erreurs de parsing
          }
        }
      });

      // Convertir en tableau et limiter à 5 valeurs par attribut
      const result: Record<string, string[]> = {};
      Object.entries(popularFilters).forEach(([key, valueSet]) => {
        result[key] = Array.from(valueSet).slice(0, 5);
      });

      return result;
    } catch {
      return {};
    }
  }
}

export const storeProductService = new StoreProductService();
export default storeProductService;
