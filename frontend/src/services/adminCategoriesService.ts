import axios from "axios";
import type { Category } from "../../../shared/types";

const API_BASE = "/api/admin/categories";

export interface CategoryWithStats extends Category {
  productCount: number;
  stats?: {
    averagePrice: number;
    totalStock: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
  shop?: {
    id: string;
    name: string;
    shopType: string;
  };
}

export interface CreateCategoryData {
  name: string;
  image?: string;
  shopId: string;
}

export interface UpdateCategoryData {
  name?: string;
  image?: string;
}

/**
 * Récupérer toutes les catégories avec stats admin
 */
export const getCategories = async (
  shopId?: string,
  includeStats = false
): Promise<CategoryWithStats[]> => {
  try {
    const params = new URLSearchParams();
    if (shopId) params.append("shopId", shopId);
    if (includeStats) params.append("includeStats", "true");

    const { data } = await axios.get<CategoryWithStats[]>(
      `${API_BASE}?${params}`
    );
    return data;
  } catch (error) {
    console.error("Erreur récupération catégories:", error);
    throw error;
  }
};

/**
 * Récupérer une catégorie par ID avec détails
 */
export const getCategoryById = async (
  categoryId: string
): Promise<CategoryWithStats> => {
  try {
    const { data } = await axios.get<CategoryWithStats>(
      `${API_BASE}/${categoryId}`
    );
    return data;
  } catch (error) {
    console.error("Erreur récupération catégorie:", error);
    throw error;
  }
};

/**
 * Créer une nouvelle catégorie
 */
export const createCategory = async (
  categoryData: CreateCategoryData
): Promise<CategoryWithStats> => {
  try {
    const { data } = await axios.post<CategoryWithStats>(
      API_BASE,
      categoryData
    );
    return data;
  } catch (error) {
    console.error("Erreur création catégorie:", error);
    throw error;
  }
};

/**
 * Mettre à jour une catégorie
 */
export const updateCategory = async (
  categoryId: string,
  categoryData: UpdateCategoryData
): Promise<CategoryWithStats> => {
  try {
    const { data } = await axios.put<CategoryWithStats>(
      `${API_BASE}/${categoryId}`,
      categoryData
    );
    return data;
  } catch (error) {
    console.error("Erreur mise à jour catégorie:", error);
    throw error;
  }
};

/**
 * Supprimer une catégorie
 */
export const deleteCategory = async (
  categoryId: string,
  force = false
): Promise<void> => {
  try {
    const params = force ? "?force=true" : "";
    await axios.delete(`${API_BASE}/${categoryId}${params}`);
  } catch (error) {
    console.error("Erreur suppression catégorie:", error);
    throw error;
  }
};

/**
 * Récupérer les statistiques des catégories par boutique
 */
export const getCategoryStats = async (shopId: string) => {
  try {
    const { data } = await axios.get(`${API_BASE}/shop/${shopId}/stats`);
    return data;
  } catch (error) {
    console.error("Erreur récupération stats catégories:", error);
    throw error;
  }
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
};
