import React, { useState } from "react";
import styles from "./Portfolio.module.css";

export default function Portfolio() {
  const [fotos, setFotos] = useState([]);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  const handleAddPhoto = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const novaFoto = {
        id: Date.now(),
        src: reader.result,
        descricao: "Clique para editar descrição",
        editando: false,
      };
      setFotos([...fotos, novaFoto]);
    };
    reader.readAsDataURL(file);
  };

  const handleEditDescricao = (id) => {
    setFotos(
      fotos.map((foto) =>
        foto.id === id ? { ...foto, editando: !foto.editando } : foto
      )
    );
  };

  const handleChangeDescricao = (id, valor) => {
    setFotos(
      fotos.map((foto) =>
        foto.id === id ? { ...foto, descricao: valor } : foto
      )
    );
  };

  return (
    <div className={styles.portfolioPage}>
      <div className={styles.portfolioContainer}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Meu Portfólio</h2>
          <label className="btn btn-warning fw-bold mb-0">
            + Adicionar Foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAddPhoto}
            />
          </label>
        </div>

        <div className="row">
          {fotos.map((foto) => (
            <div key={foto.id} className="col-md-4 col-sm-6 col-12 mb-4">
              <div
                className={`${styles.card} card shadow-sm`}
                onClick={() => setFotoSelecionada(foto)}
              >
                <img
                  src={foto.src}
                  className={`${styles.cardImg} card-img-top`}
                  alt="Foto"
                />
                <div className="card-body text-center">
                  {foto.editando ? (
                    <input
                      type="text"
                      className="form-control"
                      value={foto.descricao}
                      onChange={(e) =>
                        handleChangeDescricao(foto.id, e.target.value)
                      }
                      onBlur={() => handleEditDescricao(foto.id)}
                      autoFocus
                    />
                  ) : (
                    <p
                      className="card-text"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDescricao(foto.id);
                      }}
                    >
                      {foto.descricao}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualização */}
      {fotoSelecionada && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setFotoSelecionada(null)}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <img
                src={fotoSelecionada.src}
                alt="Foto selecionada"
                className="w-100 rounded"
              />
              <div className="p-3 text-center">
                <p>{fotoSelecionada.descricao}</p>
                <button
                  className="btn btn-dark"
                  onClick={() => setFotoSelecionada(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
