import type { Product, Shop } from "../../../../shared/types";
import {
  getAllFormattedAttributes,
  getKeyAttributesForCard,
  getStockBadgeColor,
  getStockBadgeText,
  hasLowStock,
  isBeautyShopAttributes,
  isBreweryAttributes,
  isHerbShopAttributes,
  isOutOfStock,
  isTeaShopAttributes,
  parseProductAttributes,
} from "../productAttributes";

// Mocks de produits pour les tests
const mockBreweryProduct: Product = {
  id: "brewery-1",
  name: "IPA Houblonnée",
  description: "Une IPA aux arômes intenses",
  price: 4.5,
  attributes: JSON.stringify({
    degre_alcool: 6.5,
    amertume_ibu: 45,
    type_houblon: "Cascade, Centennial",
    process_brassage: "Fermentation haute",
    garde_conseillee: "2 ans",
    format_bouteille: "33cl",
    disponibilite: "En stock",
    stock: 25,
  }),
  categoryId: "cat-1",
  shopId: "shop-1",
};

const mockTeaShopProduct: Product = {
  id: "tea-1",
  name: "Earl Grey Premium",
  description: "Thé noir bergamote",
  price: 12.9,
  attributes: JSON.stringify({
    origine_plantation: "Darjeeling",
    altitude_culture: "1500m",
    grade_qualite: "FTGFOP",
    recolte_flush: "Second Flush",
    temperature_infusion: "95°C",
    temps_infusion: "4 minutes",
    quantite_grammes: "2g",
    conservation: "Lieu sec",
    stock: 8,
  }),
  categoryId: "cat-2",
  shopId: "shop-2",
};

const mockBeautyShopProduct: Product = {
  id: "beauty-1",
  name: "Crème Anti-Âge",
  description: "Soin visage premium",
  price: 45.0,
  attributes: JSON.stringify({
    type_peau: "Peau mature",
    ingredients_actifs: "Acide hyaluronique, Rétinol",
    certification_bio: true,
    contenance_ml: 50,
    utilisation_moment: "Soir",
    zone_application: "Visage",
    texture: "Crème",
    age_recommande: "35+",
    stock: 0,
  }),
  categoryId: "cat-3",
  shopId: "shop-3",
};

const mockHerbShopProduct: Product = {
  id: "herb-1",
  name: "Tisane Digestive",
  description: "Mélange de plantes digestives",
  price: 8.5,
  attributes: JSON.stringify({
    principes_actifs: "Menthe, Fenouil, Anis",
    usage_traditionnel: "Digestion",
    posologie: "1 tasse après les repas",
    contre_indications: "Grossesse",
    forme_galenique: "Tisane",
    certification: "Agriculture Biologique",
    duree_cure: "3 semaines",
    conservation_duree: "2 ans",
    stock: 15,
  }),
  categoryId: "cat-4",
  shopId: "shop-4",
};

const mockShops: Record<string, Shop> = {
  "shop-1": {
    id: "shop-1",
    name: "Houblon & Tradition",
    shopType: "brewery",
    categories: [],
  },
  "shop-2": {
    id: "shop-2",
    name: "Les Jardins de Darjeeling",
    shopType: "teaShop",
    categories: [],
  },
  "shop-3": {
    id: "shop-3",
    name: "L'Écrin de Jade",
    shopType: "beatyShop",
    categories: [],
  },
  "shop-4": {
    id: "shop-4",
    name: "Herboristerie du Moulin Vert",
    shopType: "herbShop",
    categories: [],
  },
};

