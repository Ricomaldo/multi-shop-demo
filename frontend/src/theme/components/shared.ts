import {
  createMultiStyleConfigHelpers,
  defineStyleConfig,
} from "@chakra-ui/react";

// Variantes pour SharedProductCard
const productCardHelpers = createMultiStyleConfigHelpers([
  "card",
  "image",
  "content",
  "title",
  "price",
]);

export const SharedProductCard = productCardHelpers.defineMultiStyleConfig({
  baseStyle: {
    card: {
      display: "flex",
      flexDirection: "column",
      background: "white",
      transition: "all 0.3s ease-in-out",
    },
    image: {
      objectFit: "cover",
      transition: "transform 0.3s ease-in-out",
    },
    content: {
      padding: 4,
    },
    title: {
      fontSize: "lg",
      fontWeight: "bold",
    },
    price: {
      fontSize: "md",
      fontWeight: "semibold",
      color: "gray.600",
    },
  },
  variants: {
    brewery: {
      card: {
        borderRadius: "lg",
        boxShadow: "md",
        _hover: {
          transform: "translateY(-4px)",
          boxShadow: "lg",
        },
      },
      image: {
        borderTopRadius: "lg",
        _groupHover: { transform: "scale(1.05)" },
      },
      title: {
        color: "orange.700",
      },
    },
    tea: {
      card: {
        borderRadius: "sm",
        boxShadow: "sm",
        _hover: {
          boxShadow: "md",
          bg: "green.50",
        },
      },
      image: {
        borderRadius: "sm",
        _groupHover: { opacity: 0.9 },
      },
      title: {
        color: "green.700",
        fontFamily: "serif",
      },
    },
    beauty: {
      card: {
        borderRadius: "md",
        boxShadow: "none",
        border: "1px solid",
        borderColor: "pink.100",
        _hover: {
          borderColor: "pink.300",
          bg: "pink.50",
        },
      },
      image: {
        borderRadius: "full",
        _groupHover: { transform: "rotate(5deg)" },
      },
      title: {
        color: "pink.600",
        fontSize: "xl",
      },
    },
    herb: {
      card: {
        borderRadius: "none",
        boxShadow: "sm",
        _hover: {
          bg: "green.50",
          transform: "scale(1.02)",
        },
      },
      image: {
        _groupHover: { filter: "brightness(1.1)" },
      },
      title: {
        color: "green.800",
        fontFamily: "body",
      },
    },
  },
  defaultProps: {
    variant: "brewery", // Variant par défaut
  },
});

// Configuration des grilles de produits
export const ProductGrid = defineStyleConfig({
  baseStyle: {
    display: "grid",
    gap: 6,
    padding: 4,
  },
  variants: {
    brewery: {
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 8,
    },
    tea: {
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: 6,
    },
    beauty: {
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: 10,
    },
    herb: {
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 12,
    },
  },
  defaultProps: {
    variant: "brewery",
  },
});

// Animations d'entrée par univers
export const storeAnimations = {
  brewery: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", bounce: 0.4 },
  },
  tea: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  beauty: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  herb: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: "linear" },
  },
};
