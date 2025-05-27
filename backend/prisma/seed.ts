import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const shopConfigs = {
  brewery: {
    name: "Houblon & Tradition",
    shopCount: 1, // Artisan débutant
    categories: [
      "Bières Blondes",
      "Bières Brunes",
      "India Pale Ales",
      "Bières Saisonnières",
    ],
    products: [
      // Bières Blondes
      {
        name: "Blonde du Moulin",
        price: 4.5,
        cat: "Bières Blondes",
        attributes: {
          degre_alcool: "4.8%",
          amertume_ibu: "22 IBU",
          type_houblon: "Cascade, Centennial",
          process_brassage: "Fermentation haute traditionnelle",
          format_bouteille: "33cl",
          disponibilite: "Permanente",
          stock: 45,
        },
      },
      {
        name: "Dorée de Printemps",
        price: 4.2,
        cat: "Bières Blondes",
        attributes: {
          degre_alcool: "4.2%",
          amertume_ibu: "18 IBU",
          type_houblon: "Saaz noble",
          process_brassage: "Maturation lente 6 semaines",
          format_bouteille: "33cl",
          disponibilite: "Mars à Juin",
          stock: 28,
        },
      },
      {
        name: "Cascade Blonde",
        price: 4.8,
        cat: "Bières Blondes",
        attributes: {
          degre_alcool: "5.2%",
          amertume_ibu: "35 IBU",
          type_houblon: "Cascade américain",
          process_brassage: "Houblonnage à froid",
          format_bouteille: "33cl",
          disponibilite: "Permanente",
          stock: 52,
        },
      },
      {
        name: "Triple Dorée",
        price: 5.2,
        cat: "Bières Blondes",
        attributes: {
          degre_alcool: "7.5%",
          amertume_ibu: "28 IBU",
          type_houblon: "Hallertau tradition",
          process_brassage: "Triple fermentation belge",
          garde_conseillee: "2 ans en cave",
          format_bouteille: "75cl",
          disponibilite: "Permanente",
          stock: 23,
        },
      },
      // Bières Brunes
      {
        name: "Brune du Terroir",
        price: 4.6,
        cat: "Bières Brunes",
        attributes: {
          degre_alcool: "5.5%",
          amertume_ibu: "25 IBU",
          type_houblon: "Fuggle anglais",
          process_brassage: "Malts torréfiés maison",
          format_bouteille: "33cl",
          disponibilite: "Permanente",
          stock: 38,
        },
      },
      {
        name: "Porter aux Épices",
        price: 5.0,
        cat: "Bières Brunes",
        attributes: {
          degre_alcool: "6.2%",
          amertume_ibu: "32 IBU",
          type_houblon: "East Kent Goldings",
          process_brassage: "Épices ajoutées en fin de brassage",
          garde_conseillee: "18 mois",
          format_bouteille: "33cl",
          disponibilite: "Octobre à Mars",
          stock: 31,
        },
      },
      {
        name: "Stout Imperial",
        price: 5.2,
        cat: "Bières Brunes",
        attributes: {
          degre_alcool: "8.2%",
          amertume_ibu: "45 IBU",
          type_houblon: "Northern Brewer",
          process_brassage: "Malts chocolat et café",
          garde_conseillee: "3 ans",
          format_bouteille: "33cl",
          disponibilite: "Hiver uniquement",
          stock: 19,
        },
      },
      {
        name: "Ambrée Traditionnelle",
        price: 4.9,
        cat: "Bières Brunes",
        attributes: {
          degre_alcool: "5.8%",
          amertume_ibu: "20 IBU",
          type_houblon: "Strisselspalt alsacien",
          process_brassage: "Méthode alsacienne ancestrale",
          format_bouteille: "50cl",
          disponibilite: "Permanente",
          stock: 42,
        },
      },
      // India Pale Ales
      {
        name: "IPA Houblonnée",
        price: 5.5,
        cat: "India Pale Ales",
        attributes: {
          degre_alcool: "6.5%",
          amertume_ibu: "65 IBU",
          type_houblon: "Citra, Simcoe, Mosaic",
          process_brassage: "Dry hopping 7 jours",
          format_bouteille: "33cl",
          disponibilite: "Permanente",
          stock: 35,
        },
      },
      {
        name: "Session IPA",
        price: 4.8,
        cat: "India Pale Ales",
        attributes: {
          degre_alcool: "4.5%",
          amertume_ibu: "40 IBU",
          type_houblon: "Amarillo, Centennial",
          process_brassage: "Houblonnage modéré",
          format_bouteille: "33cl",
          disponibilite: "Printemps-Été",
          stock: 47,
        },
      },
      {
        name: "Double IPA Tradition",
        price: 6.2,
        cat: "India Pale Ales",
        attributes: {
          degre_alcool: "8.8%",
          amertume_ibu: "85 IBU",
          type_houblon: "Columbus, Chinook",
          process_brassage: "Double dose de houblon",
          garde_conseillee: "1 an maximum",
          format_bouteille: "33cl",
          disponibilite: "Production limitée",
          stock: 12,
        },
      },
      {
        name: "IPA aux Agrumes",
        price: 5.8,
        cat: "India Pale Ales",
        attributes: {
          degre_alcool: "6.0%",
          amertume_ibu: "55 IBU",
          type_houblon: "Citra, Mandarina Bavaria",
          process_brassage: "Zestes d'agrumes frais",
          format_bouteille: "33cl",
          disponibilite: "Été uniquement",
          stock: 29,
        },
      },
      // Bières Saisonnières
      {
        name: "Bière de Noël aux Épices",
        price: 5.0,
        cat: "Bières Saisonnières",
        attributes: {
          degre_alcool: "7.0%",
          amertume_ibu: "15 IBU",
          type_houblon: "Styrian Goldings",
          process_brassage: "Cannelle, orange, clous de girofle",
          format_bouteille: "75cl",
          disponibilite: "Novembre-Janvier",
          stock: 18,
        },
      },
      {
        name: "Blanche d'Été Bio",
        price: 4.4,
        cat: "Bières Saisonnières",
        attributes: {
          degre_alcool: "4.8%",
          amertume_ibu: "12 IBU",
          type_houblon: "Hersbrucker bio",
          process_brassage: "Froment bio 50%",
          certification: "Agriculture Biologique",
          format_bouteille: "33cl",
          disponibilite: "Mai-Septembre",
          stock: 33,
        },
      },
      {
        name: "Bière de Garde d'Automne",
        price: 4.9,
        cat: "Bières Saisonnières",
        attributes: {
          degre_alcool: "6.5%",
          amertume_ibu: "22 IBU",
          type_houblon: "Strisselpalt",
          process_brassage: "Garde froide 3 mois",
          garde_conseillee: "2-3 ans",
          format_bouteille: "75cl",
          disponibilite: "Septembre-Novembre",
          stock: 25,
        },
      },
      {
        name: "Bière de Mars Artisanale",
        price: 4.7,
        cat: "Bières Saisonnières",
        attributes: {
          degre_alcool: "5.5%",
          amertume_ibu: "18 IBU",
          type_houblon: "Bouquet français",
          process_brassage: "Tradition brassicole française",
          format_bouteille: "50cl",
          disponibilite: "Mars uniquement",
          stock: 21,
        },
      },
    ],
  },
  teaShop: {
    name: "Les Jardins de Darjeeling",
    shopCount: 2, // Expansion locale
    categories: [
      "Thés Verts Premium",
      "Thés Noirs d'Excellence",
      "Thés Blancs Rares",
      "Infusions & Tisanes",
    ],
    products: [
      // Thés Verts Premium
      {
        name: "Sencha Impérial du Japon",
        price: 18.5,
        cat: "Thés Verts Premium",
        attributes: {
          origine_plantation: "Shizuoka, Japon",
          altitude_culture: "400m",
          grade_qualite: "Grade Supérieur",
          recolte_flush: "Première récolte",
          temperature_infusion: "70°C",
          temps_infusion: "2-3 minutes",
          quantite_grammes: "2g par tasse",
          stock: 85,
        },
      },
      {
        name: "Gyokuro Première Récolte",
        price: 42.0,
        cat: "Thés Verts Premium",
        attributes: {
          origine_plantation: "Uji, Kyoto",
          altitude_culture: "200m",
          grade_qualite: "Gyokuro Premium",
          recolte_flush: "Première récolte ombragée",
          temperature_infusion: "60°C",
          temps_infusion: "90 secondes",
          quantite_grammes: "3g par tasse",
          conservation: "Réfrigération recommandée",
          stock: 12,
        },
      },
      {
        name: "Matcha Cérémonial Uji",
        price: 55.0,
        cat: "Thés Verts Premium",
        attributes: {
          origine_plantation: "Uji, Japon",
          grade_qualite: "Cérémonial",
          recolte_flush: "Tencha ombragé 3 semaines",
          temperature_infusion: "70°C",
          quantite_grammes: "1g par bol",
          conservation: "Hermétique, au frais",
          stock: 8,
        },
      },
      {
        name: "Dragon Well Premium",
        price: 24.9,
        cat: "Thés Verts Premium",
        attributes: {
          origine_plantation: "Lac de l'Ouest, Hangzhou",
          altitude_culture: "300m",
          grade_qualite: "Grade AA",
          recolte_flush: "Avant Qingming",
          temperature_infusion: "75°C",
          temps_infusion: "3 minutes",
          quantite_grammes: "2g par tasse",
          stock: 34,
        },
      },
      // Thés Noirs d'Excellence
      {
        name: "Earl Grey Bergamote Bio",
        price: 16.5,
        cat: "Thés Noirs d'Excellence",
        attributes: {
          origine_plantation: "Ceylan + Bergamote Calabria",
          grade_qualite: "FBOP Bio",
          temperature_infusion: "95°C",
          temps_infusion: "3-5 minutes",
          quantite_grammes: "2g par tasse",
          certification: "Agriculture Biologique",
          stock: 67,
        },
      },
      {
        name: "Darjeeling FTGFOP1",
        price: 28.6,
        cat: "Thés Noirs d'Excellence",
        attributes: {
          origine_plantation: "Makaibari, Darjeeling",
          altitude_culture: "1500m",
          grade_qualite: "FTGFOP1",
          recolte_flush: "Seconde récolte muscatée",
          temperature_infusion: "95°C",
          temps_infusion: "4-5 minutes",
          quantite_grammes: "2g par tasse",
          stock: 23,
        },
      },
      {
        name: "Assam Golden Tips",
        price: 22.2,
        cat: "Thés Noirs d'Excellence",
        attributes: {
          origine_plantation: "Brahmaputra Valley",
          altitude_culture: "600m",
          grade_qualite: "FTGFOP Golden Tips",
          recolte_flush: "Seconde récolte",
          temperature_infusion: "100°C",
          temps_infusion: "3-4 minutes",
          quantite_grammes: "2g par tasse",
          stock: 41,
        },
      },
      {
        name: "Ceylon Orange Pekoe",
        price: 19.8,
        cat: "Thés Noirs d'Excellence",
        attributes: {
          origine_plantation: "Nuwara Eliya, Sri Lanka",
          altitude_culture: "1800m",
          grade_qualite: "Orange Pekoe",
          temperature_infusion: "95°C",
          temps_infusion: "3-4 minutes",
          quantite_grammes: "2g par tasse",
          stock: 55,
        },
      },
      // Thés Blancs Rares
      {
        name: "Bai Mu Dan Impérial",
        price: 35.9,
        cat: "Thés Blancs Rares",
        attributes: {
          origine_plantation: "Fujian, Chine",
          altitude_culture: "800m",
          grade_qualite: "Grade Impérial",
          recolte_flush: "Bourgeons + 2 feuilles",
          temperature_infusion: "85°C",
          temps_infusion: "4-6 minutes",
          quantite_grammes: "3g par tasse",
          conservation: "Lieu sec, aéré",
          stock: 19,
        },
      },
      {
        name: "Aiguilles d'Argent",
        price: 78.0,
        cat: "Thés Blancs Rares",
        attributes: {
          origine_plantation: "Fuding, Fujian",
          grade_qualite: "Silver Needle Premium",
          recolte_flush: "Bourgeons uniquement",
          temperature_infusion: "80°C",
          temps_infusion: "5-7 minutes",
          quantite_grammes: "3g par tasse",
          conservation: "Conditionnement hermétique",
          stock: 6,
        },
      },
      {
        name: "Moonlight White du Yunnan",
        price: 45.5,
        cat: "Thés Blancs Rares",
        attributes: {
          origine_plantation: "Monts du Yunnan",
          altitude_culture: "1200m",
          grade_qualite: "Moonlight White",
          temperature_infusion: "85°C",
          temps_infusion: "4-5 minutes",
          quantite_grammes: "3g par tasse",
          stock: 14,
        },
      },
      {
        name: "Shou Mei Vieilli 5 ans",
        price: 32.4,
        cat: "Thés Blancs Rares",
        attributes: {
          origine_plantation: "Fujian, Chine",
          grade_qualite: "Shou Mei vieilli",
          recolte_flush: "Feuilles matures",
          temperature_infusion: "90°C",
          temps_infusion: "5-8 minutes",
          quantite_grammes: "4g par tasse",
          conservation: "Vieillissement 5 ans",
          stock: 11,
        },
      },
      // Infusions & Tisanes
      {
        name: "Camomille Romaine Bio",
        price: 12.2,
        cat: "Infusions & Tisanes",
        attributes: {
          origine_plantation: "Provence, France",
          certification: "Agriculture Biologique",
          usage_traditionnel: "Détente et sommeil",
          temperature_infusion: "100°C",
          temps_infusion: "5-7 minutes",
          quantite_grammes: "2g par tasse",
          stock: 78,
        },
      },
      {
        name: "Verveine Citronnée Premium",
        price: 11.8,
        cat: "Infusions & Tisanes",
        attributes: {
          origine_plantation: "Drôme, France",
          usage_traditionnel: "Digestion et relaxation",
          temperature_infusion: "100°C",
          temps_infusion: "7-10 minutes",
          quantite_grammes: "2g par tasse",
          stock: 62,
        },
      },
      {
        name: "Rooibos Vanille Bourbon",
        price: 14.5,
        cat: "Infusions & Tisanes",
        attributes: {
          origine_plantation: "Cederberg, Afrique du Sud",
          usage_traditionnel: "Sans théine, toute la journée",
          temperature_infusion: "100°C",
          temps_infusion: "5-7 minutes",
          quantite_grammes: "3g par tasse",
          stock: 45,
        },
      },
      {
        name: "Mélange Détox aux 7 Plantes",
        price: 16.9,
        cat: "Infusions & Tisanes",
        attributes: {
          origine_plantation: "Mélange européen",
          usage_traditionnel: "Drainage et purification",
          temperature_infusion: "100°C",
          temps_infusion: "8-10 minutes",
          quantite_grammes: "3g par tasse",
          duree_cure: "3 semaines recommandées",
          stock: 38,
        },
      },
    ],
  },
  beautyShop: {
    name: "L'Écrin de Jade",
    shopCount: 2, // Variante expansion
    categories: [
      "Soins du Visage",
      "Soins du Corps",
      "Soins Capillaires",
      "Maquillage Bio",
    ],
    products: [
      // Soins du Visage
      {
        name: "Crème Hydratante à l'Acide Hyaluronique",
        price: 32.9,
        cat: "Soins du Visage",
        attributes: {
          type_peau: "Tous types de peau",
          ingredients_actifs: "Acide Hyaluronique 1.5%",
          certification_bio: "Cosmos Organic",
          contenance_ml: "50ml",
          utilisation_moment: "Matin et soir",
          zone_application: "Visage et cou",
          texture: "Crème onctueuse",
          stock: 42,
        },
      },
      {
        name: "Sérum Anti-Âge au Rétinol",
        price: 48.5,
        cat: "Soins du Visage",
        attributes: {
          type_peau: "Peaux matures",
          ingredients_actifs: "Rétinol encapsulé 0.5%",
          contenance_ml: "30ml",
          utilisation_moment: "Soir uniquement",
          zone_application: "Visage, éviter contour yeux",
          texture: "Sérum fluide",
          age_recommande: "35 ans et plus",
          stock: 28,
        },
      },
      {
        name: "Masque Purifiant à l'Argile Verte",
        price: 24.8,
        cat: "Soins du Visage",
        attributes: {
          type_peau: "Peaux mixtes à grasses",
          ingredients_actifs: "Argile verte Montmorillonite",
          certification_bio: "Ecocert",
          contenance_ml: "75ml",
          utilisation_moment: "1-2 fois par semaine",
          zone_application: "Visage, éviter contour yeux",
          texture: "Masque épais",
          stock: 35,
        },
      },
      {
        name: "Eau Micellaire Démaquillante",
        price: 18.9,
        cat: "Soins du Visage",
        attributes: {
          type_peau: "Peaux sensibles",
          ingredients_actifs: "Micelles douces sans sulfates",
          contenance_ml: "200ml",
          utilisation_moment: "Matin et soir",
          zone_application: "Visage et yeux",
          texture: "Eau transparente",
          stock: 67,
        },
      },
      // Soins du Corps
      {
        name: "Lait Corporel Nourrissant au Karité",
        price: 22.5,
        cat: "Soins du Corps",
        attributes: {
          type_peau: "Peaux sèches",
          ingredients_actifs: "Beurre de Karité 15%",
          certification_bio: "Nature & Progrès",
          contenance_ml: "250ml",
          utilisation_moment: "Après la douche",
          zone_application: "Corps entier",
          texture: "Lait fondant",
          stock: 53,
        },
      },
      {
        name: "Gommage Exfoliant aux Cristaux de Sel",
        price: 28.0,
        cat: "Soins du Corps",
        attributes: {
          type_peau: "Tous types de peau",
          ingredients_actifs: "Cristaux de sel de mer",
          contenance_ml: "200ml",
          utilisation_moment: "1-2 fois par semaine",
          zone_application: "Corps, éviter visage",
          texture: "Gel exfoliant",
          stock: 31,
        },
      },
      {
        name: "Huile de Massage Relaxante Lavande",
        price: 34.9,
        cat: "Soins du Corps",
        attributes: {
          type_peau: "Tous types de peau",
          ingredients_actifs: "Huile essentielle Lavande",
          certification_bio: "AB",
          contenance_ml: "100ml",
          utilisation_moment: "Soir, détente",
          zone_application: "Corps entier",
          texture: "Huile sèche",
          stock: 19,
        },
      },
      {
        name: "Baume Réparateur Multi-Usages",
        price: 26.8,
        cat: "Soins du Corps",
        attributes: {
          type_peau: "Peaux abîmées",
          ingredients_actifs: "Cire d'abeille, Calendula",
          certification_bio: "Cosmos Natural",
          contenance_ml: "50ml",
          zone_application: "Zones très sèches",
          texture: "Baume consistant",
          stock: 44,
        },
      },
      // Soins Capillaires
      {
        name: "Shampooing Nutrition Intense Argan",
        price: 19.9,
        cat: "Soins Capillaires",
        attributes: {
          type_cheveux: "Cheveux secs et abîmés",
          ingredients_actifs: "Huile d'Argan du Maroc",
          certification_bio: "Ecocert",
          contenance_ml: "250ml",
          utilisation_moment: "2-3 fois par semaine",
          texture: "Shampooing crémeux",
          stock: 58,
        },
      },
      {
        name: "Masque Réparateur Protéines de Soie",
        price: 35.5,
        cat: "Soins Capillaires",
        attributes: {
          type_cheveux: "Cheveux fragilisés",
          ingredients_actifs: "Protéines de soie hydrolysées",
          contenance_ml: "200ml",
          utilisation_moment: "1 fois par semaine",
          texture: "Masque riche",
          stock: 26,
        },
      },
      {
        name: "Huile Capillaire Précieuse 5 Huiles",
        price: 28.9,
        cat: "Soins Capillaires",
        attributes: {
          type_cheveux: "Tous types de cheveux",
          ingredients_actifs: "Argan, Jojoba, Avocat, Coco, Ricin",
          certification_bio: "Cosmos Organic",
          contenance_ml: "50ml",
          utilisation_moment: "Avant ou après shampooing",
          texture: "Huile légère",
          stock: 33,
        },
      },
      {
        name: "Spray Démêlant Protection Thermique",
        price: 16.8,
        cat: "Soins Capillaires",
        attributes: {
          type_cheveux: "Cheveux emmêlés",
          ingredients_actifs: "Complexe thermo-protecteur",
          contenance_ml: "150ml",
          utilisation_moment: "Sur cheveux humides",
          texture: "Spray léger",
          stock: 47,
        },
      },
      // Maquillage Bio
      {
        name: "Fond de Teint Naturel Longue Tenue",
        price: 38.9,
        cat: "Maquillage Bio",
        attributes: {
          type_peau: "Tous types de peau",
          ingredients_actifs: "Pigments minéraux naturels",
          certification_bio: "Natrue",
          contenance_ml: "30ml",
          utilisation_moment: "Jour",
          texture: "Fluide couvrant",
          nuances_disponibles: "12 teintes",
          stock: 24,
        },
      },
      {
        name: "Rouge à Lèvres Mat Hydratant",
        price: 22.5,
        cat: "Maquillage Bio",
        attributes: {
          ingredients_actifs: "Beurre de Karité, Cire de Candelilla",
          certification_bio: "Cosmos Organic",
          texture: "Mat confortable",
          nuances_disponibles: "8 couleurs",
          stock: 41,
        },
      },
      {
        name: "Mascara Volumisant Fibres Naturelles",
        price: 28.9,
        cat: "Maquillage Bio",
        attributes: {
          ingredients_actifs: "Fibres de riz, Cires végétales",
          certification_bio: "Ecocert",
          contenance_ml: "10ml",
          utilisation_moment: "Jour et soir",
          texture: "Crème volumisante",
          stock: 36,
        },
      },
      {
        name: "Palette Ombres à Paupières Nude",
        price: 42.9,
        cat: "Maquillage Bio",
        attributes: {
          ingredients_actifs: "Pigments naturels, Mica",
          certification_bio: "Natrue",
          texture: "Poudres soyeuses",
          nuances_disponibles: "12 teintes nude",
          stock: 18,
        },
      },
    ],
  },
  herbShop: {
    name: "Herboristerie du Moulin Vert",
    shopCount: 4, // Entrepreneur confirmé
    categories: [
      "Bien-être Digestif",
      "Sommeil & Relaxation",
      "Défenses Naturelles",
      "Équilibre & Vitalité",
    ],
    products: [
      // Bien-être Digestif
      {
        name: "Tisane Digestive aux 4 Plantes",
        price: 12.9,
        cat: "Bien-être Digestif",
        attributes: {
          principes_actifs: "Menthe, Fenouil, Anis, Mélisse",
          usage_traditionnel: "Facilite la digestion",
          posologie: "1 tasse après les repas",
          forme_galenique: "Tisane en vrac",
          certification: "Agriculture Biologique",
          duree_cure: "En continu",
          conservation_duree: "24 mois",
          stock: 89,
        },
      },
      {
        name: "Gélules Charbon Végétal Activé",
        price: 18.5,
        cat: "Bien-être Digestif",
        attributes: {
          principes_actifs: "Charbon de coque de noix de coco",
          usage_traditionnel: "Ballonnements, flatulences",
          posologie: "2 gélules avant les repas",
          contre_indications: "Prise de médicaments espacée",
          forme_galenique: "60 gélules végétales",
          duree_cure: "15 jours maximum",
          stock: 65,
        },
      },
      {
        name: "Huile Essentielle Menthe Poivrée",
        price: 15.8,
        cat: "Bien-être Digestif",
        attributes: {
          principes_actifs: "Menthol 40%",
          usage_traditionnel: "Digestion difficile",
          posologie: "1 goutte sur comprimé neutre",
          contre_indications: "Enfants moins de 6 ans",
          forme_galenique: "Flacon 10ml",
          certification: "HEBBD",
          conservation_duree: "5 ans",
          stock: 42,
        },
      },
      {
        name: "Infusion Fenouil Doux Bio",
        price: 10.9,
        cat: "Bien-être Digestif",
        attributes: {
          principes_actifs: "Graines de fenouil",
          usage_traditionnel: "Digestion, allaitement",
          posologie: "1 tasse 3 fois par jour",
          forme_galenique: "Sachets individuels",
          certification: "Agriculture Biologique",
          duree_cure: "En continu possible",
          stock: 73,
        },
      },
      // Sommeil & Relaxation
      {
        name: "Tisane Nuit Paisible Camomille Lavande",
        price: 14.5,
        cat: "Sommeil & Relaxation",
        attributes: {
          principes_actifs: "Camomille, Lavande, Tilleul",
          usage_traditionnel: "Favorise l'endormissement",
          posologie: "1 tasse 30min avant coucher",
          forme_galenique: "Mélange de plantes",
          certification: "Nature & Progrès",
          duree_cure: "En continu",
          stock: 57,
        },
      },
      {
        name: "Spray d'Oreiller Relaxant aux Huiles",
        price: 19.9,
        cat: "Sommeil & Relaxation",
        attributes: {
          principes_actifs: "HE Lavande, Orange douce",
          usage_traditionnel: "Ambiance apaisante",
          posologie: "2-3 pulvérisations sur oreiller",
          forme_galenique: "Spray 50ml",
          conservation_duree: "3 ans",
          stock: 34,
        },
      },
      {
        name: "Gélules Mélatonine Naturelle",
        price: 24.9,
        cat: "Sommeil & Relaxation",
        attributes: {
          principes_actifs: "Mélatonine 1.9mg",
          usage_traditionnel: "Régulation sommeil",
          posologie: "1 gélule 1h avant coucher",
          contre_indications: "Femmes enceintes",
          forme_galenique: "30 gélules",
          duree_cure: "1 mois renouvelable",
          stock: 28,
        },
      },
      {
        name: "Huile de Massage Nocturne Apaisante",
        price: 28.5,
        cat: "Sommeil & Relaxation",
        attributes: {
          principes_actifs: "HE Lavande vraie, Petit grain",
          usage_traditionnel: "Détente musculaire",
          posologie: "Massage avant coucher",
          forme_galenique: "Flacon 100ml",
          certification: "Cosmos Natural",
          stock: 21,
        },
      },
      // Défenses Naturelles
      {
        name: "Sirop Échinacée Propolis Miel",
        price: 22.8,
        cat: "Défenses Naturelles",
        attributes: {
          principes_actifs: "Échinacée, Propolis, Miel",
          usage_traditionnel: "Renforcement immunité",
          posologie: "1 cuillère à soupe 3 fois/jour",
          forme_galenique: "Sirop 150ml",
          duree_cure: "10 jours en cure",
          conservation_duree: "2 ans",
          stock: 46,
        },
      },
      {
        name: "Gélules Propolis Française Premium",
        price: 26.9,
        cat: "Défenses Naturelles",
        attributes: {
          principes_actifs: "Propolis française 400mg",
          usage_traditionnel: "Défenses naturelles",
          posologie: "2 gélules matin à jeun",
          forme_galenique: "60 gélules",
          certification: "Origine France",
          duree_cure: "1 mois",
          stock: 33,
        },
      },
      {
        name: "Tisane Immunité Thym Romarin",
        price: 13.5,
        cat: "Défenses Naturelles",
        attributes: {
          principes_actifs: "Thym, Romarin, Eucalyptus",
          usage_traditionnel: "Période hivernale",
          posologie: "3 tasses par jour",
          forme_galenique: "Mélange plantes",
          certification: "Agriculture Biologique",
          duree_cure: "En cure de 3 semaines",
          stock: 62,
        },
      },
      {
        name: "Vitamine C Naturelle Acérola",
        price: 28.9,
        cat: "Défenses Naturelles",
        attributes: {
          principes_actifs: "Acérola titré 17% Vit C",
          usage_traditionnel: "Fatigue, immunité",
          posologie: "1 comprimé par jour",
          forme_galenique: "60 comprimés à croquer",
          duree_cure: "2 mois",
          stock: 39,
        },
      },
      // Équilibre & Vitalité
      {
        name: "Infusion Équilibre Verveine Mélisse",
        price: 11.8,
        cat: "Équilibre & Vitalité",
        attributes: {
          principes_actifs: "Verveine, Mélisse, Passiflore",
          usage_traditionnel: "Équilibre nerveux",
          posologie: "1 tasse matin et soir",
          forme_galenique: "Tisane en sachets",
          certification: "Agriculture Biologique",
          duree_cure: "En continu",
          stock: 54,
        },
      },
      {
        name: "Huile Essentielle Lavande Fine AOP",
        price: 18.9,
        cat: "Équilibre & Vitalité",
        attributes: {
          principes_actifs: "Linalol, Acétate de linalyle",
          usage_traditionnel: "Stress, agitation",
          posologie: "Diffusion ou 2 gouttes sur poignets",
          forme_galenique: "Flacon 10ml",
          certification: "AOP Provence",
          conservation_duree: "5 ans",
          stock: 37,
        },
      },
      {
        name: "Gélules Rhodiola Anti-Stress",
        price: 34.5,
        cat: "Équilibre & Vitalité",
        attributes: {
          principes_actifs: "Rhodiola rosea 500mg",
          usage_traditionnel: "Adaptation au stress",
          posologie: "1 gélule matin à jeun",
          contre_indications: "Troubles bipolaires",
          forme_galenique: "60 gélules végétales",
          duree_cure: "3 mois maximum",
          stock: 22,
        },
      },
      {
        name: "Baume Détente Muscles et Articulations",
        price: 24.9,
        cat: "Équilibre & Vitalité",
        attributes: {
          principes_actifs: "Arnica, Gaulthérie, Menthe",
          usage_traditionnel: "Confort musculaire",
          posologie: "Massage 2-3 fois par jour",
          forme_galenique: "Pot 75ml",
          certification: "Cosmos Natural",
          stock: 48,
        },
      },
    ],
  },
};

