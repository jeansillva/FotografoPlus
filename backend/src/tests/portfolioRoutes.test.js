import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.unstable_mockModule("../controllers/portfolioController.js", () => ({
  createPortfolioItem: jest.fn((req, res) => res.status(201).json({ message: "mocked create" })),
  getAllPortfolioItems: jest.fn((req, res) => res.status(200).json([{ id: 1, title: "mocked" }])),
  updatePortfolioItem: jest.fn((req, res) => res.status(200).json({ message: "mocked update" })),
  deletePortfolioItem: jest.fn((req, res) => res.status(200).json({ message: "mocked delete" })),
  upload: { single: jest.fn(() => (req, res, next) => next()) },
}));

const portfolioController = await import("../controllers/portfolioController.js");
const portfolioRoutes = (await import("../routes/portfolioRoutes.js")).default;

const app = express();
app.use(express.json());
app.use("/portfolio", portfolioRoutes);

describe("Portfolio Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /portfolio chama createPortfolioItem", async () => {
    const response = await request(app).post("/portfolio").send({ title: "Teste" });

    expect(portfolioController.createPortfolioItem).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "mocked create" });
  });

  it("GET /portfolio chama getAllPortfolioItems", async () => {
    const response = await request(app).get("/portfolio");

    expect(portfolioController.getAllPortfolioItems).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, title: "mocked" }]);
  });

  it("PUT /portfolio/:id chama updatePortfolioItem", async () => {
    const response = await request(app).put("/portfolio/123").send({ title: "Atualizado" });

    expect(portfolioController.updatePortfolioItem).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "mocked update" });
  });

  it("DELETE /portfolio/:id chama deletePortfolioItem", async () => {
    const response = await request(app).delete("/portfolio/123");

    expect(portfolioController.deletePortfolioItem).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "mocked delete" });
  });
});
