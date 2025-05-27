# 🎨 Système de Thématisation DemoForge

## Vue d'ensemble

Le système de thématisation permet d'adapter automatiquement l'interface selon l'univers métier sélectionné (brewery, tea-shop, beauty-shop, herb-shop).

## Structure

```
frontend/src/
├── theme/
│   ├── index.ts              # Thème principal Chakra UI
│   ├── universeColors.ts     # Palettes de couleurs par univers
│   └── README.md            # Cette documentation
├── contexts/
│   └── UniverseContext.tsx   # Contexte React pour gérer l'univers actuel
└── components/
    ├── shared/              # Composants adaptatifs
    ├── admin/               # Interface admin thématisée
    └── store/               # Vitrines thématisées
```

## Utilisation

### 1. Dans un composant

```tsx
import { useUniverse } from "../../contexts/UniverseContext";
import { Button } from "@chakra-ui/react";

export const MonComposant: React.FC = () => {
  const { getColorScheme } = useUniverse();

  return <Button colorScheme={getColorScheme()}>Bouton thématisé</Button>;
};
```

### 2. Changer d'univers

```tsx
import { useUniverse } from "../../contexts/UniverseContext";

export const UniverseSelector: React.FC = () => {
  const { universe, setUniverse } = useUniverse();

  return (
    <select
      value={universe}
      onChange={(e) => setUniverse(e.target.value as UniverseType)}
    >
      <option value="brewery">Brasserie</option>
      <option value="teaShop">Salon de thé</option>
      <option value="beautyShop">Institut beauté</option>
      <option value="herbShop">Herboristerie</option>
    </select>
  );
};
```

## Palettes de Couleurs

### 🍺 Brewery (Brasserie)

- **Principal** : `#ffc107` (ambre/doré)
- **Usage** : Tons chauds évoquant la bière et le malt

### 🍵 Tea Shop (Salon de thé)

- **Principal** : `#8bc34a` (vert naturel)
- **Usage** : Tons verts évoquant le thé et la nature

### 💄 Beauty Shop (Institut beauté)

- **Principal** : `#e91e63` (rose/corail)
- **Usage** : Tons roses évoquant la beauté et l'élégance

### 🌿 Herb Shop (Herboristerie)

- **Principal** : `#4caf50` (vert profond)
- **Usage** : Tons verts forestiers évoquant les plantes médicinales

## Composants Adaptatifs

### SharedProductCard

Carte produit qui s'adapte automatiquement :

- **Couleurs** : Badge et boutons selon l'univers
- **Mode** : Admin (bouton modifier) ou Store (bouton panier)

### AdminUniverseSelector

Sélecteur d'univers pour l'interface admin :

- **Visuel** : Boutons avec icônes et noms des boutiques
- **Fonctionnel** : Change le thème en temps réel

## Règles de Développement

1. **Toujours utiliser `getColorScheme()`** pour les composants Chakra UI
2. **Préférer les composants Shared\*** pour la réutilisabilité
3. **Tester avec tous les univers** pour vérifier la cohérence
4. **Respecter les palettes définies** dans `universeColors.ts`

## Tests

Les composants thématisés doivent être testés avec le `TestWrapper` :

```tsx
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider theme={theme}>
    <UniverseProvider defaultUniverse="brewery">{children}</UniverseProvider>
  </ChakraProvider>
);
```

## Évolutions Futures

- [ ] Thèmes sombres par univers
- [ ] Animations spécifiques par univers
- [ ] Polices personnalisées par univers
- [ ] Icônes SVG personnalisées
