import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler";
import categoriesRouter from "./routes/categories";
import productsRouter from "./routes/products";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Middleware de validation corrigé
app.use((req: Request, res: Response, next: NextFunction) => {
  // express.json() a déjà parsé le JSON, on passe au suivant
  next();
});

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes API avec gestion d'erreurs
app.get("/api/shops", async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      include: { categories: true },
    });
    res.json(shops);
  } catch (error) {
    console.error("Erreur /api/shops:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/shops/:shopId/products", async (req, res) => {
  try {
    const { shopId } = req.params;
    const products = await prisma.product.findMany({
      where: { shopId },
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    console.error("Erreur /api/shops/:shopId/products:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Routes modulaires CRUD
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Serveur DemoForge démarré sur http://localhost:${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api/health`);
});

// Gestion propre de l'arrêt
process.on("SIGINT", async () => {
  console.log("🛑 Arrêt du serveur...");
  await prisma.$disconnect();
  process.exit(0);
});
