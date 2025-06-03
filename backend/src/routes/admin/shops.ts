import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import type { Shop } from "../../../../shared/types";
import { asyncHandler } from "../../middleware/errorHandler";

const router = Router();
const prisma = new PrismaClient();

// Route GET pour tester que le routeur fonctionne
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const shops = await prisma.shop.findMany();
      res.json({ message: "Admin shops route works", count: shops.length });
    } catch (error) {
      console.error("Erreur get shops admin:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  })
);

// Route PUT pour mettre à jour les informations d'une boutique
router.put(
  "/:shopId",
  asyncHandler(async (req: Request, res: Response) => {
    const { shopId } = req.params;
    const shopData: Partial<Shop> = req.body;

    console.log("🔧 PUT /api/admin/shops/:shopId appelée", {
      shopId,
      shopData,
    });

    // Vérification des données requises
    if (!shopId) {
      return res.status(400).json({ error: "ID boutique manquant" });
    }

    try {
      // Vérifier d'abord si la boutique existe
      const existingShop = await prisma.shop.findUnique({
        where: { id: shopId },
      });

      if (!existingShop) {
        return res.status(404).json({ error: "Boutique non trouvée" });
      }

      // Mise à jour de la boutique
      const updatedShop = await prisma.shop.update({
        where: { id: shopId },
        data: {
          name: shopData.name,
          address: shopData.address,
          phone: shopData.phone,
          email: shopData.email,
          website: shopData.website,
          description: shopData.description,
          openingHours: shopData.openingHours
            ? JSON.stringify(shopData.openingHours)
            : undefined,
        },
      });

      console.log("✅ Boutique mise à jour avec succès:", updatedShop.id);
      res.json(updatedShop);
    } catch (error) {
      console.error("Erreur update boutique:", error);
      res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
    }
  })
);

export default router;
