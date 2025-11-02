import { jest, beforeEach, afterEach, describe, test, expect } from "@jest/globals";
import User from "../models/User.js";

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { sign: jest.fn(() => "mock-token") },
}));

process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "7d";

const { registerUser, loginUser, updateUserCredentials, deleteUserById } =
  await import("../controllers/authController.js");

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("authController - registerUser", () => {
  test("retorna 400 quando faltar campos", async () => {
    const req = { body: { name: "Jean", email: "jean@teste.com" } };
    const res = buildRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Preencha todos os campos." });
  });

  test("retorna 400 quando usuário já existe", async () => {
    const req = { body: { name: "Jean", email: "jean@teste.com", password: "Jean1234" } };
    const res = buildRes();

    jest.spyOn(User, "findOne").mockResolvedValue({ _id: "id" });

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "jean@teste.com" });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuário já cadastrado." });
  });

  test("cria usuário e retorna 201 com token", async () => {
    const req = { body: { name: "Jean", email: "jean@teste.com", password: "Jean1234" } };
    const res = buildRes();

    jest.spyOn(User, "findOne").mockResolvedValue(null);
    jest.spyOn(User, "create").mockResolvedValue({ _id: "newId", name: "Jean", email: "jean@teste.com" });

    await registerUser(req, res);

    expect(User.create).toHaveBeenCalledWith({ name: "Jean", email: "jean@teste.com", password: "Jean1234" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Usuário registrado com sucesso!",
        user: { id: "newId", name: "Jean", email: "jean@teste.com" },
        token: "mock-token",
      })
    );
  });

  test("tratamento de ValidationError retorna 400", async () => {
    const req = { body: { name: "Jean", email: "jean@teste.com", password: "Jean1234" } };
    const res = buildRes();

    const error = new Error("invalid");
    error.name = "ValidationError";
    jest.spyOn(User, "findOne").mockRejectedValue(error);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Dados inválidos", error: "invalid" });
  });

  test("erro genérico retorna 500", async () => {
    const req = { body: { name: "Jean", email: "jean@teste.com", password: "Jean1234" } };
    const res = buildRes();

    const error = new Error("boom");
    jest.spyOn(User, "findOne").mockRejectedValue(error);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro ao registrar usuário.", error: "boom" });
  });
});

describe("authController - loginUser", () => {
  test("retorna 400 quando usuário não encontrado", async () => {
    const req = { body: { email: "jean@teste.com", password: "Jean1234" } };
    const res = buildRes();

    jest.spyOn(User, "findOne").mockResolvedValue(null);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Usuário não encontrado." });
  });

  test("retorna 401 quando senha incorreta", async () => {
    const req = { body: { email: "jean@teste.com", password: "Jean1234" } };
    const res = buildRes();

    jest.spyOn(User, "findOne").mockResolvedValue({
      _id: "id",
      matchPassword: jest.fn().mockResolvedValue(false),
    });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Senha incorreta." });
  });

  test("login bem-sucedido retorna 200 com token", async () => {
    const req = { body: { email: "jean@teste.com", password: "Jean1234" } };
    const res = buildRes();

    jest.spyOn(User, "findOne").mockResolvedValue({
      _id: "idOK",
      name: "Jean",
      email: "jean@teste.com",
      matchPassword: jest.fn().mockResolvedValue(true),
    });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Login bem-sucedido!",
        user: { id: "idOK", name: "Jean", email: "jean@teste.com" },
        token: "mock-token",
      })
    );
  });

  test("erro genérico no login retorna 500", async () => {
    const req = { body: { email: "jean@teste.com", password: "Jean1234" } };
    const res = buildRes();

    const error = new Error("login-fail");
    jest.spyOn(User, "findOne").mockRejectedValue(error);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao fazer login.",
      error: "login-fail",
    });
  });
});

describe("authController - updateUserCredentials", () => {
  test("retorna 404 quando usuário não encontrado", async () => {
    const req = { user: { id: "u1" }, body: { name: "Jean" } };
    const res = buildRes();

    jest.spyOn(User, "findById").mockResolvedValue(null);

    await updateUserCredentials(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário não encontrado.",
    });
  });

  test("retorna 400 quando senha atual incorreta", async () => {
    const mockUser = {
      _id: "u2",
      name: "Jean",
      email: "jean@teste.com",
      matchPassword: jest.fn().mockResolvedValue(false),
    };
    jest.spyOn(User, "findById").mockResolvedValue(mockUser);

    const req = {
      user: { id: "u2" },
      body: { currentPassword: "Jean1234", newPassword: "NewPass" },
    };
    const res = buildRes();

    await updateUserCredentials(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Senha atual incorreta.",
    });
  });

  test("atualiza nome e senha com sucesso", async () => {
    const mockUser = {
      _id: "u3",
      name: "OldName",
      email: "jean@teste.com",
      matchPassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };
    jest.spyOn(User, "findById").mockResolvedValue(mockUser);

    const req = {
      user: { id: "u3" },
      body: {
        name: "Jean",
        currentPassword: "Jean1234",
        newPassword: "Jean1234",
      },
    };
    const res = buildRes();

    await updateUserCredentials(req, res);

    expect(mockUser.name).toBe("Jean");
    expect(mockUser.password).toBe("Jean1234");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Credenciais atualizadas com sucesso!",
        user: { id: "u3", name: "Jean", email: "jean@teste.com" },
      })
    );
  });

  test("erro genérico em update retorna 500", async () => {
    const req = { user: { id: "uX" }, body: {} };
    const res = buildRes();

    const error = new Error("update-err");
    jest.spyOn(User, "findById").mockRejectedValue(error);

    await updateUserCredentials(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao atualizar credenciais.",
      error: "update-err",
    });
  });
});

describe("authController - deleteUserById", () => {
  test("retorna 401 sem requester no token", async () => {
    const req = { params: { id: "toDel" }, user: null };
    const res = buildRes();

    await deleteUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token inválido ou não fornecido.",
    });
  });

  test("deleta usuário com sucesso", async () => {
    const req = { params: { id: "del1" }, user: { id: "requester" } };
    const res = buildRes();

    jest.spyOn(User, "findByIdAndDelete").mockResolvedValue({ _id: "del1" });

    await deleteUserById(req, res);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith("del1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário deletado com sucesso.",
      id: "del1",
    });
  });

  test("retorna 404 quando usuário não existe", async () => {
    const req = { params: { id: "x" }, user: { id: "requester" } };
    const res = buildRes();

    jest.spyOn(User, "findByIdAndDelete").mockResolvedValue(null);

    await deleteUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário não encontrado.",
    });
  });

  test("erro genérico em delete retorna 500", async () => {
    const req = { params: { id: "err" }, user: { id: "r" } };
    const res = buildRes();

    const error = new Error("del-err");
    jest.spyOn(User, "findByIdAndDelete").mockRejectedValue(error);

    await deleteUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erro ao deletar usuário.",
      error: "del-err",
    });
  });
});
