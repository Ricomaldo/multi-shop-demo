import {
  Box,
  Flex,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAdminShop } from "../../hooks";
import { getUniverseColorScheme } from "../../utils/universeMapping";

interface LoadingStateProps {
  /** Message de chargement contextuel */
  message: string;
  /** Taille du spinner */
  size?: "sm" | "md" | "lg" | "xl";
  /** Hauteur du conteneur */
  height?: string | number;
  /** Variante de style */
  variant?: "default" | "minimal" | "full";
}

export default function LoadingState({
  message,
  size = "lg",
  height = "400px",
  variant = "default",
}: LoadingStateProps) {
  const { universe, shop } = useAdminShop();

  // Thème couleur selon l'univers de la boutique sélectionnée
  const colorScheme = shop ? getUniverseColorScheme(universe) : "gray";

  // Styles conditionnels
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const spinnerColor = useColorModeValue(
    `${colorScheme}.500`,
    `${colorScheme}.300`
  );
  const pulseColor = useColorModeValue(
    `${colorScheme}.100`,
    `${colorScheme}.900`
  );

  if (variant === "minimal") {
    return (
      <Flex justify="center" align="center" p={4}>
        <VStack spacing={3}>
          <Spinner
            size={size}
            color={spinnerColor}
            thickness="3px"
            speed="0.8s"
          />
          <Text fontSize="sm" color={textColor} fontWeight="medium">
            {message}
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (variant === "full") {
    return (
      <Flex
        justify="center"
        align="center"
        h="100vh"
        bg={bgColor}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={9999}
      >
        <VStack spacing={6}>
          <Box position="relative">
            <Spinner
              size="xl"
              color={spinnerColor}
              thickness="4px"
              speed="0.8s"
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="20px"
              h="20px"
              bg={pulseColor}
              borderRadius="full"
              animation="pulse 2s infinite"
            />
          </Box>
          <Text fontSize="lg" color={textColor} fontWeight="semibold">
            {message}
          </Text>
        </VStack>
      </Flex>
    );
  }

  // Variant default
  return (
    <Flex justify="center" align="center" h={height}>
      <VStack spacing={4}>
        <Box position="relative">
          <Spinner
            size={size}
            color={spinnerColor}
            thickness="3px"
            speed="0.8s"
          />
          {/* Effet de pulsation subtile */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="8px"
            h="8px"
            bg={pulseColor}
            borderRadius="full"
            animation="pulse 1.5s infinite"
          />
        </Box>
        <Text
          fontSize="md"
          color={textColor}
          fontWeight="medium"
          textAlign="center"
        >
          {message}
        </Text>
        {/* Animation de points */}
        <Box
          w="60px"
          h="4px"
          bg={pulseColor}
          borderRadius="full"
          position="relative"
          overflow="hidden"
        >
          <Box
            w="20px"
            h="full"
            bg={spinnerColor}
            borderRadius="full"
            animation="loading-bar 1.2s ease-in-out infinite"
            css={{
              "@keyframes loading-bar": {
                "0%": { transform: "translateX(-20px)" },
                "50%": { transform: "translateX(60px)" },
                "100%": { transform: "translateX(-20px)" },
              },
            }}
          />
        </Box>
      </VStack>
    </Flex>
  );
}
