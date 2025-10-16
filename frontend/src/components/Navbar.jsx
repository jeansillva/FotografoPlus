import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Collapse } from "bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const handleLinkClick = () => {
    if (navbarRef.current && window.innerWidth < 992) {
      const bsCollapse = Collapse.getOrCreateInstance(navbarRef.current, { toggle: false });
      bsCollapse.hide();
      setMenuOpen(false);
    }
  };

  const handleTogglerClick = () => {
    if (navbarRef.current && window.innerWidth < 992) {
      const bsCollapse = Collapse.getOrCreateInstance(navbarRef.current, { toggle: false });
      if (menuOpen) {
        bsCollapse.hide();
        setMenuOpen(false);
      } else {
        bsCollapse.show();
        setMenuOpen(true);
      }
    }
  };

  const handleLogout = () => {
    logout();
    handleLinkClick();
    navigate("/login");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbarCustom} px-3`}>
      <div className="container-fluid">
        <Link className={`navbar-brand fw-bold ${styles.brand}`} to="/">
          Fotógrafo+
        </Link>

        <button
          className="navbar-toggler bg-light"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={handleTogglerClick}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
          ref={navbarRef}
        >
          <ul className={`navbar-nav ${styles.navList}`}>
            <li className="nav-item">
              <Link
                className={`nav-link ${styles.navLink}`}
                to="/portfolio"
                onClick={handleLinkClick}
              >
                Portfólio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${styles.navLink}`}
                to="/schedule"
                onClick={handleLinkClick}
              >
                Agenda
              </Link>
            </li>
            {!token ? (
              <li className="nav-item">
                <Link
                  className={`nav-link ${styles.navLink}`}
                  to="/login"
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${styles.navLink}`}
                    to="/update-credentials"
                    onClick={handleLinkClick}
                  >
                    Alterar Dados
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${styles.logoutLink}`}
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}