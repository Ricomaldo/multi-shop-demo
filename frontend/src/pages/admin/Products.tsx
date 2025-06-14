import ProductAttributes from "@/components/ui/ProductAttributes";
import { useStoreDataQuery } from "@/hooks/useStoreDataQuery";
import type { Product } from "@/types";
import { SearchIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { SharedProductPreviewCard } from "../../components/business/product/SharedProductPreviewCard";
import { AdminProductForm } from "../../components/features/admin/product/AdminProductForm";
import AdminProductList from "../../components/features/admin/product/AdminProductList";
import LoadingState from "../../components/ui/LoadingState";
import {
  useAdminShop,
  useAdvancedProductFilters,
  useUniverseAnimations,
  useUniverseButton,
  useUniverseColors,
} from "../../hooks";
import type { ProductFilters } from "../../services/adminProductService";
import { getUniverseTokens } from "../../theme/universeTokens";

export default function Products() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const { shop: activeShop } = useAdminShop();
  const { products, loading, refetch } = useStoreDataQuery();

  // 🆕 HOOKS ÉMOTIONNELS POUR ADMIN
  const shopType = activeShop?.shopType || "brewery";
  const tokens = getUniverseTokens(shopType);
  const universeButton = useUniverseButton(shopType);
  const universeColors = useUniverseColors(shopType);
  const universeAnimations = useUniverseAnimations(
    activeShop?.shopType || "brewery"
  );

  // Couleurs pour le mode sombre/clair
  const previewBg = useColorModeValue("gray.50", "gray.700");

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
    setSelectedProduct(product); // Mettre à jour le preview
  };

  // Nouvelle fonction pour mettre à jour le preview en temps réel
  const handleFormChange = (formData: Partial<Product>) => {
    if (selectedProduct) {
      setSelectedProduct({
        ...selectedProduct,
        ...formData,
      });
    }
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Produit supprimé",
        description: `Le produit "${productToDelete.name}" a été supprimé avec succès`,
        status: "success",
        duration: 3000,
      });

      refetch();
      onDeleteClose();
      setProductToDelete(null);
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
      if (!editingProduct?.id || !activeShop?.id) {
        throw new Error("Produit ou boutique manquant");
      }

      // Conversion des attributes string JSON vers objet pour l'API
      const apiData = {
        ...productData,
        attributes: productData.attributes
          ? JSON.parse(productData.attributes)
          : undefined,
      };

      // Appel API avec route simple
      const response = await fetch(
        `http://localhost:3001/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Log réponse serveur
      const updatedProduct = await response.json();
      console.log("✅ [DEBUG] Réponse serveur:", updatedProduct);

      toast({
        title: "Produit mis à jour",
        description: "Les modifications ont été enregistrées avec succès",
        status: "success",
        duration: 3000,
      });

      setEditingProduct(null);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      // Log erreur détaillée
      console.error("❌ [DEBUG] Erreur lors de la sauvegarde:", error);
      console.error(
        "❌ [DEBUG] Stack trace:",
        error instanceof Error ? error.stack : "Pas de stack"
      );
      console.error(
        "❌ [DEBUG] Message:",
        error instanceof Error ? error.message : "Erreur inconnue"
      );

      toast({
        title: "Erreur de sauvegarde",
        description:
          error instanceof Error
            ? error.message
            : "Impossible de mettre à jour le produit",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setSelectedProduct(null); // Réinitialiser le preview
  };

  if (loading || !activeShop) {
    return (
      <LoadingState
        message={
          !activeShop
            ? "Aucune boutique sélectionnée"
            : "Chargement des produits..."
        }
      />
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} {...universeAnimations.getEntranceProps()}>
      <VStack spacing={8} align="stretch">
        {/* En-tête avec filtres */}
        <Card>
          <CardHeader>
            <Heading size="md" mb={4} color={universeColors.primary}>
              🏪 Gestion des produits - {tokens.meta.displayName}
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
                  borderColor={universeColors.borders.light}
                  focusBorderColor={universeColors.primary}
                />
              </InputGroup>

              <Select
                placeholder="Toutes catégories"
                value={selectedCategoryId || ""}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                maxW="200px"
                borderColor={universeColors.borders.light}
                focusBorderColor={universeColors.primary}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>

              <Button
                onClick={handleResetFilters}
                {...universeButton.getSecondaryProps()}
                size="md"
              >
                Réinitialiser
              </Button>
            </Flex>
          </CardHeader>

          <Divider />

          <CardBody>
            {editingProduct ? (
              <VStack spacing={6} align="stretch">
                {/* Mobile: Preview en haut, Form en bas */}
                {selectedProduct && (
                  <Box display={{ base: "block", lg: "none" }} mb={6}>
                    <Box
                      bg={previewBg}
                      p={4}
                      borderRadius="lg"
                      borderLeft="4px solid"
                      borderColor={universeColors.primary}
                    >
                      <Heading size="sm" mb={4} color={universeColors.primary}>
                        Aperçu vitrine
                      </Heading>
                      <Box maxW="300px" mx="auto">
                        <SharedProductPreviewCard
                          product={selectedProduct}
                          shop={activeShop}
                          isAdminMode={false}
                          showActions={false}
                          imageHeight="200px"
                          priceOverride={selectedProduct.price}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Desktop: Grid côte à côte */}
                <Grid
                  templateColumns={{ base: "1fr", lg: "1fr 350px" }}
                  gap={6}
                  display={{ base: "block", lg: "grid" }}
                >
                  <GridItem>
                    <AdminProductForm
                      product={editingProduct}
                      shop={activeShop}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onChange={handleFormChange}
                      onDelete={handleDelete}
                      isLoading={isLoading}
                    />
                  </GridItem>

                  {/* Preview desktop uniquement */}
                  <GridItem display={{ base: "none", lg: "block" }}>
                    {selectedProduct && (
                      <Box
                        position="sticky"
                        top={4}
                        bg={previewBg}
                        p={6}
                        borderRadius="lg"
                        borderLeft="4px solid"
                        borderColor={universeColors.primary}
                      >
                        <Heading
                          size="sm"
                          mb={4}
                          color={universeColors.primary}
                        >
                          Aperçu vitrine
                        </Heading>
                        <SharedProductPreviewCard
                          product={selectedProduct}
                          shop={activeShop}
                          isAdminMode={false}
                          showActions={false}
                          imageHeight="250px"
                          priceOverride={selectedProduct.price}
                        />

                        {/* Affichage des attributs */}
                        <Box mt={6}>
                          <Heading
                            size="sm"
                            mb={4}
                            color={universeColors.primary}
                          >
                            Caractéristiques du produit
                          </Heading>
                          {activeShop && selectedProduct && (
                            <ProductAttributes
                              product={selectedProduct}
                              shop={activeShop}
                              variant="detail"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </GridItem>
                </Grid>
              </VStack>
            ) : (
              <AdminProductList
                products={filteredProducts}
                shop={activeShop}
                onEdit={handleEdit}
              />
            )}
          </CardBody>
        </Card>
      </VStack>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Supprimer le produit</AlertDialogHeader>
            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer{" "}
              <Text as="span" fontWeight="bold">
                "{productToDelete?.name}"
              </Text>{" "}
              ? Cette action est irréversible.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} variant="ghost" onClick={onDeleteClose}>
                Annuler
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
                isLoading={isLoading}
              >
                Supprimer définitivement
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
