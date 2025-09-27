import React, { useState } from "react";
import styles from "./Schedule.module.css";

export default function Schedule() {
  const [agendamentos, setAgendamentos] = useState([
    { id: 1, data: "25/09/2025", titulo: "Ensaio Fotográfico" },
    { id: 2, data: "28/09/2025", titulo: "Casamento" },
  ]);

  const [novoAgendamento, setNovoAgendamento] = useState({
    data: "",
    titulo: "",
  });

  const handleDelete = (id) => {
    setAgendamentos(agendamentos.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    if (!novoAgendamento.data || !novoAgendamento.titulo) return;

    const novo = {
      id: Date.now(),
      data: novoAgendamento.data,
      titulo: novoAgendamento.titulo,
    };

    setAgendamentos([...agendamentos, novo]);
    setNovoAgendamento({ data: "", titulo: "" });
    window.bootstrap.Modal.getInstance(
      document.getElementById("addModal")
    ).hide();
  };

  return (
    <div className={styles.schedulePage}>
      <div className={styles.scheduleContainer}>
        {/* Header */}
        <div className={styles.scheduleHeader}>
          <h2>Agenda</h2>
          <button
            className={styles.addButton}
            data-bs-toggle="modal"
            data-bs-target="#addModal"
          >
            + Novo Agendamento
          </button>
        </div>

        {/* Lista de Agendamentos */}
        <div className={styles.scheduleList}>
          {agendamentos.map((item) => (
            <div key={item.id} className={styles.scheduleItem}>
              <div className={styles.eventInfo}>
                <span className={styles.scheduleDate}>📅 {item.data} </span>
                <span>{item.titulo}</span>
              </div>
              <div className={styles.scheduleActions}>
                <button className={`${styles.editButton}`}>Editar</button>
                <button
                  className={`${styles.deleteButton}`}
                  onClick={() => handleDelete(item.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Novo Agendamento */}
      <div
        className="modal fade"
        id="addModal"
        tabIndex="-1"
        aria-labelledby="addModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="addModalLabel">
                Novo Agendamento
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Fechar"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={novoAgendamento.data}
                  onChange={(e) =>
                    setNovoAgendamento({
                      ...novoAgendamento,
                      data: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Ensaio Fotográfico"
                  value={novoAgendamento.titulo}
                  onChange={(e) =>
                    setNovoAgendamento({
                      ...novoAgendamento,
                      titulo: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-warning fw-bold"
                onClick={handleAdd}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
