# DOC2 - Nomenclature Technique DemoForge

## 🎯 Terminologie Standardisée

**Acteurs :**

- **Commerçant** = client qui achète la solution
- **Visiteur** = client final du commerçant
- **Prospect** = commerçant potentiel à convaincre

**Interfaces :**

- **Vitrine** = frontend public (visiteurs)
- **Backoffice** = interface admin (commerçant)

**Fonctionnalités :**

- **Filtres avancés** = filtres métier spécialisés par univers
- **Split view** = aperçu temps réel admin/vitrine
- **Attributs métier** = caractéristiques spécialisées par secteur

## 🏪 Configuration des Univers

| ID Technique | Nom Commercial                 | Type Commerce   |
| ------------ | ------------------------------ | --------------- |
| `brewery`    | "Houblon & Tradition"          | Brasserie       |
| `teaShop`    | "Les Jardins de Darjeeling"    | Salon de thé    |
| `beautyShop` | "L'Écrin de Jade"              | Institut beauté |
| `herbShop`   | "Herboristerie du Moulin Vert" | Herboristerie   |

## 🏗 Architecture Multi-Boutique

```
Commerçant (Merchant)
└── Boutiques (Shops) [1-N]
    ├── Catégories (Categories) [4]
    └── Produits (Products) [16]
```

**Hiérarchie des données :**

- 1 Commerçant → N Boutiques
- 1 Boutique → 4 Catégories fixes
- 1 Catégorie → 4 Produits

## 🔧 Conventions de Code

**Composants React :**

- Vitrine : `Store*` (StoreProductCard, StoreCategoryGrid)
- Backoffice : `Admin*` (AdminProductForm, AdminShopConfig)
- Communs : `Shared*` (SharedHeader, SharedModal)

**Hooks personnalisés :**

- `useShopData()` - données boutique active
- `useProductFilters()` - filtres produits
- `useMerchantAuth()` - authentification commerçant

**Services API :**

- `ShopService` - CRUD boutiques
- `ProductService` - CRUD produits
- `MerchantService` - gestion commerçants

## 📡 Structure Routes API

```
/api/merchant/:merchantId/shop/:shopId/products
/api/merchant/:merchantId/shop/:shopId/categories
/api/merchant/:merchantId/shops
/api/auth/merchant
```

## 💾 Modèles Prisma (Base)

```typescript
model Merchant {
  id    String @id @default(cuid())
  shops Shop[]
}

model Shop {
  id         String @id @default(cuid())
  shopType   String // brewery, tea-shop, etc.
  merchant   Merchant
  products   Product[]
  categories Category[]
}
```

## 🤖 Standards pour IA

**Contexte requis :**

- Toujours spécifier l'univers cible (`brewery`, `tea-shop`, etc.)
- Préciser l'interface (vitrine/backoffice)
- Indiquer le niveau multi-boutique si pertinent

**Formats de demande :**

- `@code brewery vitrine` - code pour brasserie côté vitrine
- `@admin multi-shop` - interface admin multi-boutique
- `@data tea-shop` - structure données salon de thé

## 📝 Sections à Compléter

- [ ] Conventions CSS/SCSS par univers
- [ ] Structure des fichiers de configuration
- [ ] Patterns de validation des données
- [ ] Gestion des erreurs standardisée
- [ ] Tests unitaires par composant
