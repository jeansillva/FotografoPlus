import { jest, beforeEach, afterEach, describe, it, expect } from "@jest/globals";
import Schedule from "../models/Schedule.js";
import {
  createSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";

jest.mock("../models/Schedule.js");

beforeEach(() => {
  Schedule.create = jest.fn();
  Schedule.find = jest.fn();
  Schedule.findOneAndUpdate = jest.fn();
  Schedule.findOneAndDelete = jest.fn();
});

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

let req;
let res;

beforeEach(() => {
  req = { body: {}, params: {}, user: { id: "userId" } };
  res = buildRes();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Schedule Controller - createSchedule", () => {
  it("deve retornar 400 se title ou date não forem fornecidos", async () => {
    req.body = { title: "", date: "" };
    await createSchedule(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Título e data são obrigatórios" });
  });

  it("deve retornar 400 se data for inválida", async () => {
    req.body = { title: "Teste", date: "invalid-date" };
    await createSchedule(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Formato de data inválido" });
  });

  it("deve criar um agendamento com sucesso", async () => {
    req.body = { title: "Teste", date: "2025-10-19", description: "Desc" };
    Schedule.create.mockResolvedValue({ id: "123", ...req.body });

    await createSchedule(req, res);

    expect(Schedule.create).toHaveBeenCalledWith({
      title: "Teste",
      date: new Date("2025-10-19").toISOString(),
      description: "Desc",
      user: "userId",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Agendamento criado com sucesso",
      newSchedule: { id: "123", ...req.body },
    });
  });
});

describe("Schedule Controller - getAllSchedules", () => {
  it("deve retornar lista de agendamentos", async () => {
    const schedules = [{ title: "A" }, { title: "B" }];
    Schedule.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(schedules) });

    await getAllSchedules(req, res);

    expect(Schedule.find).toHaveBeenCalledWith({ user: "userId" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(schedules);
  });
});

describe("Schedule Controller - updateSchedule", () => {
  it("deve retornar 404 se agendamento não encontrado", async () => {
    req.params.id = "123";
    Schedule.findOneAndUpdate.mockResolvedValue(null);

    await updateSchedule(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Agendamento não encontrado ou não pertence ao usuário",
    });
  });

  it("deve atualizar o agendamento com sucesso", async () => {
    req.params.id = "123";
    req.body = { title: "Atualizado" };
    Schedule.findOneAndUpdate.mockResolvedValue({ id: "123", title: "Atualizado" });

    await updateSchedule(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Agendamento atualizado com sucesso",
      updated: { id: "123", title: "Atualizado" },
    });
  });
});

describe("Schedule Controller - deleteSchedule", () => {
  it("deve retornar 404 se agendamento não encontrado", async () => {
    req.params.id = "123";
    Schedule.findOneAndDelete.mockResolvedValue(null);

    await deleteSchedule(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Agendamento não encontrado ou não pertence ao usuário",
    });
  });

  it("deve deletar o agendamento com sucesso", async () => {
    req.params.id = "123";
    Schedule.findOneAndDelete.mockResolvedValue({ id: "123" });

    await deleteSchedule(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Agendamento excluído com sucesso" });
  });
});
