import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import styles from "./Portfolio.module.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Albums() {
  const { token } = useContext(AuthContext);
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [addingPhoto, setAddingPhoto] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const fetch = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/albums`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlbums(res.data);
      } catch (err) {
        setMensagem("Erro ao carregar álbuns.");
      }
    };
    fetch();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return setMensagem("Título obrigatório");
    setLoading(true);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    for (const f of files) fd.append("photos", f);

    try {
      const res = await axios.post(`${API_URL}/api/albums`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setAlbums([res.data, ...albums]);
      setTitle("");
      setDescription("");
      setFiles([]);
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao criar álbum.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoto = async (albumId, file) => {
    if (!file) return;
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const res = await axios.post(`${API_URL}/api/albums/${albumId}/photos`, fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setAlbums(albums.map((a) => (a._id === albumId ? res.data : a)));
      setMensagem("Foto adicionada!");
      setAddingPhoto(null);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao adicionar foto.");
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este álbum?")) return;
    try {
      await axios.delete(`${API_URL}/api/albums/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlbums(albums.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao excluir álbum.");
    }
  };

  const handleDeletePhoto = async (albumId, photoId) => {
    try {
      const res = await axios.delete(`${API_URL}/api/albums/${albumId}/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlbums(albums.map((a) => (a._id === albumId ? res.data.album : a)));
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao excluir foto.");
    }
  };

  const startEdit = (album) => {
    setEditingAlbum(album._id);
    setEditTitle(album.title);
    setEditDescription(album.description || "");
  };

  const handleSaveEdit = async (albumId) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/albums/${albumId}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlbums(albums.map((a) => (a._id === albumId ? res.data : a)));
      setEditingAlbum(null);
      setMensagem("Álbum atualizado!");
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao atualizar álbum.");
    }
  };

  return (
    <div className={styles.portfolioPage}>
      <div className={styles.portfolioContainer}>
        <h2>Álbuns</h2>
        {mensagem && <p className="text-danger">{mensagem}</p>}

        <form onSubmit={handleSubmit} className="mb-4">
          <input
            className="form-control mb-2"
            placeholder="Título do álbum"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          <button className="btn btn-warning mt-2" disabled={loading}>
            {loading ? "Enviando..." : "Criar álbum"}
          </button>
        </form>

        {albums.map((album) => (
          <div key={album._id} className="border p-3 mb-3 rounded bg-light">
            {editingAlbum === album._id ? (
              <div>
                <input
                  className="form-control mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  className="form-control mb-2"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleSaveEdit(album._id)}
                >
                  Salvar
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingAlbum(null)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="m-0">{album.title}</h5>
                  <p className="text-muted">{album.description}</p>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => startEdit(album)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteAlbum(album._id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}

            <div className="d-flex gap-2 flex-wrap mt-2">
              {album.photos?.map((p) => (
                <div key={p._id} style={{ position: "relative" }}>
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{ padding: "0 4px", fontSize: 12 }}
                    onClick={() => handleDeletePhoto(album._id, p._id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {addingPhoto === album._id ? (
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAddPhoto(album._id, e.target.files[0])}
                />
              </div>
            ) : (
              <button
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => setAddingPhoto(album._id)}
              >
                Adicionar foto
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
