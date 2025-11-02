import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Schedule from "../models/Schedule.js";

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
  await Schedule.deleteMany({});
});

describe("Schedule Model", () => {
  it("deve criar um agendamento válido", async () => {
    const schedule = await Schedule.create({
      title: "Reunião",
      date: new Date(),
      description: "Descrição",
      user: new mongoose.Types.ObjectId(),
    });

    expect(schedule._id).toBeDefined();
    expect(schedule.title).toBe("Reunião");
  });

  it("deve falhar sem título", async () => {
    await expect(
      Schedule.create({
        date: new Date(),
        user: new mongoose.Types.ObjectId(),
      })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("deve falhar sem data", async () => {
    await expect(
      Schedule.create({
        title: "Teste",
        user: new mongoose.Types.ObjectId(),
      })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("deve aplicar default para description", async () => {
    const schedule = await Schedule.create({
      title: "Reunião",
      date: new Date(),
      user: new mongoose.Types.ObjectId(),
    });

    expect(schedule.description).toBe("");
  });
});
