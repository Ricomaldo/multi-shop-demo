import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = Router();
const prisma = new PrismaClient();

// GET /api/categories - Récupérer toutes les catégories
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { shopId } = req.query;

    const where: any = {};
    if (shopId) where.shopId = shopId as string;

    const categories = await prisma.category.findMany({
      where,
      include: {
        shop: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(categories);
  })
);

// GET /api/categories/:id - Récupérer une catégorie par ID
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
            category: true,
            shop: true,
          },
        },
      },
    });

    if (!category) {
      throw createError("Catégorie non trouvée", 404);
    }

    res.json(category);
  })
);

// GET /api/categories/:id/products - Récupérer les produits d'une catégorie
router.get(
  "/:id/products",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Vérifier que la catégorie existe
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw createError("Catégorie non trouvée", 404);
    }

    const products = await prisma.product.findMany({
      where: { categoryId: id },
      include: {
        category: true,
        shop: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(products);
  })
);

export default router;
