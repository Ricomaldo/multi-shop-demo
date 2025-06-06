# 🚀 DemoForge - Guide Développeur Junior

## 🎯 Ce que fait le projet

DemoForge est une **démo e-commerce** avec 4 thèmes visuels différents :

- **Admin** pour gérer produits et catégories
- **Page vitrine** qui s'adapte automatiquement au thème choisi
- **React + TypeScript + Chakra UI + React Query**

## 🏗️ Architecture Simple

```
App.tsx
├── AdminProvider (pour /admin)
├── Routes Admin (Dashboard, Products...)
└── Routes Store (Pages vitrine thématisées)
    ├── useStorePage() - Gestion boutique actuelle
    ├── useStoreDataQuery() - Données + cache
    └── useUniverseTokens() - Couleurs par thème
```

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

- `src/routes/` - API endpoints
- `prisma/schema.prisma` - Structure base de données

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

1. Vérifier que backend tourne (port 3001)
2. Vérifier console navigateur pour erreurs
3. Tester API : `curl http://localhost:3001/api/store/data`

### Thème ne s'applique pas ?

1. Vérifier l'URL : `/store/brewery`, `/store/teaShop`, etc.
2. Console → Network → vérifier appel API réussi

### Performance lente ?

- React Query cache les données automatiquement
- Après le 1er chargement, navigation = instantanée

## 📝 Notes pour Plus Tard

Ce projet est une **démo technique**. Pour le transformer en vraie solution :

- Ajouter authentification utilisateur
- Intégrer système de paiement
- Optimiser SEO et accessibilité
- Tests automatisés
- Déploiement production

---

**Gardez ça simple, développez progressivement !** 🚀
