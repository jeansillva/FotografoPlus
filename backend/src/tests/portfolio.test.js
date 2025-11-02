import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Portfolio from "../models/Portfolio.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Portfolio.deleteMany({});
});

describe("Portfolio Model", () => {
  it("deve criar um portfólio válido", async () => {
    const portfolio = await Portfolio.create({
      title: "Foto Teste",
      imageUrl: "http://teste.com/foto.png",
      description: "Descrição",
      user: new mongoose.Types.ObjectId(),
    });

    expect(portfolio._id).toBeDefined();
    expect(portfolio.title).toBe("Foto Teste");
    expect(portfolio.description).toBe("Descrição");
  });

  it("deve falhar ao criar sem título", async () => {
    await expect(
      Portfolio.create({
        imageUrl: "http://teste.com/foto.png",
        user: new mongoose.Types.ObjectId(),
      })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("deve aplicar default para description", async () => {
    const portfolio = await Portfolio.create({
      title: "Foto",
      imageUrl: "http://teste.com/foto.png",
      user: new mongoose.Types.ObjectId(),
    });

    expect(portfolio.description).toBe("");
  });
});
