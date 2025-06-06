import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ command, mode }) => {
  const isProd = mode === "production";

  const config = {
    plugins: [react()],
    base: "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },

    // 🚀 OPTIMISATIONS CRITIQUES POUR PERFORMANCE
    build: {
      // Minification agressive avec Terser
      minify: "terser" as const,
      terserOptions: {
        compress: {
          drop_console: isProd, // Supprimer console.log en prod
          drop_debugger: isProd, // Supprimer debugger en prod
          pure_funcs: isProd ? ["console.log", "console.info"] : [],
        },
      },

      // Code splitting intelligent pour réduire le bundle principal
      rollupOptions: {
        output: {
          // Séparer les vendors lourds en chunks séparés
          manualChunks: {
            // React ecosystem (foundational)
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            // UI Library (très lourd - 200KB+)
            "ui-vendor": [
              "@chakra-ui/react",
              "@emotion/react",
              "@emotion/styled",
            ],
            // Utils et data fetching
            "utils-vendor": ["axios", "@tanstack/react-query"],
            // Icons (très lourd - 100KB+)
            "icons-vendor": ["@chakra-ui/icons", "react-icons"],
            // Animation (lourd - 50KB+)
            "animation-vendor": ["framer-motion"],
          },
          // Noms de fichiers avec hash pour cache busting
          chunkFileNames: "assets/[name].[hash].js",
          entryFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",
        },
      },

      // Optimisations build
      target: "esnext", // Syntaxe moderne pour moins de polyfills
      cssCodeSplit: true, // CSS splitting pour charger seulement le nécessaire
      sourcemap: false, // Pas de sourcemap en prod (gain de taille)

      // Limite de taille des chunks avec warning
      chunkSizeWarningLimit: 1000,

      // Optimisation des assets
      assetsInlineLimit: 4096, // Inline les petits assets en base64
    },

    // ⚡ OPTIMISATIONS DÉVELOPPEMENT
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@chakra-ui/react",
        "@emotion/react",
        "@emotion/styled",
        "framer-motion",
      ],
    },
  };

  if (command !== "serve") {
    config.base = "/demoforge/";
  }

  return config;
});
