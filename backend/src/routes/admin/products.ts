import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { Router } from "express";
import { asyncHandler, createError } from "../../middleware/errorHandler";

const router = Router();
const prisma = new PrismaClient();

// GET /api/admin/merchant/:merchantId/shop/:shopId/products
// Récupérer tous les produits d'une boutique avec filtres métier spécialisés
router.get(
  "/merchant/:merchantId/shop/:shopId/products",
  asyncHandler(async (req: Request, res: Response) => {
    const { merchantId, shopId } = req.params;
    const {
      category,
      search,
      minPrice,
      maxPrice,
      stockStatus,
      // Filtres métier spécialisés
      degre_alcool_min,
      degre_alcool_max,
      amertume_ibu_min,
      amertume_ibu_max,
      type_houblon,
      origine_plantation,
      grade_qualite,
      type_peau,
      certification_bio,
      usage_traditionnel,
      forme_galenique,
    } = req.query;

    // Vérification que la boutique appartient au commerçant
    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId as string,
        merchantId: merchantId as string,
      },
    });

    if (!shop) {
      throw createError("Boutique non trouvée", 404);
    }

    // Construction de la requête avec filtres de base
    const whereClause: any = {
      shopId: shopId as string,
    };

    if (category) {
      whereClause.category = {
        name: {
          contains: category as string,
          mode: "insensitive",
        },
      };
    }

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search as string,
            mode: "insensitive",
          },
        },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice as string);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice as string);
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        shop: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Filtrage post-requête pour les attributs métier (stockés en JSON)
    let filteredProducts = products;

    // Filtre par statut de stock
    if (stockStatus) {
      filteredProducts = filteredProducts.filter((product) => {
        if (!product.attributes) return false;
        try {
          const attrs = JSON.parse(product.attributes);
          const stock = attrs.stock || 0;

          switch (stockStatus) {
            case "in_stock":
              return stock > 10;
            case "low_stock":
              return stock > 0 && stock <= 10;
            case "out_of_stock":
              return stock === 0;
            default:
              return true;
          }
        } catch {
          return false;
        }
      });
    }

    // Filtres spécialisés par univers selon nomenclature DemoForge
    if (shop.shopType === "brewery") {
      if (
        degre_alcool_min ||
        degre_alcool_max ||
        amertume_ibu_min ||
        amertume_ibu_max ||
        type_houblon
      ) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.attributes) return false;
          try {
            const attrs = JSON.parse(product.attributes);

            if (
              degre_alcool_min &&
              attrs.degre_alcool < parseFloat(degre_alcool_min as string)
            )
              return false;
            if (
              degre_alcool_max &&
              attrs.degre_alcool > parseFloat(degre_alcool_max as string)
            )
              return false;
            if (
              amertume_ibu_min &&
              attrs.amertume_ibu < parseInt(amertume_ibu_min as string)
            )
              return false;
            if (
              amertume_ibu_max &&
              attrs.amertume_ibu > parseInt(amertume_ibu_max as string)
            )
              return false;
            if (
              type_houblon &&
              !attrs.type_houblon
                ?.toLowerCase()
                .includes((type_houblon as string).toLowerCase())
            )
              return false;

            return true;
          } catch {
            return false;
          }
        });
      }
    }

    if (shop.shopType === "teaShop") {
      if (origine_plantation || grade_qualite) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.attributes) return false;
          try {
            const attrs = JSON.parse(product.attributes);

            if (
              origine_plantation &&
              !attrs.origine_plantation
                ?.toLowerCase()
                .includes((origine_plantation as string).toLowerCase())
            )
              return false;
            if (grade_qualite && attrs.grade_qualite !== grade_qualite)
              return false;

            return true;
          } catch {
            return false;
          }
        });
      }
    }

    if (shop.shopType === "beatyShop") {
      if (type_peau || certification_bio) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.attributes) return false;
          try {
            const attrs = JSON.parse(product.attributes);

            if (type_peau && attrs.type_peau !== type_peau) return false;
            if (
              certification_bio &&
              attrs.certification_bio !== (certification_bio === "true")
            )
              return false;

            return true;
          } catch {
            return false;
          }
        });
      }
    }

    if (shop.shopType === "herbShop") {
      if (usage_traditionnel || forme_galenique) {
        filteredProducts = filteredProducts.filter((product) => {
          if (!product.attributes) return false;
          try {
            const attrs = JSON.parse(product.attributes);

            if (
              usage_traditionnel &&
              !attrs.usage_traditionnel
                ?.toLowerCase()
                .includes((usage_traditionnel as string).toLowerCase())
            )
              return false;
            if (forme_galenique && attrs.forme_galenique !== forme_galenique)
              return false;

            return true;
          } catch {
            return false;
          }
        });
      }
    }

    res.json({
      products: filteredProducts,
      total: filteredProducts.length,
      shopType: shop.shopType,
      shopName: shop.name,
    });
  })
);

