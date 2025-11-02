import Album from "../models/Album.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const uploadMany = multer({ storage }).array("photos");

export const createAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!title) return res.status(400).json({ message: "Título obrigatório" });

    const photos = (req.files || []).map((f) => {
      const b64 = f.buffer.toString("base64");
      return {
        title: f.originalname,
        imageUrl: `data:${f.mimetype};base64,${b64}`,
        description: "",
      };
    });

    const album = await Album.create({ title, description, photos, user: userId });
    res.status(201).json(album);
  } catch (error) {
    console.error("Erro ao criar álbum:", error);
    res.status(500).json({ message: "Erro interno ao criar álbum" });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const items = await Album.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("Erro ao buscar álbuns:", error);
    res.status(500).json({ message: "Erro ao buscar álbuns" });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const album = await Album.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, description },
      { new: true }
    );

    if (!album) return res.status(404).json({ message: "Álbum não encontrado" });
    res.status(200).json(album);
  } catch (error) {
    console.error("Erro ao atualizar álbum:", error);
    res.status(500).json({ message: "Erro ao atualizar álbum" });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await Album.findOneAndDelete({ _id: id, user: req.user.id });
    if (!album) return res.status(404).json({ message: "Álbum não encontrado" });
    res.status(200).json({ message: "Álbum excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir álbum:", error);
    res.status(500).json({ message: "Erro ao excluir álbum" });
  }
};


export const addPhoto = async (req, res) => {
  try {
    const { id } = req.params; 
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Nenhuma foto enviada" });

    const photo = {
      title: file.originalname,
      imageUrl: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      description: req.body.description || "",
    };

    const album = await Album.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $push: { photos: photo } },
      { new: true }
    );

    if (!album) return res.status(404).json({ message: "Álbum não encontrado" });
    res.status(201).json(album);
  } catch (error) {
    console.error("Erro ao adicionar foto:", error);
    res.status(500).json({ message: "Erro ao adicionar foto" });
  }
};

export const updatePhoto = async (req, res) => {
  try {
    const { albumId, photoId } = req.params;
    const { title, description } = req.body;

    const album = await Album.findOne({ _id: albumId, user: req.user.id });
    if (!album) return res.status(404).json({ message: "Álbum não encontrado" });

    const photo = album.photos.id(photoId);
    if (!photo) return res.status(404).json({ message: "Foto não encontrada" });

    if (title !== undefined) photo.title = title;
    if (description !== undefined) photo.description = description;

    await album.save();
    res.status(200).json(album);
  } catch (error) {
    console.error("Erro ao atualizar foto:", error);
    res.status(500).json({ message: "Erro ao atualizar foto" });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { albumId, photoId } = req.params;

    const album = await Album.findOne({ _id: albumId, user: req.user.id });
    if (!album) return res.status(404).json({ message: "Álbum não encontrado" });

    album.photos.id(photoId).deleteOne();
    await album.save();

    res.status(200).json({ message: "Foto excluída com sucesso", album });
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    res.status(500).json({ message: "Erro ao excluir foto" });
  }
};
