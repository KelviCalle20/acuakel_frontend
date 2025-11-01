import { useState } from "react";
import { FaEye, FaHeart, FaExchangeAlt, FaStar, FaShoppingBasket, FaSearch } from "react-icons/fa";
import "./Productos.css"; // Estilos propios

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen_url: string;
    categoria_id: number;
}

const categoriasIniciales: Categoria[] = [
    { id: 1, nombre: "Peces" },
    { id: 2, nombre: "Plantas" },
    { id: 3, nombre: "Accesorios" },
];

function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        imagen_url: "",
        categoria_id: 1,
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNuevoProducto({ ...nuevoProducto, [name]: name === "precio" || name === "stock" || name === "categoria_id" ? Number(value) : value });
    };

    const handleAgregar = () => {
        const producto: Producto = {
            id: productos.length + 1,
            ...nuevoProducto,
        };
        setProductos([...productos, producto]);
        setNuevoProducto({
            nombre: "",
            descripcion: "",
            precio: 0,
            stock: 0,
            imagen_url: "",
            categoria_id: 1,
        });
    };

    const productosFiltrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <main className="main-content">
            <section className="container top-products">
                <h1 className="heading-1">Todos los Productos</h1>

                {/* Buscador */}
                <div className="search-container" style={{ marginBottom: "20px" }}>
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

                {/* Formulario Agregar Producto */}
                <div className="form-add-product">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre del producto"
                        value={nuevoProducto.nombre}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="precio"
                        placeholder="Precio"
                        value={nuevoProducto.precio}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        value={nuevoProducto.stock}
                        onChange={handleChange}
                    />
                    <select name="categoria_id" value={nuevoProducto.categoria_id} onChange={handleChange}>
                        {categoriasIniciales.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="imagen_url"
                        placeholder="URL de la imagen"
                        value={nuevoProducto.imagen_url}
                        onChange={handleChange}
                    />
                    <textarea
                        name="descripcion"
                        placeholder="Descripción"
                        value={nuevoProducto.descripcion}
                        onChange={handleChange}
                    />
                    <button onClick={handleAgregar}>Agregar Producto</button>
                </div>

                {/* Grid de Productos */}
                <div className="container-product">
                    {productosFiltrados.map((producto) => (
                        <div key={producto.id} className="card-products">
                            <div className="container-img">
                                <img src={producto.imagen_url} alt={producto.nombre} />
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
                                <p className="prices">{producto.precio}bs</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/*
                <svg
                    className="products-wave"
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
                </svg>*/}
            </section>

        </main>
    );
}

export default Productos;
