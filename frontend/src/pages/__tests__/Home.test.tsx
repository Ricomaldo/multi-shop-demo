import { ChakraProvider } from "@chakra-ui/react";
import { act, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import Home from "../Home";

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ChakraProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </ChakraProvider>
);

describe("Home Page", () => {
  test("renders home page content", () => {
    act(() => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );
    });

    expect(
      screen.getByText(/DemoForge - Vitrine Multi-Boutiques/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Brasserie/i)).toBeInTheDocument();
    expect(screen.getByText(/Salon de Thé/i)).toBeInTheDocument();
  });

  test("renders shop navigation links", () => {
    act(() => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>
      );
    });

    // Utiliser getAllByText pour gérer les multiples éléments
    const vitrineLinks = screen.getAllByText(/Voir la vitrine/i);
    expect(vitrineLinks.length).toBeGreaterThan(0); // Au moins une boutique
    expect(screen.getByText(/Interface Administration/i)).toBeInTheDocument();
  });
});
