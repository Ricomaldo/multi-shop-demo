🔍 AUDIT HOOKS CORE - PRIORITÉS RÉAJUSTÉES
✅ HOOKS VALIDÉS - À CONSERVER

1. useStoreDataQuery.ts
   ✅ CORE HOOK - Ne pas toucher
   Utilisé massivement et donne satisfaction
   Performance optimale avec React Query
   API stable et complète
2. useStorePage.ts
   ✅ HOOK ACTIF - Largement utilisé
   8+ composants l'utilisent (pages store + contexts)
   Logique centrale pour la navigation store
   À conserver mais renommer le contexte
3. useStoreHandlers.ts
   ✅ HOOK UTILITAIRE - Utilisé
   8 composants l'utilisent pour les interactions
   Centralise bien la logique handleAddToCart/handleViewProduct
   À conserver tel quel
4. useShopContent.ts
   ✅ HOOK CONTENT - Utilisé activement
   3 composants l'utilisent (StoreLandingGeneric, StoreHeroSection, UniverseSection)
   Gère le contenu statique des univers
   À conserver tel quel
   ❌ DEAD CODE IDENTIFIÉ
5. useShopByType.ts
   ❌ DEAD CODE - Uniquement dans /backup/
   Utilisé seulement dans pages/backup/ (StoreBeautyShop, StoreTeaShop, StoreHerbShop)
   Duplique la fonctionnalité de useStoreDataQuery + filtrage
   SUPPRIMER - Remplacé par useStorePage
6. useSimpleStore.ts
   ❌ DEAD CODE - Aucune utilisation
   Grep = 0 résultat d'utilisation
   Hook orphelin
   SUPPRIMER
7. useShopData (référencé mais manquant)
   ❌ DEAD CODE - Hook fantôme
   Importé dans 4 fichiers /backup/ mais fichier n'existe plus
   Probablement supprimé lors du nettoyage précédent
   Nettoyer les imports cassés
   🎯 PRIORITÉS RÉAJUSTÉES
   🔥 URGENT - Nettoyage immédiat
8. Supprimer dead code hooks
   Apply to TO_DO.md
   Run
   ts
9. Nettoyer imports cassés dans /backup/
   Apply to TO_DO.md
   tsx
10. Renommer SimpleStoreContext → StoreContext
    Apply to TO_DO.md
    Run
    tsx
    📅 CETTE SEMAINE - API Hooks manquante
11. Créer hooks API client-ready
    Apply to TO_DO.md
    }
    📊 IMPACT NETTOYAGE
    Hooks à supprimer : 2
    useShopByType.ts (remplacé par useStorePage)
    useSimpleStore.ts (inutilisé)
    Imports cassés à nettoyer : 4 fichiers
    Tous dans /backup/ donc pas d'impact production
    Hooks CORE conservés : 4
    useStoreDataQuery.ts ✅ (intouchable)
    useStorePage.ts ✅ (hook principal)
    useStoreHandlers.ts ✅ (utilitaire)
    useShopContent.ts ✅ (contenu)
    Résultat : Architecture hooks simplifiée, plus de dead code, API claire pour Palier 2
    Score Conformité Implementation Guide après nettoyage : 85% ✅
