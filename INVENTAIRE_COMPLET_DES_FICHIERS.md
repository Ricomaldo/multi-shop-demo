# INVENTAIRE COMPLET DES FICHIERS - DEMOFORGE

## 🏷️ LÉGENDE DES PASTILLES

🔴 **CRITIQUE** - Ne pas toucher (AdminContext, types centraux, build)
🟠 **IMPORTANT** - Cœur métier DemoForge (pages principales, composants clés)
🟡 **MODIFIABLE** - Peut être modifié avec précaution
🟢 **ÉVOLUTIF** - Créé par Alfred, améliorable facilement
🔵 **STANDARD** - Configuration standard, rarement modifié
🟣 **EXPÉRIMENTAL** - OnWork, en développement
⚫ **SUPPRIMABLE** - Peut être supprimé si inutile
⚪ **TEMPORAIRE** - Fichiers système (.DS_Store, etc.)

---

## 📋 CONFIGURATION RACINE DU PROJET

### Documentation & règles

```
README.md                    	🟡 - Présente le projet
AI_RULES.md                  	🔴 - Définit les règles Robin
DOCUMENTATION_UNIQUE.md      	🟠 - Documente l'architecture
.gitmessage                  	🔵 - Template commits Git
```

### Configuration générale

```
.gitignore                   	🔵 - Ignore fichiers Git
.vscode/settings.json        	🔵 - Configure VSCode
.DS_Store                    	⚪ - Cache système macOS
shared/types.ts              	🔴 - Centralise tous les types
```

---

## 🔧 BACKEND

### Configuration & Setup

```
backend/package.json         	🔵 - Gère dépendances NPM
backend/package-lock.json    	🔵 - Verrouille versions
backend/README.md            	🟡 - Documente le backend
backend/tsconfig.json        	🔵 - Configure TypeScript
backend/.yarnrc.yml          	🔵 - Configure Yarn
backend/.editorconfig        	🔵 - Standardise l'éditeur
backend/.gitattributes       	🔵 - Configure Git
backend/.gitignore           	🔵 - Ignore fichiers backend
backend/.env                 	🔵 - Variables environnement
backend/jest.config.js       	🔵 - Configure tests Jest
```

### Base de données Prisma

```
backend/prisma/seed.ts                                        	🟠 - Initialise données démo
backend/prisma/migrations/migration_lock.toml                 	🔵 - Verrouille migrations
backend/prisma/migrations/20250527132715_init/migration.sql   	🔴 - Crée structure initiale
backend/prisma/migrations/20250529143426_add_shop_infos/migration.sql    	🟠 - Ajoute infos boutiques
backend/prisma/migrations/20250530091237_add_category_image/migration.sql 	🟠 - Ajoute images catégories
backend/prisma/migrations/20250602213018_add_image_url/migration.sql      	🟠 - Ajoute URLs images
```

### Code source Backend

```
backend/src/server.ts                	🔴 - Lance le serveur Express
backend/src/middleware/errorHandler.ts  	🟠 - Gère les erreurs
backend/src/routes/api.ts            	🟠 - Route principale API
backend/src/routes/categories.ts     	🟠 - Routes catégories
backend/src/routes/products.ts       	🟠 - Routes produits
backend/src/routes/admin/index.ts    	🟠 - Routes admin principales
backend/src/routes/admin/categories.ts  	🟠 - Routes admin catégories
backend/src/routes/admin/products.ts 	🟠 - Routes admin produits
backend/src/routes/admin/shops.ts    	🟠 - Routes admin boutiques
```

---

## 🎨 FRONTEND

### Configuration & Setup

```
frontend/package.json        	🔵 - Gère dépendances frontend
frontend/README.md           	🟡 - Documente le frontend
frontend/index.html          	🔵 - Template HTML principal
frontend/vite.config.ts      	🔵 - Configure Vite
frontend/eslint.config.js    	🔵 - Configure ESLint
frontend/tsconfig.json       	🔵 - Configure TypeScript
frontend/tsconfig.app.json   	🔵 - Config TS application
frontend/tsconfig.node.json  	🔵 - Config TS Node
frontend/.yarnrc.yml         	🔵 - Configure Yarn frontend
frontend/.gitignore          	🔵 - Ignore fichiers frontend
frontend/.vscode/extensions.json  	🔵 - Recommande extensions
frontend/.vscode/settings.json    	🔵 - Configure VSCode frontend
frontend/.DS_Store           	⚪ - Cache système macOS
```

### Assets & Resources

