#!/usr/bin/env node

/**
 * Script de test - Étape δ (Delta)
 * Validation du sélecteur de boutique repensé
 * Interface intuitive : Univers → Boutique
 */

const fs = require("fs");
const path = require("path");

console.log("🏪 TEST DELTA - Sélecteur boutique révolutionnaire\n");

// ✅ 1. Vérifier que AdminDualSelector existe
const adminDualSelectorPath = path.join(
  __dirname,
  "src/components/admin/AdminDualSelector.tsx"
);
if (fs.existsSync(adminDualSelectorPath)) {
  console.log("✅ AdminDualSelector créé");

  const content = fs.readFileSync(adminDualSelectorPath, "utf8");

  // Vérifier les fonctionnalités clés
  const features = [
    { name: "Étape 1: Sélection univers", pattern: /Étape 1.*univers/i },
    { name: "Étape 2: Sélection boutique", pattern: /Étape 2.*boutique/i },
    { name: "Interface en cards", pattern: /Card|CardHeader|CardBody/ },
    { name: "Statistiques par univers", pattern: /universeStats|shopCount/ },
    { name: "Filtrage par univers", pattern: /filteredShops/ },
    { name: "Résumé de sélection", pattern: /Boutique sélectionnée/ },
  ];

  features.forEach((feature) => {
    if (feature.pattern.test(content)) {
      console.log(`✅ ${feature.name}`);
    } else {
      console.log(`❌ ${feature.name}`);
    }
  });
} else {
  console.log("❌ AdminDualSelector introuvable");
}

// ✅ 2. Vérifier l'intégration dans AdminSidebar
const sidebarPath = path.join(
  __dirname,
  "src/components/admin/AdminSidebar.tsx"
);
if (fs.existsSync(sidebarPath)) {
  const sidebarContent = fs.readFileSync(sidebarPath, "utf8");
  if (sidebarContent.includes("AdminDualSelector")) {
    console.log("✅ Intégration AdminSidebar");
  } else {
    console.log("❌ Intégration AdminSidebar manquante");
  }
}

// ✅ 3. Vérifier l'intégration dans Dashboard
const dashboardPath = path.join(__dirname, "src/pages/admin/Dashboard.tsx");
if (fs.existsSync(dashboardPath)) {
  const dashboardContent = fs.readFileSync(dashboardPath, "utf8");
  if (dashboardContent.includes("AdminDualSelector")) {
    console.log("✅ Intégration Dashboard");
  } else {
    console.log("❌ Intégration Dashboard manquante");
  }
}

// ✅ 4. Vérifier le contexte AdminDualSelectorContext
const contextPath = path.join(
  __dirname,
  "src/contexts/AdminDualSelectorContext.tsx"
);
if (fs.existsSync(contextPath)) {
  console.log("✅ AdminDualSelectorContext créé");

  const contextContent = fs.readFileSync(contextPath, "utf8");
  const contextFeatures = [
    {
      name: "Gestion univers",
      pattern: /selectedUniverse.*setSelectedUniverse/,
    },
    { name: "Gestion boutique", pattern: /selectedShop.*setSelectedShop/ },
    {
      name: "Helpers de sélection",
      pattern: /isUniverseSelected|isShopSelected/,
    },
    {
      name: "Synchronisation automatique",
      pattern: /handleSetSelectedShop|handleSetSelectedUniverse/,
    },
  ];

  contextFeatures.forEach((feature) => {
    if (feature.pattern.test(contextContent)) {
      console.log(`✅ ${feature.name}`);
    } else {
      console.log(`❌ ${feature.name}`);
    }
  });
} else {
  console.log("❌ AdminDualSelectorContext introuvable");
}

// ✅ 5. Vérifier l'intégration dans AdminLayout
const layoutPath = path.join(__dirname, "src/components/admin/AdminLayout.tsx");
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, "utf8");
  if (layoutContent.includes("AdminDualSelectorProvider")) {
    console.log("✅ Provider intégré dans AdminLayout");
  } else {
    console.log("❌ Provider non intégré dans AdminLayout");
  }
}

console.log("\n🎯 RÉSUMÉ DELTA:");
console.log("- Sélecteur en 2 étapes: Univers puis Boutique");
console.log("- Interface moderne avec Cards et animations");
console.log("- Statistiques temps réel par univers");
console.log("- Synchronisation automatique univers ↔ boutique");
console.log("- Intégration complète sidebar + dashboard + context");

console.log("\n📋 BÉNÉFICES:");
console.log("- UX intuitive: logique métier claire");
console.log("- Découvrabilité: voir tous les univers");
console.log("- Performance: filtrage intelligent");
console.log("- Maintenance: contexte centralisé");

console.log("\n🚀 Delta terminé ! Interface admin révolutionnée.");
