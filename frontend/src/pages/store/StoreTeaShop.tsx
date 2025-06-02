import {
  Box,
  Button,
  Collapse,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import type { Product, Shop } from "../../../../shared/types";
import { SharedHeroHeader } from "../../components/shared/SharedHeroHeader";
import { SharedProductCard } from "../../components/shared/SharedProductCard";
import { useShopByType } from "../../hooks/useShopByType";

interface CategoryCollapseProps {
  category: string;
  products: Product[];
  shop: Shop;
}

const CategoryCollapse: React.FC<CategoryCollapseProps> = ({
  category,
  products,
  shop,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Button
        onClick={onToggle}
        variant="ghost"
        colorScheme="teal"
        size="lg"
        width="100%"
        justifyContent="space-between"
        mb={4}
      >
        <Heading size="md">{category}</Heading>
        <Text>{isOpen ? "▼" : "▶"}</Text>
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} pb={6}>
          {products.map((product) => (
            <SharedProductCard key={product.id} product={product} shop={shop} />
          ))}
        </SimpleGrid>
      </Collapse>
    </Box>
  );
};

const StoreTeaShop = () => {
  const { shop, products, loading } = useShopByType("teaShop");

  // Grouper les produits par catégorie
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products.forEach((product) => {
      const category = product.category || "Autres";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [products]);

  if (loading || !shop) {
    return <Box>Chargement...</Box>;
  }

  return (
    <Box>
      <SharedHeroHeader
        title={shop.name}
        subtitle="Découvrez notre sélection de thés d'exception"
        imagePath="/images/store/tea-banner.jpg"
        imageAlt="Bannière du salon de thé"
      />

      <VStack spacing={8} align="stretch" p={8}>
        {Object.entries(productsByCategory).map(
          ([category, categoryProducts]) => (
            <CategoryCollapse
              key={category}
              category={category}
              products={categoryProducts}
              shop={shop}
            />
          )
        )}
      </VStack>
    </Box>
  );
};

export default StoreTeaShop;
