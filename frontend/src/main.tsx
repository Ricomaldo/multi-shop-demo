import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UniverseProvider } from "./contexts/UniverseContext";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <UniverseProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UniverseProvider>
    </ChakraProvider>
  </React.StrictMode>
);
