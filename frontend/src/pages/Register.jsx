import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import styles from "./Login.module.css";
import LoadingIndicator from "../components/LoadingIndicator";
import { useLoading } from "../hooks/useLoading";

const API_URL = import.meta.env.VITE_API_URL

export default function Register() {
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);
  const { loading, startLoading, stopLoading } = useLoading();

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    startLoading();
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      login(res.data.user, res.data.token);
      window.location.href = "/portfolio";
    } catch (err) {
      setMessage("Erro ao registrar. Tente novamente.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2>Cadastro</h2>
        {message && <p className={styles.alert}>{message}</p>}
        <form onSubmit={handleRegister}>
          <input name="name" type="text" placeholder="Nome" className={styles.input} required />
          <input name="email" type="email" placeholder="Email" className={styles.input} required />
          <input name="password" type="password" placeholder="Senha" className={styles.input} required />
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? <LoadingIndicator /> : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}