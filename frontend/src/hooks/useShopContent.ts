import type { ShopType } from "@/types";
import { useEffect, useState } from "react";
import shopContentData from "../data/shop_content.json";

interface ShopContentCard {
  title: string;
  content: string;
}

interface ShopContentSection {
  title: string;
  description: string;
  cards: ShopContentCard[];
}

interface UniverseContent {
  heroSubtitle: string;
  heroImage: string;
  sections: {
    main: ShopContentSection;
  };
}

interface ShopContentData {
  universeContent: Record<ShopType, UniverseContent>;
}

export const useShopContent = (shopType: ShopType) => {
  const [content, setContent] = useState<UniverseContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = shopContentData as ShopContentData;
      const universeContent = data.universeContent[shopType];

      if (universeContent) {
        setContent(universeContent);
      } else {
        console.warn(`No content found for shopType: ${shopType}`);
        setContent(null);
      }
    } catch (error) {
      console.error("Error loading shop content:", error);
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [shopType]);

  return {
    content,
    loading,
    heroSubtitle: content?.heroSubtitle || "",
    heroImage: content?.heroImage || "/images/store/default-hero.jpg",
    mainSection: content?.sections.main || null,
  };
};
