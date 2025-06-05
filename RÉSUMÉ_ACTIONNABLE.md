# 🚀 **GUIDE PRATIQUE : DÉMARRAGE IMMÉDIAT**

Voici comment démarrer **concrètement** avec vos 3 docs comme référence.

## 📋 **SEMAINE 1 : PREMIERS PAS (PALIER 1)**

### **Jour 1 - Mise en place du StoreProvider**

#### **1. Créer le contexte store**

```bash
# Dans votre terminal
mkdir -p frontend/src/contexts
touch frontend/src/contexts/StoreContext.tsx
```

```typescript
// frontend/src/contexts/StoreContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { useStorePage } from "../hooks/useStorePage"; // Votre hook existant
import { getUniverseTokens } from "../theme/universeTokens"; // Vos tokens existants

interface StoreContextValue {
  // Vos données existantes de useStorePage
  currentShop: any;
  availableShops: any[];
  shopProducts: any[];
  isReady: boolean;
  isChanging: boolean;
  handleShopChange: (shop: any) => void;

  // ✨ Nouveau : tokens intégrés
  universeTokens: any;
  isConfigurable: boolean;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Utiliser votre hook existant UNE SEULE FOIS
  const storeState = useStorePage({
    redirectOnShopChange: true,
    // ✨ Ajouter cache si possible
  });

  // ✨ Intégrer vos universeTokens
  const universeTokens = getUniverseTokens(
    storeState.currentShop?.shopType || "brewery"
  );

  const value: StoreContextValue = {
    ...storeState,
    universeTokens,
    isConfigurable: false, // Mode demo pour l'instant
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
```

#### **2. Créer le hook simplifié**

```bash
touch frontend/src/hooks/useStore.ts
```

```typescript
// frontend/src/hooks/useStore.ts
export { useStore } from "../contexts/StoreContext";

// Hook spécialisé pour les tokens
export function useStoreConfig() {
  const { universeTokens, currentShop, isConfigurable } = useStore();
  return { universeTokens, currentShop, isConfigurable };
}
```

#### **3. Modifier App.tsx**

```typescript
// frontend/src/App.tsx
import { StoreProvider } from "./contexts/StoreContext";

function App() {
  return (
    <ChakraProvider theme={theme}>
      {/* ✨ Wrapper autour des routes store uniquement */}
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route
          path="/*"
          element={
            <StoreProvider>
              <StoreRoutes /> {/* Vos routes store existantes */}
            </StoreProvider>
          }
        />
      </Routes>
    </ChakraProvider>
  );
}
```

#### **4. Tester immédiatement**

```bash
npm run dev
# Vérifier que ça fonctionne toujours comme avant
# Si erreur → rollback et ajuster
```

### **Jour 2 - Migration première page**

#### **5. Sauvegarder l'existant**

```bash
# Backup avant modification
cp frontend/src/pages/store/StoreLandingGeneric.tsx frontend/src/pages/store/StoreLandingGeneric.tsx.backup
```

#### **6. Modifier StoreLandingGeneric.tsx**

```typescript
// frontend/src/pages/store/StoreLandingGeneric.tsx
// AVANT (à supprimer)
// const { currentShop, shopProducts } = useStorePage();

// APRÈS (nouveau)
import { useStore, useStoreConfig } from "../../hooks/useStore";

export default function StoreLandingGeneric() {
  const { currentShop, shopProducts } = useStore(); // ✨ Nouveau
  const { universeTokens } = useStoreConfig(); // ✨ Tokens intégrés

  // Le reste de votre code existant reste identique
  return <StorePage headerType="hero">{/* Votre JSX existant */}</StorePage>;
}
```

#### **7. Tester et mesurer**

```bash
# Ouvrir DevTools → Network
# Navigation store → Vérifier réduction API calls
# Avant : 4 appels, Après : 1 appel
```

### **Jour 3-4 - Migration autres pages**

#### **8. Répéter pour chaque page store**

```bash
# Pour chaque fichier dans pages/store/
# 1. Backup
cp original.tsx original.tsx.backup

# 2. Remplacer useStorePage par useStore
sed -i 's/useStorePage/useStore/g' fichier.tsx

# 3. Ajouter import useStoreConfig si nécessaire
```

#### **9. Validation continue**

```bash
# Après chaque page migrée
npm run dev
# Tester navigation complète
# Vérifier 0 régression fonctionnelle
```

### **Jour 5 - Validation Palier 1**

#### **10. Métriques de validation**