// POST /api/admin/merchant/:merchantId/shop/:shopId/products
// Créer un nouveau produit avec validation des attributs métier
router.post(
  "/merchant/:merchantId/shop/:shopId/products",
  asyncHandler(async (req: Request, res: Response) => {
    const { merchantId, shopId } = req.params;
    const { name, description, price, categoryId, attributes } = req.body;

    // Validation des champs obligatoires
    if (!name || !price || !categoryId) {
      throw createError("Nom, prix et catégorie sont obligatoires", 400);
    }

    // Vérification que la boutique appartient au commerçant
    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId as string,
        merchantId: merchantId as string,
      },
    });

    if (!shop) {
      throw createError("Boutique non trouvée", 404);
    }

    // Vérification que la catégorie appartient à la boutique
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        shopId: shopId as string,
      },
    });

    if (!category) {
      throw createError("Catégorie non trouvée", 404);
    }

    // Validation des attributs selon le type de boutique (nomenclature DemoForge)
    let validatedAttributes = "{}";
    if (attributes) {
      try {
        const parsedAttributes =
          typeof attributes === "string" ? JSON.parse(attributes) : attributes;

        // Validation spécifique selon shopType
        switch (shop.shopType) {
          case "brewery":
            if (
              !parsedAttributes.degre_alcool ||
              !parsedAttributes.amertume_ibu
            ) {
              throw createError(
                "Degré d'alcool et amertume IBU sont obligatoires pour une brasserie",
                400
              );
            }
            if (!parsedAttributes.stock || parsedAttributes.stock < 0) {
              throw createError("Stock obligatoire et doit être positif", 400);
            }
            break;
          case "teaShop":
            if (
              !parsedAttributes.origine_plantation ||
              !parsedAttributes.grade_qualite
            ) {
              throw createError(
                "Origine plantation et grade qualité sont obligatoires pour un salon de thé",
                400
              );
            }
            if (!parsedAttributes.stock || parsedAttributes.stock < 0) {
              throw createError("Stock obligatoire et doit être positif", 400);
            }
            break;
          case "beatyShop":
            if (
              !parsedAttributes.type_peau ||
              !parsedAttributes.ingredients_actifs
            ) {
              throw createError(
                "Type de peau et ingrédients actifs sont obligatoires pour un institut beauté",
                400
              );
            }
            if (!parsedAttributes.stock || parsedAttributes.stock < 0) {
              throw createError("Stock obligatoire et doit être positif", 400);
            }
            break;
          case "herbShop":
            if (
              !parsedAttributes.principes_actifs ||
              !parsedAttributes.usage_traditionnel
            ) {
              throw createError(
                "Principes actifs et usage traditionnel sont obligatoires pour une herboristerie",
                400
              );
            }
            if (!parsedAttributes.stock || parsedAttributes.stock < 0) {
              throw createError("Stock obligatoire et doit être positif", 400);
            }
            break;
        }

        validatedAttributes = JSON.stringify(parsedAttributes);
      } catch (error) {
        if (error instanceof Error && error.message.includes("obligatoire")) {
          throw error;
        }
        throw createError("Format des attributs invalide", 400);
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        attributes: validatedAttributes,
        categoryId,
        shopId: shopId as string,
      },
      include: {
        category: true,
        shop: true,
      },
    });

    res.status(201).json(product);
  })
);

