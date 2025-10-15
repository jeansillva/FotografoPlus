import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import styles from "./Login.module.css";
import LoadingIndicator from "../components/LoadingIndicator";
import { useLoading } from "../hooks/useLoading";

const API_URL = import.meta.env.VITE_API_URL

export default function Login() {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);
  const { loading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (location.state?.from === "private") {
      setMessage("É necessário fazer login para acessar essa página.");
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    startLoading();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      window.location.href = "/portfolio";
    } catch (err) {
      setMessage("Email ou senha incorretos.");
    } finally {
      stopLoading();
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        {message && <p className={styles.alert}>{message}</p>}
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" className={styles.input} required />
          <input name="password" type="password" placeholder="Senha" className={styles.input} required />
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? <LoadingIndicator /> : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}