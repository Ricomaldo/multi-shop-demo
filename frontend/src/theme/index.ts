import { extendTheme } from "@chakra-ui/react";
import { universeColors } from "./universeColors";

const theme = extendTheme({
  colors: {
    // Couleurs par défaut Chakra préservées
    ...universeColors,
  },
});

export default theme;
