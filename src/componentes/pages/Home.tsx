import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
//Etiqueta header(icon)
import { FaUser, FaBars, FaTimes, FaShoppingCart, FaFish } from "react-icons/fa";
//Etiqueta main(icon)
import { FaPlane, FaWallet, FaGift, FaHeadset, FaEye, FaHeart, FaExchangeAlt, FaStar, FaShoppingBasket, FaSearch, FaLink } from "react-icons/fa";
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
                <Link to="/cart">
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
            <Link to="/cart">
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

      <main className="main-content">
        {/* SECCIÓN DE FEATURES */}
        <section className="container container-features">
          <div className="card-feature">
            <FaPlane />
            <div className="feature-content">
              <span>Envío gratuito a nivel mundial</span>
              <p>En pedido superior a $150</p>
            </div>
          </div>

          <div className="card-feature">
            <FaWallet />
            <div className="feature-content">
              <span>Contrareembolso</span>
              <p>100% garantía de devolución de dinero</p>
            </div>
          </div>

          <div className="card-feature">
            <FaGift />
            <div className="feature-content">
              <span>Tarjeta regalo especial</span>
              <p>Ofrece bonos especiales con regalo</p>
            </div>
          </div>

          <div className="card-feature">
            <FaHeadset />
            <div className="feature-content">
              <span>Servicio al cliente 24/7</span>
              <p>LLámenos 24/7 al 123-456-7890</p>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE CATEGORÍAS */}
        <section className="container top-categories">
          <h1 className="heading-1">Mejores Categorías</h1>
          <div className="container-categories">
            <div className="card-category category-moca">
              <p>Filtros de Mochila</p>
              <span>Ver más</span>
            </div>
            <div className="card-category category-expreso">
              <p>Filtros Internos</p>
              <span>Ver más</span>
            </div>
            <div className="card-category category-capuchino">
              <p>Bombas de Aire</p>
              <span>Ver más</span>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE PRODUCTOS */}
        <section className="container top-products">
          <h1 className="heading-1">Mejores Productos</h1>

          <div className="container-options">
            <span className="active">Destacados</span>
            <span>Más recientes</span>
            <span>Mejores Vendidos</span>
          </div>

          <div className="container-products">
            {/* PRODUCTO 1 */}
            <div className="card-product">
              <div className="container-img">
                <img src="src/componentes/assets/productos/FiltroXBA5.jpg" alt="Filtro XBA-500" />
                <span className="discount">-13%</span>
                <div className="button-group">
                  <span><FaEye /></span>
                  <span><FaHeart /></span>
                  <span><FaExchangeAlt /></span>
                </div>
              </div>
              <div className="content-card-product">
                <div className="stars">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar style={{ opacity: 0.3 }} />
                </div>
                <h3>Filtro XBA-500</h3>
                <span className="add-cart"><FaShoppingBasket /></span>
                <p className="price">250bs <span>300bs</span></p>
              </div>
            </div>

            {/* PRODUCTO 2 */}
            <div className="card-product">
              <div className="container-img">
                <img src="src/componentes/assets/productos/SOBO-termostato200watts.jpg" alt="Termostato 200W" />
                <span className="discount">-22%</span>
                <div className="button-group">
                  <span><FaEye /></span>
                  <span><FaHeart /></span>
                  <span><FaExchangeAlt /></span>
                </div>
              </div>
              <div className="content-card-product">
                <div className="stars">
                  <FaStar /><FaStar /><FaStar /><FaStar style={{ opacity: 0.3 }} /><FaStar style={{ opacity: 0.3 }} />
                </div>
                <h3>Cafe Inglés</h3>
                <span className="add-cart"><FaShoppingBasket /></span>
                <p className="price">150bs <span>200bs</span></p>
              </div>
            </div>

            {/* PRODUCTO 3 */}
            <div className="card-product">
              <div className="container-img">
                <img src="src/componentes/assets/productos/AzulDeMetileno.jpg" alt="Azul de metileno" />
                <div className="button-group">
                  <span><FaEye /></span>
                  <span><FaHeart /></span>
                  <span><FaExchangeAlt /></span>
                </div>
              </div>
              <div className="content-card-product">
                <div className="stars"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                <h3>Azul de metileno</h3>
                <span className="add-cart"><FaShoppingBasket /></span>
                <p className="price">15bs</p>
              </div>
            </div>

            {/* PRODUCTO 4 */}
            <div className="card-product">
              <div className="container-img">
                <img src="src/componentes/assets/productos/Tubifex.jpg" alt="tubifex" />
                <div className="button-group">
                  <span><FaEye /></span>
                  <span><FaHeart /></span>
                  <span><FaExchangeAlt /></span>
                </div>
              </div>
              <div className="content-card-product">
                <div className="stars"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar style={{ opacity: 0.3 }} /></div>
                <h3>tubifex</h3>
                <span className="add-cart"><FaShoppingBasket /></span>
                <p className="price">10bs</p>
              </div>
            </div>
          </div>
        </section>

        {/* GALERÍA */}
        <section className="gallery">
          <img src="src/componentes/assets/productos/Galeria1.jpg" alt="Gallery Img1" className="gallery-img-1" />
          <img src="src/componentes/assets/productos/Galeria2.jpg" alt="Gallery Img2" className="gallery-img-2" />
          <img src="src/componentes/assets/productos/Galeria3.jpg" alt="Gallery Img3" className="gallery-img-3" />
          <img src="src/componentes/assets/productos/Galeria4.jpg" alt="Gallery Img4" className="gallery-img-4" />
          <img src="src/componentes/assets/productos/Galeria5.jpg" alt="Gallery Img5" className="gallery-img-5" />
        </section>

        {/* ESPECIALES */}
        <section className="container specials">
          <h1 className="heading-1">Especiales</h1>
          <div className="container-products">
            <div className="card-product">
              <div className="container-img">
                <img src="src/componentes/assets/productos/PezBettas.jpg" alt="Pez betta" />
                <span className="discount">-13%</span>
                <div className="button-group">
                  <span><FaEye /></span>
                  <span><FaHeart /></span>
                  <span><FaExchangeAlt /></span>
                </div>
              </div>
              <div className="content-card-product">
                <div className="stars">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar style={{ opacity: 0.3 }} />
                </div>
                <h3>Bettas</h3>
                <span className="add-cart"><FaShoppingBasket /></span>
                <p className="price">96bs <span>100bs</span></p>
              </div>
            </div>

            <div className="card-product">
              <div className="container-img">
                <img src="src/componentes/assets/productos/PezDisco.jpg" alt="Discos" />
                <span className="discount">-22%</span>
                <div className="button-group">
                  <span><FaEye /></span>
                  <span><FaHeart /></span>
                  <span><FaExchangeAlt /></span>
                </div>
              </div>
              <div className="content-card-product">
                <div className="stars">
                  <FaStar /><FaStar /><FaStar /><FaStar style={{ opacity: 0.3 }} /><FaStar style={{ opacity: 0.3 }} />
                </div>
                <h3>Pez Disco</h3>
                <span className="add-cart"><FaShoppingBasket /></span>
                <p className="price">550bs <span>700bs</span></p>
              </div>
            </div>

            <div className="card-product">
              <div className="container-img">
                <img src="src/componentes/assets/productos/LangostaAzul.jpg" alt="Langosta azul" />
                <span className="discount">-30%</span>
                <div className="button-group">
                  <span><FaEye /></span>
                  <span><FaHeart /></span>
                  <span><FaExchangeAlt /></span>
                </div>
              </div>
              <div className="content-card-product">
                <div className="stars"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                <h3>Langosta Azul</h3>
                <span className="add-cart"><FaShoppingBasket /></span>
                <p className="price">58bs <span>75bs</span></p>
              </div>
            </div>

            <div className="card-product">
              <div className="container-img">
                <img src="src/componentes/assets/productos/PezOscar.jpg" alt="Pez OSCAR" />
                <div className="button-group">
                  <span><FaEye /></span>
                  <span><FaHeart /></span>
                  <span><FaExchangeAlt /></span>
                </div>
              </div>
              <div className="content-card-product">
                <div className="stars">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar style={{ opacity: 0.3 }} />
                </div>
                <h3>Oscar</h3>
                <span className="add-cart"><FaShoppingBasket /></span>
                <p className="price">900bs</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOGS */}
        <section className="container blogs">
          <h1 className="heading-1">Últimos Blogs</h1>
          <div className="container-blogs">
            <div className="card-blog">
              <div className="container-img">
                <img src="src/componentes/assets/productos/Blog1.jpg" alt="Imagen Blog 1" />
                <div className="button-group-blog">
                  <span><FaSearch /></span>
                  <span><FaLink /></span>
                </div>
              </div>
              <div className="content-blog">
                <h3>Lorem, ipsum dolor sit</h3>
                <span>29 Noviembre 2022</span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                <div className="btn-read-more">Leer más</div>
              </div>
            </div>

            <div className="card-blog">
              <div className="container-img">
                <img src="src/componentes/assets/productos/Blog2.jpg" alt="Imagen Blog 2" />
                <div className="button-group-blog">
                  <span><FaSearch /></span>
                  <span><FaLink /></span>
                </div>
              </div>
              <div className="content-blog">
                <h3>Lorem, ipsum dolor sit</h3>
                <span>29 Noviembre 2022</span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                <div className="btn-read-more">Leer más</div>
              </div>
            </div>

            <div className="card-blog">
              <div className="container-img">
                <img src="src/componentes/assets/productos/Blog3.jpg" alt="Imagen Blog 3" />
                <div className="button-group-blog">
                  <span><FaSearch /></span>
                  <span><FaLink /></span>
                </div>
              </div>
              <div className="content-blog">
                <h3>Lorem, ipsum dolor sit</h3>
                <span>29 Noviembre 2022</span>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
                <div className="btn-read-more">Leer más</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container container-footer">
          <div className="menu-footer">
            <div className="contact-info">
              <p className="title-footer">Información de Contacto</p>
              <ul>
                <li>
                  Dirección: 71 Pennington Lane Vernon Rockville, CT
                  06066
                </li>
                <li>Teléfono: 123-456-7890</li>
                <li>Fax: 55555300</li>
                <li>EmaiL: baristas@support.com</li>
              </ul>
              <div className="social-icons">
                <span className="facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </span>
                <span className="twitter">
                  <i className="fa-brands fa-twitter"></i>
                </span>
                <span className="youtube">
                  <i className="fa-brands fa-youtube"></i>
                </span>
                <span className="pinterest">
                  <i className="fa-brands fa-pinterest-p"></i>
                </span>
                <span className="instagram">
                  <i className="fa-brands fa-instagram"></i>
                </span>
              </div>
            </div>

            <div className="information">
              <p className="title-footer">Información</p>
              <ul>
                <li><a href="#">Acerca de Nosotros</a></li>
                <li><a href="#">Información Delivery</a></li>
                <li><a href="#">Politicas de Privacidad</a></li>
                <li><a href="#">Términos y condiciones</a></li>
                <li><a href="#">Contactános</a></li>
              </ul>
            </div>

            <div className="my-account">
              <p className="title-footer">Mi cuenta</p>

              <ul>
                <li><a href="#">Mi cuenta</a></li>
                <li><a href="#">Historial de ordenes</a></li>
                <li><a href="#">Lista de deseos</a></li>
                <li><a href="#">Boletín</a></li>
                <li><a href="#">Reembolsos</a></li>
              </ul>
            </div>

            <div className="newsletter">
              <p className="title-footer">Boletín informativo</p>

              <div className="content">
                <p>
                  Suscríbete a nuestros boletines ahora y mantente al
                  día con nuevas colecciones y ofertas exclusivas.
                </p>
                <input type="email" placeholder="Ingresa el correo aquí..."/>
                  <button>Suscríbete</button>
              </div>
            </div>
          </div>

          <div className="copyright">
            <p>
              Desarrollado por Programación para el mundo &copy; 2022
            </p>

            <img src="src/componentes/assets/productos/payment.png" alt="Pagos"/>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
