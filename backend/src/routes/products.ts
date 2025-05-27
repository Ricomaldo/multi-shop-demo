import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { asyncHandler, createError } from "../middleware/errorHandler";

const router = Router();
const prisma = new PrismaClient();

// GET /api/products - Récupérer tous les produits
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { shopId, categoryId } = req.query;

    const where: any = {};
    if (shopId) where.shopId = shopId as string;
    if (categoryId) where.categoryId = categoryId as string;

    const products = await prisma.product.findMany({
      where,
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

// GET /api/products/:id - Récupérer un produit par ID
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
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

// POST /api/products - Créer un nouveau produit
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, price, image, attributes, categoryId, shopId } =
      req.body;

    // Validation basique
    if (!name || !price || !categoryId || !shopId) {
      throw createError(
        "Champs requis manquants: name, price, categoryId, shopId",
        400
      );
    }

    if (typeof price !== "number" || price <= 0) {
      throw createError("Le prix doit être un nombre positif", 400);
    }

    // Vérifier que la catégorie et la boutique existent
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw createError("Catégorie non trouvée", 404);
    }

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      throw createError("Boutique non trouvée", 404);
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
        attributes: attributes ? JSON.stringify(attributes) : null,
        categoryId,
        shopId,
      },
      include: {
        category: true,
        shop: true,
      },
    });

    res.status(201).json(product);
  })
);

// PUT /api/products/:id - Mettre à jour un produit
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, image, attributes } = req.body;

    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw createError("Produit non trouvé", 404);
    }

    // Validation du prix si fourni
    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      throw createError("Le prix doit être un nombre positif", 400);
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (image !== undefined) updateData.image = image;
    if (attributes !== undefined)
      updateData.attributes = JSON.stringify(attributes);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        shop: true,
      },
    });

    res.json(product);
  })
);

// DELETE /api/products/:id - Supprimer un produit
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw createError("Produit non trouvé", 404);
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Produit supprimé avec succès" });
  })
);

export default router;
