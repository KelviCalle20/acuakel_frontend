import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUsers, FaBoxOpen, FaBars, FaTimes } from "react-icons/fa";
import "./Admin.css";

export default function Admin() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <div className="admin-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-title">Panel Admin</h2>
          <FaTimes
            className="admin-close"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        <nav className="admin-menu">
          <Link
            to="/admin/bandeja-usuarios"
            className="admin-link"
            onClick={() => setMenuOpen(false)}
          >
            <FaUsers className="admin-icon" /> Usuarios
          </Link>

          <Link
            to="/admin/bandeja-productos"
            className="admin-link"
            onClick={() => setMenuOpen(false)}
          >
            <FaBoxOpen className="admin-icon" /> Productos
          </Link>
        </nav>
      </aside>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main className={`admin-main ${menuOpen ? "shifted" : ""}`}>
        <header className="admin-header">
          <FaBars
            className="admin-bars"
            onClick={() => setMenuOpen(true)}
          />
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>

      {/* ===== OVERLAY ===== */}
      {menuOpen && (
        <div
          className="admin-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

