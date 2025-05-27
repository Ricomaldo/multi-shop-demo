import express from "express";
import request from "supertest";
import { errorHandler } from "../../middleware/errorHandler";
import productsRouter from "../products";

// Mock Prisma
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

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/products", productsRouter);
  app.use(errorHandler);
  return app;
};

describe("Products Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    test("should return all products", async () => {
      const mockProducts = [
        {
          id: "product-1",
          name: "Test Product",
          price: 10.99,
          category: { name: "Test Category" },
          shop: { name: "Test Shop" },
        },
      ];

      // Mock Prisma response
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
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

    test("should filter by shopId when provided", async () => {
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
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
  });

  describe("GET /api/products/:id", () => {
    test("should return product by id", async () => {
      const mockProduct = {
        id: "product-1",
        name: "Test Product",
        price: 10.99,
      };

      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      const response = await request(app)
        .get("/api/products/product-1")
        .expect(200);

      expect(response.body).toEqual(mockProduct);
    });

    test("should return 404 if product not found", async () => {
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/products/nonexistent")
        .expect(404);

      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Produit non trouvé");
    });
  });

  describe("POST /api/products", () => {
    test("should create new product", async () => {
      const newProduct = {
        name: "New Product",
        description: "Test description",
        price: 15.99,
        categoryId: "cat-1",
        shopId: "shop-1",
      };

      const mockCreatedProduct = { id: "product-new", ...newProduct };

      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.category.findUnique.mockResolvedValue({ id: "cat-1" });
      mockPrisma.shop.findUnique.mockResolvedValue({ id: "shop-1" });
      mockPrisma.product.create.mockResolvedValue(mockCreatedProduct);

      const response = await request(app)
        .post("/api/products")
        .send(newProduct)
        .expect(201);

      expect(response.body).toEqual(mockCreatedProduct);
    });

    test("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/api/products")
        .send({ name: "Incomplete Product" })
        .expect(400);

      expect(response.body).toHaveProperty("error", true);
      expect(response.body.message).toContain("Champs requis manquants");
    });
  });

  describe("PUT /api/products/:id", () => {
    test("should update existing product", async () => {
      const updateData = { name: "Updated Product", price: 20.99 };
      const mockUpdatedProduct = { id: "product-1", ...updateData };

      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.product.findUnique.mockResolvedValue({ id: "product-1" });
      mockPrisma.product.update.mockResolvedValue(mockUpdatedProduct);

      const response = await request(app)
        .put("/api/products/product-1")
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedProduct);
    });

    test("should return 404 for nonexistent product", async () => {
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/products/nonexistent")
        .send({ name: "Updated" })
        .expect(404);

      expect(response.body).toHaveProperty("message", "Produit non trouvé");
    });
  });

  describe("DELETE /api/products/:id", () => {
    test("should delete existing product", async () => {
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.product.findUnique.mockResolvedValue({ id: "product-1" });
      mockPrisma.product.delete.mockResolvedValue({ id: "product-1" });

      const response = await request(app)
        .delete("/api/products/product-1")
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Produit supprimé avec succès"
      );
    });

    test("should return 404 for nonexistent product", async () => {
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/products/nonexistent")
        .expect(404);

      expect(response.body).toHaveProperty("message", "Produit non trouvé");
    });
  });
});
