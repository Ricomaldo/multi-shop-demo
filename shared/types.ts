// shared/types.ts
export type ShopType = "brewery" | "teaShop" | "beautyShop" | "herbShop";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Shop {
  id: string;
  name: string;
  shopType: ShopType;
  themeColor: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: OpeningHours | string;
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  shopId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  shopId: string;
  categoryId: string;
  category?: Category;
  stockStatus?: StockStatus;
  featured?: boolean;
  attributes?: string;
}

export interface BreweryAttributes {
  degre_alcool: number;
  amertume_ibu: number;
  type_houblon: string;
  process_brassage: string;
  garde_conseillee: string;
  format_bouteille: string;
  disponibilite: string;
  stock: number;
}

export interface TeaShopAttributes {
  origine_plantation: string;
  altitude_culture: string;
  grade_qualite: string;
  recolte_flush: string;
  temperature_infusion: string;
  temps_infusion: string;
  quantite_grammes: string;
  conservation: string;
  stock: number;
}

export interface BeautyShopAttributes {
  type_peau: string;
  ingredients_actifs: string;
  certification_bio: boolean;
  contenance_ml: number;
  utilisation_moment: string;
  zone_application: string;
  texture: string;
  age_recommande: string;
  stock: number;
}

export interface HerbShopAttributes {
  principes_actifs: string;
  usage_traditionnel: string;
  posologie: string;
  contre_indications?: string;
  forme_galenique: string;
  certification: string;
  duree_cure: string;
  conservation_duree?: string;
  stock: number;
}

export type ProductAttributes =
  | BreweryAttributes
  | TeaShopAttributes
  | BeautyShopAttributes
  | HerbShopAttributes;

export interface ProductWithTypedAttributes
  extends Omit<Product, "attributes"> {
  attributes: ProductAttributes;
}

export interface BreweryFilters {
  degre_alcool_min?: number;
  degre_alcool_max?: number;
  amertume_ibu_min?: number;
  amertume_ibu_max?: number;
  type_houblon?: string[];
  format_bouteille?: string[];
}

export interface TeaShopFilters {
  origine_plantation?: string[];
  grade_qualite?: string[];
  recolte_flush?: string[];
  temperature_infusion_max?: number;
}

export interface BeautyShopFilters {
  type_peau?: string[];
  certification_bio?: boolean;
  contenance_ml_min?: number;
  contenance_ml_max?: number;
  zone_application?: string[];
}

export interface HerbShopFilters {
  usage_traditionnel?: string[];
  forme_galenique?: string[];
  certification?: string[];
  duree_cure?: string[];
}

export interface ShopStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  averagePrice: number;
  topCategories: Array<{ name: string; count: number }>;
  specializedMetrics:
    | BreweryStats
    | TeaShopStats
    | BeautyShopStats
    | HerbShopStats;
}

export interface BreweryStats {
  averageAlcohol: number;
  mostPopularHopType: string;
  bottleFormatsDistribution: Record<string, number>;
}

export interface TeaShopStats {
  originsDistribution: Record<string, number>;
  qualityGradesDistribution: Record<string, number>;
  averageInfusionTemp: number;
}

export interface BeautyShopStats {
  skinTypesDistribution: Record<string, number>;
  bioProductsPercentage: number;
  averageVolume: number;
}

export interface HerbShopStats {
  usageDistribution: Record<string, number>;
  certificationDistribution: Record<string, number>;
  averageCureDuration: string;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  shops: Shop[];
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface ShopCarouselItem {
  shop: Shop;
  stockLevel: "high" | "medium" | "low" | "out";
  totalProducts: number;
  lowStockCount: number;
  revenue?: number;
}
