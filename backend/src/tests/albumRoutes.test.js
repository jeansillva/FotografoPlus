import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

const mockController = {
  createAlbum: jest.fn((req, res) => res.status(201).json({ message: "Álbum criado" })),
  getAlbums: jest.fn((req, res) => res.status(200).json([{ title: "Álbum 1" }])),
  updateAlbum: jest.fn((req, res) => res.status(200).json({ message: "Álbum atualizado" })),
  deleteAlbum: jest.fn((req, res) => res.status(200).json({ message: "Álbum deletado" })),
  addPhoto: jest.fn((req, res) => res.status(201).json({ message: "Foto adicionada" })),
  updatePhoto: jest.fn((req, res) => res.status(200).json({ message: "Foto atualizada" })),
  deletePhoto: jest.fn((req, res) => res.status(200).json({ message: "Foto removida" })),
  uploadMany: jest.fn((req, res, next) => next()),
};

jest.unstable_mockModule("../controllers/albumController.js", () => ({
  ...mockController,
}));

const albumRoutes = (await import("../routes/albumRoutes.js")).default;

const app = express();
app.use(express.json());
app.use("/api/albums", albumRoutes);

describe("Album Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("POST /api/albums deve chamar createAlbum com uploadMany", async () => {
    const res = await request(app).post("/api/albums").send({ title: "Novo Álbum" });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Álbum criado");
    expect(mockController.createAlbum).toHaveBeenCalled();
  });

  it("GET /api/albums deve chamar getAlbums", async () => {
    const res = await request(app).get("/api/albums");
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe("Álbum 1");
    expect(mockController.getAlbums).toHaveBeenCalled();
  });

  it("PUT /api/albums/:id deve chamar updateAlbum", async () => {
    const res = await request(app).put("/api/albums/1").send({ title: "Atualizado" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Álbum atualizado");
    expect(mockController.updateAlbum).toHaveBeenCalled();
  });

  it("DELETE /api/albums/:id deve chamar deleteAlbum", async () => {
    const res = await request(app).delete("/api/albums/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Álbum deletado");
    expect(mockController.deleteAlbum).toHaveBeenCalled();
  });

  it("POST /api/albums/:id/photos deve chamar addPhoto", async () => {
    const res = await request(app)
      .post("/api/albums/1/photos")
      .attach("photo", Buffer.from("fake"), "foto.jpg");
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Foto adicionada");
    expect(mockController.addPhoto).toHaveBeenCalled();
  });

  it("PUT /api/albums/:albumId/photos/:photoId deve chamar updatePhoto", async () => {
    const res = await request(app)
      .put("/api/albums/1/photos/2")
      .send({ title: "Nova foto" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Foto atualizada");
    expect(mockController.updatePhoto).toHaveBeenCalled();
  });

  it("DELETE /api/albums/:albumId/photos/:photoId deve chamar deletePhoto", async () => {
    const res = await request(app).delete("/api/albums/1/photos/2");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Foto removida");
    expect(mockController.deletePhoto).toHaveBeenCalled();
  });
});
