import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Collapse } from "bootstrap";

export default function Navbar() {
  const handleLinkClick = () => {
    const navbar = document.getElementById("navbarNav");
    const bsCollapse = new Collapse(navbar, { toggle: false });
    bsCollapse.hide();
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
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className={`navbar-nav ${styles.navList}`}>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/portfolio" onClick={handleLinkClick}>
                Portfólio
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/schedule" onClick={handleLinkClick}>
                Agenda
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/login" onClick={handleLinkClick}>
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
