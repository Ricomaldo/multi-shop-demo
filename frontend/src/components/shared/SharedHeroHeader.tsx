import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

interface SharedHeroHeaderProps {
  title: string;
  subtitle: string;
  imagePath: string;
  imageAlt: string;
  height?: string;
}

export const SharedHeroHeader: React.FC<SharedHeroHeaderProps> = ({
  title,
  subtitle,
  imagePath,
  height = "50vh",
}) => {
  return (
    <Box
      as="header"
      position="relative"
      height={height}
      backgroundImage={`url(${imagePath})`}
      backgroundSize="cover"
      backgroundPosition="center"
      mb={8}
    >
      {/* Overlay sombre */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
      />

      {/* Contenu */}
      <Container maxW="7xl" height="100%" position="relative" zIndex={1}>
        <VStack
          height="100%"
          justify="center"
          align="center"
          spacing={4}
          textAlign="center"
          color="white"
        >
          <Heading
            as="h1"
            size="2xl"
            fontWeight="bold"
            textShadow="2px 2px 4px rgba(0,0,0,0.4)"
          >
            {title}
          </Heading>
          <Text
            fontSize="xl"
            maxW="2xl"
            textShadow="1px 1px 2px rgba(0,0,0,0.4)"
          >
            {subtitle}
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};
