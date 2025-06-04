import type { OpeningHours, Shop } from "@/types";
import { updateShop } from "@/services/adminShopService";
import { getUniverseTokens } from "@/theme/universeTokens";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

interface AdminShopFormProps {
  shop: Shop;
  onSave: (shopData: Partial<Shop>) => Promise<void>;
  isLoading?: boolean;
}

const daysOfWeek = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
] as const;

/**
 * Formulaire de gestion des informations business d'une boutique
 * Permet au commerçant de gérer nom, adresse, horaires, contact
 */
export default function AdminShopForm({
  shop,
  onSave,
  isLoading = false,
}: AdminShopFormProps) {
  // Initialiser les horaires d'ouverture en parsant le JSON si nécessaire
  const initialOpeningHours =
    typeof shop.openingHours === "string"
      ? (JSON.parse(shop.openingHours) as OpeningHours)
      : shop.openingHours || {};

  const [formData, setFormData] = useState<Partial<Shop>>({
    name: shop.name || "",
    address: shop.address || "",
    phone: shop.phone || "",
    email: shop.email || "",
    website: shop.website || "",
    description: shop.description || "",
    openingHours: initialOpeningHours,
  });

  const toast = useToast();
  const tokens = getUniverseTokens(shop.shopType);
  const colorScheme = tokens.meta.colorScheme;

  const handleInputChange = (field: keyof Shop, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (day: keyof OpeningHours, hours: string) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...(typeof prev.openingHours === "string"
          ? (JSON.parse(prev.openingHours) as OpeningHours)
          : prev.openingHours || {}),
        [day]: hours || undefined,
      },
    }));
  };

  const copyCommonHours = (hours: string) => {
    const weekdays: (keyof OpeningHours)[] = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ];
    const newHours = {
      ...(typeof formData.openingHours === "string"
        ? (JSON.parse(formData.openingHours) as OpeningHours)
        : formData.openingHours || {}),
    };

    weekdays.forEach((day) => {
      newHours[day] = hours;
    });

    setFormData((prev) => ({ ...prev, openingHours: newHours }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convertir les horaires en JSON pour l'API
      const dataToSave = {
        ...formData,
        openingHours:
          typeof formData.openingHours === "string"
            ? formData.openingHours
            : JSON.stringify(formData.openingHours),
      };

      await updateShop(shop.id, dataToSave);
      await onSave(dataToSave);
      toast({
        title: "Boutique mise à jour",
        description: "Les informations ont été sauvegardées avec succès",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Erreur sauvegarde boutique:", err);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les informations",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">{tokens.meta.icon} Informations boutique</Heading>
        <Text color="gray.600" fontSize="sm">
          {tokens.meta.displayName} • Gestion des informations business
        </Text>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Informations de base */}
            <Box>
              <Heading size="sm" mb={4} color={`${colorScheme}.600`}>
                📋 Informations générales
              </Heading>

              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Nom de la boutique</FormLabel>
                  <Input
                    value={formData.name || ""}
                    isReadOnly
                    bg="gray.50"
                    _hover={{ cursor: "not-allowed" }}
                    placeholder="Nom commercial de votre boutique"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Courte description de votre boutique (visible par les clients)"
                    rows={3}
                  />
                </FormControl>
              </Stack>
            </Box>

            {/* Contact et localisation */}
            <Box>
              <Heading size="sm" mb={4} color={`${colorScheme}.600`}>
                📍 Contact et localisation
              </Heading>

              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Adresse complète</FormLabel>
                  <Textarea
                    value={formData.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Numéro, rue, code postal, ville"
                    rows={2}
                  />
                </FormControl>

                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                  <FormControl>
                    <FormLabel>Téléphone</FormLabel>
                    <Input
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="01 23 45 67 89"
                      type="tel"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      value={formData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="contact@boutique.fr"
                      type="email"
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel>Site web</FormLabel>
                  <Input
                    value={formData.website || ""}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://www.votreboutique.fr"
                    type="url"
                  />
                </FormControl>
              </Stack>
            </Box>

            {/* Horaires d'ouverture */}
            <Box>
              <Flex align="center" justify="space-between" mb={4}>
                <Heading size="sm" color={`${colorScheme}.600`}>
                  🕒 Horaires d'ouverture
                </Heading>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme={colorScheme}
                  onClick={() => copyCommonHours("9h00 - 18h00")}
                >
                  Appliquer 9h-18h en semaine
                </Button>
              </Flex>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={3}
              >
                {daysOfWeek.map(({ key, label }) => (
                  <FormControl key={key}>
                    <FormLabel fontSize="sm">{label}</FormLabel>
                    <Input
                      size="sm"
                      value={
                        typeof formData.openingHours === "string"
                          ? (JSON.parse(formData.openingHours) as OpeningHours)[
                              key
                            ] || ""
                          : formData.openingHours?.[key] || ""
                      }
                      onChange={(e) => handleHoursChange(key, e.target.value)}
                      placeholder="9h00 - 18h00 ou Fermé"
                    />
                  </FormControl>
                ))}
              </Grid>

              <Text fontSize="xs" color="gray.500" mt={2}>
                💡 Exemples : "9h00 - 18h00", "14h00 - 19h00", "Fermé", "Sur
                RDV"
              </Text>
            </Box>

            {/* Actions */}
            <Flex gap={4} justify="end">
              <Button
                type="submit"
                colorScheme={colorScheme}
                isLoading={isLoading}
                loadingText="Sauvegarde..."
              >
                💾 Sauvegarder
              </Button>
            </Flex>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}
