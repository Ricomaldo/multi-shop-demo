import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import type { Product } from "../../../../shared/types";
import { AdminProductForm } from "../../components/admin/AdminProductForm";
import AdminProductList from "../../components/admin/AdminProductList";
import {
  useAdminShop,
  useAdvancedProductFilters,
  useShopData,
  useUniverse,
} from "../../hooks";
import type { ProductFilters } from "../../services/adminProductService";
import { getUniverseColorScheme } from "../../utils/universeMapping";

export default function Products() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  const { universe } = useUniverse();
  const { shop: activeShop } = useAdminShop();
  const { products, loading, refreshData } = useShopData();

  // Filtrer les produits pour la boutique active
  const shopProducts = useMemo(
    () => products.filter((p) => p.shopId === activeShop?.id),
    [products, activeShop]
  );

  // Hook de filtrage avancé
  const {
    filteredProducts,
    selectedCategoryId,
    categories,
    setSelectedCategoryId,
    resetFilters,
    applyAdvancedFilters,
  } = useAdvancedProductFilters(shopProducts, activeShop?.id);

  // Thème couleur selon l'univers
  const colorScheme = getUniverseColorScheme(universe);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    applyAdvancedFilters(advancedFilters, search);
  };

  const handleResetFilters = () => {
    setAdvancedFilters({});
    setSearchTerm("");
    resetFilters();
  };

  const handleEdit = async (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (product: Product) => {
    setIsLoading(true);
    try {
      // Simulation API - Dans un vrai projet, appel backend
      console.log("Suppression du produit:", product.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Produit supprimé",
        description: `Le produit "${product.name}" a été supprimé avec succès`,
        status: "success",
        duration: 3000,
      });

      refreshData();
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (productData: Partial<Product>) => {
    setIsLoading(true);
    try {
      // Simulation API - Dans un vrai projet, appel backend
      console.log("Mise à jour du produit:", productData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Produit mis à jour",
        description: "Les modifications ont été enregistrées avec succès",
        status: "success",
        duration: 3000,
      });

      setEditingProduct(null);
      refreshData();
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  if (loading || !activeShop) {
    return (
      <Box p={8}>
        <Text>Chargement...</Text>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        {/* En-tête avec filtres */}
        <Card>
          <CardHeader>
            <Heading size="md" mb={4}>
              🏪 Gestion des produits
            </Heading>
            <Flex gap={4} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </InputGroup>

              <Select
                placeholder="Toutes catégories"
                value={selectedCategoryId || ""}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                maxW="200px"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>

              <Button
                variant="ghost"
                colorScheme={colorScheme}
                onClick={handleResetFilters}
                size="md"
              >
                Réinitialiser
              </Button>
            </Flex>
          </CardHeader>

          <Divider />

          <CardBody>
            {editingProduct ? (
              <AdminProductForm
                product={editingProduct}
                shop={activeShop}
                onSave={handleSave}
                onCancel={handleCancel}
                isLoading={isLoading}
              />
            ) : (
              <AdminProductList
                products={filteredProducts}
                shop={activeShop}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
