import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaShoppingCart, FaFish } from "react-icons/fa"; 
import "./Home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false); 

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
              <i className="fa-solid fa-mug-hot"><FaFish/></i>
              <h1 className="logo">
                <a href="/">ACUARIOFILIA</a>
              </h1>
            </div>

            <div className="container-user">
              <Link to="/login">
                <FaUser className="fa-user" />
              </Link>
		
            
              <div className="content-shopping-cart">
				<Link to="#">
                  <FaShoppingCart className="fa-user" />
                </Link>
                <span className="text">Carrito</span>
                <span className="number">(0)</span>
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
              <Link to="/usuarios" className="btn-admin">Ver usuarios</Link>
              <li><a href="#">Blog</a></li>
            </ul>

            <form className="search-form">
              <input type="search" placeholder="Buscar..." />
              <button className="btn-search">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </nav>
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