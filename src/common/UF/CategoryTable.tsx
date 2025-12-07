import { useState, useEffect } from "react";
import { FaSearch, FaBoxOpen, FaSignOutAlt, FaPen, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CategoryTable.css";
import CategoryModal from "../../modulos/UI/CategoryModal";

interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    estado: boolean;
    imagen_url?: string;
}

export default function CategoryTable() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpen, setBandejaOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // NUEVAS PROPIEDADES
    const [bestCategories, setBestCategories] = useState<number[]>([]);
    const [showBestModal, setShowBestModal] = useState(false);

    const [categoriesPerPage, setCategoriesPerPage] = useState<number>(() => {
        const saved = localStorage.getItem("categoriesPerPage");
        return saved ? Number(saved) : 5;
    });

    useEffect(() => {
        localStorage.setItem("categoriesPerPage", categoriesPerPage.toString());
    }, [categoriesPerPage]);

    const fetchCategorias = async () => {
        try {
            const res = await fetch("/api/categories");
            if (!res.ok) throw new Error("Error al obtener las categorías");
            const data = await res.json();
            setCategorias(data);
            setFilteredCategorias(data);
        } catch (err) {
            console.error(err);
            setFilteredCategorias([]);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        const filtered = categorias.filter(
            (c) =>
                c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );
        setFilteredCategorias(filtered);
        setCurrentPage(1);
    }, [searchTerm, categorias]);

    const indexOfLast = currentPage * categoriesPerPage;
    const indexOfFirst = indexOfLast - categoriesPerPage;
    const currentCategories = filteredCategorias.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredCategorias.length / categoriesPerPage);

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const openModal = (categoria?: Categoria) => {
        setSelectedCategoria(
            categoria || {
                id: 0,
                nombre: "",
                descripcion: "",
                estado: true,
                imagen_url: "",
            }
        );
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCategoria(null);
        setIsModalOpen(false);
    };

    const handleExit = () => {
        navigate("/");
    };

    const handleSaveBestCategories = async () => {
        try {
            // Aquí podrías enviar al backend si quieres guardar permanentemente
            // await fetch("/api/categories/best", { method: "POST", body: JSON.stringify(bestCategories) });

            alert("Mejores categorías guardadas: " + bestCategories.join(", "));
            setShowBestModal(false);
        } catch (err) {
            console.error(err);
            alert("Error al guardar las mejores categorías.");
        }
    };

    return (
        <div className="category-table-page">
            <nav className="category-navbar-tray">
                <div className="navbar-left">
                    <FaBars className="category-bandeja-toggle" onClick={() => setBandejaOpen(!menuOpen)} />
                    <h2>Gestión de Categorías</h2>
                </div>
                <div className="navbar-right">
                    <button className="category-exit-button" onClick={handleExit}>
                        <FaSignOutAlt />
                    </button>
                </div>
            </nav>

            <div className="category-table-container">
                <div className="category-table-header">
                    <div className="category-search-container">
                        <input
                            type="text"
                            placeholder="Buscar categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="category-search-input"
                        />
                        <FaSearch className="category-search-icon" />
                    </div>
                    <button className="category-add-button" onClick={() => openModal()}>
                        <FaBoxOpen /> agregar
                    </button>
                    <button
                        className="category-add-button"
                        onClick={() => setShowBestModal(true)}
                        style={{ marginLeft: "10px" }}
                    >
                        ⭐ Mejores Categorías
                    </button>
                </div>

                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.length > 0 ? (
                            currentCategories.map((categoria) => (
                                <tr key={categoria.id}>
                                    <td>
                                        {categoria.imagen_url ? (
                                            <img
                                                src={categoria.imagen_url}
                                                alt={categoria.nombre}
                                                style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                                            />
                                        ) : (
                                            "Sin imagen"
                                        )}
                                    </td>
                                    <td>{categoria.nombre || "Sin nombre"}</td>
                                    <td>{categoria.descripcion || "Sin descripción"}</td>
                                    <td className={categoria.estado ? "category-estado-activo" : "category-estado-inactivo"}>
                                        {categoria.estado ? "ACTIVO" : "INACTIVO"}
                                    </td>
                                    <td>
                                        <button className="category-edit-btn" onClick={() => openModal(categoria)}>
                                            <FaPen />
                                        </button>
                                        <label className="category-switch">
                                            <input
                                                type="checkbox"
                                                checked={categoria.estado}
                                                onChange={async (e) => {
                                                    try {
                                                        await fetch(
                                                            `/api/categories/${categoria.id}/status`,
                                                            {
                                                                method: "PATCH",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ estado: e.target.checked }),
                                                            }
                                                        );
                                                        fetchCategorias();
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                            />
                                            <span className="category-slider round"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>No se encontraron categorías</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Paginación */}
                <div className="category-pagination-container">
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
                        value={categoriesPerPage}
                        onChange={(e) => {
                            setCategoriesPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                {/* MODAL DE EDICIÓN DE CATEGORÍA */}
                {isModalOpen && selectedCategoria && (
                    <CategoryModal
                        categoria={selectedCategoria}
                        closeModal={closeModal}
                        refreshCategorias={fetchCategorias}
                    />
                )}

                {/* MODAL DE MEJORES CATEGORÍAS */}
                {showBestModal && (
                    <div className="category-modal-overlay">
                        <div className="category-modal">
                            <h2>Seleccionar hasta 3 mejores categorías</h2>
                            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                {categorias.map((cat) => (
                                    <label key={cat.id} style={{ display: "block", margin: "5px 0" }}>
                                        <input
                                            type="checkbox"
                                            checked={bestCategories.includes(cat.id)}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setBestCategories((prev) => {
                                                    if (checked) {
                                                        if (prev.length >= 3) return prev;
                                                        return [...prev, cat.id];
                                                    } else {
                                                        return prev.filter((id) => id !== cat.id);
                                                    }
                                                });
                                            }}
                                        />
                                        {" "}{cat.nombre}
                                    </label>
                                ))}
                            </div>
                            <div style={{ marginTop: "15px", textAlign: "right" }}>
                                <button onClick={() => setShowBestModal(false)} className="category-btn-cancel">
                                    Cancelar
                                </button>
                                <button onClick={handleSaveBestCategories} className="category-btn-save" style={{ marginLeft: "10px" }}>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
