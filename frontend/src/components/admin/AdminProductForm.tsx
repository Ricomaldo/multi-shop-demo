import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Switch,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import type { Product, Shop } from "../../../../shared/types";
import { parseProductAttributes } from "../../utils/productAttributes";

interface AdminProductFormProps {
  product?: Product;
  shop: Shop;
  onSave: (productData: Partial<Product>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  shop,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const toast = useToast();

  // États pour les champs de base
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || 0);

  // États pour les attributs spécialisés
  const [attributes, setAttributes] = useState<Record<string, unknown>>({});

  // Initialisation des attributs selon le type de boutique
  useEffect(() => {
    if (product) {
      const parsedAttributes = parseProductAttributes(product);
      if (parsedAttributes) {
        setAttributes(parsedAttributes);
      }
    } else {
      // Valeurs par défaut selon le type de boutique
      switch (shop.shopType) {
        case "brewery":
          setAttributes({
            degre_alcool: 5.0,
            amertume_ibu: 20,
            type_houblon: "",
            process_brassage: "",
            garde_conseillee: "",
            format_bouteille: "33cl",
            disponibilite: "En stock",
            stock: 0,
          });
          break;
        case "tea-shop":
          setAttributes({
            origine_plantation: "",
            altitude_culture: "",
            grade_qualite: "",
            recolte_flush: "",
            temperature_infusion: "80°C",
            temps_infusion: "3 minutes",
            quantite_grammes: "2g",
            conservation: "",
            stock: 0,
          });
          break;
        case "beauty-shop":
          setAttributes({
            type_peau: "",
            ingredients_actifs: "",
            certification_bio: false,
            contenance_ml: 50,
            utilisation_moment: "",
            zone_application: "",
            texture: "",
            age_recommande: "",
            stock: 0,
          });
          break;
        case "herb-shop":
          setAttributes({
            principes_actifs: "",
            usage_traditionnel: "",
            posologie: "",
            contre_indications: "",
            forme_galenique: "",
            certification: "",
            duree_cure: "",
            conservation_duree: "",
            stock: 0,
          });
          break;
      }
    }
  }, [product, shop.shopType]);

  const handleAttributeChange = (
    key: string,
    value: string | number | boolean
  ) => {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du produit est obligatoire",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (price <= 0) {
      toast({
        title: "Erreur",
        description: "Le prix doit être supérieur à 0",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const productData: Partial<Product> = {
      name: name.trim(),
      description: description.trim(),
      price,
      attributes: JSON.stringify(attributes),
    };

    onSave(productData);
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
                  value={attributes.degre_alcool || 0}
                  onChange={(_, value) =>
                    handleAttributeChange("degre_alcool", value)
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
                  value={attributes.amertume_ibu || 0}
                  onChange={(_, value) =>
                    handleAttributeChange("amertume_ibu", value)
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
                    handleAttributeChange("type_houblon", e.target.value)
                  }
                  placeholder="Ex: Cascade, Centennial"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Format bouteille</FormLabel>
                <Select
                  value={attributes.format_bouteille || ""}
                  onChange={(e) =>
                    handleAttributeChange("format_bouteille", e.target.value)
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
                  handleAttributeChange("process_brassage", e.target.value)
                }
                placeholder="Décrivez le processus de brassage..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Garde conseillée</FormLabel>
              <Input
                value={attributes.garde_conseillee || ""}
                onChange={(e) =>
                  handleAttributeChange("garde_conseillee", e.target.value)
                }
                placeholder="Ex: 2 ans, À consommer rapidement"
              />
            </FormControl>
          </VStack>
        );

      case "tea-shop":
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
                    handleAttributeChange("origine_plantation", e.target.value)
                  }
                  placeholder="Ex: Darjeeling, Ceylan"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Altitude culture</FormLabel>
                <Input
                  value={attributes.altitude_culture || ""}
                  onChange={(e) =>
                    handleAttributeChange("altitude_culture", e.target.value)
                  }
                  placeholder="Ex: 1500m, Haute altitude"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Grade qualité</FormLabel>
                <Select
                  value={attributes.grade_qualite || ""}
                  onChange={(e) =>
                    handleAttributeChange("grade_qualite", e.target.value)
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
                    handleAttributeChange("recolte_flush", e.target.value)
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
                    handleAttributeChange(
                      "temperature_infusion",
                      e.target.value
                    )
                  }
                  placeholder="Ex: 80°C, 95°C"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Temps infusion</FormLabel>
                <Input
                  value={attributes.temps_infusion || ""}
                  onChange={(e) =>
                    handleAttributeChange("temps_infusion", e.target.value)
                  }
                  placeholder="Ex: 3 minutes, 5 minutes"
                />
              </FormControl>
            </SimpleGrid>
          </VStack>
        );

      case "beauty-shop":
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
                    handleAttributeChange("type_peau", e.target.value)
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
                  value={attributes.contenance_ml || 0}
                  onChange={(_, value) =>
                    handleAttributeChange("contenance_ml", value)
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
                    handleAttributeChange("zone_application", e.target.value)
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
                  onChange={(e) =>
                    handleAttributeChange("texture", e.target.value)
                  }
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
                  handleAttributeChange("ingredients_actifs", e.target.value)
                }
                placeholder="Listez les ingrédients actifs..."
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Certification bio</FormLabel>
              <Switch
                isChecked={attributes.certification_bio || false}
                onChange={(e) =>
                  handleAttributeChange("certification_bio", e.target.checked)
                }
              />
            </FormControl>
          </VStack>
        );

      case "herb-shop":
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
                    handleAttributeChange("usage_traditionnel", e.target.value)
                  }
                  placeholder="Ex: Digestion, Sommeil"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Forme galénique</FormLabel>
                <Select
                  value={attributes.forme_galenique || ""}
                  onChange={(e) =>
                    handleAttributeChange("forme_galenique", e.target.value)
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
                    handleAttributeChange("certification", e.target.value)
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
                    handleAttributeChange("duree_cure", e.target.value)
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
                  handleAttributeChange("principes_actifs", e.target.value)
                }
                placeholder="Décrivez les principes actifs..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Posologie</FormLabel>
              <Textarea
                value={attributes.posologie || ""}
                onChange={(e) =>
                  handleAttributeChange("posologie", e.target.value)
                }
                placeholder="Indiquez la posologie recommandée..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Contre-indications</FormLabel>
              <Textarea
                value={attributes.contre_indications || ""}
                onChange={(e) =>
                  handleAttributeChange("contre_indications", e.target.value)
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

          <FormControl isRequired>
            <FormLabel>Nom du produit</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du produit"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du produit"
              rows={3}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Prix (€)</FormLabel>
            <NumberInput
              value={price}
              onChange={(_, value) => setPrice(value || 0)}
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
              value={attributes.stock || 0}
              onChange={(_, value) =>
                handleAttributeChange("stock", value || 0)
              }
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
        <HStack justify="flex-end" spacing={4}>
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
      </VStack>
    </Box>
  );
};