async function main() {
  console.log("🧹 Nettoyage de la base de données...");
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.merchant.deleteMany();

  console.log("👤 Création du commerçant principal...");
  const merchant = await prisma.merchant.create({
    data: {
      name: "Jean Dupont",
      email: "jean@demoforge.com",
    },
  });

  let totalProducts = 0;
  let totalShops = 0;

  // Création des boutiques selon la stratégie DemoForge
  for (const [shopType, config] of Object.entries(shopConfigs)) {
    console.log(
      `\n🏪 Création des boutiques ${config.name} (${
        config.shopCount
      } boutique${config.shopCount > 1 ? "s" : ""})...`
    );

    // Création du nombre de boutiques défini pour chaque type
    for (let i = 1; i <= config.shopCount; i++) {
      const shopName =
        config.shopCount === 1
          ? config.name
          : `${config.name} ${
              i === 1 ? "Centre" : i === 2 ? "Nord" : i === 3 ? "Sud" : "Est"
            }`;

      const shop = await prisma.shop.create({
        data: {
          name: shopName,
          shopType: shopType,
          merchantId: merchant.id,
        },
      });
      totalShops++;

      // Création des catégories pour chaque boutique
      for (const categoryName of config.categories) {
        const category = await prisma.category.create({
          data: {
            name: categoryName,
            shopId: shop.id,
          },
        });

        // Création des produits pour cette catégorie
        const categoryProducts = config.products.filter(
          (p) => p.cat === categoryName
        );
        for (const productData of categoryProducts) {
          // Ajustement du stock selon le nombre de boutiques
          const adjustedStock =
            Math.floor(productData.attributes.stock / config.shopCount) +
            Math.floor(Math.random() * 10);

          await prisma.product.create({
            data: {
              name: productData.name,
              description: `${productData.name} - Produit d'exception de notre collection ${categoryName}. ${shopName}.`,
              price: productData.price,
              image: null, // À compléter avec images libres de droit
              attributes: JSON.stringify({
                ...productData.attributes,
                stock: adjustedStock,
                boutique: shopName,
                featured: Math.random() > 0.8, // 20% de produits vedette
              }),
              categoryId: category.id,
              shopId: shop.id,
            },
          });
          totalProducts++;
        }
      }
    }
  }

  console.log("\n✅ Base de données DemoForge initialisée avec succès!");
  console.log(`📊 Statistiques de création :`);
  console.log(`   • 1 commerçant principal`);
  console.log(`   • ${totalShops} boutiques réparties sur 4 univers`);
  console.log(`   • ${totalProducts} produits avec attributs métier`);
  console.log(`   • Architecture multi-boutique : 1-2-2-4`);
  console.log(`\n🎯 DemoForge prêt pour les démonstrations commerciales!`);
}

main()
  .catch((e: Error) => {
    console.error("❌ Erreur lors de l'initialisation:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
