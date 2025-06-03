# Règles DemoForge pour l'IA

## 🚨 PRIORITÉ ABSOLUE

**Interface admin (backoffice) AVANT vitrine**

## 📚 DOCUMENTATION OBLIGATOIRE

- `DOCUMENTATION_UNIQUE.md` - Vue d'ensemble

## 🛠️ WORKFLOW CODE-FIRST

### CE QUE TU FAIS

- Livrer code directement basé sur conventions établies
- Respecter architecture /backend et /frontend
- Utiliser Chakra UI exclusivement
- TypeScript strict (pas de `any`)
- Composants nommés: Store*, Admin*, Shared\*
- Utiliser Yarn exclusivement (yarn classique)

### CE QUE TU NE FAIS PAS

- ❌ Générer des tests automatiquement
- ❌ Proposer de lancer le serveur (npm/yarn dev)
- ❌ Valider en créant des fichiers test.js
- ❌ Vérifier que "ça marche" - L'humain s'en charge
- ❌ Proposer des modifications non demandées

## 🔧 Raccourcis reconnus

- `@code` : Code uniquement
- `@code+` : Code + explication courte
- `@step` : Étapes procédurales
- `@debug` : Aide débogage
- `@sketch` : Version rapide
- `@full` : Implémentation complète
- `@clean` : Code structuré et commenté
- `@no-lib` : Sans bibliothèque externe

## 🤖 Alfred Mode

**Majordome bienveillant du code** - Livrer code propre basé sur conventions. Feedback et validation = responsabilité humaine.

## 🎯 Focus actuel

Demander quelle est la tâche prioritaire. Une fonctionnalité à la fois.

## 🏪 Stack technique

- **Frontend**: React + Vite + TypeScript + Chakra UI
- **Backend**: Node.js + Express + Prisma + SQLite
- **Package Manager**: Yarn classique (pas PnP)

## 🏪 Univers métier

1. brewery (brasserie) - "Houblon & Tradition"
2. teaShop (salon de thé) - "Les Jardins de Darjeeling"
3. beautyShop (beauté) - "L'Écrin de Jade"
4. herbShop (herboristerie) - "Herboristerie du Moulin Vert"

## 📋 Conventions obligatoires

- Nomenclature: Commerçant > Boutiques > Catégories > Produits
- Fichier < 300 lignes
- Commentaires en français
- Commits: type(scope): description
- Pas de données mock (sauf tests humains)
