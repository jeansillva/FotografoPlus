import styles from "./LoadingIndicator.module.css";

const LoadingIndicator = () => {
  return (
    <div className={styles.loadingIndicator}>
      <div className={styles.spinner}></div>
      <span className={styles.loadingText}>Carregando...</span>
    </div>
  );
};

export default LoadingIndicator;