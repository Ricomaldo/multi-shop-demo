# DemoForge - Guide d'initialisation complète

## Étape 0 : Initialisation projet

### 0. Prérequis - Configuration Yarn

```bash
# Vérifier la version de Yarn (doit être >= 1.22)
yarn --version

# S'assurer d'utiliser Yarn classique (pas PnP)
# Si vous avez Yarn 2+, créer un .yarnrc.yml pour forcer le mode classique
echo "nodeLinker: node-modules" > .yarnrc.yml
echo "yarnPath: yarn" >> .yarnrc.yml
```

### 1. Structure des dossiers

```bash
mkdir demoforge
cd demoforge
mkdir backend frontend shared
```

### 2. Backend - Initialisation

```bash
cd backend
yarn init -y
yarn add express cors dotenv prisma @prisma/client
yarn add -D typescript @types/node @types/express ts-node nodemon
npx prisma init --datasource-provider sqlite
```

### 3. Frontend - Initialisation

```bash
cd ../frontend
yarn create vite . --template react-ts
yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion
yarn add axios react-router-dom
yarn add -D @types/react-router-dom
```

## Architecture fondamentale

```
demoforge/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── routes/
│   │   │   └── api.ts
│   │   └── server.ts
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   └── AdminProductList.tsx
│   │   │   └── store/
│   │   │       └── StoreLayout.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── Products.tsx
│   │   │   └── store/
│   │   │       ├── Brewery.tsx
│   │   │       ├── TeaShop.tsx
│   │   │       ├── BeautyShop.tsx
│   │   │       └── HerbShop.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── shared/
    └── types.ts
```

## Fichiers à créer

### Backend - schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Merchant {
  id    String @id @default(cuid())
  name  String
  email String @unique
  shops Shop[]

  @@map("merchants")
}

model Shop {
  id         String    @id @default(cuid())
  name       String
  shopType   String    // brewery, teaShop, beatyShop, herbShop
  merchant   Merchant  @relation(fields: [merchantId], references: [id])
  merchantId String
  products   Product[]
  categories Category[]

  @@map("shops")
}

model Category {
  id       String    @id @default(cuid())
  name     String
  shop     Shop      @relation(fields: [shopId], references: [id])
  shopId   String
  products Product[]

  @@map("categories")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  image       String?
  attributes  String?  // JSON string for flexible attributes
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  shop        Shop     @relation(fields: [shopId], references: [id])
  shopId      String

  @@map("products")
}
```

### Backend - seed.ts

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const shopConfigs = {
  brewery: {
    name: "Houblon & Tradition",
    categories: ["Blondes", "Brunes", "IPA", "Saisonnières"],
    products: [
      { name: "Blonde de Garde", price: 4.5, cat: "Blondes" },
      { name: "Blonde d'Été", price: 4.2, cat: "Blondes" },
      { name: "Blonde Houblonnée", price: 4.8, cat: "Blondes" },
      { name: "Triple Blonde", price: 5.2, cat: "Blondes" },
      { name: "Brune Traditionnelle", price: 4.6, cat: "Brunes" },
      { name: "Porter Chocolat", price: 5.0, cat: "Brunes" },
      { name: "Stout Café", price: 5.2, cat: "Brunes" },
      { name: "Brune aux Épices", price: 4.9, cat: "Brunes" },
      { name: "IPA Américaine", price: 5.5, cat: "IPA" },
      { name: "IPA Session", price: 4.8, cat: "IPA" },
      { name: "Double IPA", price: 6.2, cat: "IPA" },
      { name: "IPA Tropicale", price: 5.8, cat: "IPA" },
      { name: "Bière de Noël", price: 5.0, cat: "Saisonnières" },
      { name: "Blanche d'Été", price: 4.4, cat: "Saisonnières" },
      { name: "Pumpkin Ale", price: 4.9, cat: "Saisonnières" },
      { name: "Bière de Mars", price: 4.7, cat: "Saisonnières" },
    ],
  },
  teaShop: {
    name: "Les Jardins de Darjeeling",
    categories: ["Thés Verts", "Thés Noirs", "Thés Blancs", "Infusions"],
    products: [
      { name: "Sencha Premium", price: 12.5, cat: "Thés Verts" },
      { name: "Gyokuro", price: 28.0, cat: "Thés Verts" },
      { name: "Matcha Cérémonial", price: 35.0, cat: "Thés Verts" },
      { name: "Gunpowder", price: 8.9, cat: "Thés Verts" },
      { name: "Earl Grey", price: 9.5, cat: "Thés Noirs" },
      { name: "Darjeeling FTGFOP", price: 15.6, cat: "Thés Noirs" },
      { name: "Assam TGFOP", price: 11.2, cat: "Thés Noirs" },
      { name: "Ceylon Orange Pekoe", price: 10.8, cat: "Thés Noirs" },
      { name: "Bai Mu Dan", price: 18.9, cat: "Thés Blancs" },
      { name: "Silver Needle", price: 45.0, cat: "Thés Blancs" },
      { name: "Moonlight White", price: 22.5, cat: "Thés Blancs" },
      { name: "Shou Mei", price: 16.4, cat: "Thés Blancs" },
      { name: "Camomille Bio", price: 7.2, cat: "Infusions" },
      { name: "Verveine Menthe", price: 6.8, cat: "Infusions" },
      { name: "Rooibos Vanille", price: 8.5, cat: "Infusions" },
      { name: "Tisane Détox", price: 9.9, cat: "Infusions" },
    ],
  },
};

async function main() {
  // Nettoie la DB
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.merchant.deleteMany();

  // Crée le commerçant
  const merchant = await prisma.merchant.create({
    data: {
      name: "Jean Dupont",
      email: "jean@demoforge.com",
    },
  });

  // Crée les boutiques (brewery et teaShop pour commencer)
  for (const [shopType, config] of Object.entries(shopConfigs)) {
    const shop = await prisma.shop.create({
      data: {
        name: config.name,
        shopType: shopType,
        merchantId: merchant.id,
      },
    });

    // Crée les catégories
    for (const categoryName of config.categories) {
      const category = await prisma.category.create({
        data: {
          name: categoryName,
          shopId: shop.id,
        },
      });

      // Crée les produits pour cette catégorie
      const categoryProducts = config.products.filter(
        (p) => p.cat === categoryName
      );
      for (const productData of categoryProducts) {
        await prisma.product.create({
          data: {
            name: productData.name,
            description: `Délicieux ${productData.name.toLowerCase()} de notre collection ${categoryName.toLowerCase()}`,
            price: productData.price,
            image: null,
            attributes: JSON.stringify({
              origine: "Artisanal",
              disponible: true,
              stock: Math.floor(Math.random() * 50) + 10,
            }),
            categoryId: category.id,
            shopId: shop.id,
          },
        });
      }
    }
  }

  console.log("🌱 Base de données initialisée avec succès!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Backend - server.ts

```typescript
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes API
app.get("/api/shops", async (req, res) => {
  const shops = await prisma.shop.findMany({
    include: { categories: true },
  });
  res.json(shops);
});

