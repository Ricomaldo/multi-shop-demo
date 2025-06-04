import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/admin/AdminLayout";
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
 * App principal avec page vitrine générique 4-in-1
 *
 * Structure optimisée :
 * - Routes publiques (/)
 * - Routes admin (/admin/*) avec AdminProvider
 * - Page vitrine générique pour tous les univers (/store/:shopType)
 * - Routes spécialisées (/store/:shopType/contact, /products, etc.)
 */
export default function App() {
  return (
    <Routes>
      {/* ==== ROUTES PUBLIQUES ==== */}
      <Route path="/" element={<Home />} />

      {/* ==== ROUTES ADMIN ==== */}
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

      {/* ==== ROUTES VITRINE - Page générique 4-in-1 ==== */}
      <Route path="/store/:shopType" element={<StoreLandingGeneric />} />

      {/* ==== ROUTES SPÉCIALISÉES ==== */}
      <Route path="/store/:shopType/contact" element={<StoreContact />} />
      <Route
        path="/store/:shopType/products"
        element={<StoreCatalogueView />}
      />
      <Route
        path="/store/:shopType/product/:productId"
        element={<StoreProductDetail />}
      />

      {/* ==== REDIRECTIONS ==== */}
      <Route path="/store" element={<Navigate to="/store/brewery" replace />} />

      {/* ==== FALLBACK ==== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
