import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LoadingState from "../../components/ui/LoadingState";
import { useAdminShop } from "../../hooks";
import { useStoreDataQuery } from "../../hooks/useStoreDataQuery";
import adminCategoriesService, {
  type CategoryWithStats,
} from "../../services/adminCategoriesService";

// Helper pour extraire les messages d'erreur
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { error?: string } } })
      .response;
    if (response?.data?.error) {
      return response.data.error;
    }
  }
  return defaultMessage;
};

export default function Categories() {
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithStats | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [shopCategories, setShopCategories] = useState<CategoryWithStats[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { shop: activeShop } = useAdminShop();
  const { products, loading, error } = useStoreDataQuery();

  const colorScheme = "green";

  // Charger les catégories via l'API admin
  const fetchCategories = async () => {
    if (!activeShop?.id) return;

    setCategoriesLoading(true);
    try {
      const categories = await adminCategoriesService.getCategories(
        activeShop.id,
        true
      );
      setShopCategories(categories);
    } catch (err) {
      console.error("Erreur récupération catégories:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [activeShop?.id]);

  const getCategoryProductCount = (categoryId: string) => {
    // Utiliser le productCount de l'API si disponible
    const category = shopCategories.find((c) => c.id === categoryId);
    if (category && typeof category.productCount === "number") {
      return category.productCount;
    }

    // Fallback vers le calcul local
    const shopProducts = products.filter((p) => p.shopId === activeShop?.id);
    return shopProducts.filter((p) => p.categoryId === categoryId).length;
  };

  const handleEdit = (category: CategoryWithStats) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    onOpen();
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "" });
    onOpen();
  };

  const handleSave = async () => {
    if (!activeShop?.id || !formData.name.trim()) return;

    setIsLoading(true);
    try {
      if (editingCategory) {
        // Mise à jour
        await adminCategoriesService.updateCategory(editingCategory.id, {
          name: formData.name.trim(),
        });
        toast({
          title: "Catégorie modifiée",
          description: `${formData.name} a été mise à jour avec succès`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Création
        await adminCategoriesService.createCategory({
          name: formData.name.trim(),
          shopId: activeShop.id,
        });
        toast({
          title: "Catégorie créée",
          description: `${formData.name} a été créée avec succès`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
      // Recharger les catégories
      await fetchCategories();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Impossible de sauvegarder la catégorie"
      );
      toast({
        title: "Erreur",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (category: CategoryWithStats) => {
    const productCount = getCategoryProductCount(category.id);

    if (productCount > 0) {
      toast({
        title: "Suppression impossible",
        description: `Cette catégorie contient ${productCount} produit${
          productCount > 1 ? "s" : ""
        }. Vous devez d'abord déplacer ou supprimer les produits.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await adminCategoriesService.deleteCategory(category.id);
      toast({
        title: "Catégorie supprimée",
        description: `${category.name} a été supprimée avec succès`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      // Recharger les catégories
      await fetchCategories();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Impossible de supprimer la catégorie"
      );
      toast({
        title: "Erreur",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading || categoriesLoading || !activeShop) {
    return (
      <LoadingState
        message={
          !activeShop
            ? "Initialisation de la boutique..."
            : "Chargement des catégories..."
        }
        height="60vh"
      />
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <VStack spacing={4}>
            <Text color="red.500" fontSize="lg">
              ❌ Erreur: {error.message || String(error)}
            </Text>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={fetchCategories}
            >
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
                🏷️ Gestion des Catégories
              </Heading>
              <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                {activeShop?.name} • {shopCategories.length} catégorie
                {shopCategories.length !== 1 ? "s" : ""}
              </Text>
            </VStack>

            <Button
              colorScheme={colorScheme}
              leftIcon={<AddIcon />}
              onClick={handleCreate}
              size={{ base: "md", md: "md" }}
              w={{ base: "full", md: "auto" }}
            >
              Nouvelle catégorie
            </Button>
          </Flex>
        </CardBody>
      </Card>

      {/* Statistiques rapides */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total catégories</StatLabel>
              <StatNumber>{shopCategories.length}</StatNumber>
              <StatHelpText>Dans cette boutique</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Produits total</StatLabel>
              <StatNumber>
                {shopCategories.reduce(
                  (total, cat) => total + getCategoryProductCount(cat.id),
                  0
                )}
              </StatNumber>
              <StatHelpText>Tous produits confondus</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Moyenne par catégorie</StatLabel>
              <StatNumber>
                {shopCategories.length > 0
                  ? Math.round(
                      shopCategories.reduce(
                        (total, cat) => total + getCategoryProductCount(cat.id),
                        0
                      ) / shopCategories.length
                    )
                  : 0}
              </StatNumber>
              <StatHelpText>Produits par catégorie</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Liste des catégories */}
      <Card>
        <CardHeader>
          <Heading size="md">Liste des catégories</Heading>
        </CardHeader>
        <CardBody>
          {shopCategories.length === 0 ? (
            <VStack spacing={4} py={8}>
              <Text fontSize="lg" color="gray.500">
                Aucune catégorie créée
              </Text>
              <Button colorScheme={colorScheme} onClick={handleCreate}>
                Créer votre première catégorie
              </Button>
            </VStack>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {shopCategories.map((category: CategoryWithStats) => {
                const productCount = getCategoryProductCount(category.id);
                return (
                  <Card key={category.id} variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="start">
                          <VStack align="start" spacing={1} flex={1}>
                            <Text fontWeight="bold" fontSize="lg">
                              {category.name}
                            </Text>
                            <Badge
                              colorScheme={
                                productCount > 0 ? colorScheme : "gray"
                              }
                              variant="subtle"
                            >
                              {productCount} produit
                              {productCount !== 1 ? "s" : ""}
                            </Badge>
                          </VStack>

                          <HStack spacing={1}>
                            <Tooltip label="Modifier">
                              <IconButton
                                aria-label="Modifier"
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(category)}
                              />
                            </Tooltip>
                            <Tooltip label="Supprimer">
                              <IconButton
                                aria-label="Supprimer"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleDelete(category)}
                              />
                            </Tooltip>
                          </HStack>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </CardBody>
      </Card>

      {/* Modal de création/édition */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box w="full">
                <Text mb={2} fontWeight="medium">
                  Nom de la catégorie
                </Text>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Ex: Blondes, IPA, Brunes..."
                  size="lg"
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button
              colorScheme={colorScheme}
              onClick={handleSave}
              isLoading={isLoading}
              loadingText="Sauvegarde..."
              isDisabled={!formData.name.trim()}
            >
              {editingCategory ? "Modifier" : "Créer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
