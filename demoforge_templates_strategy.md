# DemoForge - Stratégie Templates Univers

## Document Stratégique : 4 Flows UX Différenciés

**Date :** Juin 2025  
**Équipe :** Alfred Pennyworth (Architecture) + Robin (Implémentation)  
**Objectif :** Transformer 4 univers en expériences utilisateur complètes et différenciées  
**Timeline :** 1 heure d'implémentation maximum

---

## EXECUTIVE SUMMARY

### Vision Stratégique

DemoForge évoluera de quatre boutiques thématiquement colorées vers quatre expériences utilisateur distinctes et mémorables. Chaque univers proposera un parcours complet cohérent depuis la landing page jusqu'à la page contact, en exploitant l'architecture technique existante tout en créant une différenciation business réelle.

### Objectifs Mesurables

L'implémentation réussie se caractérise par la capacité d'un prospect à identifier immédiatement l'univers métier en naviguant sur n'importe quelle page du flow, tout en conservant l'intégralité des fonctionnalités actuelles. La différenciation doit être perceptible au niveau du ressenti utilisateur sans nécessiter d'analyse détaillée.

---

## DIRECTION ARTISTIQUE PAR UNIVERS

### Universe Brewery : "Craft Authentique"

**Persona :** Artisan passionné, attaché aux traditions brassicoles, valorisant l'authenticité et le savoir-faire manuel.

**Mood visuel :** Chaleur conviviale des brasseries artisanales, matières naturelles, robustesse assumée. L'interface évoque la texture du bois, la consistance du houblon et l'authenticité du processus artisanal.

**Direction UI :** Angles marqués avec `borderRadius` minimal ou nul, typographie sans-serif robuste à fort contraste, espacements généreux pour respirer, palette ambrée dominante avec accents orange profond. Les interactions privilégient la solidité perçue aux effets sophistiqués.

**Expérience cible :** L'utilisateur ressent immédiatement l'authenticité craft et la passion artisanale à travers chaque interaction.

### Universe TeaShop : "Zen Wellness"

**Persona :** Consommateur recherchant sérénité et bien-être, sensible aux rituels apaisants, valorisant la qualité et l'origine des produits.

**Mood visuel :** Épurement japonais, respiration visuelle, harmonie naturelle. L'interface inspire la tranquillité des jardins de thé et la méditation du rituel de dégustation.

**Direction UI :** Courbes douces avec `borderRadius` généreux, typographie serif élégante pour les titres, espacements spacieux créant des zones de respiration, palette verte apaisante avec nuances subtiles. Les animations sont fluides et discrètes.

**Expérience cible :** L'utilisateur éprouve une sensation de calme et de raffinement à chaque étape de navigation.

### Universe Beauty : "Luxe Premium"

**Persona :** Consommatrice exigeante, sensible aux tendances esthétiques, recherchant l'excellence et la sophistication dans les soins personnels.

**Mood visuel :** Sophistication parisienne, finitions soignées, élégance contemporaine. L'interface reflète le luxe accessible et l'attention portée aux détails esthétiques.

**Direction UI :** Formes équilibrées avec `borderRadius` modéré, typographie moderne sans-serif de grande qualité, micro-interactions subtiles, palette rose-corail avec touches dorées. Les effets de survol sont raffinés et précis.

**Expérience cible :** L'utilisatrice perçoit immédiatement le positionnement premium et l'expertise beauté.

### Universe Herb : "Bio Authentique"

**Persona :** Consommateur conscient, privilégiant les solutions naturelles, attaché aux pratiques traditionnelles et aux certifications biologiques.

**Mood visuel :** Naturel brut, sincérité des matières premières, connexion à la terre. L'interface évoque l'authenticité des remèdes traditionnels et la confiance en la nature.

**Direction UI :** Formes organiques avec `borderRadius` variable selon les composants, typographie simple et lisible, textures naturelles suggérées, palette verte forestière avec accents teal. Les interactions restent simples et directes.

**Expérience cible :** L'utilisateur ressent la confiance dans l'approche naturelle et l'authenticité bio.

---

## SPÉCIFICATIONS TECHNIQUES

### Architecture Foundation

L'implémentation exploite l'infrastructure DemoForge existante sans modification majeure. Le système AdminContext assure la persistance par univers, UniverseContext gère la thématisation automatique, et la structure theme/ centralise les configurations visuelles.

### Système de Tokens Centralisé

**Nouveau fichier : `theme/universeTokens.ts`**

