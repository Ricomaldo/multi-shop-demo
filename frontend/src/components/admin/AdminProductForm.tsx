import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import type { Product, Shop } from "../../../../shared/types";

interface AdminProductFormProps {
  product?: Product;
  shop: Shop;
  onSave: (productData: Partial<Product>) => void;
  onCancel: () => void;
  onChange?: (productData: Partial<Product>) => void;
  onDelete?: (product: Product) => void;
  isLoading?: boolean;
}

interface ProcessedAttributes {
  [key: string]: string | number | boolean;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  shop,
  onSave,
  onCancel,
  onChange,
  onDelete,
  isLoading = false,
}) => {
  // États pour les champs de base
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);

  // État pour les attributs spécialisés avec typage simple
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  // Modal de confirmation pour suppression
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fonction de suppression avec confirmation
  const handleDelete = () => {
    if (product && onDelete) {
      onDelete(product);
      onClose();
    }
  };

  // Initialisation des attributs selon le type de boutique
  useEffect(() => {
    if (product?.attributes) {
      try {
        const parsed = JSON.parse(product.attributes || "{}");
        // Conversion de toutes les valeurs en string pour uniformité
        const stringified = Object.entries(parsed).reduce(
          (acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          },
          {} as Record<string, string>
        );
        setAttributes(stringified);
      } catch (e) {
        console.error("Erreur parsing attributs:", e);
        setAttributes({});
      }
    } else {
      // Valeurs par défaut selon le type de boutique
      const defaultAttributes: Record<string, string> = { stock: "0" };

      switch (shop.shopType) {
        case "brewery":
          Object.assign(defaultAttributes, {
            degre_alcool: "5.0",
            amertume_ibu: "20",
            type_houblon: "",
            process_brassage: "",
            garde_conseillee: "",
            format_bouteille: "33cl",
            disponibilite: "En stock",
          });
          break;
        case "teaShop":
          Object.assign(defaultAttributes, {
            origine_plantation: "",
            altitude_culture: "",
            grade_qualite: "",
            recolte_flush: "",
            temperature_infusion: "80°C",
            temps_infusion: "3 minutes",
            quantite_grammes: "2g",
            conservation: "",
          });
          break;
        case "beautyShop":
          Object.assign(defaultAttributes, {
            type_peau: "",
            ingredients_actifs: "",
            certification_bio: "false",
            contenance_ml: "50",
            utilisation_moment: "",
            zone_application: "",
            texture: "",
            age_recommande: "",
          });
          break;
        case "herbShop":
          Object.assign(defaultAttributes, {
            principes_actifs: "",
            usage_traditionnel: "",
            posologie: "",
            contre_indications: "",
            forme_galenique: "",
            certification: "",
            duree_cure: "",
            conservation_duree: "",
          });
          break;
      }
      setAttributes(defaultAttributes);
    }
  }, [product, shop.shopType]);

  // Pour les champs numériques
  const handleNumberChange = (key: string, value: number | string) => {
    const newAttributes = { ...attributes, [key]: String(value) };
    setAttributes(newAttributes);
    if (onChange) {
      onChange({
        name,
        description,
        price,
        attributes: JSON.stringify(newAttributes),
      });
    }
  };

  // Pour les champs booléens
  const handleBooleanChange = (key: string, value: boolean) => {
    const newAttributes = { ...attributes, [key]: String(value) };
    setAttributes(newAttributes);
    if (onChange) {
      onChange({
        name,
        description,
        price,
        attributes: JSON.stringify(newAttributes),
      });
    }
  };

  // Pour les champs texte
  const handleTextChange = (key: string, value: string) => {
    const newAttributes = { ...attributes, [key]: value };
    setAttributes(newAttributes);
    if (onChange) {
      onChange({
        name,
        description,
        price,
        attributes: JSON.stringify(newAttributes),
      });
    }
  };

  // Mettre à jour name avec trigger
  const setNameWithChange = (newName: string) => {
    setName(newName);
    if (onChange) {
      onChange({
        name: newName,
        description,
        price,
        attributes: JSON.stringify(attributes),
      });
    }
  };

  // Mettre à jour description avec trigger
  const setDescriptionWithChange = (newDescription: string) => {
    setDescription(newDescription);
    if (onChange) {
      onChange({
        name,
        description: newDescription,
        price,
        attributes: JSON.stringify(attributes),
      });
    }
  };

  // Mettre à jour price avec trigger
  const setPriceWithChange = (newPrice: number) => {
    setPrice(newPrice);
    if (onChange) {
      onChange({
        name,
        description,
        price: newPrice,
        attributes: JSON.stringify(attributes),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Conversion des attributs en leurs types appropriés
    const processedAttributes = Object.entries(attributes).reduce(
      (acc, [key, value]) => {
        if (key === "certification_bio") {
          acc[key] = value === "true";
        } else if (
          ["degre_alcool", "amertume_ibu", "contenance_ml", "stock"].includes(
            key
          )
        ) {
          acc[key] = parseFloat(value) || 0;
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as ProcessedAttributes
    );

    onSave({
      name,
      description,
      price,
      attributes: JSON.stringify(processedAttributes),
    });
  };

  // Rendu des champs spécialisés selon le type de boutique
  const renderSpecializedFields = () => {
    switch (shop.shopType) {
      case "brewery":
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="orange.500">
              🍺 Attributs Brasserie
            </Heading>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Degré d'alcool (%)</FormLabel>
                <NumberInput
                  value={parseFloat(attributes.degre_alcool) || 0}
                  onChange={(_, value) =>
                    handleNumberChange("degre_alcool", value)
                  }
                  min={0}
                  max={20}
                  step={0.1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Amertume (IBU)</FormLabel>
                <NumberInput
                  value={attributes.amertume_ibu || "0"}
                  onChange={(_, value) =>
                    handleNumberChange("amertume_ibu", value)
                  }
                  min={0}
                  max={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Type de houblon</FormLabel>
                <Input
                  value={attributes.type_houblon || ""}
                  onChange={(e) =>
                    handleTextChange("type_houblon", e.target.value)
                  }
                  placeholder="Ex: Cascade, Centennial"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Format bouteille</FormLabel>
                <Select
                  value={attributes.format_bouteille || ""}
                  onChange={(e) =>
                    handleTextChange("format_bouteille", e.target.value)
                  }
                >
                  <option value="25cl">25cl</option>
                  <option value="33cl">33cl</option>
                  <option value="50cl">50cl</option>
                  <option value="75cl">75cl</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Processus de brassage</FormLabel>
              <Textarea
                value={attributes.process_brassage || ""}
                onChange={(e) =>
                  handleTextChange("process_brassage", e.target.value)
                }
                placeholder="Décrivez le processus de brassage..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Garde conseillée</FormLabel>
              <Input
                value={attributes.garde_conseillee || ""}
                onChange={(e) =>
                  handleTextChange("garde_conseillee", e.target.value)
                }
                placeholder="Ex: 2 ans, À consommer rapidement"
              />
            </FormControl>
          </VStack>
        );

      case "teaShop":
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="green.500">
              🍵 Attributs Salon de Thé
            </Heading>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Origine plantation</FormLabel>
                <Input
                  value={attributes.origine_plantation || ""}
                  onChange={(e) =>
                    handleTextChange("origine_plantation", e.target.value)
                  }
                  placeholder="Ex: Darjeeling, Ceylan"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Altitude culture</FormLabel>
                <Input
                  value={attributes.altitude_culture || ""}
                  onChange={(e) =>
                    handleTextChange("altitude_culture", e.target.value)
                  }
                  placeholder="Ex: 1500m, Haute altitude"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Grade qualité</FormLabel>
                <Select
                  value={attributes.grade_qualite || ""}
                  onChange={(e) =>
                    handleTextChange("grade_qualite", e.target.value)
                  }
                >
                  <option value="FTGFOP">FTGFOP</option>
                  <option value="SFTGFOP">SFTGFOP</option>
                  <option value="OP">OP</option>
                  <option value="Pekoe">Pekoe</option>
                  <option value="Broken">Broken</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Récolte flush</FormLabel>
                <Select
                  value={attributes.recolte_flush || ""}
                  onChange={(e) =>
                    handleTextChange("recolte_flush", e.target.value)
                  }
                >
                  <option value="First Flush">First Flush</option>
                  <option value="Second Flush">Second Flush</option>
                  <option value="Autumnal">Autumnal</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Température infusion</FormLabel>
                <Input
                  value={attributes.temperature_infusion || ""}
                  onChange={(e) =>
                    handleTextChange("temperature_infusion", e.target.value)
                  }
                  placeholder="Ex: 80°C, 95°C"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Temps infusion</FormLabel>
                <Input
                  value={attributes.temps_infusion || ""}
                  onChange={(e) =>
                    handleTextChange("temps_infusion", e.target.value)
                  }
                  placeholder="Ex: 3 minutes, 5 minutes"
                />
              </FormControl>
            </SimpleGrid>
          </VStack>
        );

      case "beautyShop":
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="pink.500">
              💄 Attributs Institut Beauté
            </Heading>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Type de peau</FormLabel>
                <Select
                  value={attributes.type_peau || ""}
                  onChange={(e) =>
                    handleTextChange("type_peau", e.target.value)
                  }
                >
                  <option value="Tous types">Tous types</option>
                  <option value="Peau sèche">Peau sèche</option>
                  <option value="Peau grasse">Peau grasse</option>
                  <option value="Peau mixte">Peau mixte</option>
                  <option value="Peau sensible">Peau sensible</option>
                  <option value="Peau mature">Peau mature</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Contenance (ml)</FormLabel>
                <NumberInput
                  value={attributes.contenance_ml || "0"}
                  onChange={(_, value) =>
                    handleNumberChange("contenance_ml", value)
                  }
                  min={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Zone d'application</FormLabel>
                <Select
                  value={attributes.zone_application || ""}
                  onChange={(e) =>
                    handleTextChange("zone_application", e.target.value)
                  }
                >
                  <option value="Visage">Visage</option>
                  <option value="Corps">Corps</option>
                  <option value="Contour des yeux">Contour des yeux</option>
                  <option value="Lèvres">Lèvres</option>
                  <option value="Mains">Mains</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Texture</FormLabel>
                <Select
                  value={attributes.texture || ""}
                  onChange={(e) => handleTextChange("texture", e.target.value)}
                >
                  <option value="Crème">Crème</option>
                  <option value="Gel">Gel</option>
                  <option value="Sérum">Sérum</option>
                  <option value="Huile">Huile</option>
                  <option value="Lotion">Lotion</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Ingrédients actifs</FormLabel>
              <Textarea
                value={attributes.ingredients_actifs || ""}
                onChange={(e) =>
                  handleTextChange("ingredients_actifs", e.target.value)
                }
                placeholder="Listez les ingrédients actifs..."
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Certification bio</FormLabel>
              <Switch
                isChecked={attributes.certification_bio === "true"}
                onChange={(e) =>
                  handleBooleanChange("certification_bio", e.target.checked)
                }
              />
            </FormControl>
          </VStack>
        );

      case "herbShop":
        return (
          <VStack spacing={4} align="stretch">
            <Heading size="md" color="green.600">
              🌿 Attributs Herboristerie
            </Heading>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>Usage traditionnel</FormLabel>
                <Input
                  value={attributes.usage_traditionnel || ""}
                  onChange={(e) =>
                    handleTextChange("usage_traditionnel", e.target.value)
                  }
                  placeholder="Ex: Digestion, Sommeil"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Forme galénique</FormLabel>
                <Select
                  value={attributes.forme_galenique || ""}
                  onChange={(e) =>
                    handleTextChange("forme_galenique", e.target.value)
                  }
                >
                  <option value="Gélules">Gélules</option>
                  <option value="Tisane">Tisane</option>
                  <option value="Teinture mère">Teinture mère</option>
                  <option value="Huile essentielle">Huile essentielle</option>
                  <option value="Poudre">Poudre</option>
                  <option value="Comprimés">Comprimés</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Certification</FormLabel>
                <Select
                  value={attributes.certification || ""}
                  onChange={(e) =>
                    handleTextChange("certification", e.target.value)
                  }
                >
                  <option value="Agriculture Biologique">
                    Agriculture Biologique
                  </option>
                  <option value="Demeter">Demeter</option>
                  <option value="Nature & Progrès">Nature & Progrès</option>
                  <option value="Ecocert">Ecocert</option>
                  <option value="Non certifié">Non certifié</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Durée de cure</FormLabel>
                <Input
                  value={attributes.duree_cure || ""}
                  onChange={(e) =>
                    handleTextChange("duree_cure", e.target.value)
                  }
                  placeholder="Ex: 3 semaines, 1 mois"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Principes actifs</FormLabel>
              <Textarea
                value={attributes.principes_actifs || ""}
                onChange={(e) =>
                  handleTextChange("principes_actifs", e.target.value)
                }
                placeholder="Décrivez les principes actifs..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Posologie</FormLabel>
              <Textarea
                value={attributes.posologie || ""}
                onChange={(e) => handleTextChange("posologie", e.target.value)}
                placeholder="Indiquez la posologie recommandée..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Contre-indications</FormLabel>
              <Textarea
                value={attributes.contre_indications || ""}
                onChange={(e) =>
                  handleTextChange("contre_indications", e.target.value)
                }
                placeholder="Mentionnez les contre-indications..."
              />
            </FormControl>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        {/* Champs de base */}
        <VStack spacing={4} align="stretch">
          <Heading size="md">Informations générales</Heading>

          <FormControl>
            <FormLabel>Nom du produit</FormLabel>
            <Input
              value={name}
              onChange={(e) => setNameWithChange(e.target.value)}
              placeholder="Nom du produit"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescriptionWithChange(e.target.value)}
              placeholder="Description du produit"
              rows={3}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Prix (€)</FormLabel>
            <NumberInput
              value={price}
              onChange={(_, value) => setPriceWithChange(value || 0)}
              min={0}
              step={0.01}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Stock</FormLabel>
            <NumberInput
              value={attributes.stock || "0"}
              onChange={(_, value) => handleNumberChange("stock", value)}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </VStack>

        <Divider />

        {/* Champs spécialisés */}
        {renderSpecializedFields()}

        <Divider />

        {/* Actions */}
        <HStack justify="space-between" spacing={4}>
          <HStack spacing={4}>
            {product && onDelete && (
              <Button
                variant="outline"
                colorScheme="red"
                onClick={onOpen}
                size="sm"
              >
                Supprimer produit
              </Button>
            )}
          </HStack>

          <HStack spacing={4}>
            <Button variant="ghost" onClick={onCancel}>
              Annuler
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Enregistrement..."
            >
              {product ? "Modifier" : "Créer"} le produit
            </Button>
          </HStack>
        </HStack>
      </VStack>

      {/* Modal de confirmation suppression */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Supprimer le produit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Êtes-vous sûr de vouloir supprimer le produit{" "}
              <Text as="span" fontWeight="bold">
                "{product?.name}"
              </Text>{" "}
              ? Cette action est irréversible.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Supprimer définitivement
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
