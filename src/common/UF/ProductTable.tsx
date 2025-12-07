import { useState, useEffect } from "react";
import { FaSearch, FaBoxOpen, FaSignOutAlt, FaPen, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductModal from "../../modulos/UI/ProductModal";
import "./ProductTable.css"; // Ahora CSS independiente

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen_url?: string;
    categoria_id?: number;
    categoria?: { id: number; nombre: string };
    estado: boolean;
    mejor?: boolean;   
    especial?: boolean;
}

export default function ProductTable() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setBandejaOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const [productsPerPage, setProductsPerPage] = useState<number>(() => {
        const saved = localStorage.getItem("productsPerPage");
        return saved ? Number(saved) : 5;
    });

    useEffect(() => {
        localStorage.setItem("productsPerPage", productsPerPage.toString());
    }, [productsPerPage]);

    const fetchProductos = async () => {
        try {
            const res = await fetch("/api/products");
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
        setCurrentPage(1);
    }, [searchTerm, productos]);

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filteredProductos.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProductos.length / productsPerPage);

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

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
                categoria: undefined,
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
        <div className="product-table-page">
            <nav className="product-navbar-tray">
                <div className="navbar-left">
                    <FaBars className="product-bandeja-toggle" onClick={() => setBandejaOpen(!menuOpen)} />
                    <h2>Gestión de Productos</h2>
                </div>
                <div className="navbar-right">
                    <button className="product-exit-button" onClick={handleExit}>
                        <FaSignOutAlt />
                    </button>
                </div>
            </nav>

            <div className="product-table-container">
                <div className="product-table-header">
                    <div className="product-search-container">
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="product-search-input"
                        />
                        <FaSearch className="product-search-icon" />
                    </div>
                    <button className="product-add-button" onClick={() => openModal()}>
                        <FaBoxOpen /> agregar
                    </button>
                </div>

                <table className="product-table">
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
                        {currentProducts.length > 0 ? (
                            currentProducts.map((producto) => (
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
                                    <td>{producto.categoria?.nombre || "Sin categoría"}</td>
                                    <td className={producto.estado ? "product-estado-activo" : "product-estado-inactivo"}>
                                        {producto.estado ? "ACTIVO" : "INACTIVO"}
                                    </td>
                                    <td>
                                        <button className="product-edit-btn" onClick={() => openModal(producto)}>
                                            <FaPen />
                                        </button>
                                        <label className="product-switch">
                                            <input
                                                type="checkbox"
                                                checked={producto.estado}
                                                onChange={async (e) => {
                                                    try {
                                                        await fetch(
                                                            `/api/products/${producto.id}/status`,
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
                                            <span className="product-slider round"></span>
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

                {/* Paginación */}
                <div className="product-pagination-container">
                    <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                        <button
                            key={idx + 1}
                            className={currentPage === idx + 1 ? "active-page" : ""}
                            onClick={() => changePage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
                        Siguiente
                    </button>

                    <select
                        value={productsPerPage}
                        onChange={(e) => {
                            setProductsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                {isModalOpen && selectedProduct && (
                    <ProductModal
                        producto={selectedProduct}
                        closeModal={closeModal}
                        refreshProductos={fetchProductos}
                    />
                )}
            </div>

            <div className={`product-sidebar-bandeja ${menuOpen ? "active" : ""}`}>
                <div className="product-close-areaBandeja">
                    <FaTimes className="product-close-iconBandeja" onClick={() => setBandejaOpen(false)} />
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

            {menuOpen && <div className="product-overlay-two" onClick={() => setBandejaOpen(false)} />}
        </div>
    );
}
