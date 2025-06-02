import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { asyncHandler, createError } from "../../middleware/errorHandler";

const router = Router();
const prisma = new PrismaClient();

// GET /admin/categories - Récupérer toutes les catégories avec statistiques admin
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { shopId, includeStats } = req.query;

    const where: any = {};
    if (shopId) where.shopId = shopId as string;

    const categories = await prisma.category.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            shopType: true,
          },
        },
        products: includeStats === "true" ? {
          select: {
            id: true,
            name: true,
            price: true,
            attributes: true,
          },
        } : {
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        { shop: { name: "asc" } },
        { name: "asc" },
      ],
    });

    // Enrichir avec statistiques admin si demandé
    const enrichedCategories = categories.map(category => {
      const baseCategory = {
        ...category,
        productCount: category.products.length,
      };

      if (includeStats === "true") {
        // TypeScript sait que si includeStats est true, products contient price et attributes
        const productsWithDetails = category.products as Array<{
          id: string;
          name: string;
          price: number;
          attributes: string | null;
        }>;

        const prices = productsWithDetails.map(p => p.price);
        const stocks = productsWithDetails.map(p => {
          try {
            const attrs = JSON.parse(p.attributes || "{}");
            return Number(attrs.stock) || 0;
          } catch {
            return 0;
          }
        });

        return {
          ...baseCategory,
          stats: {
            averagePrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
            totalStock: stocks.reduce((a, b) => a + b, 0),
            lowStockProducts: stocks.filter(s => s <= 10 && s > 0).length,
            outOfStockProducts: stocks.filter(s => s === 0).length,
            priceRange: {
              min: prices.length ? Math.min(...prices) : 0,
              max: prices.length ? Math.max(...prices) : 0,
            },
          },
        };
      }

      return baseCategory;
    });

    res.json(enrichedCategories);
  })
);

// GET /admin/categories/:id - Récupérer une catégorie avec détails admin
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        shop: true,
        products: {
          include: {
            shop: {
              select: {
                id: true,
                name: true,
                shopType: true,
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!category) {
      throw createError("Catégorie non trouvée", 404);
    }

    // Calculer statistiques détaillées
    const prices = category.products.map(p => p.price);
    const stocks = category.products.map(p => {
      try {
        const attrs = JSON.parse(p.attributes || "{}");
        return Number(attrs.stock) || 0;
      } catch {
        return 0;
      }
    });

    const enrichedCategory = {
      ...category,
      stats: {
        productCount: category.products.length,
        averagePrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
        totalStock: stocks.reduce((a, b) => a + b, 0),
        lowStockProducts: stocks.filter(s => s <= 10 && s > 0).length,
        outOfStockProducts: stocks.filter(s => s === 0).length,
        priceRange: {
          min: prices.length ? Math.min(...prices) : 0,
          max: prices.length ? Math.max(...prices) : 0,
        },
        topProducts: category.products
          .sort((a, b) => b.price - a.price)
          .slice(0, 5)
          .map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
          })),
      },
    };

    res.json(enrichedCategory);
  })
);

// POST /admin/categories - Créer une nouvelle catégorie
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, image, shopId } = req.body;

    // Validation
    if (!name || !shopId) {
      throw createError("Champs requis manquants: name, shopId", 400);
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      throw createError("Le nom de la catégorie doit être une chaîne non vide", 400);
    }

    // Vérifier que la boutique existe
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw createError("Boutique non trouvée", 404);
    }

    // Vérifier l'unicité du nom dans cette boutique
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        shopId,
      },
    });

    if (existingCategory) {
      throw createError(
        `Une catégorie "${name.trim()}" existe déjà dans cette boutique`,
        409
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        image: image || null,
        shopId,
      },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            shopType: true,
          },
        },
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    res.status(201).json({
      ...category,
      productCount: category.products.length,
    });
  })
);

// PUT /admin/categories/:id - Mettre à jour une catégorie
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, image } = req.body;

    // Vérifier que la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        shop: true,
      },
    });

    if (!existingCategory) {
      throw createError("Catégorie non trouvée", 404);
    }

    // Validation du nom si fourni
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        throw createError("Le nom doit être une chaîne non vide", 400);
      }

      // Vérifier l'unicité du nouveau nom dans la boutique
      if (name.trim() !== existingCategory.name) {
        const duplicateCategory = await prisma.category.findFirst({
          where: {
            name: name.trim(),
            shopId: existingCategory.shopId,
            id: { not: id },
          },
        });

        if (duplicateCategory) {
          throw createError(
            `Une catégorie "${name.trim()}" existe déjà dans cette boutique`,
            409
          );
        }
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (image !== undefined) updateData.image = image;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            shopType: true,
          },
        },
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    res.json({
      ...category,
      productCount: category.products.length,
    });
  })
);

// DELETE /admin/categories/:id - Supprimer une catégorie
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { force } = req.query;

    // Vérifier que la catégorie existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        shop: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!existingCategory) {
      throw createError("Catégorie non trouvée", 404);
    }

    // Vérifier s'il y a des produits dans cette catégorie
    if (existingCategory.products.length > 0) {
      if (force !== "true") {
        throw createError(
          `Impossible de supprimer la catégorie "${existingCategory.name}": ` +
          `elle contient ${existingCategory.products.length} produit(s). ` +
          `Utilisez le paramètre force=true pour forcer la suppression.`,
          409
        );
      }

      // Suppression forcée: supprimer d'abord tous les produits
      await prisma.product.deleteMany({
        where: { categoryId: id },
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({
      message: `Catégorie "${existingCategory.name}" supprimée avec succès`,
      deletedProductsCount: existingCategory.products.length,
      shopName: existingCategory.shop.name,
    });
  })
);

// GET /admin/categories/shop/:shopId/stats - Statistiques des catégories par boutique
router.get(
  "/shop/:shopId/stats",
  asyncHandler(async (req: Request, res: Response) => {
    const { shopId } = req.params;

    // Vérifier que la boutique existe
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw createError("Boutique non trouvée", 404);
    }

    const categories = await prisma.category.findMany({
      where: { shopId },
      include: {
        products: {
          select: {
            price: true,
            attributes: true,
          },
        },
      },
    });

    const stats = {
      totalCategories: categories.length,
      categoriesWithProducts: categories.filter(c => c.products.length > 0).length,
      emptyCategoriesCount: categories.filter(c => c.products.length === 0).length,
      totalProducts: categories.reduce((sum, cat) => sum + cat.products.length, 0),
      categoriesBreakdown: categories.map(category => {
        const prices = category.products.map(p => p.price);
        const stocks = category.products.map(p => {
          try {
            const attrs = JSON.parse(p.attributes || "{}");
            return Number(attrs.stock) || 0;
          } catch {
            return 0;
          }
        });

        return {
          id: category.id,
          name: category.name,
          productCount: category.products.length,
          averagePrice: prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
          totalStock: stocks.reduce((a, b) => a + b, 0),
          stockStatus: {
            lowStock: stocks.filter(s => s <= 10 && s > 0).length,
            outOfStock: stocks.filter(s => s === 0).length,
            inStock: stocks.filter(s => s > 10).length,
          },
        };
      }).sort((a, b) => b.productCount - a.productCount),
    };

    res.json(stats);
  })
);

export default router;