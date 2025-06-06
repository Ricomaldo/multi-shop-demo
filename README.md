# 🚀 DemoForge - Guide Développeur Junior

## 🎯 Ce que fait le projet

DemoForge est une **démo e-commerce** avec 4 thèmes visuels différents :

- **Admin** pour gérer produits et catégories
- **Page vitrine** qui s'adapte automatiquement au thème choisi
- **React + TypeScript + Chakra UI + React Query**

## 🏗️ Architecture Simple

### Frontend

```
App.tsx
├── AdminProvider (pour /admin)
├── Routes Admin (Dashboard, Products...)
└── Routes Store (Pages vitrine thématisées)
    ├── useStorePage() - Gestion boutique actuelle
    ├── useStoreDataQuery() - Données + cache
    └── getUniverseTokens() - Couleurs par thème
```

### Backend - Architecture Hybride Pragmatique

```
server.ts (Point d'entrée principal)
├── Routes Directes (endpoints simples)
│   ├── GET /api/health - Test serveur
│   ├── GET /api/store/data - 🚀 Endpoint unifié (shops + products + categories)
│   ├── GET /api/shops - Liste boutiques
│   └── GET /api/shops/:id/products - Produits par boutique
└── Routes Modulaires (CRUD complexe)
    ├── /api/admin/shops - Gestion boutiques
    ├── /api/admin/products - Gestion produits
    └── /api/admin/categories - Gestion catégories
```

**💡 Pourquoi cette approche ?**

- **Routes directes** : Pour les endpoints simples et performants
- **Routes modulaires** : Pour le CRUD admin complexe avec validation
- **Endpoint unifié** `/api/store/data` : Remplace 40+ appels par 1 seul → Performance ⚡

## 🎨 Système de Thèmes

4 univers avec couleurs/styles différents :

### 🍺 Brewery (ambre, robuste)

- Couleurs chaudes ambrées
- Style robuste, angles marqués
- Pour brasseries artisanales

### 🍵 TeaShop (vert, zen)

- Couleurs vertes apaisantes
- Style épuré, courbes douces
- Pour boutiques de thé/wellness

### 💄 Beauty (rose, élégant)

- Couleurs rose-corail
- Style sophistiqué, raffiné
- Pour cosmétiques/beauté

### 🌿 Herb (vert foncé, naturel)

- Couleurs vertes forestières
- Style naturel, formes organiques
- Pour herboristerie/bio

## 🚀 Démarrage Rapide

```bash
# Backend (port 3001)
cd backend
yarn install
yarn db:generate
yarn db:push
yarn dev

# Frontend (port 5173)
cd frontend
yarn install
yarn dev
```

**Données de test :**

```bash
cd backend
yarn reset-db  # Remplit la DB avec des produits d'exemple
```

## 📁 Fichiers Importants

### Frontend

- `App.tsx` - Routes principales
- `hooks/useStorePage.ts` - Logique boutique courante
- `hooks/useStoreDataQuery.ts` - Récupération données + cache
- `theme/universeTokens.ts` - Couleurs et styles par thème
- `pages/store/StoreLandingGeneric.tsx` - Page vitrine principale

### Backend

- `src/server.ts` - Point d'entrée + routes directes
- `src/routes/admin/` - Routes modulaires CRUD (shops, products, categories)
- `src/routes/products.ts` - Route publique produits
- `src/routes/categories.ts` - Route publique catégories
- `prisma/schema.prisma` - Structure base de données
- `prisma/seed.ts` - Données d'exemple (yarn reset-db)

## 📡 API et Performance

### Endpoint Unifié - La Clé de la Performance

```typescript
// 🚀 UN SEUL appel pour TOUTES les données
GET /api/store/data

// Retourne:
{
  shops: [...],           // Toutes les boutiques avec catégories
  products: [...],        // Tous les produits avec relations
  categories: [...],      // Toutes les catégories
  meta: {                 // Métadonnées utiles
    shopsCount: 4,
    productsCount: 40,
    timestamp: "..."
  }
}
```

**💡 Avantages :**

