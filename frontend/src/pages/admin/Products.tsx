import { ArrowBackIcon, SearchIcon } from "@chakra-ui/icons";
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
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Tooltip,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import axios from "axios";
import { useMemo, useState } from "react";
import type { Product } from "../../../../shared/types";
import { AdminProductList } from "../../components/admin";
import AdminPreviewLayout from "../../components/admin/AdminPreviewLayout";
import { AdminProductForm } from "../../components/admin/AdminProductForm";
import AdminProductPreview from "../../components/admin/AdminProductPreview";
import { useUniverse } from "../../contexts/UniverseContext";
import {
  useAdvancedProductFilters,
  useProductPreview,
  useShopData,
} from "../../hooks";
import type { ProductFilters } from "../../services/adminProductService";
import {
  getUniverseColorScheme,
  shopTypeToUniverse,
} from "../../utils/universeMapping";

export default function Products() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<ProductFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  const { universe } = useUniverse();

  // Utiliser les hooks personnalisés pour la gestion des données
  const { shops, products, loading, error, refreshData } = useShopData();

  // Filtrer les boutiques selon l'univers sélectionné
  const filteredShops = useMemo(
    () =>
      shops.filter((shop) => shopTypeToUniverse(shop.shopType) === universe),
    [shops, universe]
  );

  const currentShop = filteredShops[0]; // Prendre la première boutique de l'univers
  const shopProducts = useMemo(
    () => products.filter((p) => p.shopId === currentShop?.id),
    [products, currentShop]
  );

  // Hook de filtrage avancé
  const {
    filteredProducts,
    selectedCategoryId,
    categories,
    setSelectedCategoryId,
    resetFilters,
    applyAdvancedFilters,
  } = useAdvancedProductFilters(shopProducts, currentShop?.id);

  // Thème couleur selon l'univers
  const colorScheme = getUniverseColorScheme(universe);

  // Hook pour l'aperçu temps réel
  const { previewData, hasChanges, updatePreview, resetChanges } =
    useProductPreview();

  // Extraction dynamique des options selon l'univers
  const dynamicOptions = useMemo(() => {
    const options: Record<string, string[]> = {};

    shopProducts.forEach((product) => {
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);

          switch (universe) {
            case "brewery":
              if (
                attrs.type_houblon &&
                !options.type_houblon?.includes(attrs.type_houblon)
              ) {
                options.type_houblon = [
                  ...(options.type_houblon || []),
                  attrs.type_houblon,
                ];
              }
              break;
            case "teaShop":
              if (
                attrs.origine_plantation &&
                !options.origine_plantation?.includes(attrs.origine_plantation)
              ) {
                options.origine_plantation = [
                  ...(options.origine_plantation || []),
                  attrs.origine_plantation,
                ];
              }
              if (
                attrs.grade_qualite &&
                !options.grade_qualite?.includes(attrs.grade_qualite)
              ) {
                options.grade_qualite = [
                  ...(options.grade_qualite || []),
                  attrs.grade_qualite,
                ];
              }
              break;
            case "beautyShop":
              if (
                attrs.type_peau &&
                !options.type_peau?.includes(attrs.type_peau)
              ) {
                options.type_peau = [
                  ...(options.type_peau || []),
                  attrs.type_peau,
                ];
              }
              break;
            case "herbShop":
              if (
                attrs.usage_traditionnel &&
                !options.usage_traditionnel?.includes(attrs.usage_traditionnel)
              ) {
                options.usage_traditionnel = [
                  ...(options.usage_traditionnel || []),
                  attrs.usage_traditionnel,
                ];
              }
              if (
                attrs.forme_galenique &&
                !options.forme_galenique?.includes(attrs.forme_galenique)
              ) {
                options.forme_galenique = [
                  ...(options.forme_galenique || []),
                  attrs.forme_galenique,
                ];
              }
              break;
          }
        } catch {
          // Ignore les erreurs de parsing
        }
      }
    });

    // Trier les options
    Object.keys(options).forEach((key) => {
      options[key].sort();
    });

    return options;
  }, [shopProducts, universe]);

  // Gestionnaires pour les filtres identiques à la vitrine
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setAdvancedFilters(newFilters);
    applyAdvancedFilters(newFilters, searchTerm);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    applyAdvancedFilters(advancedFilters, search);
  };

  const handleResetFilters = () => {
    setAdvancedFilters({});
    setSearchTerm("");
    resetFilters();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    // Initialiser l'aperçu avec les données du produit
    const initialFormData = {
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
    };
    updatePreview(initialFormData, product.category?.name);
    resetChanges();
  };

  const handleSave = async (productData: Partial<Product>) => {
    if (!editingProduct || !currentShop) return;

    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:3001/api/products/${editingProduct.id}`,
        productData
      );

      toast({
        title: "Produit modifié",
        description: `${productData.name} a été mis à jour avec succès`,
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
    resetChanges();
  };

  // Rendu des filtres spécialisés selon l'univers (identique à la vitrine)
  const renderUniverseFilters = () => {
    switch (universe) {
      case "brewery":
        return (
          <>
            {/* Filtre par intensité */}
            <Select
              placeholder="Intensité"
              size="sm"
              maxW="150px"
              bg="white"
              value={advancedFilters.degre_alcool_ranges?.[0] || ""}
              onChange={(e) => {
                const value = e.target.value;
                handleFiltersChange({
                  ...advancedFilters,
                  degre_alcool_ranges: value ? [value] : undefined,
                });
              }}
            >
              <option value="light">Légère (3-5°)</option>
              <option value="medium">Modérée (5-7°)</option>
              <option value="strong">Forte (7-10°)</option>
              <option value="very-strong">Très forte (10°+)</option>
            </Select>

            {/* Filtre par amertume */}
            <Select
              placeholder="Amertume"
              size="sm"
              maxW="150px"
              bg="white"
              value={advancedFilters.amertume_ibu_ranges?.[0] || ""}
              onChange={(e) => {
                const value = e.target.value;
                handleFiltersChange({
                  ...advancedFilters,
                  amertume_ibu_ranges: value ? [value] : undefined,
                });
              }}
            >
              <option value="low">Douce (10-25 IBU)</option>
              <option value="medium">Équilibrée (25-45 IBU)</option>
              <option value="high">Amère (45-70 IBU)</option>
              <option value="very-high">Très amère (70+ IBU)</option>
            </Select>

            {/* Filtre par houblon */}
            <Select
              placeholder="Houblon"
              size="sm"
              maxW="150px"
              bg="white"
              value={advancedFilters.type_houblon || ""}
              onChange={(e) =>
                handleFiltersChange({
                  ...advancedFilters,
                  type_houblon: e.target.value || undefined,
                })
              }
            >
              {dynamicOptions.type_houblon?.map((houblon) => (
                <option key={houblon} value={houblon}>
                  {houblon}
                </option>
              ))}
            </Select>
          </>
        );

      case "teaShop":
        return (
          <>
            {/* Filtre par origine */}
            <Select
              placeholder="Origine"
              size="sm"
              maxW="150px"
              bg="white"
              value={advancedFilters.origine_plantation || ""}
              onChange={(e) =>
                handleFiltersChange({
                  ...advancedFilters,
                  origine_plantation: e.target.value || undefined,
                })
              }
            >
              {dynamicOptions.origine_plantation?.map((origine) => (
                <option key={origine} value={origine}>
                  {origine}
                </option>
              ))}
            </Select>

            {/* Filtre par grade */}
            <Select
              placeholder="Grade"
              size="sm"
              maxW="150px"
              bg="white"
              value={advancedFilters.grade_qualite || ""}
              onChange={(e) =>
                handleFiltersChange({
                  ...advancedFilters,
                  grade_qualite: e.target.value || undefined,
                })
              }
            >
              {dynamicOptions.grade_qualite?.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </Select>
          </>
        );

      case "beautyShop":
        return (
          <>
            {/* Filtre par type de peau */}
            <Select
              placeholder="Type de peau"
              size="sm"
              maxW="150px"
              bg="white"
              value={advancedFilters.type_peau || ""}
              onChange={(e) =>
                handleFiltersChange({
                  ...advancedFilters,
                  type_peau: e.target.value || undefined,
                })
              }
            >
              {dynamicOptions.type_peau?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>

            {/* Filtre bio */}
            <Select
              placeholder="Bio"
              size="sm"
              maxW="120px"
              bg="white"
              value={
                advancedFilters.certification_bio !== undefined
                  ? String(advancedFilters.certification_bio)
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                handleFiltersChange({
                  ...advancedFilters,
                  certification_bio:
                    value === "" ? undefined : value === "true",
                });
              }}
            >
              <option value="true">Bio</option>
              <option value="false">Conventionnel</option>
            </Select>
          </>
        );

      case "herbShop":
        return (
          <>
            {/* Filtre par usage */}
            <Select
              placeholder="Usage"
              size="sm"
              maxW="150px"
              bg="white"
              value={advancedFilters.usage_traditionnel || ""}
              onChange={(e) =>
                handleFiltersChange({
                  ...advancedFilters,
                  usage_traditionnel: e.target.value || undefined,
                })
              }
            >
              {dynamicOptions.usage_traditionnel?.map((usage) => (
                <option key={usage} value={usage}>
                  {usage}
                </option>
              ))}
            </Select>

            {/* Filtre par forme */}
            <Select
              placeholder="Forme"
              size="sm"
              maxW="150px"
              bg="white"
              value={advancedFilters.forme_galenique || ""}
              onChange={(e) =>
                handleFiltersChange({
                  ...advancedFilters,
                  forme_galenique: e.target.value || undefined,
                })
              }
            >
              {dynamicOptions.forme_galenique?.map((forme) => (
                <option key={forme} value={forme}>
                  {forme}
                </option>
              ))}
            </Select>
          </>
        );

      default:
        return null;
    }
  };

  // Mode édition avec split view et aperçu temps réel
  if (editingProduct && currentShop) {
    // Contenu du formulaire enrichi avec tous les attributs spécialisés
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
            <Heading size="md">✏️ Modifier le produit</Heading>
            <Text color="gray.600" fontSize="sm">
              {currentShop.name} • Tous les attributs spécialisés
            </Text>
          </VStack>
        </Flex>

        <Divider />

        {/* Formulaire riche avec synchronisation aperçu */}
        <AdminProductForm
          product={editingProduct}
          shop={currentShop}
          onSave={handleSave}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </VStack>
    );

    // Contenu de l'aperçu temps réel
    const previewContent = (
      <AdminProductPreview
        productData={previewData}
        hasChanges={hasChanges}
        shopType={currentShop.shopType}
      />
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
      {/* En-tête */}
      <Card>
        <CardBody>
          <Heading size={{ base: "md", md: "lg" }}>
            📦 Gestion des Produits
          </Heading>
        </CardBody>
      </Card>

      {/* Barre de recherche et filtres - IDENTIQUE à la vitrine */}
      <VStack spacing={4} w="full">
        {/* Recherche principale */}
        <InputGroup size="lg" maxW="500px">
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            borderRadius="full"
            bg="white"
            _focus={{
              borderColor: `${colorScheme}.400`,
              boxShadow: `0 0 0 1px var(--chakra-colors-${colorScheme}-400)`,
            }}
          />
        </InputGroup>

        {/* Filtres rapides horizontaux - IDENTIQUE à la vitrine */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          align="center"
          justify="center"
          wrap="wrap"
        >
          {/* Filtre par catégorie */}
          <Select
            placeholder="Catégorie"
            size="sm"
            maxW="150px"
            bg="white"
            value={selectedCategoryId || ""}
            onChange={(e) => setSelectedCategoryId(e.target.value || null)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          {/* Filtres spécialisés selon l'univers */}
          {renderUniverseFilters()}

          {/* Reset */}
          {(selectedCategoryId ||
            Object.keys(advancedFilters).length > 0 ||
            searchTerm) && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme={colorScheme}
              onClick={handleResetFilters}
            >
              Effacer tout
            </Button>
          )}
        </Flex>
      </VStack>

      {/* Stats et badges - IDENTIQUE à la vitrine */}
      <Wrap justify="center" spacing={4}>
        <WrapItem>
          <Badge colorScheme={colorScheme} px={3} py={1}>
            {filteredProducts.length} résultat
            {filteredProducts.length !== 1 ? "s" : ""}
          </Badge>
        </WrapItem>
        <WrapItem>
          <Badge colorScheme="blue" px={3} py={1}>
            Mode Admin
          </Badge>
        </WrapItem>
        <WrapItem>
          <Badge colorScheme="green" px={3} py={1}>
            Aperçu temps réel
          </Badge>
        </WrapItem>
      </Wrap>

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
                {selectedCategoryId ||
                Object.keys(advancedFilters).length > 0 ||
                searchTerm
                  ? "Aucun produit ne correspond à vos critères"
                  : "Aucun produit disponible"}
              </Text>
              {(selectedCategoryId ||
                Object.keys(advancedFilters).length > 0 ||
                searchTerm) && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  size={{ base: "sm", md: "md" }}
                >
                  Voir tous les produits
                </Button>
              )}
            </VStack>
          ) : (
            <AdminProductList
              products={filteredProducts}
              shop={currentShop!}
              onEdit={handleEdit}
            />
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
