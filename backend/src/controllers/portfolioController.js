let photos = [
  { id: 1, url: "https://via.placeholder.com/300", description: "Foto exemplo" },
];

export const getPhotos = (req, res) => {
  res.json(photos);
};

export const addPhoto = (req, res) => {
  const { url, description } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL da foto é obrigatória" });
  }
  const newPhoto = {
    id: Date.now(),
    url,
    description: description || "Sem descrição",
  };
  photos.push(newPhoto);
  res.status(201).json(newPhoto);
};

export const updatePhoto = (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  const photo = photos.find((p) => p.id == id);
  if (!photo) return res.status(404).json({ message: "Foto não encontrada" });

  photo.description = description || photo.description;
  res.json(photo);
};

export const deletePhoto = (req, res) => {
  const { id } = req.params;
  photos = photos.filter((p) => p.id != id);
  res.json({ message: "Foto removida com sucesso" });
};
