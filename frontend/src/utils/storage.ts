/**
 * 🗄️ Utilitaires de storage pour DemoForge
 * Gestion robuste de localStorage/sessionStorage avec fallbacks
 */

type StorageType = "localStorage" | "sessionStorage";

// Vérification de la disponibilité du storage
const isStorageAvailable = (type: StorageType): boolean => {
  try {
    const storage = window[type];
    const test = "__storage_test__";
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Cache en mémoire pour les cas où le storage n'est pas disponible
const memoryFallback = new Map<string, string>();

/**
 * Gestionnaire de storage unifié
 */
class StorageManager {
  private storage: Storage | null;
  private type: StorageType;

  constructor(type: StorageType = "localStorage") {
    this.type = type;
    this.storage = isStorageAvailable(type) ? window[type] : null;
  }

  /**
   * Sauvegarde une valeur (objet JSON ou string)
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);

      if (this.storage) {
        this.storage.setItem(key, serialized);
      } else {
        // Fallback en mémoire
        memoryFallback.set(key, serialized);
      }
    } catch (error) {
      console.warn(`📦 Storage.set failed for key "${key}":`, error);
    }
  }

  /**
   * Récupère une valeur avec type safety
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const stored = this.storage
        ? this.storage.getItem(key)
        : memoryFallback.get(key);

      if (stored === null || stored === undefined) {
        return defaultValue ?? null;
      }

      return JSON.parse(stored) as T;
    } catch (error) {
      console.warn(`📦 Storage.get failed for key "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Supprime une clé
   */
  remove(key: string): void {
    try {
      if (this.storage) {
        this.storage.removeItem(key);
      } else {
        memoryFallback.delete(key);
      }
    } catch (error) {
      console.warn(`📦 Storage.remove failed for key "${key}":`, error);
    }
  }

  /**
   * Nettoie tout le storage (dangereux)
   */
  clear(): void {
    try {
      if (this.storage) {
        this.storage.clear();
      } else {
        memoryFallback.clear();
      }
    } catch (error) {
      console.warn(`📦 Storage.clear failed:`, error);
    }
  }

  /**
   * Vérifie si une clé existe
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// 🚀 Instances pré-configurées
export const localStorage = new StorageManager("localStorage");
export const sessionStorage = new StorageManager("sessionStorage");

// 🎯 Storage spécialisé pour DemoForge
export const demoforgeStorage = {
  // Admin preferences (persistent)
  admin: {
    getShopType: () =>
      localStorage.get<string>("demoforge_admin_shoptype", "brewery"),
    setShopType: (type: string) =>
      localStorage.set("demoforge_admin_shoptype", type),

    getSelectedShop: (shopType: string) =>
      localStorage.get<string>(`demoforge_admin_shop_${shopType}`),
    setSelectedShop: (shopType: string, shopId: string) =>
      localStorage.set(`demoforge_admin_shop_${shopType}`, shopId),

    clearShop: (shopType: string) =>
      localStorage.remove(`demoforge_admin_shop_${shopType}`),
  },

  // User preferences (session)
  user: {
    getLastVisitedStore: () =>
      sessionStorage.get<string>("demoforge_last_store"),
    setLastVisitedStore: (shopType: string) =>
      sessionStorage.set("demoforge_last_store", shopType),

    getCartItems: () =>
      sessionStorage.get<Record<string, unknown>[]>("demoforge_cart", []),
    setCartItems: (items: Record<string, unknown>[]) =>
      sessionStorage.set("demoforge_cart", items),

    clearCart: () => sessionStorage.remove("demoforge_cart"),
  },

  // Cache React Query (persistent mais avec TTL)
  cache: {
    set: (
      key: string,
      data: Record<string, unknown>,
      ttl: number = 24 * 60 * 60 * 1000
    ) => {
      const expires = Date.now() + ttl;
      localStorage.set(`demoforge_cache_${key}`, { data, expires });
    },

    get: (key: string) => {
      const cached = localStorage.get<{
        data: Record<string, unknown>;
        expires: number;
      }>(`demoforge_cache_${key}`);
      if (!cached) return null;

      if (Date.now() > cached.expires) {
        localStorage.remove(`demoforge_cache_${key}`);
        return null;
      }

      return cached.data;
    },

    clear: () => {
      // Nettoyer tous les caches expirés
      const keys = Object.keys(window.localStorage || {});
      keys.forEach((key) => {
        if (key.startsWith("demoforge_cache_")) {
          const cached = localStorage.get<{ expires: number }>(key);
          if (cached && Date.now() > cached.expires) {
            localStorage.remove(key);
          }
        }
      });
    },
  },
};
