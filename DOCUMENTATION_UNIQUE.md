# DemoForge - Documentation Technique

## 🎯 Vue d'ensemble

Projet multi-boutiques pour démonstrations commerciales. Interface admin prioritaire avec 4 univers de vitrines différenciés.

## 🚀 Innovation Split View Admin

- **Aperçu temps réel** : Modifications visibles instantanément dans l'admin
- **SharedProductCard** : OBLIGATOIRE dans aperçus admin (fidélité parfaite vitrine)
- **Mapping automatique** : shopType → universe pour thématisation auto
- **Effet démo** : Wow garanti pour prospects

## 🛠️ Stack Technique

- **Frontend:** React + Vite + TypeScript + Chakra UI
- **Backend:** Node.js + Express + Prisma + SQLite
- **Types:** Centralisés dans `shared/types.ts` (source unique de vérité)

## 📁 Architecture & Conventions

### Nomenclature stricte

```
Admin*     → Interface backoffice (AdminProductCard, AdminSidebar...)
Store*     → Interface vitrine (StoreLayout, StoreHeroHeader...)
Shared*    → Composants communs (SharedProductCard, SharedFilters...)
```

### Types centraux

```typescript
Product.attributes: string        // JSON stringifié (cohérent Prisma)
Product.categoryId: string        // ID catégorie
Product.category?: Category       // Objet catégorie (include optionnel)
Shop.categories?: Category[]      // Categories liées (include optionnel)
UniverseType: 'brewery'|'teaShop'|'beautyShop'|'herbShop'
```

## ⚠️ AdminContext - NE PAS CASSER

```typescript
// Context global admin fonctionnel
AdminProvider; // Wrapper app admin
useAdminShop(); // Hook boutique active admin
```

**Utilisé par:** Dashboard, Products, Categories → **Ne jamais modifier sans test**

## 🏪 Univers & Thématisation

```
brewery    → 🍺 orange (Houblon & Tradition)
teaShop    → 🍵 green  (Les Jardins de Darjeeling)
beautyShop → 💄 pink   (L'Écrin de Jade)
herbShop   → 🌿 teal   (Herboristerie du Moulin Vert)
```

## 🔧 Commandes Essentielles

```bash
# Développement
yarn dev              # Frontend (port 5173)
cd backend && yarn dev # Backend (port 3001)

# Qualité
yarn build            # Build production (OBJECTIF: 0 erreur)
yarn lint             # ESLint (OBJECTIF: 0 warning)

# Base de données
cd backend && yarn seed # Réinitialiser données demo
```

## 📂 Structure Importante

```
frontend/src/
├── components/
│   ├── admin/        # Interface backoffice
│   ├── store/        # Interface vitrines
│   └── shared/       # Composants réutilisables
├── contexts/
│   ├── AdminContext.tsx     # ⚠️ CRITIQUE - boutique active admin
│   └── UniverseContext.tsx  # Thématisation vitrines
├── pages/
│   ├── admin/        # Dashboard, Products, Categories
│   └── store/        # 4 vitrines (Brewery, TeaShop, BeautyShop, HerbShop)
├── shared/
│   └── types.ts      # ⚠️ SOURCE UNIQUE - tous les types
└── utils/
    └── universeMapping.ts   # Mapping shopType ↔ couleurs/noms
```

## 🎨 Règles Design

- **Chakra UI exclusivement** (thème automatique par univers)
- **Responsive obligatoire** (mobile-first)
- **Thématisation automatique** via UniverseProvider

## 🚨 Points d'Attention

1. **AdminContext fonctionnel** → Tester après chaque modif admin
2. **Types cohérents** → `shared/types.ts` = référence absolue
3. **Prisma schema** → Product.attributes = string (pas Record)
4. **beautyShop** (pas beatyShop) → Typo récurrente à éviter

## 🎯 Objectifs Actuels

- ✅ **Build clean** : `yarn build` sans erreurs TypeScript
- ✅ **Lint clean** : `yarn lint` sans warnings ESLint
- 🔄 **AdminContext préservé** : Dashboard/Products/Categories fonctionnels

---

_Documentation mise à jour après nettoyage code - Décembre 2024_