Configuration centralisée des variables visuelles par univers incluant espacements, hauteurs, chemins d'images et opacités. Cette approche garantit la cohérence et facilite les ajustements globaux.

**Extension : `theme/components/templates.ts`**

Définition des variants Chakra UI spécialisés pour les composants stratégiques, permettant l'application automatique des styles selon l'univers détecté.

### Polices Différenciées

**Brewery :** Conservation police système robuste actuelle  
**TeaShop :** Introduction serif élégante pour titres et navigation  
**Beauty :** Police sans-serif moderne premium  
**Herb :** Police système simple avec variation weight

### Composants Stratégiques à Varianter

**Pages complètes :** Landing (déjà différenciée), Catalogue, Produit, Contact  
**Composants transversaux :** SharedProductPreviewCard, headers, formulaires, boutons CTA  
**Éléments navigation :** Breadcrumbs, pagination, filtres

---

## PLAN D'IMPLÉMENTATION

### Phase 1 : Foundation Context (15 minutes)

**Objectif :** Établir la base technique solide avant tout développement visuel.

Création du fichier `universeTokens.ts` avec configuration complète des quatre univers. Extension du système de thème existant pour intégrer les nouveaux tokens. Validation du bon fonctionnement de la détection automatique d'univers sur toutes les pages.

Cette phase critique détermine la qualité de toute l'implémentation suivante. Aucun compromis acceptable sur la robustesse technique.

### Phase 2 : Variants Stratégiques (30 minutes)

**Objectif :** Implémenter les différenciations visuelles sur les composants à fort impact.

Application des variants sur SharedProductPreviewCard avec exploitation des nouveaux tokens. Extension de la thématisation aux pages Catalogue, Produit et Contact via modification minimale des composants existants. Documentation systématique de chaque variant créé avec exemples d'usage.

**Priorité absolue :** TeaShop comme univers de référence pour validation prospect.

### Phase 3 : Polish et Validation (15 minutes)

**Objectif :** Finaliser la cohérence et valider les quatre flows complets.

Test de navigation complète sur les quatre univers pour vérifier la cohérence visuelle. Ajustements finaux sur les transitions et interactions. Validation que les patterns sont suffisamment différenciés tout en conservant l'ergonomie.

---

## DOCUMENTATION PATTERNS OBLIGATOIRE

### Standard Documentation

Chaque variant créé doit être documenté avec le nom du composant, l'univers concerné, les propriétés modifiées et un exemple d'usage. Cette documentation servira de référence pour les évolutions futures et la formation des prospects.

### Jeux de Variantes

Documentation des associations cohérentes entre variants de différents composants pour maintenir l'harmonie visuelle de chaque univers. Cette approche garantit que les combinaisons respectent la direction artistique définie.

---

## CRITÈRES DE VALIDATION

### Critères Fonctionnels

Aucune perte de fonctionnalité existante. Tous les parcours utilisateur actuels demeurent opérationnels. L'ajout de nouveaux univers reste possible en suivant la même méthodologie.

### Critères Expérientiels

Un prospect peut identifier l'univers sur n'importe quelle page du flow. La différenciation est perceptible au ressenti sans analyse technique. Chaque univers génère une émotion distincte correspondant au persona cible.

### Critères Techniques

Le système de variants est facilement modifiable pour ajustements futurs. L'architecture reste scalable pour l'ajout de nouveaux univers. Les performances ne sont pas dégradées par l'ajout des variants.

---

## CADRAGE DÉVELOPPEUR

### Instructions Robin

Cette stratégie constitue le cadre non-négociable pour l'implémentation. Aucune improvisation autorisée sans validation préalable. Chaque étape doit être validée avant passage à la suivante.

La timeline d'une heure impose une exécution disciplinée et efficace. En cas de blocage dépassant dix minutes, escalade immédiate requise plutôt que solution de contournement.

### Validation Continue

Validation après chaque phase avant poursuite. Test systematique sur les quatre univers après chaque modification. Documentation en temps réel des choix d'implémentation.

---

## CONCLUSION STRATÉGIQUE

Cette stratégie transforme DemoForge d'une démonstration technique en une expérience métier différenciée. L'exploitation intelligente de l'architecture existante permet une implémentation rapide tout en créant une valeur business réelle.

Le succès se mesure à la capacité de susciter une émotion distincte par univers, positioning DemoForge comme solution adaptable plutôt que template générique.

**Prêt pour implémentation selon ce cadre stratégique.**
