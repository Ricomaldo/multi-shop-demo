import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import AdminPreviewLayout from "../AdminPreviewLayout";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock react-icons
jest.mock("react-icons/fi", () => ({
  FiEye: () => "👁️",
  FiEyeOff: () => "🙈",
  FiMaximize2: () => "⛶",
  FiMinimize2: () => "⊟",
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe("AdminPreviewLayout", () => {
  const mockEditContent = <div data-testid="edit-content">Contenu édition</div>;
  const mockPreviewContent = (
    <div data-testid="preview-content">Contenu aperçu</div>
  );

  test("affiche le contenu d'édition et d'aperçu", () => {
    render(
      <AdminPreviewLayout
        editContent={mockEditContent}
        previewContent={mockPreviewContent}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByTestId("edit-content")).toBeInTheDocument();
    expect(screen.getByTestId("preview-content")).toBeInTheDocument();
  });

  test("affiche les titres par défaut", () => {
    render(
      <AdminPreviewLayout
        editContent={mockEditContent}
        previewContent={mockPreviewContent}
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("✏️ Édition")).toBeInTheDocument();
    expect(screen.getByText("👁️ Aperçu vitrine")).toBeInTheDocument();
  });

  test("affiche les titres personnalisés", () => {
    render(
      <AdminPreviewLayout
        editContent={mockEditContent}
        previewContent={mockPreviewContent}
        editTitle="Modifier produit"
        previewTitle="Aperçu temps réel"
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText("✏️ Modifier produit")).toBeInTheDocument();
    expect(screen.getByText("👁️ Aperçu temps réel")).toBeInTheDocument();
  });

  test("affiche une iframe quand previewUrl est fourni", () => {
    render(
      <AdminPreviewLayout
        editContent={mockEditContent}
        previewContent={mockPreviewContent}
        previewUrl="https://example.com"
      />,
      { wrapper: TestWrapper }
    );

    const iframe = screen.getByTitle("Aperçu vitrine");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://example.com");
  });

  test("gère le responsive mobile", () => {
    // Mock useBreakpointValue pour simuler mobile
    jest.mock("@chakra-ui/react", () => ({
      ...jest.requireActual("@chakra-ui/react"),
      useBreakpointValue: jest.fn(() => true), // mobile
    }));

    render(
      <AdminPreviewLayout
        editContent={mockEditContent}
        previewContent={mockPreviewContent}
      />,
      { wrapper: TestWrapper }
    );

    // Sur mobile, il devrait y avoir un bouton pour toggle l'aperçu
    expect(screen.getByText("Masquer")).toBeInTheDocument();
  });

  test("toggle l'aperçu sur mobile", () => {
    // Mock pour mobile
    const mockUseBreakpointValue = jest.fn(() => true);
    jest.doMock("@chakra-ui/react", () => ({
      ...jest.requireActual("@chakra-ui/react"),
      useBreakpointValue: mockUseBreakpointValue,
    }));

    render(
      <AdminPreviewLayout
        editContent={mockEditContent}
        previewContent={mockPreviewContent}
      />,
      { wrapper: TestWrapper }
    );

    const toggleButton = screen.getByText("Masquer");
    fireEvent.click(toggleButton);

    expect(screen.getByText("Aperçu")).toBeInTheDocument();
  });

  test("affiche le texte d'indication temps réel", () => {
    render(
      <AdminPreviewLayout
        editContent={mockEditContent}
        previewContent={mockPreviewContent}
      />,
      { wrapper: TestWrapper }
    );

    expect(
      screen.getByText("Modifications en temps réel →")
    ).toBeInTheDocument();
    expect(screen.getByText("Aperçu temps réel")).toBeInTheDocument();
  });

  test("gère les props optionnelles", () => {
    render(
      <AdminPreviewLayout
        editContent={mockEditContent}
        previewContent={mockPreviewContent}
        onPreviewUpdate={() => {}}
      />,
      { wrapper: TestWrapper }
    );

    // Le composant doit se rendre sans erreur même avec des props optionnelles
    expect(screen.getByTestId("edit-content")).toBeInTheDocument();
    expect(screen.getByTestId("preview-content")).toBeInTheDocument();
  });
});
