import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User.js";
import bcrypt from "bcrypt";

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
  await User.deleteMany({});
});

describe("User Model", () => {
  it("deve criar um usuário válido e hashear a senha", async () => {
    const user = await User.create({
      name: "Jean",
      email: "jean@teste.com",
      password: "Senha123",
    });

    expect(user._id).toBeDefined();
    expect(user.name).toBe("Jean");
    expect(user.password).not.toBe("Senha123"); 
    const isMatch = await bcrypt.compare("Senha123", user.password);
    expect(isMatch).toBe(true);
  });

  it("deve falhar sem email", async () => {
    await expect(
      User.create({ name: "Jean", password: "Senha123" })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("deve falhar sem senha", async () => {
    await expect(
      User.create({ name: "Jean", email: "teste@teste.com" })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("matchPassword deve retornar true para senha correta", async () => {
    const user = await User.create({
      name: "Jean",
      email: "jean2@teste.com",
      password: "Senha123",
    });

    const match = await user.matchPassword("Senha123");
    expect(match).toBe(true);
  });

  it("matchPassword deve retornar false para senha incorreta", async () => {
    const user = await User.create({
      name: "Jean",
      email: "jean3@teste.com",
      password: "Senha123",
    });

    const match = await user.matchPassword("Errada");
    expect(match).toBe(false);
  });
});
