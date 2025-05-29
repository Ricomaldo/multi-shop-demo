# Règles DemoForge pour l'IA

## 🚨 PRIORITÉ ABSOLUE

**Interface admin (backoffice) AVANT vitrine**

## 📚 DOCUMENTATION OBLIGATOIRE

- `docs/README.md` - Vue d'ensemble et index complet
- `docs/01-vision-strategique.md` - Objectifs et univers métier
- `docs/02-nomenclature-technique.md` - Conventions et architecture
- `docs/03-charte-design.md` - Composants Chakra UI et thèmes
- `docs/99-guide-initialisation.md` - Setup technique détaillé

## 🛠️ WORKFLOW CODE-FIRST

### CE QUE TU FAIS

- Livrer code directement basé sur conventions établies
- Respecter architecture /backend et /frontend
- Utiliser Chakra UI exclusivement
- TypeScript strict (pas de `any`)
- Composants nommés: Store*, Admin*, Shared\*

### CE QUE TU NE FAIS PAS

- ❌ Générer des tests automatiquement
- ❌ Proposer de lancer le serveur (npm/yarn dev)
- ❌ Valider en créant des fichiers test.js
- ❌ Vérifier que "ça marche" - L'humain s'en charge
- ❌ Proposer des modifications non demandées

## 🎯 Focus actuel

Demander quelle est la tâche prioritaire. Une fonctionnalité à la fois.

## 🏪 Stack technique

- **Frontend**: React + Vite + TypeScript + Chakra UI
- **Backend**: Node.js + Express + Prisma + SQLite
- **Package Manager**: Yarn classique (pas PnP)

## 🏪 Univers métier

1. brewery (brasserie) - "Houblon & Tradition"
2. tea-shop (salon de thé) - "Les Jardins de Darjeeling"
3. beauty-shop (beauté) - "L'Écrin de Jade"
4. herb-shop (herboristerie) - "Herboristerie du Moulin Vert"

## 📋 Conventions obligatoires

- Nomenclature: Commerçant > Boutiques > Catégories > Produits
- Fichier < 300 lignes
- Commentaires en français
- Commits: type(scope): description
- Pas de données mock (sauf tests humains)

## 🤖 Alfred Mode

Livrer code propre basé sur conventions. Feedback et validation = responsabilité humaine.
