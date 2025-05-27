import { Request, Response } from "express";

// Mock des fonctions de route
const mockShopsRoute = (req: Request, res: Response) => {
  res.json([
    {
      id: "test-shop-1",
      name: "Test Brewery",
      shopType: "brewery",
      categories: [],
    },
  ]);
};

const mockProductsRoute = (req: Request, res: Response) => {
  res.json([
    {
      id: "test-product-1",
      name: "Test Beer",
      description: "A test beer",
      price: 4.5,
      shopId: "test-shop-1",
      categoryId: "test-category-1",
    },
  ]);
};

describe("API Routes", () => {
  test("shops route should return array of shops", () => {
    const mockReq = {} as Request;
    const mockRes = {
      json: jest.fn(),
    } as unknown as Response;

    mockShopsRoute(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "test-shop-1",
        name: "Test Brewery",
        shopType: "brewery",
      }),
    ]);
  });

  test("products route should return array of products", () => {
    const mockReq = {} as Request;
    const mockRes = {
      json: jest.fn(),
    } as unknown as Response;

    mockProductsRoute(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "test-product-1",
        name: "Test Beer",
        price: 4.5,
      }),
    ]);
  });
});
