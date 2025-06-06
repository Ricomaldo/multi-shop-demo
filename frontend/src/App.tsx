import { Box, Spinner } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/admin/AdminLayout";
import { AdminProvider } from "./contexts/AdminContext";
import Categories from "./pages/admin/Categories";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Settings from "./pages/admin/Settings";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// 🚀 LAZY LOADING DES PAGES LOURDES POUR PERFORMANCE
const EmotionalSystemDemo = lazy(() => import("./pages/EmotionalSystemDemo"));
const StoreCatalogueView = lazy(
  () => import("./pages/store/StoreCatalogueView")
);
const StoreContact = lazy(() => import("./pages/store/StoreContact"));
const StoreLandingGeneric = lazy(
  () => import("./pages/store/StoreLandingGeneric")
);
const StoreProductDetail = lazy(
  () => import("./pages/store/StoreProductDetail")
);

/**
 * App principal avec page vitrine générique 4-in-1
 *
 * Structure optimisée :
 * - Routes publiques (/)
 * - Routes admin (/admin/*) avec AdminProvider
 * - Page vitrine générique pour tous les univers (/store/:shopType)
 * - Routes spécialisées (/store/:shopType/contact, /products, etc.)
 * - Lazy loading pour les pages lourdes
 */

// 🚀 Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Composant de chargement simple et rapide
const PageLoader = () => (
  <Box
    h="200px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    w="100%"
  >
    <Spinner size="lg" color="blue.500" thickness="3px" />
  </Box>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* ==== ROUTES PUBLIQUES (chargement immédiat) ==== */}
        <Route path="/" element={<Home />} />

        {/* ==== ROUTES LOURDES AVEC LAZY LOADING ==== */}
        <Route
          path="/demo"
          element={
            <Suspense fallback={<PageLoader />}>
              <EmotionalSystemDemo />
            </Suspense>
          }
        />

        {/* ==== ROUTES ADMIN (chargement immédiat car moins lourdes) ==== */}
        <Route
          path="/admin"
          element={
            <AdminProvider>
              <AdminLayout />
            </AdminProvider>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ==== ROUTES VITRINE AVEC LAZY LOADING ==== */}
        <Route
          path="/store/:shopType"
          element={
            <Suspense fallback={<PageLoader />}>
              <StoreLandingGeneric />
            </Suspense>
          }
        />

        {/* ==== ROUTES SPÉCIALISÉES AVEC LAZY LOADING ==== */}
        <Route
          path="/store/:shopType/contact"
          element={
            <Suspense fallback={<PageLoader />}>
              <StoreContact />
            </Suspense>
          }
        />
        <Route
          path="/store/:shopType/products"
          element={
            <Suspense fallback={<PageLoader />}>
              <StoreCatalogueView />
            </Suspense>
          }
        />
        <Route
          path="/store/:shopType/product/:productId"
          element={
            <Suspense fallback={<PageLoader />}>
              <StoreProductDetail />
            </Suspense>
          }
        />

        {/* ==== REDIRECTIONS ==== */}
        <Route
          path="/store"
          element={<Navigate to="/store/brewery" replace />}
        />

        {/* ==== FALLBACK ==== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </QueryClientProvider>
  );
}
