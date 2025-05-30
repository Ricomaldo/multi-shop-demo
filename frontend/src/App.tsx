import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import Categories from "./pages/admin/Categories";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Settings from "./pages/admin/Settings";
import Home from "./pages/Home";
import StoreBeautyShop from "./pages/store/StoreBeautyShop";
import StoreBrewery from "./pages/store/StoreBrewery";
import StoreContact from "./pages/store/StoreContact";
import StoreHerbShop from "./pages/store/StoreHerbShop";
import StoreTeaShop from "./pages/store/StoreTeaShop";
import theme from "./theme";

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/store/brewery" element={<StoreBrewery />} />
        <Route path="/store/teaShop" element={<StoreTeaShop />} />
        <Route path="/store/beautyShop" element={<StoreBeautyShop />} />
        <Route path="/store/herbShop" element={<StoreHerbShop />} />
        <Route path="/store/contact" element={<StoreContact />} />
      </Routes>
    </ChakraProvider>
  );
}
