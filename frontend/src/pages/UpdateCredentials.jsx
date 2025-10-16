import { useState, useContext } from "react";
import axios from "axios";
import styles from "./Login.module.css";
import LoadingIndicator from "../components/LoadingIndicator";
import { useLoading } from "../hooks/useLoading";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function UpdateCredentials() {
  const { token, user, login } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [message, setMessage] = useState("");
  const { loading, startLoading, stopLoading } = useLoading();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.newPassword || form.repeatPassword || form.currentPassword) {
      if (!form.currentPassword) {
        setMessage("Informe a senha atual para alterar a senha.");
        return;
      }
      if (form.newPassword.length < 6) {
        setMessage("A nova senha deve ter pelo menos 6 caracteres.");
        return;
      }
      if (form.newPassword !== form.repeatPassword) {
        setMessage("As novas senhas não conferem.");
        return;
      }
    }

    startLoading();
    try {
      const payload = {
        name: form.name,
      };
      if (form.currentPassword && form.newPassword && form.repeatPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      const res = await axios.patch(
        `${API_URL}/api/auth/update-password`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Dados atualizados com sucesso!");
      if (res.data.user) {
        login(res.data.user, token);
      }
      setForm({
        name: res.data.user?.name || "",
        currentPassword: "",
        newPassword: "",
        repeatPassword: "",
      });
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Erro ao atualizar credenciais."
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2>
          Alterar Credenciais
          <br />
          <span style={{ fontSize: "1rem", color: "#f39c12", fontWeight: "normal" }}>
            Alterando credenciais de: {user?.name}
          </span>
        </h2>
        {message && <p className={styles.alert}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Novo nome (opcional)"
            className={styles.input}
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="currentPassword"
            type="password"
            placeholder="Senha atual"
            className={styles.input}
            value={form.currentPassword}
            onChange={handleChange}
          />
          <input
            name="newPassword"
            type="password"
            placeholder="Nova senha"
            className={styles.input}
            value={form.newPassword}
            onChange={handleChange}
            minLength={6}
          />
          <input
            name="repeatPassword"
            type="password"
            placeholder="Repetir nova senha"
            className={styles.input}
            value={form.repeatPassword}
            onChange={handleChange}
            minLength={6}
          />
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? <LoadingIndicator /> : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}