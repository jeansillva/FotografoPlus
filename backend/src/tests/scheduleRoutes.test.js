import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.unstable_mockModule("../controllers/scheduleController.js", () => ({
  createSchedule: jest.fn((req, res) => res.status(201).json({ message: "mocked create" })),
  getAllSchedules: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "mocked" }])),
  updateSchedule: jest.fn((req, res) => res.status(200).json({ message: "mocked update" })),
  deleteSchedule: jest.fn((req, res) => res.status(200).json({ message: "mocked delete" })),
}));

jest.unstable_mockModule("../middlewares/authMiddleware.js", () => ({
  authMiddleware: jest.fn((req, res, next) => next()), 
}));

const scheduleController = await import("../controllers/scheduleController.js");
const { authMiddleware } = await import("../middlewares/authMiddleware.js");
const scheduleRoutes = (await import("../routes/scheduleRoutes.js")).default;

const app = express();
app.use(express.json());
app.use("/schedules", scheduleRoutes);

describe("Schedule Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /schedules chama createSchedule", async () => {
    const response = await request(app).post("/schedules").send({ name: "Novo" });

    expect(authMiddleware).toHaveBeenCalled();
    expect(scheduleController.createSchedule).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "mocked create" });
  });

  it("GET /schedules chama getAllSchedules", async () => {
    const response = await request(app).get("/schedules");

    expect(authMiddleware).toHaveBeenCalled();
    expect(scheduleController.getAllSchedules).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "mocked" }]);
  });

  it("PUT /schedules/:id chama updateSchedule", async () => {
    const response = await request(app).put("/schedules/123").send({ name: "Atualizado" });

    expect(authMiddleware).toHaveBeenCalled();
    expect(scheduleController.updateSchedule).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "mocked update" });
  });

  it("DELETE /schedules/:id chama deleteSchedule", async () => {
    const response = await request(app).delete("/schedules/123");

    expect(authMiddleware).toHaveBeenCalled();
    expect(scheduleController.deleteSchedule).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "mocked delete" });
  });
});
