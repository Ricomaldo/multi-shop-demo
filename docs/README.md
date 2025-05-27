# 📚 Documentation DemoForge

## 🎯 Outil de démonstration multi-boutiques avec backoffice admin prioritaire

### 📋 Index Documentaire

| Document                                                          | Statut      | Complétude | Priorité |
| ----------------------------------------------------------------- | ----------- | ---------- | -------- |
| **[01 - Vision Stratégique](./01-vision-strategique.md)**         | ✅ Stable   | 85%        | Critique |
| **[02 - Nomenclature Technique](./02-nomenclature-technique.md)** | ✅ Stable   | 90%        | Critique |
| **[03 - Charte Design UX](./03-charte-design.md)**                | 🚧 En cours | 40%        | Moyenne  |
| **[04 - Scénarios Démo](./04-scenarios-demo.md)**                 | 🚧 En cours | 30%        | Faible   |
| **[99 - Guide Initialisation](./99-guide-initialisation.md)**     | ✅ Complet  | 100%       | Critique |

### 🚨 Priorité Absolue : Interface Admin

Tous les développements doivent prioriser le **backoffice admin** avant la vitrine.

### 🛠️ Stack Technique

- **Frontend** : React + Vite + TypeScript + Chakra UI
- **Backend** : Node.js + Express + Prisma + SQLite
- **Tests** : Jest (couverture >80%)
- **Package Manager** : Yarn classique exclusivement (pas PnP)

### 🏪 Univers Métier

1. **brewery** - Houblon & Tradition (brasserie)
2. **tea-shop** - Les Jardins de Darjeeling (salon de thé)
3. **beauty-shop** - L'Écrin de Jade (institut beauté)
4. **herb-shop** - Herboristerie du Moulin Vert (herboristerie)

### 📝 Conventions

- **Nomenclature** : Commerçant > Boutiques > Catégories > Produits
- **Composants** : Store* (vitrine), Admin* (backoffice), Shared\* (communs)
- **Commits** : `type(scope): description` en français
- **TypeScript** : Strict, pas de `any`, props explicitement typées

### 🔄 Workflow Documentation

1. **Lecture** : Commencer par 01-vision puis 02-nomenclature
2. **Développement** : Suivre 99-guide-initialisation
3. **Design** : Consulter 03-charte-design (en cours)
4. **Commercial** : Préparer avec 04-scenarios-demo (futur)

### 🤖 Pour l'IA

Utiliser les commandes :

- `@docs` - Consulter la documentation
- `@admin` - Focus interface admin
- `@brewery` / `@tea-shop` / `@beauty-shop` / `@herb-shop` - Contexte univers

---

_Dernière mise à jour : Décembre 2024_
