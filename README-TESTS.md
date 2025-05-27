# 🧪 Tests DemoForge - Configuration Jest

## 📋 Vue d'ensemble

Configuration Jest complète pour frontend (React) et backend (Node.js) avec TypeScript.

## 🎯 Structure des tests

```
demoforge/
├── frontend/
│   ├── jest.config.js
│   ├── src/
│   │   ├── setupTests.ts
│   │   ├── components/__tests__/
│   │   │   └── App.test.tsx
│   │   └── pages/__tests__/
│   │       └── Home.test.tsx
│   └── package.json (scripts test)
└── backend/
    ├── jest.config.js
    ├── src/
    │   ├── setupTests.ts
    │   ├── __tests__/
    │   │   └── server.test.ts
    │   └── routes/__tests__/
    │       └── api.test.ts
    └── package.json (scripts test)
```

## 🚀 Commandes disponibles

### Frontend

```bash
cd frontend
yarn test              # Lancer tous les tests
yarn test:watch        # Mode watch (re-exécution automatique)
yarn test:coverage     # Rapport de couverture
```

### Backend

```bash
cd backend
yarn test              # Lancer tous les tests
yarn test:watch        # Mode watch
yarn test:coverage     # Rapport de couverture
```

## 📦 Dépendances installées

### Frontend

- `@testing-library/react` - Utilitaires de test React
- `@testing-library/jest-dom` - Matchers Jest pour DOM
- `@testing-library/user-event` - Simulation d'interactions utilisateur
- `jest` - Framework de test
- `jest-environment-jsdom` - Environnement DOM pour Jest
- `ts-jest` - Support TypeScript

### Backend

- `jest` - Framework de test
- `supertest` - Tests d'API HTTP
- `ts-jest` - Support TypeScript
- `@types/jest` - Types TypeScript pour Jest
- `@types/supertest` - Types TypeScript pour Supertest

## 🔧 Configuration

### Frontend (jest.config.js)

- Environnement : `jsdom` (simulation navigateur)
- Support : TypeScript, React, ES modules
- Setup : Matchers Jest DOM, mocks CSS
- Coverage : Exclusion des fichiers de config

### Backend (jest.config.js)

- Environnement : `node`
- Support : TypeScript, Express
- Setup : Mocks Prisma, variables d'environnement test
- Coverage : Exclusion des tests et types

## 📝 Tests existants

### Frontend

- **App.test.tsx** : Test de rendu du composant principal
- **Home.test.tsx** : Test de la page d'accueil

### Backend

- **server.test.ts** : Test de l'API health check
- **api.test.ts** : Test des routes API (mocks)

## 🎯 Prochaines étapes

### Tests à ajouter

1. **Frontend**

   - Tests des composants Store\* (StoreBrewery, StoreTeaShop)
   - Tests des composants Admin\* (AdminLayout, AdminProductList)
   - Tests d'intégration navigation
   - Tests des hooks personnalisés

2. **Backend**
   - Tests des routes API réelles
   - Tests des modèles Prisma
   - Tests d'intégration base de données
   - Tests de validation des données

### Bonnes pratiques

- **Couverture cible** : >80%
- **Nommage** : `*.test.tsx` ou `*.spec.tsx`
- **Organisation** : Dossier `__tests__` par module
- **Mocks** : Isoler les dépendances externes
- **Assertions** : Utiliser les matchers Jest appropriés

## 🔍 Exemples d'utilisation

### Test composant React

```typescript
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import MonComposant from "../MonComposant";

test("renders component", () => {
  render(
    <ChakraProvider>
      <MonComposant />
    </ChakraProvider>
  );
  expect(screen.getByText(/texte attendu/i)).toBeInTheDocument();
});
```

### Test API Express

```typescript
import request from "supertest";
import app from "../server";

test("GET /api/endpoint", async () => {
  const response = await request(app).get("/api/endpoint").expect(200);

  expect(response.body).toHaveProperty("data");
});
```

## 🚨 Notes importantes

- Les erreurs TypeScript dans les tests sont normales en développement
- Installer les dépendances avant de lancer les tests
- Les mocks Prisma permettent de tester sans base de données
- La configuration supporte ES modules (frontend) et CommonJS (backend)
