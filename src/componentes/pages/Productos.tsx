import { useEffect, useState } from "react";
import { FaEye, FaHeart, FaExchangeAlt, FaStar, FaShoppingBasket, FaSearch } from "react-icons/fa";
import "./Productos.css";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen_url: string;
    categoria: string;
    estado: boolean;
}

function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");

    const fetchProductos = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/products");
            if (!res.ok) throw new Error("Error al obtener productos");
            const data = await res.json();
            const activos = data.filter((p: Producto) => p.estado === true);
            setProductos(activos);
        } catch (err) {
            console.error("Error al cargar productos:", err);
            setProductos([]);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const productosFiltrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="page-products">
            <main className="main-content">
                <section className="container top-products">
                    <h1 className="heading-1">Tienda de Productos</h1>

                    {/* Buscador */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={busqueda}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        <button className="btn-search">
                            <FaSearch />
                        </button>
                    </div>

                    {/* Grid de Productos */}
                    <div className="container-product">
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <div key={producto.id} className="card-products">
                                    <div className="container-img">
                                        <img
                                            src={producto.imagen_url || "https://via.placeholder.com/150"}
                                            alt={producto.nombre}
                                        />
                                        <div className="button-groups">
                                            <span><FaEye /></span>
                                            <span><FaHeart /></span>
                                            <span><FaExchangeAlt /></span>
                                        </div>
                                    </div>
                                    <div className="content-card-products">
                                        <div className="star">
                                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar style={{ opacity: 0.3 }} />
                                        </div>
                                        <h3>{producto.nombre}</h3>
                                        <span className="add-carts"><FaShoppingBasket /></span>
                                        <p className="prices">{producto.precio} Bs</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-products">No hay productos disponibles.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Productos;

