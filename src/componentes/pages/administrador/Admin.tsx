import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaChartBar,
  FaTags,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Admin.css";

export default function Admin() {
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // elimina token y datos de sesión
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-title">Panel Admin</h2>
          <FaTimes className="admin-close" onClick={() => setMenuOpen(false)} />
        </div>

        <nav className="admin-menu">
          <NavLink
            to="/admin/bandeja-usuarios"
            className={({ isActive }) => `admin-link ${isActive ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <FaUsers className="admin-icon" /> Usuarios
          </NavLink>

          <NavLink
            to="/admin/bandeja-productos"
            className={({ isActive }) => `admin-link ${isActive ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <FaBoxOpen className="admin-icon" /> Productos
          </NavLink>

          <NavLink
            to="/admin/bandeja-pedidos"
            className={({ isActive }) => `admin-link ${isActive ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <FaShoppingCart className="admin-icon" /> Pedidos
          </NavLink>

          <NavLink
            to="/admin/estadisticas"
            className={({ isActive }) => `admin-link ${isActive ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <FaChartBar className="admin-icon" /> Estadísticas
          </NavLink>

          <NavLink
            to="/admin/bandeja-categorias"
            className={({ isActive }) => `admin-link ${isActive ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <FaTags className="admin-icon" /> Categorías
          </NavLink>

        </nav>

        {/* ==== BOTÓN CERRAR SESIÓN ABAJO ==== */}
        <div className="admin-logout">
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ===== CONTENIDO ===== */}
      <main className={`admin-main ${menuOpen ? "shifted" : ""}`}>
        <header className="admin-header">
          <FaBars className="admin-bars" onClick={() => setMenuOpen(true)} />
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>

      {menuOpen && <div className="admin-overlay" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}


