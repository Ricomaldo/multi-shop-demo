import type { Product, Shop } from "../../../shared/types";

interface WindowWithEnv extends Window {
  VITE_API_URL?: string;
}

// Fonction utilitaire pour obtenir l'URL de l'API
function getApiUrl(): string {
  if (typeof window !== "undefined") {
    const win = window as WindowWithEnv;
    return win.VITE_API_URL || "http://localhost:3001/api";
  }
  return "http://localhost:3001/api";
}

const API_BASE_URL = getApiUrl();

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
  // Filtres métier spécialisés
  degre_alcool_min?: number;
  degre_alcool_max?: number;
  degre_alcool_ranges?: string[];
  amertume_ibu_min?: number;
  amertume_ibu_max?: number;
  amertume_ibu_ranges?: string[];
  type_houblon?: string;
  origine_plantation?: string;
  grade_qualite?: string;
  type_peau?: string;
  certification_bio?: boolean;
  usage_traditionnel?: string;
  forme_galenique?: string;
  origine_plante?: string;
  // Propriétés spécialisées manquantes
  type_the?: string;
  origine_bio?: boolean;
  propriete_therapeutique?: string;
  culture_bio?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  shopType: string;
  shopName: string;
}

export interface ProductStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  averagePrice: number;
  topCategories: Array<{ name: string; count: number }>;
  specializedStats: Record<string, unknown>;
  shopType: string;
  shopName: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  attributes?: Record<string, unknown>;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  attributes?: Record<string, unknown>;
}

class AdminProductService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Récupérer tous les produits d'une boutique avec filtres métier
   */
  async getProducts(
    merchantId: string,
    shopId: string,
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/merchant/${merchantId}/shop/${shopId}/products${
      queryString ? `?${queryString}` : ""
    }`;

    return this.request<ProductsResponse>(endpoint);
  }

  /**
   * Récupérer les produits filtrés (version simplifiée pour le hook)
   */
  async getFilteredProducts(
    shopId: string,
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/products${
      queryString ? `?shopId=${shopId}&${queryString}` : `?shopId=${shopId}`
    }`;

    return this.request<ProductsResponse>(endpoint);
  }

  /**
   * Récupérer un produit spécifique
   */
  async getProduct(
    merchantId: string,
    shopId: string,
    productId: string
  ): Promise<Product> {
    return this.request<Product>(
      `/merchant/${merchantId}/shop/${shopId}/products/${productId}`
    );
  }

  /**
   * Créer un nouveau produit avec attributs métier
   */
  async createProduct(
    merchantId: string,
    shopId: string,
    productData: CreateProductData
  ): Promise<Product> {
    return this.request<Product>(
      `/merchant/${merchantId}/shop/${shopId}/products`,
      {
        method: "POST",
        body: JSON.stringify(productData),
      }
    );
  }

  /**
   * Modifier un produit existant
   */
  async updateProduct(
    merchantId: string,
    shopId: string,
    productId: string,
    productData: UpdateProductData
  ): Promise<Product> {
    return this.request<Product>(
      `/merchant/${merchantId}/shop/${shopId}/products/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(productData),
      }
    );
  }

  /**
   * Supprimer un produit
   */
  async deleteProduct(
    merchantId: string,
    shopId: string,
    productId: string
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/merchant/${merchantId}/shop/${shopId}/products/${productId}`,
      {
        method: "DELETE",
      }
    );
  }

  /**
   * Récupérer les statistiques des produits pour le dashboard admin
   */
  async getProductStats(
    merchantId: string,
    shopId: string
  ): Promise<ProductStats> {
    return this.request<ProductStats>(
      `/merchant/${merchantId}/shop/${shopId}/products/stats`
    );
  }

  /**
   * Recherche avancée par attributs métier selon l'univers
   */
  async searchByBusinessAttributes(
    merchantId: string,
    shopId: string,
    shop: Shop,
    attributes: Record<string, unknown>
  ): Promise<ProductsResponse> {
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

    return this.getProducts(merchantId, shopId, filters);
  }

  /**
   * Obtenir les valeurs uniques d'un attribut métier pour les filtres
   */
  async getAttributeValues(
    merchantId: string,
    shopId: string,
    attributeName: string
  ): Promise<string[]> {
    const response = await this.getProducts(merchantId, shopId);
    const values = new Set<string>();

    response.products.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes || "{}");
          if (attrs[attributeName]) {
            values.add(String(attrs[attributeName]));
          }
        } catch {
          // Ignore les erreurs de parsing
        }
      }
    });

    return Array.from(values).sort();
  }

  /**
   * Valider les attributs métier selon l'univers
   */
  validateBusinessAttributes(
    shopType: string,
    attributes: Record<string, unknown>
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation du stock (obligatoire pour tous)
    if (!attributes.stock || Number(attributes.stock) < 0) {
      errors.push("Le stock est obligatoire et doit être positif");
    }

    // Validations spécifiques par univers
    switch (shopType) {
      case "brewery":
        if (!attributes.degre_alcool) {
          errors.push("Le degré d'alcool est obligatoire pour une brasserie");
        }
        if (!attributes.amertume_ibu) {
          errors.push("L'amertume IBU est obligatoire pour une brasserie");
        }
        if (
          attributes.degre_alcool &&
          (Number(attributes.degre_alcool) < 0 ||
            Number(attributes.degre_alcool) > 20)
        ) {
          errors.push("Le degré d'alcool doit être entre 0 et 20");
        }
        break;

      case "teaShop":
        if (!attributes.origine_plantation) {
          errors.push(
            "L'origine de plantation est obligatoire pour un salon de thé"
          );
        }
        if (!attributes.grade_qualite) {
          errors.push(
            "Le grade de qualité est obligatoire pour un salon de thé"
          );
        }
        break;

      case "beautyShop":
        if (!attributes.type_peau) {
          errors.push(
            "Le type de peau est obligatoire pour un institut beauté"
          );
        }
        if (!attributes.ingredients_actifs) {
          errors.push(
            "Les ingrédients actifs sont obligatoires pour un institut beauté"
          );
        }
        if (attributes.contenance_ml && Number(attributes.contenance_ml) <= 0) {
          errors.push("La contenance doit être positive");
        }
        break;

      case "herbShop":
        if (!attributes.principes_actifs) {
          errors.push(
            "Les principes actifs sont obligatoires pour une herboristerie"
          );
        }
        if (!attributes.usage_traditionnel) {
          errors.push(
            "L'usage traditionnel est obligatoire pour une herboristerie"
          );
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const adminProductService = new AdminProductService();
export default adminProductService;
