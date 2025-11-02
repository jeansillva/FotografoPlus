import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import jwt from "jsonwebtoken";

// asyncHandler
describe("asyncHandler", () => {
  it("deve chamar next com erro se a função lançar", async () => {
    const error = new Error("fail");
    const fn = jest.fn().mockRejectedValue(error);
    const req = {}, res = {}, next = jest.fn();

    const wrapped = asyncHandler(fn);
    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("deve chamar função normalmente se não houver erro", async () => {
    const fn = jest.fn().mockResolvedValue("ok");
    const req = {}, res = {}, next = jest.fn();

    const wrapped = asyncHandler(fn);
    await wrapped(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});

// authMiddleware
describe("authMiddleware", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: "test-secret" };
    jest.clearAllMocks();
  });

  it("deve retornar 401 se token não fornecido", () => {
    const req = { header: jest.fn().mockReturnValue(undefined) };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Acesso negado. Token não fornecido.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se token inválido", () => {
    const req = { header: jest.fn().mockReturnValue("Bearer invalid") };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Token inválido ou expirado." })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("deve adicionar user e chamar next se token válido", () => {
    const token = jwt.sign({ id: "123" }, process.env.JWT_SECRET);
    const req = { header: jest.fn().mockReturnValue(`Bearer ${token}`) };
    const res = {};
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.user).toEqual(expect.objectContaining({ id: "123" }));
    expect(next).toHaveBeenCalled();
  });
});

// errorHandler
describe("errorHandler", () => {
  it("deve enviar status e mensagem do erro", () => {
    const err = { status: 400, message: "Bad Request" };
    const req = {}, res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Bad Request" });
  });

  it("deve usar defaults se não houver status ou mensagem", () => {
    const err = {};
    const req = {}, res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro interno no servidor" });
  });
});
