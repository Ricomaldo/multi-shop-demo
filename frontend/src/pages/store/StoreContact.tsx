import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Shop } from "../../../../shared/types";
import StoreHeader from "../../components/store/StoreHeader";
import StoreLayout from "../../components/store/StoreLayout";
import { useShopByType, useShopData } from "../../hooks";

export default function StoreContact() {
  const navigate = useNavigate();
  const { shop: initialShop, loading: shopLoading } =
    useShopByType("beautyShop");
  const { shops, refreshData } = useShopData();

  // État local pour la boutique courante
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Initialiser la boutique courante
  useEffect(() => {
    if (!shopLoading && initialShop) {
      setCurrentShop(initialShop);
    } else if (!shopLoading && !initialShop) {
      navigate("/404");
    }
  }, [shopLoading, initialShop, navigate]);

  // Si chargement ou pas de boutique
  if (shopLoading || !currentShop) {
    return <Box>Chargement...</Box>;
  }

  // Handler pour changement de boutique
  const handleShopChange = async (newShop: Shop) => {
    setCurrentShop(newShop);
    await refreshData();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du formulaire
    console.log("Message envoyé:", formData);
    // Réinitialiser le formulaire
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <StoreLayout shop={currentShop}>
      {/* VARIANT FULL - Navigation + section gradient */}
      <StoreHeader
        shop={currentShop}
        title="Nous Contacter"
        subtitle="Une question ? Un conseil personnalisé ? Notre équipe est à votre écoute"
        availableShops={shops}
        onShopChange={handleShopChange}
        variant="full"
      />

      <Container maxW="1400px" py={12}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={12}>
          {/* Informations de contact */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              <Box>
                <Heading size="lg" mb={6} color="pink.600">
                  Informations Pratiques
                </Heading>

                <VStack spacing={6} align="stretch">
                  <HStack spacing={4}>
                    <Icon as={FaMapMarkerAlt} boxSize={5} color="pink.500" />
                    <Box>
                      <Text fontWeight="medium">Adresse</Text>
                      <Text color="gray.600">{currentShop.address}</Text>
                    </Box>
                  </HStack>

                  <HStack spacing={4}>
                    <Icon as={FaPhone} boxSize={5} color="pink.500" />
                    <Box>
                      <Text fontWeight="medium">Téléphone</Text>
                      <Text color="gray.600">
                        {currentShop.phone || "01 23 45 67 89"}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack spacing={4}>
                    <Icon as={FaEnvelope} boxSize={5} color="pink.500" />
                    <Box>
                      <Text fontWeight="medium">Email</Text>
                      <Text color="gray.600">
                        {currentShop.email || "contact@beautyshop.fr"}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack spacing={4} align="flex-start">
                    <Icon as={FaClock} boxSize={5} color="pink.500" mt={1} />
                    <Box>
                      <Text fontWeight="medium">Horaires d'ouverture</Text>
                      <VStack spacing={1} align="flex-start" mt={2}>
                        <Text fontSize="sm" color="gray.600">
                          Lundi - Vendredi : 9h00 - 19h00
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Samedi : 9h00 - 18h00
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Dimanche : Fermé
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              </Box>

              {/* Carte ou image de la boutique */}
              <Box>
                <Heading size="md" mb={4} color="pink.600">
                  Nous Trouver
                </Heading>
                <Box
                  h="300px"
                  bg="gray.100"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text color="gray.500">Carte de la boutique</Text>
                </Box>
              </Box>
            </VStack>
          </GridItem>

          {/* Formulaire de contact */}
          <GridItem>
            <Box>
              <Heading size="lg" mb={6} color="pink.600">
                Envoyez-nous un Message
              </Heading>

              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <Flex gap={4} w="full">
                    <FormControl>
                      <FormLabel>Nom</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        required
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                        required
                      />
                    </FormControl>
                  </Flex>

                  <FormControl>
                    <FormLabel>Sujet</FormLabel>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Objet de votre message"
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Votre message..."
                      rows={6}
                      required
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="pink"
                    size="lg"
                    w="full"
                    py={6}
                  >
                    Envoyer le Message
                  </Button>
                </VStack>
              </form>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </StoreLayout>
  );
}