- **1 appel** au lieu de 40+ → Latence divisée par 10
- **Cache React Query** → Navigation instantanée
- **Relations Prisma** → Données complètes en 1 fois

### Tester l'API

```bash
# Test santé serveur
curl http://localhost:3001/api/health

# Récupérer toutes les données
curl http://localhost:3001/api/store/data | jq

# Produits d'une boutique spécifique
curl http://localhost:3001/api/shops/SHOP_ID/products
```

## 🛠️ Développement Quotidien

### Modifier les couleurs d'un thème

```typescript
// Dans theme/universeTokens.ts
brewery: {
  500: "#e6a419", // Couleur principale - changer ici
  // ...
}
```

### Ajouter une nouvelle page

```typescript
// Dans pages/store/
export default function MaNouvellePage() {
  const { currentShop } = useStorePage();
  const tokens = getUniverseTokens(currentShop?.shopType);

  return <StorePageWrapper>{/* Votre contenu */}</StorePageWrapper>;
}
```

### Créer un nouveau hook

```typescript
// Dans hooks/
export function useMonHook() {
  const { shops, products } = useStoreDataQuery();
  // Votre logique
  return {
    /* vos données */
  };
}
```

### Utiliser le système de thèmes

```typescript
// ✅ Approche recommandée - Direct
import { getUniverseTokens } from "@/theme/universeTokens";

function MonComposant() {
  const { currentShop } = useStorePage();
  const tokens = getUniverseTokens(currentShop?.shopType || "brewery");

  return (
    <Box
      bg={tokens.colors[500]}
      borderRadius={tokens.borderRadius.md}
      _hover={{ transform: tokens.animations.hover.transform.md }}
    >
      Thématisé automatiquement !
    </Box>
  );
}
```

## 🔧 Stack Technique

- **Frontend** : React 19 + TypeScript + Chakra UI + Vite
- **Backend** : Node.js + Express + TypeScript
- **Base de données** : Prisma ORM + SQLite
- **Styling** : Emotion + Chakra UI
- **État** : React Query pour cache + hooks personnalisés

## ⚡ Commandes Utiles

```bash
# Frontend
npm run dev          # Démarrer développement
npm run build        # Build production
npm run type-check   # Vérifier TypeScript

# Backend
yarn dev            # Démarrer API
yarn db:studio      # Interface admin Prisma
yarn reset-db       # Remettre données de test
```

## 🐛 Debugging

### Page blanche ?

1. **Backend** : Vérifier port 3001 avec `curl http://localhost:3001/api/health`
2. **Frontend** : Console navigateur → Erreurs réseau/JavaScript
3. **API** : Tester endpoint unifié `curl http://localhost:3001/api/store/data`
4. **Base de données** : `cd backend && yarn db:studio` pour voir les données

### Thème ne s'applique pas ?

1. **URL** : Vérifier `/store/brewery`, `/store/teaShop`, `/store/beautyShop`, `/store/herbShop`
2. **Network** : Console → Onglet Réseau → Vérifier appel `/api/store/data` réussi
3. **Tokens** : `console.log(getUniverseTokens('brewery'))` pour débugger les couleurs
4. **Hook** : Vérifier que `useStorePage()` retourne une `currentShop` valide

### Performance lente ?

- **1er chargement** : Normal (fetch de toutes les données)
- **Navigation suivante** : Instantanée grâce au cache React Query
- **Cache** : Expire après 5min → Refetch automatique en arrière-plan
- **Debug cache** : React Query DevTools disponibles en dev

### Erreurs de build ?

```bash
# Frontend
cd frontend
yarn type-check  # Vérifier TypeScript
yarn build       # Tester build production

# Backend
cd backend
yarn build       # Compiler TypeScript
```

## 📝 Notes pour Plus Tard

Ce projet est une **démo technique**. Pour le transformer en vraie solution :

- Ajouter authentification utilisateur
- Intégrer système de paiement
- Optimiser SEO et accessibilité
- Tests automatisés
- Déploiement production

---

**Gardez ça simple, développez progressivement !** 🚀
