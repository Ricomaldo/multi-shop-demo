export interface BaseProductAttributes {
  stock: number;
}

export interface BreweryAttributes extends BaseProductAttributes {
  degre_alcool: number;
  amertume_ibu: number;
  type_houblon: string;
  process_brassage: string;
  garde_conseillee: string;
  format_bouteille: string;
  disponibilite: string;
}

export interface TeaShopAttributes extends BaseProductAttributes {
  origine_plantation: string;
  altitude_culture: string;
  grade_qualite: string;
  recolte_flush: string;
  temperature_infusion: string;
  temps_infusion: string;
  quantite_grammes: string;
  conservation: string;
}

export interface BeautyShopAttributes extends BaseProductAttributes {
  type_peau: string;
  ingredients_actifs: string;
  certification_bio: boolean;
  contenance_ml: number;
  utilisation_moment: string;
  zone_application: string;
  texture: string;
  age_recommande: string;
}

export interface HerbShopAttributes extends BaseProductAttributes {
  principes_actifs: string;
  usage_traditionnel: string;
  posologie: string;
  contre_indications: string;
  forme_galenique: string;
  certification: string;
  duree_cure: string;
  conservation_duree: string;
}

export type ProductAttributes =
  | BreweryAttributes
  | TeaShopAttributes
  | BeautyShopAttributes
  | HerbShopAttributes;
