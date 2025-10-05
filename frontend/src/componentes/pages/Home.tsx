import { Link } from "react-router-dom";
import {FaUser} from "react-icons/fa";
import "./Home.css";
function Home() {
  return (
    <>
        <header>
			<div className="container-hero">
				<div className="container hero">
					<div className="customer-support">
						<i className="fa-solid fa-headset"></i>
						<div className="content-customer-support">
							<span className="text">Soporte al cliente</span>
							<span className="number">000-000-0000</span>
						</div>
					</div>
                    <div className="container-logo">
						<i className="fa-solid fa-mug-hot"></i>
						<h1 className="logo"><a href="/">ACUARIOFILIA</a></h1>
					</div>

					<div className="container-user">
                        <Link to="/login">
                            <FaUser className="fa-user"/>
                        </Link>
						<i className="fa-solid fa-basket-shopping"></i>
						<div className="content-shopping-cart">
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
						<li><a href="#">testimonios</a></li>
						<li><a href="#">Más</a></li>
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
    </> 
  );
}

export default Home;