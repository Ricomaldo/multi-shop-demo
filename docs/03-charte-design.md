# DOC3 - Charte Design UX DemoForge

## 🎨 Statut : En cours - Fondamentaux Chakra UI

**Attention :** Document de travail. Contenu minimal pour démarrage développement.

## 🏗 Principes Directeurs

**Priorité absolue :** Interface admin (backoffice) fonctionnelle avant esthétique
**Framework :** Chakra UI exclusivement
**Cohérence :** Système unifié adaptable par univers

## 🎨 Système de Design Chakra UI

### Thème de base

```typescript
// theme/index.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brewery: {
      50: "#fff7ed",
      100: "#ffedd5",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
    },
    teaShop: {
      50: "#f0fdf4",
      100: "#dcfce7",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    beautyShop: {
      50: "#fdf2f8",
      100: "#fce7f3",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
    },
    herbShop: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
    },
  },
});
```

## 🎯 Backoffice Admin

### Layout principal

- Sidebar navigation fixe
- Zone contenu principale responsive
- Header avec infos commerçant/boutique active

### Composants Admin standardisés

```typescript
// components/admin/AdminTable.tsx
interface AdminTableProps {
  data: any[];
  columns: Column[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  colorScheme: "brewery" | "teaShop" | "beautyShop" | "herbShop";
}

// components/admin/AdminForm.tsx
interface AdminFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  schema: ValidationSchema;
  colorScheme: string;
}

// components/admin/AdminSidebar.tsx
// Navigation cohérente avec état actif

// components/admin/AdminHeader.tsx
// En-tête avec contexte boutique/commerçant
```

### Composants par univers

- `AdminTable` avec `colorScheme="brewery"` pour brasserie
- `AdminForm` avec validation spécifique par univers
- `AdminSidebar` avec icônes adaptées (🍺 🍵 💄 🌿)
- `AdminHeader` avec branding univers

## 🛍 Vitrine (Phase 2)

### Grille produits

- 4 colonnes desktop, 2 mobile
- Cards uniformes avec image + infos essentielles
- Filtres par attributs d'univers

### Navigation

- Menu catégories horizontal
- Breadcrumb si navigation profonde

## 📱 Responsive

- Mobile-first obligatoire
- Breakpoints Chakra standard
- Grilles adaptatives automatiques

## 🔄 Thématisation par Univers

### brewery

- `colorScheme="orange"` composants Chakra

### teaShop

- `colorScheme="green"` composants Chakra

### beatyShop

- `colorScheme="pink"` composants Chakra

### herbShop

- `colorScheme="teal"` composants Chakra

## 📝 À Compléter Phase 2

- [ ] Maquettes détaillées par univers
- [ ] Micro-interactions spécifiques
- [ ] Guidelines images/iconographie
- [ ] Tests utilisabilité