describe("productAttributes utils", () => {
  describe("parseProductAttributes", () => {
    it("devrait parser correctement les attributs JSON valides", () => {
      const result = parseProductAttributes(mockBreweryProduct);
      expect(result).toEqual({
        degre_alcool: 6.5,
        amertume_ibu: 45,
        type_houblon: "Cascade, Centennial",
        process_brassage: "Fermentation haute",
        garde_conseillee: "2 ans",
        format_bouteille: "33cl",
        disponibilite: "En stock",
        stock: 25,
      });
    });

    it("devrait retourner null pour un produit sans attributs", () => {
      const productWithoutAttributes: Product = {
        ...mockBreweryProduct,
        attributes: undefined,
      };
      const result = parseProductAttributes(productWithoutAttributes);
      expect(result).toBeNull();
    });

    it("devrait retourner null pour des attributs JSON invalides", () => {
      const productWithInvalidJSON: Product = {
        ...mockBreweryProduct,
        attributes: "invalid json",
      };
      const result = parseProductAttributes(productWithInvalidJSON);
      expect(result).toBeNull();
    });
  });

  describe("Type guards", () => {
    it("isBreweryAttributes devrait identifier correctement les attributs brasserie", () => {
      const attributes = parseProductAttributes(mockBreweryProduct)!;
      expect(isBreweryAttributes(attributes)).toBe(true);
      expect(isTeaShopAttributes(attributes)).toBe(false);
      expect(isBeautyShopAttributes(attributes)).toBe(false);
      expect(isHerbShopAttributes(attributes)).toBe(false);
    });

    it("isTeaShopAttributes devrait identifier correctement les attributs salon de thé", () => {
      const attributes = parseProductAttributes(mockTeaShopProduct)!;
      expect(isTeaShopAttributes(attributes)).toBe(true);
      expect(isBreweryAttributes(attributes)).toBe(false);
      expect(isBeautyShopAttributes(attributes)).toBe(false);
      expect(isHerbShopAttributes(attributes)).toBe(false);
    });

    it("isBeautyShopAttributes devrait identifier correctement les attributs institut beauté", () => {
      const attributes = parseProductAttributes(mockBeautyShopProduct)!;
      expect(isBeautyShopAttributes(attributes)).toBe(true);
      expect(isBreweryAttributes(attributes)).toBe(false);
      expect(isTeaShopAttributes(attributes)).toBe(false);
      expect(isHerbShopAttributes(attributes)).toBe(false);
    });

    it("isHerbShopAttributes devrait identifier correctement les attributs herboristerie", () => {
      const attributes = parseProductAttributes(mockHerbShopProduct)!;
      expect(isHerbShopAttributes(attributes)).toBe(true);
      expect(isBreweryAttributes(attributes)).toBe(false);
      expect(isTeaShopAttributes(attributes)).toBe(false);
      expect(isBeautyShopAttributes(attributes)).toBe(false);
    });
  });

  describe("getKeyAttributesForCard", () => {
    it("devrait retourner les attributs clés pour une brasserie", () => {
      const result = getKeyAttributesForCard(
        mockBreweryProduct,
        mockShops["shop-1"]
      );
      expect(result).toEqual([
        { label: "Degré", value: "6.5°" },
        { label: "Amertume", value: "45 IBU" },
        { label: "Format", value: "33cl" },
        { label: "Stock", value: "25 unités" },
      ]);
    });

    it("devrait retourner les attributs clés pour un salon de thé", () => {
      const result = getKeyAttributesForCard(
        mockTeaShopProduct,
        mockShops["shop-2"]
      );
      expect(result).toEqual([
        { label: "Origine", value: "Darjeeling" },
        { label: "Grade", value: "FTGFOP" },
        { label: "Température", value: "95°C" },
        { label: "Stock", value: "8 unités" },
      ]);
    });

    it("devrait retourner les attributs clés pour un institut beauté", () => {
      const result = getKeyAttributesForCard(
        mockBeautyShopProduct,
        mockShops["shop-3"]
      );
      expect(result).toEqual([
        { label: "Type de peau", value: "Peau mature" },
        { label: "Volume", value: "50ml" },
        { label: "Bio", value: "Oui" },
        { label: "Stock", value: "0 unités" },
      ]);
    });

    it("devrait retourner les attributs clés pour une herboristerie", () => {
      const result = getKeyAttributesForCard(
        mockHerbShopProduct,
        mockShops["shop-4"]
      );
      expect(result).toEqual([
        { label: "Usage", value: "Digestion" },
        { label: "Forme", value: "Tisane" },
        { label: "Durée cure", value: "3 semaines" },
        { label: "Stock", value: "15 unités" },
      ]);
    });

    it("devrait retourner un tableau vide pour un produit sans attributs", () => {
      const productWithoutAttributes: Product = {
        ...mockBreweryProduct,
        attributes: undefined,
      };
      const result = getKeyAttributesForCard(
        productWithoutAttributes,
        mockShops["shop-1"]
      );
      expect(result).toEqual([]);
    });
  });

  describe("getAllFormattedAttributes", () => {
    it("devrait retourner tous les attributs formatés pour une brasserie", () => {
      const result = getAllFormattedAttributes(
        mockBreweryProduct,
        mockShops["shop-1"]
      );
      expect(result).toHaveLength(8);
      expect(result[0]).toEqual({
        label: "Degré d'alcool",
        value: "6.5°",
        category: "Caractéristiques",
      });
      expect(result[7]).toEqual({
        label: "Stock",
        value: "25 unités",
        category: "Disponibilité",
      });
    });

    it("devrait inclure les contre-indications pour une herboristerie si présentes", () => {
      const result = getAllFormattedAttributes(
        mockHerbShopProduct,
        mockShops["shop-4"]
      );
      const contrIndications = result.find(
        (attr) => attr.label === "Contre-indications"
      );
      expect(contrIndications).toEqual({
        label: "Contre-indications",
        value: "Grossesse",
        category: "Précautions",
      });
    });

    it("devrait retourner un tableau vide pour un produit sans attributs", () => {
      const productWithoutAttributes: Product = {
        ...mockBreweryProduct,
        attributes: undefined,
      };
      const result = getAllFormattedAttributes(
        productWithoutAttributes,
        mockShops["shop-1"]
      );
      expect(result).toEqual([]);
    });
  });

  describe("Stock management", () => {
    it("hasLowStock devrait détecter un stock faible", () => {
      expect(hasLowStock(mockTeaShopProduct)).toBe(true); // stock: 8
      expect(hasLowStock(mockBreweryProduct)).toBe(false); // stock: 25
    });

    it("isOutOfStock devrait détecter une rupture de stock", () => {
      expect(isOutOfStock(mockBeautyShopProduct)).toBe(true); // stock: 0
      expect(isOutOfStock(mockBreweryProduct)).toBe(false); // stock: 25
    });

    it("devrait gérer les produits sans attributs de stock", () => {
      const productWithoutStock: Product = {
        ...mockBreweryProduct,
        attributes: JSON.stringify({ degre_alcool: 5.0 }), // pas de stock
      };
      expect(hasLowStock(productWithoutStock)).toBe(false);
      expect(isOutOfStock(productWithoutStock)).toBe(false);
    });
  });

  describe("Stock badge", () => {
    it("getStockBadgeColor devrait retourner la bonne couleur", () => {
      expect(getStockBadgeColor(mockBeautyShopProduct)).toBe("red"); // stock: 0
      expect(getStockBadgeColor(mockTeaShopProduct)).toBe("orange"); // stock: 8
      expect(getStockBadgeColor(mockBreweryProduct)).toBe("green"); // stock: 25
    });

    it("getStockBadgeText devrait retourner le bon texte", () => {
      expect(getStockBadgeText(mockBeautyShopProduct)).toBe("Rupture");
      expect(getStockBadgeText(mockTeaShopProduct)).toBe("Stock faible (8)");
      expect(getStockBadgeText(mockBreweryProduct)).toBe("En stock (25)");
    });

    it("devrait gérer les produits sans stock défini", () => {
      const productWithoutStock: Product = {
        ...mockBreweryProduct,
        attributes: undefined,
      };
      expect(getStockBadgeColor(productWithoutStock)).toBe("green");
      expect(getStockBadgeText(productWithoutStock)).toBe("Stock inconnu");
    });
  });

  describe("Edge cases", () => {
    it("devrait gérer les attributs avec des valeurs nulles", () => {
      const productWithNullValues: Product = {
        ...mockBreweryProduct,
        attributes: JSON.stringify({
          degre_alcool: null,
          amertume_ibu: 0,
          stock: 5,
        }),
      };
      const result = getKeyAttributesForCard(
        productWithNullValues,
        mockShops["shop-1"]
      );
      expect(result).toHaveLength(4); // degre_alcool (null), amertume, format (undefined), stock
    });

    it("devrait gérer les types de boutique non reconnus", () => {
      const unknownShop: Shop = {
        id: "unknown",
        name: "Boutique Inconnue",
        shopType: "unknown" as "brewery" | "teaShop" | "beatyShop" | "herbShop",
        categories: [],
      };
      const result = getKeyAttributesForCard(mockBreweryProduct, unknownShop);
      expect(result).toEqual([]);
    });

    it("devrait gérer la certification bio false pour institut beauté", () => {
      const nonBioProduct: Product = {
        ...mockBeautyShopProduct,
        attributes: JSON.stringify({
          type_peau: "Tous types",
          ingredients_actifs: "Glycérine",
          certification_bio: false,
          contenance_ml: 30,
          stock: 10,
        }),
      };
      const result = getKeyAttributesForCard(
        nonBioProduct,
        mockShops["shop-3"]
      );
      const bioAttribute = result.find((attr) => attr.label === "Bio");
      expect(bioAttribute?.value).toBe("Non");
    });
  });
});
