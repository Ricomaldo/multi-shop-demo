import express from "express";
import request from "supertest";
import { errorHandler } from "../../middleware/errorHandler";
import categoriesRouter from "../categories";

// Mock Prisma
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
    },
  })),
}));

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/categories", categoriesRouter);
  app.use(errorHandler);
  return app;
};

describe("Categories Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    test("should return all categories", async () => {
      const mockCategories = [
        {
          id: "cat-1",
          name: "Test Category",
          shop: { name: "Test Shop" },
          products: [{ id: "prod-1", name: "Product 1", price: 10.99 }],
        },
      ];

      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.category.findMany.mockResolvedValue(mockCategories);

      const response = await request(app).get("/api/categories").expect(200);

      expect(response.body).toEqual(mockCategories);
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: {},
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
    });

    test("should filter by shopId when provided", async () => {
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.category.findMany.mockResolvedValue([]);

      await request(app).get("/api/categories?shopId=shop-123").expect(200);

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { shopId: "shop-123" },
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
    });
  });

  describe("GET /api/categories/:id", () => {
    test("should return category by id", async () => {
      const mockCategory = {
        id: "cat-1",
        name: "Test Category",
        shop: { name: "Test Shop" },
        products: [],
      };

      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.category.findUnique.mockResolvedValue(mockCategory);

      const response = await request(app)
        .get("/api/categories/cat-1")
        .expect(200);

      expect(response.body).toEqual(mockCategory);
    });

    test("should return 404 if category not found", async () => {
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.category.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/categories/nonexistent")
        .expect(404);

      expect(response.body).toHaveProperty("error", true);
      expect(response.body).toHaveProperty("message", "Catégorie non trouvée");
    });
  });

  describe("GET /api/categories/:id/products", () => {
    test("should return products for category", async () => {
      const mockProducts = [
        {
          id: "prod-1",
          name: "Product 1",
          price: 10.99,
          category: { name: "Test Category" },
          shop: { name: "Test Shop" },
        },
      ];

      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.category.findUnique.mockResolvedValue({ id: "cat-1" });
      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      const response = await request(app)
        .get("/api/categories/cat-1/products")
        .expect(200);

      expect(response.body).toEqual(mockProducts);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: "cat-1" },
        include: {
          category: true,
          shop: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    });

    test("should return 404 if category not found", async () => {
      const { PrismaClient } = require("@prisma/client");
      const mockPrisma = new PrismaClient();
      mockPrisma.category.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/categories/nonexistent/products")
        .expect(404);

      expect(response.body).toHaveProperty("message", "Catégorie non trouvée");
    });
  });
});
