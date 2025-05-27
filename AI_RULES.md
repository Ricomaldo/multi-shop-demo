# Règles DemoForge pour l'IA

## 📚 DOCUMENTATION OBLIGATOIRE

**Avant toute suggestion, consulter :**

- `docs/README.md` - Vue d'ensemble et index complet
- `docs/01-vision-strategique.md` - Objectifs et univers métier
- `docs/02-nomenclature-technique.md` - Conventions et architecture
- `docs/03-charte-design.md` - Composants Chakra UI et thèmes
- `docs/99-guide-initialisation.md` - Setup technique détaillé

## 🚨 PRIORITÉ ABSOLUE

**Interface admin (backoffice) AVANT vitrine**

## 📋 Checklist avant chaque suggestion

### Documentation

- [ ] Vérifie cohérence avec docs/02-nomenclature-technique.md
- [ ] Respecte l'architecture docs/99-guide-initialisation.md
- [ ] Suit les conventions de nommage établies
- [ ] Utilise les composants Chakra UI de docs/03-charte-design.md
- [ ] Respecte les objectifs docs/01-vision-strategique.md

### Architecture

- [ ] Respecte la séparation /backend et /frontend
- [ ] Utilise Chakra UI exclusivement
- [ ] TypeScript strict (pas de `any`)
- [ ] Props explicitement typées

### Structure

- [ ] Nomenclature: Commerçant > Boutiques > Catégories > Produits
- [ ] Composants nommés: Store*, Admin*, Shared\*
- [ ] Fichier < 300 lignes

### Tests

- [ ] Tests Jest inclus
- [ ] Couverture > 80%
- [ ] Dossier **tests**

### Conventions

- [ ] Commentaires en français
- [ ] Commits: type(scope): description
- [ ] Yarn classique uniquement (pas PnP)
- [ ] Pas de données mock (sauf tests)

## 🎯 Focus actuel

Toujours demander quelle est la tâche prioritaire avant de proposer des modifications non essentielles.

## 🛠️ Stack technique

- **Frontend**: React + Vite + TypeScript + Chakra UI
- **Backend**: Node.js + Express + Prisma + SQLite
- **Tests**: Jest
- **Package Manager**: Yarn classique (pas PnP)

## 🏪 Univers métier

1. brewery (brasserie) - "Houblon & Tradition"
2. tea-shop (salon de thé) - "Les Jardins de Darjeeling"
3. beauty-shop (beauté) - "L'Écrin de Jade"
4. herb-shop (herboristerie) - "Herboristerie du Moulin Vert"

## 🔍 Commandes utiles pour l'IA

- `@docs` - Consulter la documentation
- `@admin` - Focus interface admin
- `@brewery` - Contexte brasserie
- `@tea-shop` - Contexte salon de thé