app.get("/api/shops/:shopId/products", async (req, res) => {
  const { shopId } = req.params;
  const products = await prisma.product.findMany({
    where: { shopId },
    include: { category: true },
  });
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, shop: true },
  });
  res.json(product);
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, attributes } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: { name, description, price, attributes },
    include: { category: true, shop: true },
  });
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
```

### Backend - package.json scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "seed": "ts-node prisma/seed.ts",
    "db:reset": "npx prisma migrate reset --force && yarn seed"
  }
}
```

### Frontend - types/index.ts

```typescript
export interface Shop {
  id: string;
  name: string;
  shopType: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  shopId: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  attributes?: string;
  categoryId: string;
  shopId: string;
  category?: Category;
  shop?: Shop;
}
```

### Frontend - main.tsx

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
```

### Frontend - App.tsx

```tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Brewery from "./pages/store/Brewery";
import TeaShop from "./pages/store/TeaShop";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
      </Route>
      <Route path="/store/brewery" element={<Brewery />} />
      <Route path="/store/teaShop" element={<TeaShop />} />
    </Routes>
  );
}

export default App;
```

### Frontend - pages/Home.tsx

```tsx
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const shopTypes = [
  {
    id: "brewery",
    name: "Brasserie",
    color: "orange",
    description: "Houblon & Tradition",
  },
  {
    id: "teaShop",
    name: "Salon de Thé",
    color: "green",
    description: "Les Jardins de Darjeeling",
  },
  {
    id: "beatyShop",
    name: "Institut Beauté",
    color: "pink",
    description: "L'Écrin de Jade",
  },
  {
    id: "herbShop",
    name: "Herboristerie",
    color: "teal",
    description: "Herboristerie du Moulin Vert",
  },
];

