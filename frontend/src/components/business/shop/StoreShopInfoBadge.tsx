import { useOpeningStatus } from "@/hooks/useOpeningStatus";
import { getUniverseTokens, type ShopType } from "@/theme/universeTokens";
import type { Shop } from "@/types/index";
import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FiClock, FiGlobe, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

interface StoreShopInfoBadgeProps {
  shop: Shop;
  variant?: "compact" | "full" | "minimal";
  showDetailsButton?: boolean;
  showOpeningStatus?: boolean;
}

/**
 * 🎯 StoreShopInfoBadge - Badge d'informations boutique simplifié et élégant
 * ✅ Focus sur le statut ouvert/fermé dynamique
 * ✅ Design premium avec différenciation par shopType DIRECT
 * ✅ UX/UI de qualité supérieure
 */

export default function StoreShopInfoBadge({
  shop,
  variant = "compact",
  showDetailsButton = true,
  showOpeningStatus = true,
}: StoreShopInfoBadgeProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 🎯 APPLICATION DIRECTE shopType → tokens (plus de mapping !)
  const tokens = getUniverseTokens(shop.shopType);
  const { isOpen: shopIsOpen, nextOpeningTime } = useOpeningStatus(
    shop.openingHours
  );

  const getUniverseLabel = (shopType: string) => {
    const tokens = getUniverseTokens(shopType as ShopType);
    return `${tokens.meta.icon} ${tokens.meta.displayName}`;
  };

  // Version minimaliste - juste le statut
  if (variant === "minimal") {
    return (
      <HStack spacing={3}>
        <Badge
          colorScheme={shopIsOpen ? "green" : "red"}
          borderRadius="full"
          fontSize="sm"
          px={4}
          py={2}
          fontWeight="bold"
          display="flex"
          alignItems="center"
          gap={2}
          transition="all 0.3s ease"
          _hover={{
            transform: tokens.animations.enableOnMobile
              ? "none"
              : "scale(1.05)",
          }}
        >
          <Box
            w="8px"
            h="8px"
            borderRadius="full"
            bg={shopIsOpen ? "green.400" : "red.400"}
            animation={shopIsOpen ? "pulse 2s infinite" : "none"}
          />
          {shopIsOpen ? "Ouvert" : "Fermé"}
        </Badge>
      </HStack>
    );
  }

  // Version compacte - statut + prochaine ouverture
  if (variant === "compact") {
    return (
      <Box
        bg={`linear-gradient(135deg, ${tokens.colors[50]} 0%, white 100%)`}
        borderWidth="1px"
        borderColor={tokens.colors[200]}
        borderRadius={tokens.borderRadius.lg}
        p={4}
        shadow="sm"
        transition="all 0.3s ease"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          height: "100%",
          bg: shopIsOpen ? "green.400" : "red.400",
          transition: "all 0.3s ease",
        }}
        _hover={{
          shadow: "md",
          transform: tokens.animations.enableOnMobile
            ? "none"
            : "translateY(-2px)",
          borderColor: tokens.colors[300],
        }}
      >
        <VStack spacing={3} align="stretch">
          {/* Statut principal */}
          <HStack justify="space-between" align="center">
            <Badge
              colorScheme={tokens.meta.colorScheme}
              borderRadius={tokens.borderRadius.base}
              px={3}
              py={1}
              fontSize="sm"
              fontFamily={tokens.typography.fontFamily.body}
              fontWeight={tokens.typography.fontWeight.bold}
            >
              {getUniverseLabel(shop.shopType)}
            </Badge>

            <Badge
              colorScheme={shopIsOpen ? "green" : "red"}
              borderRadius="full"
              fontSize="sm"
              px={4}
              py={2}
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={2}
              boxShadow="sm"
            >
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={shopIsOpen ? "green.400" : "red.400"}
                animation={shopIsOpen ? "pulse 2s infinite" : "none"}
              />
              {shopIsOpen ? "Ouvert" : "Fermé"}
            </Badge>
          </HStack>

          {/* Nom de la boutique */}
          <Text
            fontSize={tokens.typography.fontSize.navigation}
            fontWeight={tokens.typography.fontWeight.bold}
            fontFamily={tokens.typography.fontFamily.heading}
            color={tokens.colors[800]}
            lineHeight="1.2"
          >
            {shop.name}
          </Text>

          {/* Prochaine ouverture si fermé */}
          {!shopIsOpen && nextOpeningTime && (
            <HStack spacing={2} align="center">
              <Icon as={FiClock} color={tokens.colors[600]} boxSize="4" />
              <Text
                fontSize="sm"
                color={tokens.colors[600]}
                fontFamily={tokens.typography.fontFamily.body}
                fontStyle="italic"
              >
                Ouvre {nextOpeningTime}
              </Text>
            </HStack>
          )}

          {/* Bouton détails si activé */}
          {showDetailsButton && (
            <Badge
              as="button"
              onClick={onOpen}
              colorScheme={tokens.meta.colorScheme}
              variant="outline"
              px={3}
              py={2}
              fontSize="xs"
              cursor="pointer"
              transition={tokens.animations.transition}
              _hover={{
                bg: `${tokens.meta.colorScheme}.50`,
                transform: tokens.animations.enableOnMobile
                  ? "none"
                  : "scale(1.02)",
              }}
            >
              Voir détails →
            </Badge>
          )}
        </VStack>
      </Box>
    );
  }

  // Version complète avec toutes les infos
  return (
    <>
      <Box
        bg={`linear-gradient(135deg, ${tokens.colors[50]} 0%, ${tokens.colors[100]} 50%, white 100%)`}
        borderWidth="2px"
        borderColor={tokens.colors[200]}
        borderRadius={tokens.borderRadius.xl}
        p={6}
        shadow="lg"
        transition="all 0.4s ease"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          bg: `linear-gradient(90deg, ${tokens.colors[400]}, ${tokens.colors[600]}, ${tokens.colors[400]})`,
        }}
        _hover={{
          shadow: "xl",
          transform: tokens.animations.enableOnMobile
            ? "none"
            : "translateY(-4px)",
          borderColor: tokens.colors[400],
        }}
      >
        <VStack spacing={4} align="stretch">
          {/* En-tête avec icône et statut */}
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Text fontSize="2xl">{tokens.meta.icon}</Text>
              <VStack align="start" spacing={1}>
                <Text
                  fontSize="lg"
                  fontWeight={tokens.typography.fontWeight.bold}
                  fontFamily={tokens.typography.fontFamily.heading}
                  color={tokens.colors[800]}
                >
                  {shop.name}
                </Text>
                <Text
                  fontSize="sm"
                  color={tokens.colors[600]}
                  fontFamily={tokens.typography.fontFamily.body}
                >
                  {tokens.meta.description}
                </Text>
              </VStack>
            </HStack>

            <Badge
              colorScheme={shopIsOpen ? "green" : "red"}
              borderRadius="full"
              fontSize="md"
              px={4}
              py={2}
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={2}
              boxShadow="md"
            >
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg={shopIsOpen ? "green.400" : "red.400"}
                animation={shopIsOpen ? "pulse 2s infinite" : "none"}
              />
              {shopIsOpen ? "Ouvert" : "Fermé"}
            </Badge>
          </HStack>

          {/* Informations de contact compactes */}
          <VStack spacing={3} align="stretch">
            {shop.address && (
              <HStack spacing={3} align="center">
                <Icon as={FiMapPin} color={tokens.colors[600]} boxSize="5" />
                <Text
                  fontSize="sm"
                  color={tokens.colors[700]}
                  fontFamily={tokens.typography.fontFamily.body}
                >
                  {shop.address}
                </Text>
              </HStack>
            )}

            {!shopIsOpen && nextOpeningTime && (
              <HStack spacing={3} align="center">
                <Icon as={FiClock} color={tokens.colors[600]} boxSize="5" />
                <Text
                  fontSize="sm"
                  color={tokens.colors[600]}
                  fontFamily={tokens.typography.fontFamily.body}
                  fontStyle="italic"
                >
                  Prochaine ouverture : {nextOpeningTime}
                </Text>
              </HStack>
            )}
          </VStack>

          {/* Bouton d'action */}
          {showDetailsButton && (
            <Button
              onClick={onOpen}
              size="sm"
              colorScheme={tokens.meta.colorScheme}
              variant="outline"
              alignSelf="flex-start"
              transition={tokens.animations.transition}
              _hover={{
                transform: tokens.animations.enableOnMobile
                  ? "none"
                  : "scale(1.05)",
              }}
            >
              Informations complètes
            </Button>
          )}
        </VStack>
      </Box>

      {/* Modal détails */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg={`linear-gradient(135deg, ${tokens.colors[100]}, ${tokens.colors[50]})`}
            color={tokens.colors[800]}
            fontFamily={tokens.typography.fontFamily.heading}
          >
            <HStack spacing={3}>
              <Text fontSize="2xl">{tokens.meta.icon}</Text>
              <Text>{shop.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2} color={tokens.colors[700]}>
                  Type de boutique
                </Text>
                <Text color={tokens.colors[600]}>
                  {tokens.meta.description}
                </Text>
              </Box>

              {shop.address && (
                <Box>
                  <Text fontWeight="bold" mb={2} color={tokens.colors[700]}>
                    <Icon as={FiMapPin} mr={2} />
                    Adresse
                  </Text>
                  <Text color={tokens.colors[600]}>{shop.address}</Text>
                </Box>
              )}

              {shop.phone && (
                <Box>
                  <Text fontWeight="bold" mb={2} color={tokens.colors[700]}>
                    <Icon as={FiPhone} mr={2} />
                    Téléphone
                  </Text>
                  <Text color={tokens.colors[600]}>{shop.phone}</Text>
                </Box>
              )}

              {shop.email && (
                <Box>
                  <Text fontWeight="bold" mb={2} color={tokens.colors[700]}>
                    <Icon as={FiMail} mr={2} />
                    Email
                  </Text>
                  <Text color={tokens.colors[600]}>{shop.email}</Text>
                </Box>
              )}

              {shop.website && (
                <Box>
                  <Text fontWeight="bold" mb={2} color={tokens.colors[700]}>
                    <Icon as={FiGlobe} mr={2} />
                    Site web
                  </Text>
                  <Text color={tokens.colors[600]}>{shop.website}</Text>
                </Box>
              )}

              {showOpeningStatus && (
                <Box>
                  <Text fontWeight="bold" mb={2} color={tokens.colors[700]}>
                    <Icon as={FiClock} mr={2} />
                    Statut actuel
                  </Text>
                  <HStack>
                    <Badge
                      colorScheme={shopIsOpen ? "green" : "red"}
                      fontSize="sm"
                      px={3}
                      py={1}
                    >
                      {shopIsOpen ? "Ouvert" : "Fermé"}
                    </Badge>
                    {!shopIsOpen && nextOpeningTime && (
                      <Text fontSize="sm" color="gray.500">
                        (Ouvre {nextOpeningTime})
                      </Text>
                    )}
                  </HStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
