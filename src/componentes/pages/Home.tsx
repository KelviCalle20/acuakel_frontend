import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaShoppingCart, FaFish, FaSearch } from "react-icons/fa";
import "./Home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }

    // Cerrar menú al hacer click fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("userName");
    setUserName(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="menu-toggle">
        <FaBars onClick={() => setMenuOpen(true)} />
      </div>
      <header>
        <div className="container-hero">
          <div className="container hero">
            <div className="customer-support">
              <i className="fa-solid fa-headset"></i>
              <div className="content-customer-support">
                <span className="text"></span>
                <span className="number"></span>
              </div>
            </div>

            <div className="container-logo">
              <i className="fa-solid fa-mug-hot"><FaFish /></i>
              <h1 className="logo">
                <a href="/">ACUARIOFILIA</a>
              </h1>
            </div>

            <div className="container-user">
              {!userName ? (
                <Link to="/login" className="login-section">
                  <FaUser className="fa-user" />
                  <span className="login-text">Iniciar sesión</span>
                </Link>
              ) : (
                <div className="user-section" ref={userMenuRef}>
                  <div className="user-top" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    <FaUser className="fa-user" />
                    <span className="user-name">{userName}</span>
                  </div>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <button onClick={handleLogout} className="logout-btn-dropdown">
                        <FaUser /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="content-shopping-cart">
                <Link to="#">
                  <FaShoppingCart className="fa-user" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        <div className="container-navbar">
          <nav className="navbar container">
            <i className="fa-solid fa-bars"></i>
            <ul className="menu">
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Tienda</a></li>
              <li><a href="#">Aprender sobre acuarismo</a></li>
              <li><a href="#">productos</a></li>
              <li><a href="#">Galeria Multimedia</a></li>
            </ul>

            <form className="search-form">
              <input type="search" placeholder="Buscar..." />
              <button className="btn-search">
                <FaSearch className="fa-solid fa-magnifying-glass" />
              </button>
            </form>
          </nav>
        </div>
        <div className="admin-button-container">
          <Link to="/usuarios" className="banner-btn">administrador</Link>
        </div>
      </header>

      <div className={`sidebar-menu ${menuOpen ? "active" : ""}`}>
        <div className="close-area">
          <FaTimes className="close-icon" onClick={() => setMenuOpen(false)} />
        </div>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Tienda</a></li>
          <li><a href="#">Aprender sobre acuarismo</a></li>
          <li><a href="#">Testimonios</a></li>
          <li><a href="#">Más</a></li>
          <li><a href="#">Blog</a></li>
          <li className="mobile-cart">
            <Link to="#">
              <FaShoppingCart className="fa-shopping-cart" /> Carrito (0)
            </Link>
          </li>
        </ul>
      </div>
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      <section className="banner">
        <div className="content-banner">
          <p>Acuariofilia</p>
          <h2>ACUARIOS <br />DE TODO</h2>
          <a href="#">Comprar ahora</a>
        </div>
      </section>
    </>
  );
}

export default Home;
