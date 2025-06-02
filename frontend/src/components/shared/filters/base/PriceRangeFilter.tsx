import {
  Box,
  HStack,
  NumberInput,
  NumberInputField,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
} from "@chakra-ui/react";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
  mode?: "admin" | "store";
  themeColor: string;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onChange,
  mode = "store",
  themeColor,
}) => {
  return mode === "store" ? (
    <Box>
      <Text fontSize="sm" mb={3} fontWeight="medium">
        Prix : {minPrice}€ - {maxPrice}€
      </Text>
      <RangeSlider
        min={3}
        max={15}
        step={0.1}
        value={[minPrice, maxPrice]}
        onChange={(values) => onChange(values[0], values[1])}
        colorScheme={themeColor}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
    </Box>
  ) : (
    <HStack spacing={2}>
      <Text fontSize="sm" color="gray.600">
        Prix :
      </Text>
      <NumberInput
        size="sm"
        maxW="80px"
        min={0}
        value={minPrice}
        onChange={(_, value) => onChange(value || 0, maxPrice)}
      >
        <NumberInputField placeholder="Min" />
      </NumberInput>
      <Text fontSize="sm" color="gray.600">
        -
      </Text>
      <NumberInput
        size="sm"
        maxW="80px"
        min={0}
        value={maxPrice}
        onChange={(_, value) => onChange(minPrice, value || 0)}
      >
        <NumberInputField placeholder="Max" />
      </NumberInput>
      <Text fontSize="sm" color="gray.600">
        €
      </Text>
    </HStack>
  );
};
