import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaShoppingCart, FaFish } from "react-icons/fa";
import {
  FaPlane, FaWallet, FaGift, FaHeadset, FaEye, FaHeart, FaExchangeAlt, FaStar, FaShoppingBasket, FaSearch, FaLink, FaFacebookF,
  FaTwitter, FaYoutube, FaPinterestP, FaInstagram
} from "react-icons/fa";
import "./Home.css";
import { useTranslation } from "react-i18next";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string;
}

function Home({ media }: { media: { video: string; audio: string } | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);


  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/products");
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      }
    };

    fetchProductos();
  }, []);



  useEffect(() => {
    const closeLang = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", closeLang);
    return () => document.removeEventListener("mousedown", closeLang);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && media?.video) {
      video.src = media.video;
      video.playbackRate = 3;
      video.play().catch(() => { });
    }
  }, [media]);



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

  const { t, i18n } = useTranslation();

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
                <a href="https://share.google/vfW41Uxa5gkEphhOO">{t("header.title")}</a>
              </h1>
            </div>

            <div className="language-dropdown" ref={langRef}>
              <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                <img src="src/componentes/assets/planeta.png" alt="Language" className="lang-globe" />
              </button>

              {langOpen && (
                <div className="lang-menu">
                  <button
                    onClick={() => {
                      i18n.changeLanguage("es");
                      setLangOpen(false);
                    }}
                    className={`lang-item ${i18n.language === "es" ? "active" : ""}`}
                  >
                    <img src="src/componentes/assets/español.png" alt="Español" />
                    <span>Español</span>
                  </button>

                  <button
                    onClick={() => {
                      i18n.changeLanguage("en");
                      setLangOpen(false);
                    }}
                    className={`lang-item ${i18n.language === "en" ? "active" : ""}`}
                  >

                    <img src="src/componentes/assets/ingles.png" alt="English" />
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>


            <div className="container-user">
              {!userName ? (
                <Link to="/login" className="login-section">
                  <FaUser className="fa-user" />
                  {/*<span className="login-text">Iniciar sesión</span>*/}
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
                        <FaUser /> {t("auth.logout")}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="content-shopping-cart">
                <Link to="/carrito">
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
              <li><a href="#1">{t("navbar.start")}</a></li>
              <li><a href="#2">{t("navbar.shop")}</a></li>
              <li><a href="#3">{t("navbar.learn")}</a></li>
              <li><Link to="/productos">{t("navbar.products")}</Link></li>
              <li><a href="#5">{t("navbar.gallery")}</a></li>
            </ul>

            <form className="search-form">
              <input type="search" placeholder={t("search.placeholder")} />
              <button className="btn-search">
                <FaSearch className="fa-solid fa-magnifying-glass" />
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
          <li className="mobile-cart">
            <Link to="/carrito">
              <FaShoppingCart className="fa-shopping-cart" /> Carrito
            </Link>
          </li>
        </ul>
      </div>
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
      {/*<div className="admin-button-container">
          <Link to="/usuarios" className="banner-btn">administrador</Link>
        </div>
        */}
      <section className="banner">
        {media && (
          <video
            ref={videoRef}
            className="banner-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={media.video} type="video/mp4" />
            Tu navegador no soporta video.
          </video>
        )}


        <div className="banner-overlay"></div>
        <div className="content-banner">
          <h2>{t("banner.title")}</h2>
          <a href="/productos">{t("banner.button")}</a>
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
        <section className="container top-categories" >
          <h1 className="heading-1" id="2">Mejores Categorías</h1>
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
          <div className="container-products">
            {productos.slice(0, 4).map((p) => (
              <div className="card-product" key={p.id}>
                <div className="container-img">
                  <img src={p.imagen_url} alt={p.nombre} />
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
                  <h3>{p.nombre}</h3>
                  <span className="add-cart"><FaShoppingBasket /></span>
                  <p className="price">{p.precio} Bs</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* GALERÍA */}
        <section className="gallery" id="3">
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
            {productos
              .slice(0, 4)
              .map((p) => (
                <div className="card-product" key={`especial-${p.id}`}>
                  <div className="container-img">
                    <img src={p.imagen_url} alt={p.nombre} />
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
                    <h3>{p.nombre}</h3>
                    <span className="add-cart"><FaShoppingBasket /></span>
                    <p className="price">{p.precio} Bs</p>
                  </div>
                </div>
              ))}
          </div>
        </section>


        {/* BLOGS */}
        <section className="container blogs" id="5">
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
        {/* --- Onda animada --- */}
        <svg
          className="footer-wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 150"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#grad1)"
            d="M0,96L60,101.3C120,107,240,117,360,128C480,139,600,149,720,144C840,139,960,117,1080,112C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          >
            <animate
              attributeName="d"
              dur="2s"
              repeatCount="indefinite"
              values="
          M0,96L60,101.3C120,107,240,117,360,128C480,139,600,149,720,144C840,139,960,117,1080,112C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z;
          M0,64L60,74.7C120,85,240,107,360,112C480,117,600,107,720,112C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z;
          M0,96L60,101.3C120,107,240,117,360,128C480,139,600,149,720,144C840,139,960,117,1080,112C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z
        "
            />
          </path>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#00bfff", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#0b5e5eff", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#00bfff", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>

        <div className="container container-footer">
          <div className="menu-footer">
            {/* Contact Info */}
            <div className="contact-info">
              <p className="title-footer">Información de Contacto</p>
              <ul>
                <li>Dirección: La Paz-Bolivia</li>
                <li>Teléfono: 123-456-7890</li>
                <li>Fax: 55555300</li>
                <li>Email: AcuaKel@gmail.com</li>
              </ul>
              <div className="social-icons">
                <span className="facebook">
                  <FaFacebookF />
                </span>
                <span className="twitter">
                  <FaTwitter />
                </span>
                <span className="youtube">
                  <FaYoutube />
                </span>
                <span className="pinterest">
                  <FaPinterestP />
                </span>
                <span className="instagram">
                  <FaInstagram />
                </span>
              </div>
            </div>

            {/* Información */}
            <div className="information">
              <p className="title-footer">Información</p>
              <ul>
                <li><a href="#">Acerca de Nosotros</a></li>
                <li><a href="#">Información Delivery</a></li>
                <li><a href="#">Políticas de Privacidad</a></li>
                <li><a href="#">Términos y condiciones</a></li>
                <li><a href="#">Contáctanos</a></li>
              </ul>
            </div>

            {/* Mi Cuenta */}
            <div className="my-account">
              <p className="title-footer">Mi cuenta</p>
              <ul>
                <li><a href="#">Mi cuenta</a></li>
                <li><a href="#">Historial de órdenes</a></li>
                <li><a href="#">Lista de deseos</a></li>
                <li><a href="#">Boletín</a></li>
                <li><a href="#">Reembolsos</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="newsletter">
              <p className="title-footer">Boletín informativo</p>
              <div className="content">
                <p>Suscríbete a nuestros boletines y recibe ofertas exclusivas.</p>
                <div className="newsletter-input">
                  <input type="email" placeholder="Ingresa tu correo..." />
                  <button>Suscribirse</button>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="copyright">
            <p>Adictos al mundo acuatico &copy; 2025</p>
            <img src="src/componentes/assets/productos/payment.png" alt="Pagos" />{/*src/componentes/assets/productos/payment.png*/}

          </div>
        </div>
      </footer>

    </>
  );
}

export default Home;