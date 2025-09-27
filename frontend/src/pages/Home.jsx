import styles from "./Home.module.css";
import ft1 from "../assets/images/ft1.jpg";
import ft2 from "../assets/images/ft2.jpg";
import ft3 from "../assets/images/ft3.jpg";

export default function Home() {
  return (
    <div className={styles.home}>
      <h1>Fotógrafo+</h1>
      <p>Gerencie seu portfólio, organize sua agenda e simplifique sua rotina.</p>

      {/* Carrossel */}
      <div
        id="homeCarousel"
        className="carousel slide mt-5 w-75 mx-auto"
        data-bs-ride="carousel"
        data-bs-interval="2000" 
      >
        <div className="carousel-inner rounded shadow">
          <div className="carousel-item active">
            <img src={ft1} className="d-block w-100" alt="Portfólio" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Portfólio Online</h5>
              <p>Mostre seus melhores trabalhos em uma vitrine digital.</p>
            </div>
          </div>

          <div className="carousel-item">
            <img src={ft3} className="d-block w-100" alt="Agendamento" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Agenda Simples</h5>
              <p>Organize sessões fotográficas de forma prática e rápida.</p>
            </div>
          </div>

          <div className="carousel-item">
            <img src={ft2} className="d-block w-100" alt="Clientes" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Gerencie Clientes</h5>
              <p>Tenha tudo em um só lugar: contatos, pacotes e histórico.</p>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Próximo</span>
        </button>
      </div>


      {/* Cards */}
      {/* <div className={`${styles.features} container`}>
        <div className={`${styles.card} card shadow-sm`}>
          <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title">📷 Portfólio</h5>
            <p className="card-text">Crie e compartilhe suas fotos com estilo.</p>
            <Link to="/portfolio" className="btn btn-dark mt-3">Explorar</Link>
          </div>
        </div>

        <div className={`${styles.card} card shadow-sm`}>
          <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title">📅 Agenda</h5>
            <p className="card-text">Organize suas sessões fotográficas facilmente.</p>
            <Link to="/schedule" className="btn btn-dark mt-3">Agendar</Link>
          </div>
        </div>

        { <div className={`${styles.card} card shadow-sm`}>
          <div className="card-body d-flex flex-column justify-content-between">
            <h5 className="card-title">👤 Login</h5>
            <p className="card-text">Gerencie seus pacotes e clientes cadastrados.</p>
            <Link to="/login" className="btn btn-dark mt-3">Entrar</Link>
          </div>
        </div>}
      </div> */}
    </div>
  );
}
