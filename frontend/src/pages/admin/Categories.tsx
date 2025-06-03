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
import axios from "axios";
import { useEffect, useState } from "react";
import type { Category } from "../../../../shared/types";
import { useAdminShop, useShopData } from "../../hooks";

export default function Categories() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [shopCategories, setShopCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { shop: activeShop } = useAdminShop();
  const { products, loading, error } = useShopData();

  // Contournement temporaire - Fetch catégories par API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!activeShop?.id) return;

      setCategoriesLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/shops/${activeShop.id}`
        );
        const shop = response.data;

        // Récupérer les catégories depuis les données shop
        setShopCategories(shop.categories || []);
      } catch (err) {
        console.error("Erreur récupération catégories:", err);
        setShopCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [activeShop?.id]);

  const getCategoryProductCount = (categoryId: string) => {
    // Filtrer les produits de la boutique active uniquement
    const shopProducts = products.filter((p) => p.shopId === activeShop?.id);

    // Compter les produits qui appartiennent à cette catégorie
    return shopProducts.filter((p) => p.categoryId === categoryId).length;
  };

  const colorScheme = "green";

  const handleEdit = (category: Category) => {
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
    setIsLoading(true);
    try {
      // Simulation d'API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: editingCategory ? "Catégorie modifiée" : "Catégorie créée",
        description: `${formData.name} a été ${
          editingCategory ? "mise à jour" : "créée"
        } avec succès`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();

      // Recharger les catégories après modification
      if (activeShop?.id) {
        const response = await axios.get(
          `http://localhost:3001/api/shops/${activeShop.id}`
        );
        setShopCategories(response.data.categories || []);
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la catégorie",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const productCount = getCategoryProductCount(category.id);

    if (productCount > 0) {
      toast({
        title: "Suppression impossible",
        description: `Cette catégorie contient ${productCount} produit${
          productCount > 1 ? "s" : ""
        }`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Simulation suppression
    toast({
      title: "Catégorie supprimée",
      description: `${category.name} a été supprimée`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading || categoriesLoading || !activeShop) {
    return (
      <Flex justify="center" align="center" h="400px">
        <VStack spacing={4}>
          <Text fontSize="lg">Chargement des catégories...</Text>
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
              ❌ Erreur: {error.message || String(error)}
            </Text>
            <Button colorScheme="red" variant="outline">
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
                {products.filter((p) => p.shopId === activeShop?.id).length}
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
                      products.filter((p) => p.shopId === activeShop?.id)
                        .length / shopCategories.length
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
              {shopCategories.map((category: Category) => {
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