```typescript
// Créer un petit script de test de performance
// frontend/src/test-performance.ts
console.time("Store Navigation");
// Navigation entre pages store
console.timeEnd("Store Navigation");

// Mesurer dans DevTools :
// - API calls : doit être 1× au lieu de 4×
// - Re-renders : utiliser React DevTools Profiler
```

## 📋 **SEMAINE 2 : PALIER 2 - UNIFICATION**

### **Jour 1 - StorePage unifié**

#### **11. Analyser vos wrappers existants**

```bash
# Identifier les différences
diff frontend/src/components/layout/store/StorePage.tsx frontend/src/components/layout/store/StorePageWrapper.tsx
```

#### **12. Créer StorePage unifié**

```typescript
// frontend/src/components/layout/store/StorePage.tsx (version unifiée)
interface StorePageProps {
  children: React.ReactNode;
  headerType?: "nav" | "hero" | "minimal";
  headerProps?: Record<string, unknown>;
  // ✨ Prep client-ready (optionnel pour l'instant)
  customization?: any;
  variant?: "demo" | "client";
}

export function StorePage({
  children,
  headerType = "nav",
  headerProps,
  customization,
  variant = "demo",
}: StorePageProps) {
  const { currentShop, isReady, isChanging } = useStore();
  const { universeTokens } = useStoreConfig();

  return (
    <StoreLayout shop={currentShop}>
      <StoreHeader variant={headerType} {...headerProps} />
      <StorePageContent>
        {isChanging ? <StoreSkeleton /> : children}
      </StorePageContent>
    </StoreLayout>
  );
}
```

### **Jour 2-3 - Migration composants**

#### **13. Intégrer universeTokens dans ProductCard**

```typescript
// frontend/src/components/business/product/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  universeTokens?: UniverseTokens; // ✨ Nouveau
  variant?: "compact" | "full" | "minimal";
}

export function ProductCard({
  product,
  universeTokens,
  variant = "full",
}: ProductCardProps) {
  // Fallback sur vos tokens existants
  const tokens = universeTokens || getUniverseTokens("brewery");

  return (
    <Card
      borderRadius={tokens.borderRadius.md}
      transition={tokens.animations.transition}
      _hover={tokens.microInteractions.cardHover}
    >
      {/* Votre logique existante */}
    </Card>
  );
}
```

## 📋 **VALIDATION CONTINUE**

### **Checklist après chaque modification**

```bash
# 1. Build passe
npm run build

# 2. Aucune erreur TypeScript
npm run type-check

# 3. Demo fonctionne
npm run dev
# Tester navigation complète

# 4. Performance maintenue
# DevTools → Network → Vérifier API calls
# DevTools → Performance → Vérifier re-renders
```

## 📋 **POINTS DE DÉCISION**

### **Si problème rencontré :**

```bash
# Rollback immédiat
git checkout -- fichier-modifié.tsx
# Ou restaurer depuis backup
cp fichier.tsx.backup fichier.tsx

# Analyser l'erreur
npm run dev 2>&1 | grep ERROR

# Ajuster et recommencer
```

### **Si tout va bien :**

```bash
# Commit étape par étape
git add .
git commit -m "Palier 1 - Jour X : Description"

# Passer à l'étape suivante
```

## 📋 **SEMAINE 3+ : PALIERS SUIVANTS**

### **Quand Palier 1 validé (performance OK) :**

#### **14. Commencer Palier 3 - Client Config**

```bash
# Créer les interfaces
mkdir -p frontend/src/config
touch frontend/src/config/ClientConfig.ts
```

```typescript
// Copier les interfaces depuis ARCHITECTURE_CLIENT_READY.md
// Commencer simple, étendre progressivement
```

## 🎯 **RÉSUMÉ ACTIONNABLE**

### **Cette semaine (Palier 1) :**

1. **Jour 1** : StoreContext + hook useStore
2. **Jour 2** : Migration 1 page (StoreLanding)
3. **Jour 3-4** : Migration autres pages store
4. **Jour 5** : Validation performance

### **Validation de succès :**

- ✅ API calls divisés par 4
- ✅ 0 régression fonctionnelle
- ✅ Code plus simple à lire
- ✅ Base pour Palier 2

### **En cas de blocage :**

- 🔄 Rollback immédiat possible
- 📞 Les 3 docs comme référence technique
- 🎯 Objectif : 1 palier = 1 amélioration mesurable

**Commencez par le Jour 1 maintenant** - c'est 2h de travail max et vous voyez déjà les bénéfices ! 🚀