// PUT /api/admin/merchant/:merchantId/shop/:shopId/products/:productId
// Modifier un produit existant avec validation métier
router.put(
  "/merchant/:merchantId/shop/:shopId/products/:productId",
  asyncHandler(async (req: Request, res: Response) => {
    const { merchantId, shopId, productId } = req.params;
    const { name, description, price, categoryId, attributes } = req.body;

    // Vérification que le produit appartient à la boutique du commerçant
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        shopId: shopId as string,
        shop: {
          merchantId: merchantId as string,
        },
      },
      include: {
        shop: true,
      },
    });

    if (!existingProduct) {
      throw createError("Produit non trouvé", 404);
    }

    // Validation des attributs si fournis
    let validatedAttributes = existingProduct.attributes;
    if (attributes) {
      try {
        const parsedAttributes =
          typeof attributes === "string" ? JSON.parse(attributes) : attributes;

        // Validation du stock si présent
        if (
          parsedAttributes.stock !== undefined &&
          parsedAttributes.stock < 0
        ) {
          throw createError("Le stock doit être positif", 400);
        }

        validatedAttributes = JSON.stringify(parsedAttributes);
      } catch (error) {
        if (error instanceof Error && error.message.includes("stock")) {
          throw error;
        }
        throw createError("Format des attributs invalide", 400);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(categoryId && { categoryId }),
        ...(validatedAttributes && { attributes: validatedAttributes }),
      },
      include: {
        category: true,
        shop: true,
      },
    });

    res.json(updatedProduct);
  })
);

// DELETE /api/admin/merchant/:merchantId/shop/:shopId/products/:productId
// Supprimer un produit
router.delete(
  "/merchant/:merchantId/shop/:shopId/products/:productId",
  asyncHandler(async (req: Request, res: Response) => {
    const { merchantId, shopId, productId } = req.params;

    // Vérification que le produit appartient à la boutique du commerçant
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        shopId: shopId as string,
        shop: {
          merchantId: merchantId as string,
        },
      },
    });

    if (!existingProduct) {
      throw createError("Produit non trouvé", 404);
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Produit supprimé avec succès" });
  })
);

// GET /api/admin/merchant/:merchantId/shop/:shopId/products/:productId
// Récupérer un produit spécifique pour l'admin
router.get(
  "/merchant/:merchantId/shop/:shopId/products/:productId",
  asyncHandler(async (req: Request, res: Response) => {
    const { merchantId, shopId, productId } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        shopId: shopId as string,
        shop: {
          merchantId: merchantId as string,
        },
      },
      include: {
        category: true,
        shop: true,
      },
    });

    if (!product) {
      throw createError("Produit non trouvé", 404);
    }

    res.json(product);
  })
);

