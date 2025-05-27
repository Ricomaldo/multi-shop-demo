import cors from "cors";
import express from "express";
import request from "supertest";

// Créer une instance de test du serveur
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Route de test simple
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  return app;
};

describe("Server API", () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  test("GET /api/health should return OK status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("timestamp");
    expect(typeof response.body.timestamp).toBe("string");
  });

  test("should handle CORS", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.headers).toHaveProperty("access-control-allow-origin");
  });
});
