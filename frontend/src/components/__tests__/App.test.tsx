import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";

// Wrapper pour les providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </ChakraProvider>
);

describe("App Component", () => {
  test("renders without crashing", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Vérifier que l'application se charge
    expect(document.body).toBeInTheDocument();
  });

  test("renders home page by default", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Vérifier que la page d'accueil s'affiche
    expect(screen.getByText(/DemoForge/i)).toBeInTheDocument();
  });
});
