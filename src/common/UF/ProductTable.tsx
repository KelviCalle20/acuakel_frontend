import { useState, useEffect } from "react";
import { FaSearch, FaBoxOpen, FaSignOutAlt, FaPen, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductModal from "../../modulos/UI/ProductModal";
import "./UserTable.css";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen_url?: string;
    categoria_id?: number;
    categoria?: string; // Nueva propiedad para mostrar nombre de categoría
    estado: boolean;
}

export default function ProductTable() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setBandejaOpen] = useState(false);
    const navigate = useNavigate();

    const fetchProductos = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/products");
            if (!res.ok) throw new Error("Error al obtener los productos");
            const data = await res.json();
            setProductos(data);
            setFilteredProductos(data);
        } catch (err) {
            console.error(err);
            setFilteredProductos([]);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    useEffect(() => {
        const filtered = productos.filter(
            (p) =>
                p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProductos(filtered);
    }, [searchTerm, productos]);

    const openModal = (product?: Producto) => {
        setSelectedProduct(
            product || {
                id: 0,
                nombre: "",
                descripcion: "",
                precio: 0,
                stock: 0,
                imagen_url: "",
                categoria_id: undefined,
                categoria: "",
                estado: true,
            }
        );
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    const handleExit = () => {
        navigate("/");
    };

    return (
        <div className="user-table-page">
            <nav className="navbar-tray">
                <div className="navbar-left">
                    <FaBars className="bandeja-toggle" onClick={() => setBandejaOpen(!menuOpen)} />
                    <h2>Gestión de Productos</h2>
                </div>
                <div className="navbar-right">
                    <button className="exit-button" onClick={handleExit}>
                        <FaSignOutAlt />
                    </button>
                </div>
            </nav>

            <div className="user-table-container">
                <div className="table-header">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <FaSearch className="search-icon" />
                    </div>
                    <button className="add-button" onClick={() => openModal()}>
                        <FaBoxOpen /> agregar
                    </button>
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Imagen</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.length > 0 ? (
                            filteredProductos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.nombre || "Sin nombre"}</td>
                                    <td>{producto.descripcion || "Sin descripción"}</td>
                                    <td>{Number(producto.precio || 0).toFixed(2)} Bs</td>
                                    <td>{producto.stock ?? 0}</td>
                                    <td>
                                        {producto.imagen_url ? (
                                            <img
                                                src={producto.imagen_url}
                                                alt={producto.nombre}
                                                style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                                            />
                                        ) : (
                                            "Sin imagen"
                                        )}
                                    </td>
                                    <td>{producto.categoria || "Sin categoría"}</td>
                                    <td className={producto.estado ? "estado-activo" : "estado-inactivo"}>
                                        {producto.estado ? "ACTIVO" : "INACTIVO"}
                                    </td>
                                    <td>
                                        <button className="edit-btn" onClick={() => openModal(producto)}>
                                            <FaPen />
                                        </button>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={producto.estado}
                                                onChange={async (e) => {
                                                    try {
                                                        await fetch(
                                                            `http://localhost:4000/api/products/${producto.id}/status`,
                                                            {
                                                                method: "PATCH",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ estado: e.target.checked }),
                                                            }
                                                        );
                                                        fetchProductos();
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8}>No se encontraron productos</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {isModalOpen && selectedProduct && (
                    <ProductModal
                        producto={selectedProduct}
                        closeModal={closeModal}
                        refreshProductos={fetchProductos}
                    />
                )}
            </div>

            <div className={`sidebar-bandeja ${menuOpen ? "active" : ""}`}>
                <div className="close-areaBandeja">
                    <FaTimes className="close-iconBandeja" onClick={() => setBandejaOpen(false)} />
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

            {menuOpen && <div className="overlay-two" onClick={() => setBandejaOpen(false)} />}
        </div>
    );
}


