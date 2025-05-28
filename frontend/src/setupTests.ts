// Configuration globale pour les tests
import "@testing-library/jest-dom";
import React from "react";

// Mock pour les modules CSS
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock pour IntersectionObserver
(
  globalThis as unknown as { IntersectionObserver: unknown }
).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock pour Emotion - Configuration complète
Object.defineProperty(window, "__emotion_real", {
  value: true,
  writable: true,
});

// Mock pour Emotion styled
jest.mock("@emotion/styled", () => ({
  __esModule: true,
  default: () => () => "div",
}));

// Mock pour Emotion React
jest.mock("@emotion/react", () => ({
  __esModule: true,
  jsx: () => null,
  css: () => ({}),
  Global: () => null,
  keyframes: () => "",
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock pour framer-motion global - Version complète
jest.mock("framer-motion", () => {
  const mockMotion = (
    Component: React.ComponentType<Record<string, unknown>>
  ) => {
    return ({
      children,
      ...props
    }: Record<string, unknown> & { children?: React.ReactNode }) =>
      React.createElement(Component, props, children);
  };

  // Ajouter les propriétés pour motion.div, motion.span, etc.
  mockMotion.div = ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement("div", props, children);
  mockMotion.span = ({ children, ...props }: React.ComponentProps<"span">) =>
    React.createElement("span", props, children);

  return {
    motion: mockMotion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});
