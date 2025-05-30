import type { Shop } from "../../../shared/types";
import BeautySection from "../components/store/sections/BeautySection";
import BrewerySection from "../components/store/sections/BrewerySection";
import HerbSection from "../components/store/sections/HerbSection";
import TeaSection from "../components/store/sections/TeaSection";

// Mapping des sections spécifiques par type de boutique
export const UniverseSections = {
  brewery: BrewerySection,
  teaShop: TeaSection,
  beautyShop: BeautySection,
  herbShop: HerbSection,
};

// Mapping des variantes de composants par type de boutique
export const ComponentVariants: Record<
  Shop["shopType"],
  {
    productCard: string;
    productGrid: string;
    footer: string;
    modal: string;
  }
> = {
  brewery: {
    productCard: "brewery",
    productGrid: "brewery",
    footer: "compact",
    modal: "dynamic",
  },
  teaShop: {
    productCard: "tea",
    productGrid: "tea",
    footer: "zen",
    modal: "minimal",
  },
  beautyShop: {
    productCard: "beauty",
    productGrid: "beauty",
    footer: "elegant",
    modal: "sophisticated",
  },
  herbShop: {
    productCard: "herb",
    productGrid: "herb",
    footer: "natural",
    modal: "organic",
  },
};
