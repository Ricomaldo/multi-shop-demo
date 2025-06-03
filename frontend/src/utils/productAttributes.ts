import type {
  BeautyShopAttributes,
  BreweryAttributes,
  HerbShopAttributes,
  Product,
  ProductAttributes,
  Shop,
  TeaShopAttributes,
} from "../../../shared/types";

/**
 * Parse les attributs JSON d'un produit en objet typé
 */
export function parseProductAttributes(
  product: Product
): ProductAttributes | null {
  if (!product.attributes) return null;

  try {
    return JSON.parse(product.attributes || "{}") as ProductAttributes;
  } catch (error) {
    console.error("Erreur lors du parsing des attributs:", error);
    return null;
  }
}

/**
 * Vérifie si les attributs correspondent à un type spécifique
 */
export function isBreweryAttributes(
  attributes: ProductAttributes
): attributes is BreweryAttributes {
  return "degre_alcool" in attributes && "amertume_ibu" in attributes;
}

export function isTeaShopAttributes(
  attributes: ProductAttributes
): attributes is TeaShopAttributes {
  return "origine_plantation" in attributes && "grade_qualite" in attributes;
}

export function isBeautyShopAttributes(
  attributes: ProductAttributes
): attributes is BeautyShopAttributes {
  return "type_peau" in attributes && "ingredients_actifs" in attributes;
}

export function isHerbShopAttributes(
  attributes: ProductAttributes
): attributes is HerbShopAttributes {
  return "principes_actifs" in attributes && "usage_traditionnel" in attributes;
}

/**
 * Retourne tous les attributs formatés pour la page détail
 */
export function getAllFormattedAttributes(
  product: Product,
  shop: Shop
): Array<{ label: string; value: string; category: string }> {
  const attributes = parseProductAttributes(product);
  if (!attributes) return [];

  switch (shop.shopType) {
    case "brewery":
      if (isBreweryAttributes(attributes)) {
        return [
          {
            label: "Degré d'alcool",
            value: `${attributes.degre_alcool}°`,
            category: "Caractéristiques",
          },
          {
            label: "Amertume",
            value: `${attributes.amertume_ibu} IBU`,
            category: "Caractéristiques",
          },
          {
            label: "Type de houblon",
            value: attributes.type_houblon,
            category: "Ingrédients",
          },
          {
            label: "Processus de brassage",
            value: attributes.process_brassage,
            category: "Production",
          },
          {
            label: "Garde conseillée",
            value: attributes.garde_conseillee,
            category: "Conservation",
          },
          {
            label: "Format bouteille",
            value: attributes.format_bouteille,
            category: "Conditionnement",
          },
          {
            label: "Disponibilité",
            value: attributes.disponibilite,
            category: "Disponibilité",
          },
          {
            label: "Stock",
            value: `${attributes.stock} unités`,
            category: "Disponibilité",
          },
        ];
      }
      break;

    case "teaShop":
      if (isTeaShopAttributes(attributes)) {
        return [
          {
            label: "Origine plantation",
            value: attributes.origine_plantation,
            category: "Origine",
          },
          {
            label: "Altitude culture",
            value: attributes.altitude_culture,
            category: "Origine",
          },
          {
            label: "Grade qualité",
            value: attributes.grade_qualite,
            category: "Qualité",
          },
          {
            label: "Récolte flush",
            value: attributes.recolte_flush,
            category: "Qualité",
          },
          {
            label: "Température infusion",
            value: attributes.temperature_infusion,
            category: "Préparation",
          },
          {
            label: "Temps infusion",
            value: attributes.temps_infusion,
            category: "Préparation",
          },
          {
            label: "Quantité",
            value: attributes.quantite_grammes,
            category: "Préparation",
          },
          {
            label: "Conservation",
            value: attributes.conservation,
            category: "Conservation",
          },
          {
            label: "Stock",
            value: `${attributes.stock} unités`,
            category: "Disponibilité",
          },
        ];
      }
      break;

    case "beautyShop":
      if (isBeautyShopAttributes(attributes)) {
        return [
          {
            label: "Type de peau",
            value: attributes.type_peau,
            category: "Adaptation",
          },
          {
            label: "Ingrédients actifs",
            value: attributes.ingredients_actifs,
            category: "Composition",
          },
          {
            label: "Certification bio",
            value: attributes.certification_bio ? "Certifié bio" : "Non bio",
            category: "Certification",
          },
          {
            label: "Contenance",
            value: `${attributes.contenance_ml}ml`,
            category: "Conditionnement",
          },
          {
            label: "Moment d'utilisation",
            value: attributes.utilisation_moment,
            category: "Utilisation",
          },
          {
            label: "Zone d'application",
            value: attributes.zone_application,
            category: "Utilisation",
          },
          {
            label: "Texture",
            value: attributes.texture,
            category: "Caractéristiques",
          },
          {
            label: "Âge recommandé",
            value: attributes.age_recommande,
            category: "Recommandations",
          },
          {
            label: "Stock",
            value: `${attributes.stock} unités`,
            category: "Disponibilité",
          },
        ];
      }
      break;

    case "herbShop":
      if (isHerbShopAttributes(attributes)) {
        const result = [
          {
            label: "Principes actifs",
            value: attributes.principes_actifs,
            category: "Composition",
          },
          {
            label: "Usage traditionnel",
            value: attributes.usage_traditionnel,
            category: "Utilisation",
          },
          {
            label: "Posologie",
            value: attributes.posologie,
            category: "Utilisation",
          },
          {
            label: "Forme galénique",
            value: attributes.forme_galenique,
            category: "Conditionnement",
          },
          {
            label: "Certification",
            value: attributes.certification,
            category: "Certification",
          },
          {
            label: "Durée de cure",
            value: attributes.duree_cure,
            category: "Utilisation",
          },
          {
            label: "Stock",
            value: `${attributes.stock} unités`,
            category: "Disponibilité",
          },
        ];

        if (attributes.contre_indications) {
          result.push({
            label: "Contre-indications",
            value: attributes.contre_indications,
            category: "Précautions",
          });
        }

        if (attributes.conservation_duree) {
          result.push({
            label: "Durée de conservation",
            value: attributes.conservation_duree,
            category: "Conservation",
          });
        }

        return result;
      }
      break;
  }

  return [];
}

/**
 * Vérifie si un produit a un stock faible (< 10 unités)
 */
export function hasLowStock(product: Product): boolean {
  const attributes = parseProductAttributes(product);
  if (!attributes || !("stock" in attributes)) return false;
  return attributes.stock < 10;
}

/**
 * Vérifie si un produit est en rupture de stock
 */
export function isOutOfStock(product: Product): boolean {
  const attributes = parseProductAttributes(product);
  if (!attributes || !("stock" in attributes)) return false;
  return attributes.stock === 0;
}

/**
 * Retourne la couleur du badge de stock selon le niveau
 */
export function getStockBadgeColor(
  product: Product
): "red" | "orange" | "green" {
  if (isOutOfStock(product)) return "red";
  if (hasLowStock(product)) return "orange";
  return "green";
}

/**
 * Retourne le texte du badge de stock
 */
export function getStockBadgeText(product: Product): string {
  const attributes = parseProductAttributes(product);
  if (!attributes || !("stock" in attributes)) return "Stock inconnu";

  if (attributes.stock === 0) return "Rupture";
  if (attributes.stock < 10) return `Stock faible (${attributes.stock})`;
  return `En stock (${attributes.stock})`;
}
