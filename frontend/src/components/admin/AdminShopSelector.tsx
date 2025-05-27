import {
  Box,
  Button,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useAdminShop } from "../../contexts/AdminShopContext";

const AdminShopSelector: React.FC = () => {
  const { selectedShop, setSelectedShop, shops, loading } = useAdminShop();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (loading) {
    return (
      <Box
        p={4}
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
      >
        <Text>Chargement des boutiques...</Text>
      </Box>
    );
  }

  const getShopIcon = (shopType: string) => {
    switch (shopType) {
      case "brewery":
        return "🍺";
      case "tea-shop":
        return "🍵";
      case "beauty-shop":
        return "💄";
      case "herb-shop":
        return "🌿";
      default:
        return "🏪";
    }
  };

  const getShopColor = (shopType: string) => {
    switch (shopType) {
      case "brewery":
        return "orange";
      case "tea-shop":
        return "green";
      case "beauty-shop":
        return "pink";
      case "herb-shop":
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
    >
      <VStack spacing={4} align="stretch">
        <Text fontWeight="semibold" fontSize="sm" color="gray.600">
          Sélectionner une boutique :
        </Text>

        <VStack spacing={2} align="stretch">
          {shops.map((shop) => {
            const isSelected = selectedShop?.id === shop.id;
            const colorScheme = getShopColor(shop.shopType);

            return (
              <Button
                key={shop.id}
                variant={isSelected ? "solid" : "outline"}
                colorScheme={colorScheme}
                onClick={() => setSelectedShop(shop)}
                justifyContent="flex-start"
                size="md"
                leftIcon={
                  <Text fontSize="lg">{getShopIcon(shop.shopType)}</Text>
                }
              >
                <VStack spacing={0} align="start" flex="1">
                  <Text fontWeight="medium" fontSize="sm">
                    {shop.name}
                  </Text>
                  <Text fontSize="xs" opacity={0.8}>
                    {shop.shopType.replace("-", " ")}
                  </Text>
                </VStack>
              </Button>
            );
          })}
        </VStack>

        {selectedShop && (
          <Box
            p={3}
            bg={`${getShopColor(selectedShop.shopType)}.50`}
            borderRadius="md"
          >
            <HStack spacing={2}>
              <Text fontSize="lg">{getShopIcon(selectedShop.shopType)}</Text>
              <VStack spacing={0} align="start" flex="1">
                <Text fontWeight="medium" fontSize="sm">
                  Boutique active : {selectedShop.name}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {selectedShop.categories?.length || 0} catégorie(s)
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default AdminShopSelector;
