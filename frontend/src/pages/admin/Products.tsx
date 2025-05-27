import { ArrowBackIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
  Textarea,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../../../shared/types";
import { AdminCategoryFilter, AdminProductList } from "../../components/admin";
import AdminPreviewLayout from "../../components/admin/AdminPreviewLayout";
import AdminProductPreview from "../../components/admin/AdminProductPreview";
import { useProductFilters, useProductPreview, useShopData } from "../../hooks";

export default function Products() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "0.00" as string,
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Utiliser les hooks personnalisés pour la gestion des données
  const { shops, products, loading, error, refreshData } = useShopData();
  const currentShop = shops[0]; // Prendre la première boutique pour l'admin
  const shopProducts = useMemo(
    () => products.filter((p) => p.shopId === currentShop?.id),
    [products, currentShop]
  );

  // Hook de filtrage par catégorie
  const {
    filteredProducts,
    selectedCategoryId,
    categories,
    setSelectedCategoryId,
    resetFilters,
  } = useProductFilters(shopProducts);

  const colorScheme = "blue";

  // Hook pour l'aperçu temps réel
  const { previewData, hasChanges, updatePreview, resetChanges } =
    useProductPreview();

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const initialFormData = {
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
    };
    setFormData(initialFormData);

    // Initialiser l'aperçu avec les données du produit
    updatePreview(initialFormData, product.category?.name);
    resetChanges();
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:3001/api/products/${editingProduct.id}`,
        { ...formData, price: parseFloat(String(formData.price)) }
      );

      toast({
        title: "Produit modifié",
        description: `${formData.name} a été mis à jour avec succès`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setEditingProduct(null);
      await refreshData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le produit",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "0.00" });
    resetChanges();
  };

  // Fonction pour mettre à jour les données et l'aperçu
  const handleFormChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    updatePreview(newFormData, editingProduct?.category?.name);
  };

  // Effet pour mettre à jour l'aperçu quand les données changent
  useEffect(() => {
    if (editingProduct) {
      updatePreview(formData, editingProduct.category?.name);
    }
  }, [formData, editingProduct, updatePreview]);

  if (editingProduct) {
    // Contenu du formulaire d'édition
    const editContent = (
      <VStack spacing={6} align="stretch">
        {/* En-tête avec bouton retour */}
        <Flex align="center" gap={4}>
          <Tooltip label="Retour à la liste">
            <IconButton
              aria-label="Retour"
              icon={<ArrowBackIcon />}
              variant="ghost"
              onClick={handleCancel}
            />
          </Tooltip>
          <VStack align="start" spacing={1} flex="1">
            <Heading size="md">Modifier le produit</Heading>
            <Text color="gray.600" fontSize="sm">
              Boutique : {currentShop?.name}
            </Text>
          </VStack>
        </Flex>

        <Divider />

        {/* Formulaire */}
        <Box>
          <Text mb={2} fontWeight="medium">
            Nom du produit
          </Text>
          <Input
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFormChange("name", e.target.value)
            }
            placeholder="Ex: Blonde de Garde"
            size="lg"
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">
            Description
          </Text>
          <Textarea
            value={formData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleFormChange("description", e.target.value)
            }
            placeholder="Décrivez votre produit..."
            rows={4}
            resize="vertical"
          />
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">
            Prix (€)
          </Text>
          <Input
            type="text"
            value={formData.price}
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]{0,2}$"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value.replace(",", ".");
              if (/^\d*\.?\d{0,2}$/.test(val) || val === "") {
                handleFormChange("price", val);
              }
            }}
            onBlur={() => {
              const formattedPrice =
                formData.price !== ""
                  ? parseFloat(String(formData.price)).toFixed(2)
                  : "0.00";
              handleFormChange("price", formattedPrice);
            }}
            placeholder="Ex: 4.50"
            size="lg"
          />
        </Box>

        <Divider />

        {/* Boutons d'action */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="flex-end"
          gap={3}
        >
          <Button
            variant="outline"
            onClick={handleCancel}
            leftIcon={<CloseIcon />}
            size="md"
            w={{ base: "full", sm: "auto" }}
          >
            Annuler
          </Button>
          <Button
            colorScheme={colorScheme}
            onClick={handleSave}
            isLoading={isLoading}
            loadingText="Sauvegarde..."
            leftIcon={<CheckIcon />}
            size="md"
            w={{ base: "full", sm: "auto" }}
          >
            Sauvegarder
          </Button>
        </Flex>
      </VStack>
    );

    // Contenu de l'aperçu
    const previewContent = (
      <AdminProductPreview productData={previewData} hasChanges={hasChanges} />
    );

    return (
      <AdminPreviewLayout
        editContent={editContent}
        previewContent={previewContent}
        editTitle="Modifier le produit"
        previewTitle="Aperçu vitrine temps réel"
      />
    );
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <VStack spacing={4}>
          <Text fontSize="lg">Chargement des produits...</Text>
          <Box
            w="200px"
            h="2px"
            bg="gray.200"
            borderRadius="full"
            overflow="hidden"
          >
            <Box
              w="100%"
              h="100%"
              bg={`${colorScheme}.500`}
              className="animate-pulse"
            />
          </Box>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <VStack spacing={4}>
            <Text color="red.500" fontSize="lg">
              ❌ Erreur: {error}
            </Text>
            <Button colorScheme="red" variant="outline" onClick={refreshData}>
              Réessayer
            </Button>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* En-tête avec statistiques */}
      <Card>
        <CardBody>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            wrap="wrap"
            gap={4}
          >
            <VStack align="start" spacing={1}>
              <Heading size={{ base: "md", md: "lg" }}>
                📦 Gestion des Produits
              </Heading>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                {currentShop?.name} • {shopProducts.length} produit
                {shopProducts.length !== 1 ? "s" : ""}
              </Text>
            </VStack>

            <Flex
              direction={{ base: "row", md: "row" }}
              wrap="wrap"
              gap={4}
              justify={{ base: "center", md: "flex-end" }}
            >
              <Badge
                colorScheme="green"
                p={2}
                borderRadius="md"
                fontSize={{ base: "xs", md: "sm" }}
              >
                {categories.length} catégorie
                {categories.length !== 1 ? "s" : ""}
              </Badge>
              <Badge
                colorScheme={colorScheme}
                p={2}
                borderRadius="md"
                fontSize={{ base: "xs", md: "sm" }}
              >
                {filteredProducts.length} affiché
                {filteredProducts.length !== 1 ? "s" : ""}
              </Badge>
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {/* Filtrage par catégorie */}
      <AdminCategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={setSelectedCategoryId}
        onResetFilters={resetFilters}
        productCount={filteredProducts.length}
        colorScheme={colorScheme}
      />

      {/* Liste des produits */}
      <Card>
        <CardHeader>
          <Heading size={{ base: "sm", md: "md" }}>
            {selectedCategoryId
              ? `Produits - ${
                  categories.find((c) => c.id === selectedCategoryId)?.name
                }`
              : "Tous les produits"}
          </Heading>
        </CardHeader>
        <CardBody>
          {filteredProducts.length === 0 ? (
            <VStack spacing={4} py={8}>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.500"
                textAlign="center"
              >
                {selectedCategoryId
                  ? "Aucun produit dans cette catégorie"
                  : "Aucun produit disponible"}
              </Text>
              {selectedCategoryId && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  size={{ base: "sm", md: "md" }}
                >
                  Voir tous les produits
                </Button>
              )}
            </VStack>
          ) : (
            <AdminProductList products={filteredProducts} onEdit={handleEdit} />
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
