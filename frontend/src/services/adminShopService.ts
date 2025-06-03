import axios from "axios";
import type { Shop } from "../../../shared/types";

const API_BASE = "/api/admin/shops";

export const updateShop = async (
  shopId: string,
  shopData: Partial<Shop>
): Promise<Shop> => {
  try {
    const { data } = await axios.put<Shop>(`${API_BASE}/${shopId}`, shopData);
    return data;
  } catch (error) {
    console.error("Erreur mise à jour boutique:", error);
    throw error;
  }
};

