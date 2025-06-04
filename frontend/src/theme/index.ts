import { extendTheme } from "@chakra-ui/react";
import { ProductGrid, SharedProductPreviewCard } from "./components/shared";
import { universeColors } from "./universeColors";

const theme = extendTheme({
  colors: {
    // Couleurs par défaut Chakra préservées
    ...universeColors,
  },
  components: {
    SharedProductPreviewCard,
    ProductGrid,
  },
});

export default theme;
