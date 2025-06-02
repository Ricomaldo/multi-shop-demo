import axios from "axios";
import type { Product, Shop } from "../../../shared/types";

const API_BASE_URL = "http://localhost:3001/api";

export const loadShops = async (): Promise<Shop[]> => {
  try {
    const response = await axios.get<Shop[]>(`${API_BASE_URL}/shops`);
    return response.data;
  } catch {
    throw new Error("Impossible de charger les boutiques");
  }
};

export const loadProducts = async (shopIds: string[]): Promise<Product[]> => {
  try {
    // FIX: Charger produits par boutique et fusionner proprement
    const productPromises = shopIds.map((shopId) =>
      axios.get<Product[]>(`${API_BASE_URL}/shops/${shopId}/products`)
    );

    const responses = await Promise.all(productPromises);
    const allProducts = responses.flatMap(
      (response: { data: Product[] }) => response.data
    );

    // Déduplication par ID
    const uniqueProducts = allProducts.filter(
      (product: Product, index: number, array: Product[]) =>
        array.findIndex((p: Product) => p.id === product.id) === index
    );

    return uniqueProducts;
  } catch {
    throw new Error("Impossible de charger les produits");
  }
};
