import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import mongoose from "mongoose";

const mockAlbumModel = {
  create: jest.fn(),
  find: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  findOne: jest.fn(),
};

jest.unstable_mockModule("../models/Album.js", () => ({
  default: mockAlbumModel,
}));

const { 
  createAlbum, 
  getAlbums, 
  updateAlbum, 
  deleteAlbum,
  addPhoto,
  updatePhoto,
  deletePhoto
} = await import("../controllers/albumController.js");

const mockUser = { id: new mongoose.Types.ObjectId() };

const app = express();
app.use(express.json());

app.post("/albums", (req, res) => { req.user = mockUser; createAlbum(req, res); });
app.get("/albums", (req, res) => { req.user = mockUser; getAlbums(req, res); });
app.put("/albums/:id", (req, res) => { req.user = mockUser; updateAlbum(req, res); });
app.delete("/albums/:id", (req, res) => { req.user = mockUser; deleteAlbum(req, res); });

describe("albumController - álbuns", () => {
  afterEach(() => jest.clearAllMocks());

  it("cria um álbum com sucesso", async () => {
    const mockAlbum = { _id: "123", title: "Viagem", description: "Fotos da praia", user: mockUser.id };
    mockAlbumModel.create.mockResolvedValue(mockAlbum);

    const res = await request(app).post("/albums").send({ title: "Viagem", description: "Fotos da praia" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Viagem");
  });

  it("retorna erro se o título estiver ausente", async () => {
    const res = await request(app).post("/albums").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Título obrigatório/);
  });

  it("busca álbuns do usuário", async () => {
    mockAlbumModel.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([{ title: "Viagem" }]),
    });

    const res = await request(app).get("/albums");
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe("Viagem");
  });

  it("atualiza um álbum com sucesso", async () => {
    mockAlbumModel.findOneAndUpdate.mockResolvedValue({ _id: "1", title: "Atualizado" });

    const res = await request(app).put("/albums/1").send({ title: "Atualizado" });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Atualizado");
  });

  it("retorna erro ao tentar atualizar álbum inexistente", async () => {
    mockAlbumModel.findOneAndUpdate.mockResolvedValue(null);
    const res = await request(app).put("/albums/999").send({ title: "X" });
    expect(res.status).toBe(404);
  });

  it("deleta um álbum existente", async () => {
    mockAlbumModel.findOneAndDelete.mockResolvedValue({ _id: "1" });
    const res = await request(app).delete("/albums/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Álbum excluído/);
  });

  it("retorna erro ao deletar álbum inexistente", async () => {
    mockAlbumModel.findOneAndDelete.mockResolvedValue(null);
    const res = await request(app).delete("/albums/999");
    expect(res.status).toBe(404);
  });
});

describe("albumController - fotos", () => {
  afterEach(() => jest.clearAllMocks());

  const mockPhoto = { _id: "p1", title: "Old", description: "Old desc", deleteOne: jest.fn() };
  const mockAlbumInstance = {
    _id: "1",
    title: "Viagem",
    user: mockUser.id,
    photos: { id: jest.fn(() => mockPhoto), push: jest.fn() },
    save: jest.fn().mockResolvedValue(true),
  };

  it("adiciona uma foto ao álbum", async () => {
    const file = { originalname: "foto.jpg", mimetype: "image/jpeg", buffer: Buffer.from("teste") };
    const req = { params: { id: "1" }, file, body: { description: "Foto legal" }, user: mockUser };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    mockAlbumModel.findOneAndUpdate.mockResolvedValue({
      ...mockAlbumInstance,
      photos: [{ title: file.originalname, imageUrl: expect.any(String), description: "Foto legal" }],
    });

    await addPhoto(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ photos: expect.arrayContaining([expect.objectContaining({ title: "foto.jpg", description: "Foto legal" })]) })
    );
  });

  it("atualiza uma foto do álbum", async () => {
    const req = { params: { albumId: "1", photoId: "p1" }, body: { title: "Novo título", description: "Nova descrição" }, user: mockUser };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    mockAlbumModel.findOne.mockResolvedValue(mockAlbumInstance);

    await updatePhoto(req, res);

    expect(mockAlbumInstance.photos.id).toHaveBeenCalledWith("p1");
    expect(mockPhoto.title).toBe("Novo título");
    expect(mockPhoto.description).toBe("Nova descrição");
    expect(mockAlbumInstance.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleta uma foto do álbum", async () => {
    const req = { params: { albumId: "1", photoId: "p1" }, user: mockUser };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    mockAlbumModel.findOne.mockResolvedValue(mockAlbumInstance);

    await deletePhoto(req, res);

    expect(mockAlbumInstance.photos.id).toHaveBeenCalledWith("p1");
    expect(mockPhoto.deleteOne).toHaveBeenCalled();
    expect(mockAlbumInstance.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Foto excluída com sucesso", album: mockAlbumInstance })
    );
  });
});
