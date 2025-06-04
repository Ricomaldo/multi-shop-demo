import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import { AdminProvider } from "./contexts/AdminContext";
import Categories from "./pages/admin/Categories";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Settings from "./pages/admin/Settings";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import StoreCatalogueView from "./pages/store/StoreCatalogueView";
import StoreContact from "./pages/store/StoreContact";
import StoreLandingGeneric from "./pages/store/StoreLandingGeneric";
import StoreProductDetail from "./pages/store/StoreProductDetail";

/**
 * App principal avec routes optimisées pour la nouvelle structure
 *
 * Hiérarchie des contextes (définie dans main.tsx) :
 * ChakraProvider (thème universel)
 * └── UniverseProvider (contexte univers global)
 *     └── BrowserRouter (routing)
 *         └── App (routes)
 *             └── AdminProvider (contexte admin - hérite d'UniverseProvider)
 *
 * Structure optimisée :
 * - Routes publiques (/)
 * - Routes admin (/admin/*) avec AdminProvider
 * - Routes vitrine (/store/*) avec logique par univers
 * - Redirections et fallbacks
 */
export default function App() {
  return (
    <Routes>
      {/* ==== ROUTES PUBLIQUES ==== */}
      <Route path="/" element={<Home />} />

      {/* ==== ROUTES ADMIN avec AdminProvider intégré ==== */}
      <Route
        path="/admin"
        element={
          <AdminProvider>
            <AdminLayout />
          </AdminProvider>
        }
      >
        {/* Pages admin - héritent d'AdminProvider + UniverseProvider */}
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* ==== ROUTES VITRINE avec logique par univers ==== */}
      {/* Landing générique pilotée par UniverseContext */}
      <Route path="/store/:universe" element={<StoreLandingGeneric />} />

      {/* Pages spécifiques par type de boutique */}
      <Route path="/store/:shopType/contact" element={<StoreContact />} />
      <Route
        path="/store/:shopType/products"
        element={<StoreCatalogueView />}
      />
      <Route
        path="/store/:shopType/product/:productId"
        element={<StoreProductDetail />}
      />

      {/* ==== REDIRECTIONS UTILES ==== */}
      {/* Redirection /store vers brewery par défaut */}
      <Route path="/store" element={<Navigate to="/store/brewery" replace />} />

      {/* ==== ROUTES FALLBACK ==== */}
      {/* Page 404 pour toutes les routes inexistantes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
