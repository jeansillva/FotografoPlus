import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import app from "../app.js";
import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";

let mongoServer;
let token;
let userId;
let createdItemId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const user = await User.create({
    name: "Jean Teste",
    email: "jean@teste.com",
    password: "Jean1234",
  });

  userId = user._id.toString();
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
});

afterEach(async () => {
  await Portfolio.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Portfolio Controller", () => {
  describe("POST /api/portfolio", () => {
    it("deve criar um item de portfólio com sucesso", async () => {
      const res = await request(app)
        .post("/api/portfolio")
        .set("Authorization", `Bearer ${token}`)
        .field("title", "Foto de Teste")
        .field("description", "Descrição da foto")
        .attach("image", Buffer.from("fakeimage"), "foto.png");

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", "Foto de Teste");

      createdItemId = res.body._id;
    });

    it("deve retornar erro se não enviar imagem", async () => {
      const res = await request(app)
        .post("/api/portfolio")
        .set("Authorization", `Bearer ${token}`)
        .field("title", "Sem Imagem");

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/Imagem é obrigatória/);
    });
  });

  describe("GET /api/portfolio", () => {
    it("deve listar todos os itens do usuário", async () => {
      await Portfolio.create({
        title: "Foto de Teste",
        description: "Descrição",
        imageUrl: "data:image/png;base64,fake",
        user: userId,
      });

      const res = await request(app)
        .get("/api/portfolio")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("PUT /api/portfolio/:id", () => {
    it("deve atualizar um item existente", async () => {
      const item = await Portfolio.create({
        title: "Antigo",
        description: "desc",
        imageUrl: "data:image/png;base64,fake",
        user: userId,
      });

      const res = await request(app)
        .put(`/api/portfolio/${item._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Foto Atualizada" });

      expect(res.statusCode).toBe(200);
      expect(res.body.updated.title).toBe("Foto Atualizada");
    });

    it("deve retornar erro ao tentar atualizar item inexistente", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/portfolio/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Inexistente" });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/Item não encontrado/);
    });
  });

  describe("DELETE /api/portfolio/:id", () => {
    it("deve deletar um item existente", async () => {
      const item = await Portfolio.create({
        title: "Para deletar",
        description: "desc",
        imageUrl: "data:image/png;base64,fake",
        user: userId,
      });

      const res = await request(app)
        .delete(`/api/portfolio/${item._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/Item removido com sucesso/);
    });

    it("deve retornar erro ao tentar deletar item inexistente", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/portfolio/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/Item não encontrado/);
    });
  });
});
