# DemoForge

Plateforme de démonstration e-commerce multi-univers avec interface d'administration complète.

Une vitrine technique showcasant 4 expériences utilisateur distinctes, chacune avec sa propre identité visuelle et son parcours client optimisé.

## 🎯 Objectif

Démontrer la capacité à créer des expériences e-commerce différenciées sur une même architecture technique, permettant de s'adapter à différents secteurs d'activité tout en conservant un socle technique unifié.

## ⚡ Stack Technique

- **Frontend** : React 19 + TypeScript + Chakra UI + Vite
- **Backend** : Node.js + Express + TypeScript
- **Base de données** : Prisma ORM + SQLite
- **Tests** : Jest + Testing Library
- **Styling** : Emotion + Framer Motion

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+
- Yarn 4.9+

### Lancement du projet

```bash
# Backend (port 3001)
cd backend
yarn install
yarn db:generate
yarn db:push
yarn dev

# Frontend (port 5173)
cd frontend
yarn install
yarn dev
```

### Base de données

```bash
# Initialiser la DB avec des données de test
cd backend
yarn reset-db

# Interface d'administration Prisma
yarn db:studio
```

## 🛍️ Univers Disponibles

### 🍺 Brewery - "Craft Authentique"

- **Cible** : Artisans brasseurs et amateurs de bières craft
- **Style** : Chaleureux, robuste, angles marqués
- **Couleurs** : Palette ambrée et orange profond

### 🍃 TeaShop - "Zen Wellness"

- **Cible** : Consommateurs wellness en quête de sérénité
- **Style** : Épuré, courbes douces, typographie serif
- **Couleurs** : Palette verte apaisante

### 💄 Beauty - "Luxe Premium"

- **Cible** : Consommatrices exigeantes, tendances beauté
- **Style** : Sophistiqué, micro-interactions raffinées
- **Couleurs** : Rose-corail avec touches dorées

### 🌿 Herb - "Bio Authentique"

- **Cible** : Consommateurs conscients, solutions naturelles
- **Style** : Naturel brut, formes organiques
- **Couleurs** : Verte forestière avec accents teal

## 🔧 Fonctionnalités

### Côté Client

- Catalogue produits avec filtrage et recherche
- Gestion du panier et commandes
- Interface responsive et accessible
- Thématisation automatique par univers

### Administration

- Gestion des produits et catégories
- Upload d'images optimisé
- Statistiques et analytics
- Interface d'administration unifiée

## 📁 Architecture

```
demoforge/
├── backend/          # API REST + Prisma
├── frontend/         # Interface React
├── shared/           # Types et utilitaires partagés
└── README.md
```

## 🎨 Système de Design

Chaque univers dispose de son propre système de tokens (couleurs, espacements, polices) tout en partageant les composants de base. La différenciation se fait via les variants Chakra UI.

---

**DemoForge** - Démonstration technique d'une architecture e-commerce adaptable et scalable.