```
frontend/public/vite.svg          	🔵 - Logo Vite
frontend/public/images/.DS_Store   	⚪ - Cache images macOS
frontend/public/.DS_Store          	⚪ - Cache public macOS
frontend/src/assets/react.svg      	🔵 - Logo React
frontend/src/vite-env.d.ts         	🔵 - Types Vite environnement
```

### Application principale

```
frontend/src/main.tsx        	🔴 - Point d'entrée React
frontend/src/App.tsx         	🔴 - Composant racine
frontend/src/index.css       	🟡 - Styles globaux
```

### Contextes (état global)

```
frontend/src/contexts/AdminContext.tsx     	🔴 - Gère état admin global
frontend/src/contexts/UniverseContext.tsx  	🟠 - Gère thématisation univers
```

### Hooks custom

```
frontend/src/hooks/index.ts                 	🟢 - Exporte tous les hooks
frontend/src/hooks/useAdminContext.ts        	🔴 - Accède contexte admin
frontend/src/hooks/useShopData.ts            	🟠 - Récupère données boutiques
frontend/src/hooks/useShopByType.ts          	🟠 - Filtre boutique par type
frontend/src/hooks/useUniverse.ts            	🟠 - Accède contexte univers
frontend/src/hooks/useOpeningStatus.ts       	🟢 - Calcule statut ouverture
frontend/src/hooks/useStoreHandlers.ts       	🟠 - Gère actions boutique
frontend/src/hooks/useAdvancedProductFilters.ts  	🟢 - Filtre produits avancé
frontend/src/hooks/useBaseProductFilters.ts  	🟢 - Filtre produits de base
```

### Services API

```
frontend/src/services/adminProductService.ts    	🟠 - Gère API produits admin
frontend/src/services/adminShopService.ts       	🟠 - Gère API boutiques admin
frontend/src/services/adminCategoriesService.ts 	🟠 - Gère API catégories admin
frontend/src/services/shopService.ts            	🟠 - Gère API boutiques publiques
frontend/src/services/storeProductService.ts    	🟠 - Gère API produits vitrine
```

### Pages principales

```
frontend/src/pages/Home.tsx                      	🟠 - Affiche page d'accueil
```

### Pages Admin (backoffice)

```
frontend/src/pages/admin/Dashboard.tsx       	🔴 - Affiche tableau de bord
frontend/src/pages/admin/Products.tsx        	🟠 - Gère produits admin
frontend/src/pages/admin/Categories.tsx      	🟠 - Gère catégories admin
frontend/src/pages/admin/Settings.tsx        	🟡 - Configure paramètres
frontend/src/pages/admin/StockTransfer.tsx   	🟡 - Transfère stocks
```

### Pages Store (vitrines)

```
frontend/src/pages/store/StoreCatalogueView.tsx  	🟠 - Affiche catalogue produits
frontend/src/pages/store/StoreProductDetail.tsx  	🟠 - Affiche détail produit
frontend/src/pages/store/StoreContact.tsx        	🟡 - Affiche contact boutique
frontend/src/pages/store/StoreBeautyShop.tsx     	🟠 - Affiche vitrine beauté
frontend/src/pages/store/StoreBrewery.tsx        	🟠 - Affiche vitrine brasserie
frontend/src/pages/store/StoreHerbShop.tsx       	🟠 - Affiche vitrine herboristerie
frontend/src/pages/store/StoreTeaShop.tsx        	🟠 - Affiche vitrine salon thé
```

### Composants Admin

```
frontend/src/components/admin/index.ts            	🟢 - Exporte composants admin
frontend/src/components/admin/AdminLayout.tsx     	🟠 - Structure layout admin
frontend/src/components/admin/AdminDashboard.tsx  	🟠 - Compose tableau de bord
frontend/src/components/admin/AdminSidebar.tsx    	🔴 - Affiche navigation admin
frontend/src/components/admin/AdminBreadcrumb.tsx 	🟡 - Affiche fil d'Ariane
frontend/src/components/admin/AdminShopSelector.tsx   	🟠 - Sélectionne boutique active
frontend/src/components/admin/AdminShopForm.tsx   	🟠 - Édite boutiques
frontend/src/components/admin/AdminProductForm.tsx    	🟠 - Édite produits
frontend/src/components/admin/AdminProductList.tsx    	🟠 - Liste produits admin
frontend/src/components/admin/AdminPreviewLayout.tsx  	🟠 - Prévisualise vitrine
```

### Composants Store (vitrines)

