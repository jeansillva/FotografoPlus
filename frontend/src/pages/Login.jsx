import { useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import styles from "./Login.module.css";

export default function Login() {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.from === "private") {
      setMessage("É necessário fazer login para acessar essa página.");
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      window.location.href = "/portfolio";
    } catch (err) {
      setMessage("Email ou senha incorretos.");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        {message && <p className={styles.alert}>{message}</p>}
        <form onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className={styles.input}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