export default function Home() {
  return (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={8}>
        <Heading size="xl" textAlign="center">
          🛍️ DemoForge - Vitrine Multi-Boutiques
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          Démonstration interactive de solutions e-commerce sur-mesure
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
          {shopTypes.map((shop) => (
            <VStack
              key={shop.id}
              p={6}
              borderWidth={2}
              borderRadius="lg"
              borderColor={`${shop.color}.200`}
              bg={`${shop.color}.50`}
              spacing={4}
            >
              <Heading size="md" color={`${shop.color}.700`}>
                {shop.name}
              </Heading>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                {shop.description}
              </Text>
              <Button
                as={Link}
                to={`/store/${shop.id}`}
                colorScheme={shop.color}
                size="sm"
                w="full"
              >
                Voir la vitrine
              </Button>
            </VStack>
          ))}
        </SimpleGrid>

        <Box mt={8} p={4} bg="blue.50" borderRadius="md">
          <Button as={Link} to="/admin" colorScheme="blue" size="lg">
            🔧 Interface Administration
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
```

### Frontend - components/admin/AdminLayout.tsx

```tsx
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <Flex h="100vh">
      <AdminSidebar />
      <Box flex={1} p={6} bg="gray.50">
        <Outlet />
      </Box>
    </Flex>
  );
}
```

### Frontend - components/admin/AdminSidebar.tsx

```tsx
import { Box, VStack, Button, Heading } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { path: "/admin", label: "📊 Tableau de bord", exact: true },
  { path: "/admin/products", label: "📦 Produits" },
  { path: "/admin/categories", label: "🏷️ Catégories" },
  { path: "/admin/settings", label: "⚙️ Paramètres" },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <Box
      w="250px"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      p={4}
    >
      <Heading size="md" mb={6} color="blue.600">
        🔧 Admin DemoForge
      </Heading>

      <VStack spacing={2} align="stretch">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Button
              key={item.path}
              as={Link}
              to={item.path}
              variant={isActive ? "solid" : "ghost"}
              colorScheme="blue"
              justifyContent="flex-start"
              size="sm"
            >
              {item.label}
            </Button>
          );
        })}
      </VStack>
    </Box>
  );
}
```

### Frontend - pages/admin/Products.tsx

```tsx
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  Text,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { Product } from "../../types";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/shops");
      const shops = response.data;
      if (shops.length > 0) {
        const productsResponse = await axios.get(
          `http://localhost:3001/api/shops/${shops[0].id}/products`
        );
        setProducts(productsResponse.data);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
    });
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      await axios.put(
        `http://localhost:3001/api/products/${editingProduct.id}`,
        formData
      );
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: 0 });
  };

  if (editingProduct) {
    return (
      <Box>
        <Heading size="lg" mb={6}>
          ✏️ Modifier le produit
        </Heading>
        <VStack spacing={4} align="stretch" maxW="500px">
          <Box>
            <Text mb={2}>Nom</Text>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Box>
          <Box>
            <Text mb={2}>Description</Text>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Box>
          <Box>
            <Text mb={2}>Prix (€)</Text>
            <NumberInput
              value={formData.price}
              onChange={(valueString) =>
                setFormData({
                  ...formData,
                  price: parseFloat(valueString) || 0,
                })
              }
            >
              <NumberInputField />
            </NumberInput>
          </Box>
          <HStack>
            <Button colorScheme="green" onClick={handleSave}>
              💾 Sauvegarder
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              ❌ Annuler
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        📦 Gestion des Produits
      </Heading>
      <VStack spacing={4} align="stretch">
        {products.map((product) => (
          <Box key={product.id} p={4} bg="white" borderRadius="md" shadow="sm">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">{product.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {product.description}
                </Text>
                <Text color="green.600" fontWeight="bold">
                  {product.price}€
                </Text>
              </VStack>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => handleEdit(product)}
              >
                ✏️ Modifier
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
```

### Frontend - pages/store/Brewery.tsx

```tsx
import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { Product } from "../../types";
import axios from "axios";

export default function Brewery() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
    const interval = setInterval(loadProducts, 2000); // Refresh toutes les 2s
    return () => clearInterval(interval);
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/shops");
      const shops = response.data;
      const breweryShop = shops.find(
        (shop: any) => shop.shopType === "brewery"
      );
      if (breweryShop) {
        const productsResponse = await axios.get(
          `http://localhost:3001/api/shops/${breweryShop.id}/products`
        );
        setProducts(productsResponse.data);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={8}>
        <Heading size="xl" color="orange.700">
          🍺 Houblon & Tradition
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Brasserie artisanale - Sélection de bières traditionnelles
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
          {products.map((product) => (
            <Box
              key={product.id}
              p={6}
              bg="white"
              borderRadius="lg"
              shadow="md"
              borderWidth={1}
              borderColor="orange.200"
            >
              <VStack spacing={3} align="start">
                <Badge colorScheme="orange" fontSize="xs">
                  {product.category?.name}
                </Badge>
                <Heading size="md" color="orange.800">
                  {product.name}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {product.description}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="orange.600">
                  {product.price}€
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
```

## Commandes de démarrage

### 1. Configuration Backend

```bash
cd backend
echo "DATABASE_URL=\"file:./dev.db\"" > .env
npx prisma generate
npx prisma db push
yarn seed
yarn dev
```

### 2. Configuration Frontend (nouveau terminal)

```bash
cd frontend
yarn dev
```

## Test de la première victoire

1. Aller sur http://localhost:5173 → Page d'accueil
2. Cliquer "Interface Administration" → Dashboard admin
3. Aller dans "Produits" → Modifier "Blonde de Garde"
4. Changer le nom en "Super Blonde de Garde"
5. Sauvegarder
6. Retourner à l'accueil → "Voir la vitrine" Brasserie
7. Constater le changement en temps réel ! 🎉

Voilà Monsieur, votre alpha-dev prêt pour la première victoire !