```
frontend/src/components/store/index.ts              	🟢 - Exporte composants store
frontend/src/components/store/StoreLayout.tsx       	🟠 - Structure layout vitrine
frontend/src/components/store/StoreHeader.tsx       	🟠 - Affiche en-tête vitrine
frontend/src/components/store/StoreFooter.tsx       	🟡 - Affiche pied de page
frontend/src/components/store/StoreHeroSection.tsx  	🟠 - Affiche section héro
frontend/src/components/store/StoreLocationSelector.tsx     	🟡 - Sélectionne localisation
frontend/src/components/store/StoreShopInfoBadge.tsx        	🟠 - Affiche infos boutique
frontend/src/components/store/sections/BeautySection.tsx    	🟠 - Section spéciale beauté
frontend/src/components/store/sections/BrewerySection.tsx   	🟠 - Section spéciale brasserie
frontend/src/components/store/sections/HerbSection.tsx     	🟠 - Section spéciale herboristerie
frontend/src/components/store/sections/TeaSection.tsx      	🟠 - Section spéciale salon thé
```

### Composants Shared (réutilisables)

```
frontend/src/components/shared/index.ts                 	🟢 - Exporte composants shared
frontend/src/components/shared/LoadingState.tsx         	🟡 - Affiche état chargement
frontend/src/components/shared/ProductGrid.tsx          	🟠 - Affiche grille produits
frontend/src/components/shared/ProductAttributes.tsx    	🟡 - Affiche attributs produit
frontend/src/components/shared/SharedProductPreviewCard.tsx     	🔴 - Affiche carte produit
frontend/src/components/shared/SharedProductDetailView.tsx      	🟠 - Affiche détail produit
frontend/src/components/shared/SharedProductFilters.tsx 	🟢 - Filtre produits unifié
frontend/src/components/shared/SharedCategoryFilter.tsx 	🟠 - Filtre par catégorie
frontend/src/components/shared/SharedShopInfoBadge.tsx  	🟠 - Badge infos boutique
frontend/src/components/shared/SharedUniverseSelector.tsx       	🟡 - Sélectionne univers
```

### Composants OnWork (en développement)

```
frontend/src/components/onwork/AdminStockCarousel.tsx    	🟣 - Carrousel stock (WIP)
frontend/src/components/onwork/AdminStockEditor.tsx      	🟣 - Éditeur stock (WIP)
frontend/src/components/onwork/AdminStockTransferForm.tsx        	🟣 - Formulaire transfert (WIP)
```

### Thème & Design

```
frontend/src/theme/index.ts              	🟠 - Configure thème Chakra
frontend/src/theme/universeColors.ts     	🟠 - Définit couleurs univers
frontend/src/theme/components/shared.ts  	🟡 - Styles composants partagés
```

### Types TypeScript

```
frontend/src/types/index.ts              	🟢 - Exporte types frontend
frontend/src/types/global.d.ts           	🟡 - Types globaux TypeScript
frontend/src/types/productAttributes.ts  	⚫ - Types attributs produits (obsolète)
```

### Utilitaires

```
frontend/src/utils/index.ts                	🟢 - Exporte utilitaires
frontend/src/utils/universeMapping.ts      	🟠 - Mappe types vers couleurs
frontend/src/utils/categoryHelpers.ts      	🟡 - Aide gestion catégories
frontend/src/utils/productAttributes.ts    	⚫ - Aide attributs (obsolète)
frontend/src/utils/productFilterHelpers.ts 	⚫ - Aide filtres (obsolète)
```

---

## 📊 STATISTIQUES

**Total fichiers :** ~140 fichiers
**Backend :** ~20 fichiers
**Frontend :** ~120 fichiers

**Répartition Frontend :**

- Configuration : 15 fichiers
- Pages : 13 fichiers
- Composants : 35 fichiers
- Services/Hooks : 20 fichiers
- Utils/Types/Theme : 15 fichiers

## 🎯 ANALYSE PAR PASTILLES

🔴 **CRITIQUE (7)** - AdminContext, types.ts, main.tsx, Dashboard, AdminSidebar, SharedProductPreviewCard
🟠 **IMPORTANT (35)** - Cœur métier, pages principales, composants business
🟡 **MODIFIABLE (12)** - Composants secondaires, utilitaires simples
🟢 **ÉVOLUTIF (8)** - Créations Alfred récentes, facilement modifiables
🔵 **STANDARD (40)** - Configuration, rarement touché
🟣 **EXPÉRIMENTAL (3)** - Composants OnWork en développement
⚫ **SUPPRIMABLE (3)** - productAttributes.ts, productFilterHelpers.ts (après refacto)
⚪ **TEMPORAIRE (4)** - Fichiers système .DS_Store
