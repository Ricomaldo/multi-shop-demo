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

// Mock pour ResizeObserver
(
  globalThis as unknown as { ResizeObserver: unknown }
).ResizeObserver = class ResizeObserver {
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

// Mock complet pour Chakra UI - Évite les problèmes React 19
jest.mock("@chakra-ui/react", () => ({
  ChakraProvider: ({ children }: { children: React.ReactNode }) => children,
  Box: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-box" },
      children
    ),
  VStack: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-vstack" },
      children
    ),
  HStack: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-hstack" },
      children
    ),
  Text: ({ children, ...props }: React.ComponentProps<"p">) =>
    React.createElement(
      "p",
      { ...props, "data-testid": "chakra-text" },
      children
    ),
  Heading: ({ children, ...props }: React.ComponentProps<"h1">) =>
    React.createElement(
      "h1",
      {
        ...props,
        "data-testid": "chakra-heading",
        className: "chakra-heading",
      },
      children
    ),
  Button: ({ children, ...props }: React.ComponentProps<"button">) =>
    React.createElement(
      "button",
      { ...props, "data-testid": "chakra-button" },
      children
    ),
  Input: (props: React.ComponentProps<"input">) =>
    React.createElement("input", { ...props, "data-testid": "chakra-input" }),
  Select: ({ children, ...props }: React.ComponentProps<"select">) =>
    React.createElement(
      "select",
      { ...props, "data-testid": "chakra-select" },
      children
    ),
  Textarea: (props: React.ComponentProps<"textarea">) =>
    React.createElement("textarea", {
      ...props,
      "data-testid": "chakra-textarea",
    }),
  Badge: ({ children, ...props }: React.ComponentProps<"span">) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "chakra-badge" },
      children
    ),
  Card: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-card" },
      children
    ),
  CardBody: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-card-body" },
      children
    ),
  CardHeader: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-card-header" },
      children
    ),
  Spinner: (props: Record<string, unknown>) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-spinner" },
      "Loading..."
    ),
  Flex: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-flex" },
      children
    ),
  Collapse: ({
    children,
    in: isOpen,
    ...props
  }: React.ComponentProps<"div"> & { in?: boolean }) =>
    React.createElement(
      "div",
      {
        ...props,
        "data-testid": "chakra-collapse",
        style: { display: isOpen ? "block" : "none" },
      },
      children
    ),
  IconButton: ({ children, ...props }: React.ComponentProps<"button">) =>
    React.createElement(
      "button",
      { ...props, "data-testid": "chakra-icon-button" },
      children
    ),
  Alert: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-alert" },
      children
    ),
  AlertIcon: () =>
    React.createElement("span", { "data-testid": "chakra-alert-icon" }),
  AlertTitle: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-alert-title" },
      children
    ),
  AlertDescription: ({ children, ...props }: React.ComponentProps<"div">) =>
    React.createElement(
      "div",
      { ...props, "data-testid": "chakra-alert-description" },
      children
    ),
  useColorModeValue: () => "#000000",
  useTheme: () => ({}),
  useColorMode: () => ({ colorMode: "light", toggleColorMode: jest.fn() }),
  extendTheme: (config: Record<string, unknown>) => config,
  useDisclosure: (options?: { defaultIsOpen?: boolean }) => ({
    isOpen: options?.defaultIsOpen ?? false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
    onToggle: jest.fn(),
  }),
  useBreakpointValue: (values: Record<string, unknown>) => values.base,
}));

// Mock pour les icônes Chakra UI
jest.mock("@chakra-ui/icons", () => ({
  SearchIcon: (props: Record<string, unknown>) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "search-icon" },
      "🔍"
    ),
  AddIcon: (props: Record<string, unknown>) =>
    React.createElement("span", { ...props, "data-testid": "add-icon" }, "➕"),
  EditIcon: (props: Record<string, unknown>) =>
    React.createElement("span", { ...props, "data-testid": "edit-icon" }, "✏️"),
  DeleteIcon: (props: Record<string, unknown>) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "delete-icon" },
      "🗑️"
    ),
  ChevronDownIcon: (props: Record<string, unknown>) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "chevron-down-icon" },
      "⬇️"
    ),
  ChevronUpIcon: (props: Record<string, unknown>) =>
    React.createElement(
      "span",
      { ...props, "data-testid": "chevron-up-icon" },
      "⬆️"
    ),
}));

// Mock pour Emotion - Configuration complète pour React 19
Object.defineProperty(window, "__emotion_real", {
  value: true,
  writable: true,
});

// Mock pour React.__unsafe_useEmotionCache (compatibilité React 19)
Object.defineProperty(React, "__unsafe_useEmotionCache", {
  value: jest.fn(() => ({})),
  writable: true,
});

// Mock pour Emotion styled
jest.mock("@emotion/styled", () => ({
  __esModule: true,
  default: () => () => "div",
}));

// Mock pour Emotion React avec support React 19
jest.mock("@emotion/react", () => ({
  __esModule: true,
  jsx: () => null,
  css: () => ({}),
  Global: () => null,
  keyframes: () => "",
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({}),
  withTheme: (Component: React.ComponentType) => Component,
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

// Mock pour les variables d'environnement via globalThis
Object.defineProperty(globalThis, "process", {
  value: {
    env: {
      NODE_ENV: "test",
      VITE_API_URL: "http://localhost:3001/api",
    },
  },
  writable: true,
});

// Mock pour import.meta.env (Vite)
Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_API_URL: "http://localhost:3001/api",
        NODE_ENV: "test",
      },
    },
  },
  writable: true,
});

// Assurer que process est disponible globalement
if (
  typeof (globalThis as unknown as { process?: unknown }).process ===
  "undefined"
) {
  (
    globalThis as unknown as { process: { env: Record<string, string> } }
  ).process = {
    env: {
      NODE_ENV: "test",
      VITE_API_URL: "http://localhost:3001/api",
    },
  };
}
