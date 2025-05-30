import { extendTheme } from "@chakra-ui/react";
import { ProductGrid, SharedProductCard } from "./components/shared";
import { universeColors } from "./universeColors";

const theme = extendTheme({
  colors: {
    // Couleurs par défaut Chakra préservées
    ...universeColors,
  },
  components: {
    SharedProductCard,
    ProductGrid,
  },
});

export default theme;
