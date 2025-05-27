import express from "express";
import request from "supertest";
import { errorHandler } from "../../middleware/errorHandler";
import productsRouter from "../products";

// Mock Prisma avec des méthodes CRUD complètes
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    shop: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require("@prisma/client");
const mockPrisma = new PrismaClient();

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/products", productsRouter);
  app.use(errorHandler);
  return app;
};

describe("API CRUD Products - Tests Critiques", () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe("CREATE - POST /api/products", () => {
    test("crée un nouveau produit avec succès", async () => {
      const newProduct = {
        name: "Nouvelle Blonde",
        description: "Bière blonde artisanale",
        price: 4.8,
        categoryId: "cat-1",
        shopId: "shop-1",
      };

      const mockCreatedProduct = {
        id: "product-new",
        ...newProduct,
        category: { id: "cat-1", name: "Blondes" },
        shop: { id: "shop-1", name: "Brasserie Test" },
      };

      // Mock des vérifications d'existence
      mockPrisma.category.findUnique.mockResolvedValue({ id: "cat-1" });
      mockPrisma.shop.findUnique.mockResolvedValue({ id: "shop-1" });
      mockPrisma.product.create.mockResolvedValue(mockCreatedProduct);

      const response = await request(app)
        .post("/api/products")
        .send(newProduct)
        .expect(201);

      expect(response.body).toEqual(mockCreatedProduct);
      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: {
          name: "Nouvelle Blonde",
          description: "Bière blonde artisanale",
          price: 4.8,
          image: undefined,
          attributes: null,
          categoryId: "cat-1",
          shopId: "shop-1",
        },
        include: {
          category: true,
          shop: true,
        },
      });
    });

    test("rejette la création avec des champs manquants", async () => {
      const incompleteProduct = {
        name: "Produit incomplet",
        // Manque price, categoryId, shopId
      };

      const response = await request(app)
        .post("/api/products")
        .send(incompleteProduct)
        .expect(400);

      expect(response.body.error).toBe(true);
      expect(response.body.message).toContain("Champs requis manquants");
    });

    test("rejette la création avec un prix invalide", async () => {
      const invalidProduct = {
        name: "Produit prix invalide",
        price: -5.0,
        categoryId: "cat-1",
        shopId: "shop-1",
      };

      const response = await request(app)
        .post("/api/products")
        .send(invalidProduct)
        .expect(400);

      expect(response.body.message).toContain(
        "prix doit être un nombre positif"
      );
    });
  });

  describe("READ - GET /api/products", () => {
    test("récupère tous les produits", async () => {
      const mockProducts = [
        {
          id: "product-1",
          name: "Blonde de Garde",
          price: 4.5,
          category: { name: "Blondes" },
          shop: { name: "Brasserie Test" },
        },
        {
          id: "product-2",
          name: "IPA Houblonnée",
          price: 5.5,
          category: { name: "IPA" },
          shop: { name: "Brasserie Test" },
        },
      ];

      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      const response = await request(app).get("/api/products").expect(200);

      expect(response.body).toEqual(mockProducts);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: true,
          shop: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    });

    test("filtre par shopId", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);

      await request(app).get("/api/products?shopId=shop-123").expect(200);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { shopId: "shop-123" },
        include: {
          category: true,
          shop: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    });

    test("récupère un produit par ID", async () => {
      const mockProduct = {
        id: "product-1",
        name: "Blonde de Garde",
        price: 4.5,
        category: { name: "Blondes" },
        shop: { name: "Brasserie Test" },
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get("/api/products/product-1")
        .expect(200);

      expect(response.body).toEqual(mockProduct);
    });

    test("retourne 404 pour un produit inexistant", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/products/inexistant")
        .expect(404);

      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Produit non trouvé");
    });
  });

  describe("UPDATE - PUT /api/products/:id", () => {
    test("met à jour un produit existant", async () => {
      const updateData = {
        name: "Blonde Modifiée",
        price: 5.0,
      };

      const mockUpdatedProduct = {
        id: "product-1",
        ...updateData,
        category: { name: "Blondes" },
        shop: { name: "Brasserie Test" },
      };

      mockPrisma.product.findUnique.mockResolvedValue({ id: "product-1" });
      mockPrisma.product.update.mockResolvedValue(mockUpdatedProduct);

      const response = await request(app)
        .put("/api/products/product-1")
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedProduct);
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: "product-1" },
        data: {
          name: "Blonde Modifiée",
          price: 5.0,
        },
        include: {
          category: true,
          shop: true,
        },
      });
    });

    test("rejette la mise à jour avec un prix invalide", async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: "product-1" });

      const response = await request(app)
        .put("/api/products/product-1")
        .send({ price: -10 })
        .expect(400);

      expect(response.body.message).toContain(
        "prix doit être un nombre positif"
      );
    });

    test("retourne 404 pour un produit inexistant", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/products/inexistant")
        .send({ name: "Test" })
        .expect(404);

      expect(response.body.message).toBe("Produit non trouvé");
    });
  });

  describe("DELETE - DELETE /api/products/:id", () => {
    test("supprime un produit existant", async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: "product-1" });
      mockPrisma.product.delete.mockResolvedValue({ id: "product-1" });

      const response = await request(app)
        .delete("/api/products/product-1")
        .expect(200);

      expect(response.body.message).toBe("Produit supprimé avec succès");
      expect(mockPrisma.product.delete).toHaveBeenCalledWith({
        where: { id: "product-1" },
      });
    });

    test("retourne 404 pour un produit inexistant", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/products/inexistant")
        .expect(404);

      expect(response.body.message).toBe("Produit non trouvé");
    });
  });

  describe("Gestion d'erreurs", () => {
    test("gère les erreurs de base de données", async () => {
      mockPrisma.product.findMany.mockRejectedValue(new Error("Erreur DB"));

      const response = await request(app).get("/api/products").expect(500);

      expect(response.body.error).toBe(true);
    });

    test("valide les relations (catégorie inexistante)", async () => {
      const newProduct = {
        name: "Test",
        price: 5.0,
        categoryId: "cat-inexistant",
        shopId: "shop-1",
      };

      mockPrisma.category.findUnique.mockResolvedValue(null);
      mockPrisma.shop.findUnique.mockResolvedValue({ id: "shop-1" });

      const response = await request(app)
        .post("/api/products")
        .send(newProduct)
        .expect(404);

      expect(response.body.message).toBe("Catégorie non trouvée");
    });

    test("valide les relations (boutique inexistante)", async () => {
      const newProduct = {
        name: "Test",
        price: 5.0,
        categoryId: "cat-1",
        shopId: "shop-inexistant",
      };

      mockPrisma.category.findUnique.mockResolvedValue({ id: "cat-1" });
      mockPrisma.shop.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/products")
        .send(newProduct)
        .expect(404);

      expect(response.body.message).toBe("Boutique non trouvée");
    });
  });
});
