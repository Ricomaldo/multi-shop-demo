import { Badge, Grid, GridItem, Text } from "@chakra-ui/react";
import React from "react";
import type { Product } from "../../../../shared/types";
import type { UniverseType } from "../../contexts/UniverseContext";
import { getUniverseColorScheme } from "../../utils/universeMapping";

interface ProductAttributesProps {
  product: Product;
  shopType: UniverseType;
}

// Parser IBU pour enlever "IBU" si présent
const parseIBU = (value: string) => {
  if (!value) return value;
  return value.replace(/ ?IBU/gi, "").trim();
};

/**
 * Affiche les attributs spécialisés selon l'univers
 */
export const ProductAttributes: React.FC<ProductAttributesProps> = ({
  product,
  shopType,
}) => {
  const colorScheme = getUniverseColorScheme(shopType);
  const attributes = JSON.parse(product.attributes || "{}");

  const renderBreweryAttributes = () => (
    <>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Degré d'alcool
        </Text>
        <Badge colorScheme={colorScheme}>{attributes.degre_alcool}%</Badge>
      </GridItem>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Amertume (IBU)
        </Text>
        <Badge colorScheme={colorScheme}>
          {parseIBU(attributes.amertume_ibu)} IBU
        </Badge>
      </GridItem>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Type de houblon
        </Text>
        <Badge variant="outline">{attributes.type_houblon}</Badge>
      </GridItem>
    </>
  );

  const renderTeaShopAttributes = () => (
    <>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Origine
        </Text>
        <Badge colorScheme={colorScheme}>{attributes.origine_plantation}</Badge>
      </GridItem>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Grade
        </Text>
        <Badge colorScheme={colorScheme}>{attributes.grade_qualite}</Badge>
      </GridItem>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Temps d'infusion
        </Text>
        <Badge variant="outline">{attributes.temps_infusion} min</Badge>
      </GridItem>
    </>
  );

  const renderBeautyShopAttributes = () => (
    <>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Type de peau
        </Text>
        <Badge colorScheme={colorScheme}>{attributes.type_peau}</Badge>
      </GridItem>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Certification
        </Text>
        <Badge colorScheme={attributes.certification_bio ? "green" : "gray"}>
          {attributes.certification_bio ? "Bio" : "Conventionnel"}
        </Badge>
      </GridItem>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Format
        </Text>
        <Badge variant="outline">{attributes.format}</Badge>
      </GridItem>
    </>
  );

  const renderHerbShopAttributes = () => (
    <>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Usage traditionnel
        </Text>
        <Badge colorScheme={colorScheme}>{attributes.usage_traditionnel}</Badge>
      </GridItem>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Forme
        </Text>
        <Badge colorScheme={colorScheme}>{attributes.forme_galenique}</Badge>
      </GridItem>
      <GridItem>
        <Text fontSize="sm" color="gray.600">
          Culture
        </Text>
        <Badge variant="outline">
          {attributes.culture_bio ? "Bio" : "Conventionnelle"}
        </Badge>
      </GridItem>
    </>
  );

  const renderAttributes = () => {
    switch (shopType) {
      case "brewery":
        return renderBreweryAttributes();
      case "teaShop":
        return renderTeaShopAttributes();
      case "beautyShop":
        return renderBeautyShopAttributes();
      case "herbShop":
        return renderHerbShopAttributes();
      default:
        return null;
    }
  };

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
      }}
      gap={4}
      mt={2}
    >
      {renderAttributes()}
    </Grid>
  );
};
