import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import styles from "./Schedule.module.css";

const API_URL = import.meta.env.VITE_API_URL

export default function Schedule() {
  const { token } = useContext(AuthContext);
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({ date: "", title: "", description: "" });
  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/schedules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgendamentos(res.data);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        setMensagem("Erro ao carregar agendamentos.");
      }
    };
    fetchSchedules();
  }, [token]);

  const handleSave = async () => {
    if (!novoAgendamento.date || !novoAgendamento.title) return;

    try {
      if (editando) {
        const res = await axios.put(
          `${API_URL}/api/schedules/${editando._id}`,
          novoAgendamento,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAgendamentos((prev) =>
          prev.map((item) => (item._id === editando._id ? res.data.updated : item))
        );
      } else {
        const res = await axios.post(`${API_URL}/api/schedules`, novoAgendamento, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgendamentos([...agendamentos, res.data.newSchedule]);
      }

      setNovoAgendamento({ date: "", title: "", description: "" });
      setEditando(null);
      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      setMensagem("Erro ao salvar agendamento.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este agendamento?")) return;
    try {
      await axios.delete(`${API_URL}/api/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendamentos((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      setMensagem("Erro ao excluir agendamento.");
    }
  };

  return (
    <div className={styles.schedulePage}>
      <div className={styles.scheduleContainer}>
        <div className={styles.scheduleHeader}>
          <h2>Agenda</h2>
          <button
            className={styles.addButton}
            onClick={() => {
              setEditando(null);
              setNovoAgendamento({ date: "", title: "", description: "" });
              setModalAberto(true);
            }}
          >
            + Novo Agendamento
          </button>
        </div>

        {mensagem && <p className="text-danger">{mensagem}</p>}

        <div className={styles.scheduleList}>
          {agendamentos.map((item) => (
            <div key={item._id} className={styles.scheduleItem}>
              <div className={styles.eventInfo}>
                <span className={styles.scheduleDate}>
                  📅 {new Date(item.date).toLocaleDateString("pt-BR")}
                </span>
                <span className="fw-bold"> {item.title}</span>
                {item.description && <p>{item.description}</p>}
              </div>
              <div className={styles.scheduleActions}>
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setEditando(item);
                    setNovoAgendamento({
                      date: item.date.split("T")[0],
                      title: item.title,
                      description: item.description || "",
                    });
                    setModalAberto(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(item._id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalAberto && (
        <div className={styles.modalOverlay} onClick={() => setModalAberto(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {editando ? "Editar Agendamento" : "Novo Agendamento"}
            </h3>

            <label>Data</label>
            <input
              type="date"
              value={novoAgendamento.date}
              onChange={(e) => setNovoAgendamento({ ...novoAgendamento, date: e.target.value })}
            />

            <label>Título</label>
            <input
              type="text"
              value={novoAgendamento.title}
              onChange={(e) => setNovoAgendamento({ ...novoAgendamento, title: e.target.value })}
            />

            <label>Descrição</label>
            <textarea
              rows="3"
              value={novoAgendamento.description}
              onChange={(e) =>
                setNovoAgendamento({ ...novoAgendamento, description: e.target.value })
              }
            ></textarea>

            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setModalAberto(false)}>
                Cancelar
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                {editando ? "Salvar Alterações" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