// GET /api/admin/merchant/:merchantId/shop/:shopId/products/stats
// Statistiques des produits pour le dashboard admin selon univers
router.get(
  "/merchant/:merchantId/shop/:shopId/products/stats",
  asyncHandler(async (req: Request, res: Response) => {
    const { merchantId, shopId } = req.params;

    // Vérification que la boutique appartient au commerçant
    const shop = await prisma.shop.findFirst({
      where: {
        id: shopId as string,
        merchantId: merchantId as string,
      },
    });

    if (!shop) {
      throw createError("Boutique non trouvée", 404);
    }

    const products = await prisma.product.findMany({
      where: { shopId: shopId as string },
      include: { category: true },
    });

    // Calculs des statistiques de base
    const totalProducts = products.length;
    const averagePrice =
      products.length > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length
        : 0;

    // Analyse des stocks et statistiques spécialisées
    let lowStockProducts = 0;
    let outOfStockProducts = 0;
    const categoryStats: Record<string, number> = {};
    const specializedStats: any = {};

    products.forEach((product) => {
      // Stats par catégorie
      const categoryName = product.category?.name || "Sans catégorie";
      categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;

      // Analyse du stock et stats spécialisées
      if (product.attributes) {
        try {
          const attrs = JSON.parse(product.attributes);
          const stock = attrs.stock || 0;

          if (stock === 0) outOfStockProducts++;
          else if (stock < 10) lowStockProducts++;

          // Stats spécialisées selon l'univers DemoForge
          switch (shop.shopType) {
            case "brewery":
              if (attrs.degre_alcool) {
                if (!specializedStats.alcoholDegrees)
                  specializedStats.alcoholDegrees = [];
                specializedStats.alcoholDegrees.push(attrs.degre_alcool);
              }
              if (attrs.type_houblon) {
                if (!specializedStats.hopTypes) specializedStats.hopTypes = {};
                specializedStats.hopTypes[attrs.type_houblon] =
                  (specializedStats.hopTypes[attrs.type_houblon] || 0) + 1;
              }
              break;

            case "teaShop":
              if (attrs.origine_plantation) {
                if (!specializedStats.origins) specializedStats.origins = {};
                specializedStats.origins[attrs.origine_plantation] =
                  (specializedStats.origins[attrs.origine_plantation] || 0) + 1;
              }
              if (attrs.grade_qualite) {
                if (!specializedStats.grades) specializedStats.grades = {};
                specializedStats.grades[attrs.grade_qualite] =
                  (specializedStats.grades[attrs.grade_qualite] || 0) + 1;
              }
              break;

            case "beatyShop":
              if (attrs.certification_bio !== undefined) {
                if (!specializedStats.bioProducts)
                  specializedStats.bioProducts = { bio: 0, nonBio: 0 };
                if (attrs.certification_bio) specializedStats.bioProducts.bio++;
                else specializedStats.bioProducts.nonBio++;
              }
              if (attrs.contenance_ml) {
                if (!specializedStats.volumes) specializedStats.volumes = [];
                specializedStats.volumes.push(attrs.contenance_ml);
              }
              break;

            case "herbShop":
              if (attrs.certification) {
                if (!specializedStats.certifications)
                  specializedStats.certifications = {};
                specializedStats.certifications[attrs.certification] =
                  (specializedStats.certifications[attrs.certification] || 0) +
                  1;
              }
              if (attrs.forme_galenique) {
                if (!specializedStats.forms) specializedStats.forms = {};
                specializedStats.forms[attrs.forme_galenique] =
                  (specializedStats.forms[attrs.forme_galenique] || 0) + 1;
              }
              break;
          }
        } catch (error) {
          // Ignore les erreurs de parsing JSON
        }
      }
    });

    // Calculs finaux pour les stats spécialisées
    if (shop.shopType === "brewery" && specializedStats.alcoholDegrees) {
      specializedStats.averageAlcohol =
        specializedStats.alcoholDegrees.reduce(
          (a: number, b: number) => a + b,
          0
        ) / specializedStats.alcoholDegrees.length;
    }

    if (shop.shopType === "beatyShop" && specializedStats.volumes) {
      specializedStats.averageVolume =
        specializedStats.volumes.reduce((a: number, b: number) => a + b, 0) /
        specializedStats.volumes.length;
    }

    const topCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      averagePrice: Math.round(averagePrice * 100) / 100,
      topCategories,
      specializedStats,
      shopType: shop.shopType,
      shopName: shop.name,
    });
  })
);

export default router;
