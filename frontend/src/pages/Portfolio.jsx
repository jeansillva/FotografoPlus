import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import styles from "./Portfolio.module.css";
import LoadingIndicator from "../components/LoadingIndicator";
import TFImageCaption from "../components/TFImageCaption";

const API_URL = import.meta.env.VITE_API_URL;

export default function Portfolio() {
  const { token, login, user } = useContext(AuthContext);
  const [fotos, setFotos] = useState([]);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");

    if (googleToken) {
      localStorage.setItem("token", googleToken);
      login(null, googleToken);
      window.history.replaceState({}, document.title, "/portfolio");
    }
  }, [login]);

  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  useEffect(() => {
    const fetchFotos = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFotos(res.data);
      } catch (error) {
        console.error("Erro ao buscar portfólio:", error);
        setMensagem("Erro ao carregar fotos.");
      } finally {
        setLoading(false);
      }
    };
    fetchFotos();
  }, [token]);

  const handleAddPhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", file.name);
    formData.append("description", "Sem descrição inicial");

    try {
      const res = await axios.post(`${API_URL}/api/portfolio`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFotos([...fotos, res.data]);
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      setMensagem("Erro ao enviar a foto.");
    }
  };

  const handleUpdateField = async (id, dataAtualizada) => {
    try {
      await axios.put(`${API_URL}/api/portfolio/${id}`, dataAtualizada, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFotos((prev) =>
        prev.map((foto) => (foto._id === id ? { ...foto, ...dataAtualizada } : foto))
      );
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setMensagem("Erro ao atualizar a foto.");
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta foto?")) return;
    try {
      await axios.delete(`${API_URL}/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFotos((prevFotos) => prevFotos.filter((foto) => foto._id !== id));
      setFotoSelecionada(null);
    } catch (error) {
      console.error("Erro ao excluir foto:", error);
      setMensagem("Erro ao excluir a foto.");
    }
  };

  if (loading)
    return (
      <div className={styles.portfolioPage}>
        <LoadingIndicator size="large" />
      </div>
    );

  return (
    <div className={styles.portfolioPage}>
      <div className={styles.portfolioContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">
            {user?.name ? `Portfólio de ${user.name}` : "Meu Portfólio"}
          </h2>
          <label className="btn btn-warning fw-bold mb-0">
            + Adicionar Foto
            <input type="file" accept="image/*" hidden onChange={handleAddPhoto} />
          </label>
        </div>

        {mensagem && <p className="text-danger">{mensagem}</p>}

        <div className="row">
          {fotos.map((foto) => (
            <div key={foto._id} className="col-md-4 col-sm-6 col-12 mb-4">
              <div
                className={`${styles.card} card shadow-sm`}
                onClick={() => setFotoSelecionada(foto)}
              >
                <img
                  src={foto.imageUrl}
                  className={`${styles.cardImg} card-img-top`}
                  alt="Foto"
                />
                <div className="card-body text-center">
                  <p className="fw-bold mb-0">{foto.title}</p>
                  <p className="card-text text-muted">{foto.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {fotoSelecionada && (
        <div className={styles.modalFixed} onClick={() => setFotoSelecionada(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h5 className={`${styles.modalTitle} text-warning`}>Editar Foto</h5>

            <img
              src={fotoSelecionada.imageUrl}
              alt="Foto selecionada"
              className={styles.modalImage}
            />

            <div className="w-100">
              <label className="form-label text-warning">Título</label>
              <input
                type="text"
                className="form-control text-center"
                value={fotoSelecionada.title || ""}
                onChange={(e) =>
                  setFotoSelecionada({ ...fotoSelecionada, title: e.target.value })
                }
                onBlur={(e) =>
                  handleUpdateField(fotoSelecionada._id, {
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="w-100 mt-3">
              <label className="form-label text-warning">Descrição</label>
              <textarea
                className="form-control"
                rows="3"
                value={fotoSelecionada.description || ""}
                onChange={(e) =>
                  setFotoSelecionada({
                    ...fotoSelecionada,
                    description: e.target.value,
                  })
                }
                onBlur={(e) =>
                  handleUpdateField(fotoSelecionada._id, {
                    description: e.target.value,
                  })
                }
              ></textarea>

              <div className="mt-2">
                <TFImageCaption
                  imageUrl={fotoSelecionada.imageUrl}
                  onGenerated={(out) =>
                    setFotoSelecionada((prev) => ({
                      ...prev,
                      title: out.title,
                      description: out.description,
                    }))
                  }
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className="btn btn-outline-danger fw-bold"
                onClick={() => handleDeletePhoto(fotoSelecionada._id)}
              >
                🗑️ Excluir
              </button>
              <button
                className="btn btn-warning fw-bold text-dark"
                onClick={async () => {
                  
                  await handleUpdateField(fotoSelecionada._id, {
                    title: fotoSelecionada.title,
                    description: fotoSelecionada.description,
                  });
                  setFotoSelecionada(null);
                }}
              >
                Fechar e Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}