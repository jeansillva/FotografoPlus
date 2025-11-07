import { jest } from "@jest/globals";

jest.unstable_mockModule("../controllers/authController.js", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  updateUserCredentials: jest.fn(),
  deleteUserById: jest.fn(),
}));

jest.unstable_mockModule("../middlewares/authMiddleware.js", () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
}));

const express = (await import("express")).default;
const request = (await import("supertest")).default;
const authRoutes = (await import("../routes/authRoutes.js")).default;
const authController = await import("../controllers/authController.js");
const { authMiddleware } = await import("../middlewares/authMiddleware.js");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("POST /api/auth/register deve chamar registerUser", async () => {
    authController.registerUser.mockImplementation((req, res) =>
      res.status(201).json({ message: "Usuário criado" })
    );

    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "teste@teste.com", password: "123" });

    expect(authController.registerUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Usuário criado" });
  });

  it("POST /api/auth/login deve chamar loginUser", async () => {
    authController.loginUser.mockImplementation((req, res) =>
      res.status(200).json({ token: "fake-jwt" })
    );

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "teste@teste.com", password: "123" });

    expect(authController.loginUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: "fake-jwt" });
  });

  it("PATCH /api/auth/update-password deve chamar updateUserCredentials com middleware", async () => {
    authController.updateUserCredentials.mockImplementation((req, res) =>
      res.status(200).json({ message: "Senha atualizada" })
    );

    const response = await request(app)
      .patch("/api/auth/update-password")
      .send({ oldPassword: "123", newPassword: "456" });

    expect(authMiddleware).toHaveBeenCalled();
    expect(authController.updateUserCredentials).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Senha atualizada" });
  });

  it("DELETE /api/auth/users/:id deve chamar deleteUserById com middleware", async () => {
    authController.deleteUserById.mockImplementation((req, res) =>
      res.status(200).json({ message: "Usuário deletado" })
    );

    const response = await request(app).delete("/api/auth/users/123");

    expect(authMiddleware).toHaveBeenCalled();
    expect(authController.deleteUserById).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Usuário deletado" });
  });
});
