import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  IconButton,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FiEye, FiEyeOff, FiMaximize2, FiMinimize2 } from "react-icons/fi";

interface AdminPreviewLayoutProps {
  /** Contenu du formulaire d'édition (côté gauche) */
  editContent: ReactNode;
  /** Contenu de l'aperçu (côté droit) */
  previewContent: ReactNode;
  /** URL optionnelle pour iframe (alternative à previewContent) */
  previewUrl?: string;
  /** Titre de la section d'édition */
  editTitle?: string;
  /** Titre de la section d'aperçu */
  previewTitle?: string;
  /** Callback appelé lors des changements pour highlight */
  onPreviewUpdate?: () => void;
}

const MotionBox = motion.create(Box);

/**
 * Layout split view pour l'admin avec aperçu temps réel
 * Desktop: Split 50/50 horizontal (édition | aperçu)
 * Mobile: Édition + section aperçu collapsible en dessous
 */
export default function AdminPreviewLayout({
  editContent,
  previewContent,
  previewUrl,
  editTitle = "Édition",
  previewTitle = "Aperçu vitrine",
}: AdminPreviewLayoutProps) {
  const { isOpen: isPreviewOpen, onToggle: togglePreview } = useDisclosure({
    defaultIsOpen: true,
  });
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Animation variants pour les highlights
  const highlightVariants = {
    initial: { scale: 1, boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)" },
    highlight: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    normal: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  if (isMobile) {
    return (
      <VStack spacing={4} align="stretch" h="100vh" overflow="hidden">
        {/* Section d'édition mobile */}
        <Box
          flex={isPreviewOpen ? "0 0 auto" : "1"}
          overflow="auto"
          bg="white"
          borderRadius="md"
          shadow="sm"
          transition="all 0.3s ease"
        >
          <Box p={4} borderBottom="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center">
              <Heading size="md" color="gray.700">
                {editTitle}
              </Heading>
              <Button
                leftIcon={isPreviewOpen ? <FiEyeOff /> : <FiEye />}
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={togglePreview}
              >
                {isPreviewOpen ? "Masquer" : "Aperçu"}
              </Button>
            </Flex>
          </Box>
          <Box p={4}>{editContent}</Box>
        </Box>

        {/* Section d'aperçu mobile (collapsible) */}
        <Collapse in={isPreviewOpen} animateOpacity>
          <MotionBox
            variants={highlightVariants}
            initial="initial"
            animate="normal"
            flex="1"
            overflow="hidden"
            bg="gray.50"
            borderRadius="md"
            shadow="md"
            border="2px"
            borderColor="blue.200"
          >
            <Box p={3} bg="blue.50" borderTopRadius="md">
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="medium" color="blue.700">
                  📱 {previewTitle}
                </Text>
                <IconButton
                  aria-label="Fermer aperçu"
                  icon={<FiMinimize2 />}
                  size="xs"
                  variant="ghost"
                  onClick={togglePreview}
                />
              </Flex>
            </Box>
            <Box h="400px" overflow="auto" bg="white">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="Aperçu vitrine"
                />
              ) : (
                <Box p={4}>{previewContent}</Box>
              )}
            </Box>
          </MotionBox>
        </Collapse>
      </VStack>
    );
  }

  // Layout desktop - Split 50/50
  return (
    <Flex h="100vh" overflow="hidden" gap={4}>
      {/* Section d'édition (gauche) */}
      <Box
        flex="1"
        overflow="auto"
        bg="white"
        borderRadius="md"
        shadow="sm"
        border="1px"
        borderColor="gray.200"
      >
        <Box p={4} borderBottom="1px" borderColor="gray.200" bg="gray.50">
          <Flex justify="space-between" align="center">
            <Heading size="md" color="gray.700">
              ✏️ {editTitle}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Modifications en temps réel →
            </Text>
          </Flex>
        </Box>
        <Box p={6}>{editContent}</Box>
      </Box>

      {/* Section d'aperçu (droite) */}
      <MotionBox
        variants={highlightVariants}
        initial="initial"
        animate="normal"
        flex="1"
        overflow="hidden"
        bg="gray.50"
        borderRadius="md"
        shadow="lg"
        border="2px"
        borderColor="blue.200"
      >
        <Box p={4} bg="blue.50" borderTopRadius="md">
          <Flex justify="space-between" align="center">
            <Heading size="sm" color="blue.700">
              👁️ {previewTitle}
            </Heading>
            <Flex gap={2}>
              <Text fontSize="xs" color="blue.600" fontWeight="medium">
                Aperçu temps réel
              </Text>
              <IconButton
                aria-label="Plein écran"
                icon={<FiMaximize2 />}
                size="xs"
                variant="ghost"
                colorScheme="blue"
              />
            </Flex>
          </Flex>
        </Box>
        <Box h="calc(100% - 60px)" overflow="auto" bg="white">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Aperçu vitrine"
            />
          ) : (
            <Box p={4}>{previewContent}</Box>
          )}
        </Box>
      </MotionBox>
    </Flex>
  );
}
