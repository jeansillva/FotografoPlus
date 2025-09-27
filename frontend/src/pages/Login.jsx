import styles from "./Login.module.css";

export default function Login() {
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h2 className="mb-4">Login</h2>
        <form>
          <div className="mb-3">
            <input
              type="email"
              className={`form-control ${styles.input}`}
              placeholder="Digite seu email"
              defaultValue="professor@fotografo.com" 
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${styles.input}`}
              placeholder="Digite sua senha"
              defaultValue="123456"
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>

        <div className={styles.registerArea}>
          <p className="mt-3">
            Não tem login? <a href="#" className={styles.registerLink}>Cadastre-se</a>
          </p>
        </div>
      </div>
    </div>
  );
}
