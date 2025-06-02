import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OpeningBadge from "../../components/shared/OpeningBadge";
import StoreHeroHeader from "../../components/store/StoreHeroHeader";
import StoreLayout from "../../components/store/StoreLayout";
import { useShopData } from "../../hooks";
import { getUniverseColorScheme } from "../../utils/universeMapping";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function StoreContact() {
  const { shops, loading, error } = useShopData();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Déterminer l'univers d'origine à partir de l'URL
  const originUniverse = useMemo(() => {
    const path = location.pathname.split("/");
    return path[path.length - 2] || "brewery";
  }, [location]);

  // Trouver la boutique correspondante
  const currentShop = useMemo(() => {
    return shops.find((shop) => shop.shopType === originUniverse) || shops[0];
  }, [shops, originUniverse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Envoi du formulaire:", formData);
    // TODO: Implémenter l'envoi du formulaire
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Retour à la boutique d'origine
  const handleBack = () => {
    navigate(`/store/${originUniverse}`);
  };

  if (loading)
    return (
      <Box p={8}>
        <Text>Chargement...</Text>
      </Box>
    );
  if (error)
    return (
      <Box p={8}>
        <Text color="red.500">Erreur: {error}</Text>
      </Box>
    );
  if (!currentShop)
    return (
      <Box p={8}>
        <Text>Aucune boutique disponible</Text>
      </Box>
    );

  return (
    <StoreLayout shop={currentShop}>
      {/* Bouton retour */}
      <Box position="absolute" top={4} left={4} zIndex={10}>
        <IconButton
          aria-label="Retour à la boutique"
          icon={<ArrowBackIcon />}
          onClick={handleBack}
          colorScheme={getUniverseColorScheme(currentShop.shopType)}
          variant="ghost"
          size="lg"
        />
      </Box>

      {/* Hero Header */}
      <StoreHeroHeader
        shop={currentShop}
        title="Contactez-nous"
        subtitle="Une question ? Un conseil ? Nous sommes là pour vous répondre"
        availableShops={shops}
      />

      {/* Formulaire de contact */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={8}
        borderRadius="xl"
        shadow="md"
        maxW="800px"
        mx="auto"
        w="full"
      >
        <VStack spacing={6}>
          {/* Nom */}
          <FormControl isRequired>
            <FormLabel>Nom</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom"
            />
          </FormControl>

          {/* Email */}
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
            />
          </FormControl>

          {/* Sujet */}
          <FormControl isRequired>
            <FormLabel>Sujet</FormLabel>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Sujet de votre message"
            />
          </FormControl>

          {/* Message */}
          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Input
              as="textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Votre message..."
              minH="200px"
            />
          </FormControl>

          {/* Bouton d'envoi */}
          <Button
            type="submit"
            colorScheme={getUniverseColorScheme(currentShop.shopType)}
            size="lg"
            w="full"
          >
            Envoyer le message
          </Button>
        </VStack>
      </Box>

      {/* Informations de contact */}
      <VStack
        spacing={4}
        bg="gray.50"
        p={8}
        borderRadius="xl"
        maxW="800px"
        mx="auto"
        w="full"
        mt={8}
      >
        <Text fontSize="lg" fontWeight="medium">
          Nos coordonnées
        </Text>

        <VStack spacing={2} align="start" w="full">
          <Text>
            <HStack>
              <Text>📍</Text>
              <Text>{currentShop.address}</Text>
            </HStack>
          </Text>
          <Text>
            <HStack>
              <Text>📞</Text>
              <Text>{currentShop.phone}</Text>
            </HStack>
          </Text>
          <Text>
            <HStack>
              <Text>✉️</Text>
              <Text>{currentShop.email}</Text>
            </HStack>
          </Text>
          <Text>
            <HStack>
              <Text>🌐</Text>
              <Text>{currentShop.website}</Text>
            </HStack>
          </Text>
          <Text>
            <HStack>
              <Text>🕒</Text>
              <OpeningBadge openingHours={currentShop.openingHours} size="md" />
            </HStack>
          </Text>
        </VStack>
      </VStack>
    </StoreLayout>
  );
}
