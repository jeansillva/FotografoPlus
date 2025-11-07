import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Album from "../models/Album.js";
import User from "../models/User.js";

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
  await Album.deleteMany({});
  await User.deleteMany({});
});

describe("Album Model", () => {
  it("deve criar um álbum válido com fotos e usuário associado", async () => {
    const user = await User.create({
      name: "Jean",
      email: "jean@teste.com",
      password: "Senha123",
    });

    const album = await Album.create({
      title: "Meu Álbum de Teste",
      description: "Fotos incríveis",
      user: user._id,
      photos: [
        { title: "Foto 1", imageUrl: "http://teste.com/foto1.jpg", description: "Linda foto" },
        { title: "Foto 2", imageUrl: "http://teste.com/foto2.jpg" },
      ],
    });

    expect(album._id).toBeDefined();
    expect(album.title).toBe("Meu Álbum de Teste");
    expect(album.user.toString()).toBe(user._id.toString());
    expect(album.photos.length).toBe(2);
    expect(album.photos[0].title).toBe("Foto 1");
  });

  it("deve falhar ao criar álbum sem título", async () => {
    const user = await User.create({
      name: "Jean",
      email: "sem@titulo.com",
      password: "Senha123",
    });

    await expect(
      Album.create({
        description: "Sem título",
        user: user._id,
      })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("deve falhar ao criar álbum sem usuário", async () => {
    await expect(
      Album.create({
        title: "Sem usuário",
        description: "Falha esperada",
      })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it("deve adicionar fotos a um álbum existente", async () => {
    const user = await User.create({
      name: "Jean",
      email: "add@teste.com",
      password: "Senha123",
    });

    const album = await Album.create({
      title: "Álbum Dinâmico",
      user: user._id,
      photos: [],
    });

    album.photos.push({
      title: "Nova Foto",
      imageUrl: "http://teste.com/nova.jpg",
      description: "Foto adicionada depois",
    });

    await album.save();

    const updated = await Album.findById(album._id);
    expect(updated.photos.length).toBe(1);
    expect(updated.photos[0].title).toBe("Nova Foto");
  });

  it("deve permitir remover uma foto do álbum", async () => {
    const user = await User.create({
      name: "Jean",
      email: "remove@teste.com",
      password: "Senha123",
    });

    const album = await Album.create({
      title: "Álbum Remover Foto",
      user: user._id,
      photos: [
        { title: "A", imageUrl: "a.jpg" },
        { title: "B", imageUrl: "b.jpg" },
      ],
    });

    album.photos.id(album.photos[0]._id).deleteOne();
    await album.save();

    const updated = await Album.findById(album._id);
    expect(updated.photos.length).toBe(1);
    expect(updated.photos[0].title).toBe("B");
  });
});
