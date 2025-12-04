import { useEffect, useState } from "react";
import {
  FaEye,
  FaHeart,
  FaExchangeAlt,
  FaStar,
  FaShoppingBasket,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import "./Productos.css";
import { useNavigate } from "react-router-dom";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
  estado: boolean;
  categoria?: { id: number; nombre: string };
}

interface Categoria {
  id: number;
  nombre: string;
}

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const productosPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Obtener productos
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

  // Obtener categorías
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error al cargar categorías:", err));
  }, []);

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    setCurrentPage(1);
  };

  const productosFiltrados = productos.filter((p) => {
    const matchesBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchesCategoria =
      categoriaSeleccionada === "" || p.categoria?.id === categoriaSeleccionada;
    return matchesBusqueda && matchesCategoria;
  });

  const indexOfLast = currentPage * productosPerPage;
  const indexOfFirst = indexOfLast - productosPerPage;
  const currentProductos = productosFiltrados.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(productosFiltrados.length / productosPerPage) || 1;

  const paginate = (page: number) => setCurrentPage(page);

  const agregarAlCarrito = async (producto: Producto) => {
    if (producto.stock === 0) return;

    if (!token) {
      alert("Debes iniciar sesión para agregar al carrito");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/carrito/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          producto_id: producto.id,
          cantidad: 1,
        }),
      });

      if (!res.ok) throw new Error("Error al agregar");
      alert("Producto agregado al carrito");
      fetchProductos();
    } catch (err) {
      console.error("Error al agregar:", err);
      alert("No se pudo agregar al carrito");
    }
  };

  return (
    <div className="page-products">
      <main className="main-content">
        <section className="container top-products">
          <h1 className="heading-1">Tienda de Productos</h1>

          <div className="search-container" style={{ display: "flex", alignItems: "center" }}>
            {/* Buscador */}
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

            {/* Selector de categorías */}
            <select
              value={categoriaSeleccionada}
              onChange={(e) => {
                const val = e.target.value;
                setCategoriaSeleccionada(val === "" ? "" : Number(val));
                setCurrentPage(1);
              }}
              style={{
                marginLeft: "10px",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "2px solid #00ffe0",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>

            {/* Botón Home */}
            <button
              className="btn-home"
              onClick={() => navigate("/")}
              style={{
                marginLeft: "10px",
                backgroundColor: "#00ffe0",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                boxShadow: "0 0 10px #00ffe0, 0 0 20px #00ffe0 inset",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#00b3a6";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 20px #00b3a6, 0 0 30px #00b3a6 inset";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#00ffe0";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 10px #00ffe0, 0 0 20px #00ffe0 inset";
              }}
            >
              <FaHome style={{ marginRight: "5px" }} /> Home
            </button>
          </div>

          <div className="container-product">
            {currentProductos.length > 0 ? (
              currentProductos.map((producto) => {
                const agotado = producto.stock === 0;

                return (
                  <div
                    key={producto.id}
                    className={`card-products ${agotado ? "card-agotado" : ""}`}
                  >
                    {agotado && <div className="badge-agotado">AGOTADO</div>}

                    <div className="container-img">
                      <img
                        src={producto.imagen_url || "https://via.placeholder.com/150"}
                        alt={producto.nombre}
                      />
                      <div className="button-groups">
                        <span>
                          <FaEye />
                        </span>
                        <span>
                          <FaHeart />
                        </span>
                        <span>
                          <FaExchangeAlt />
                        </span>
                      </div>
                    </div>

                    <div className="content-card-products">
                      <div className="star">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar style={{ opacity: 0.3 }} />
                      </div>

                      <h3>{producto.nombre}</h3>

                      <span
                        className={`add-carts ${agotado ? "disabled" : ""}`}
                        onClick={() => !agotado && agregarAlCarrito(producto)}
                      >
                        <FaShoppingBasket />
                      </span>

                      <p className="prices">{producto.precio} Bs</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-products">No hay productos disponibles.</p>
            )}
          </div>

          <div className="product-pagination-container">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={currentPage === idx + 1 ? "active-page" : ""}
                onClick={() => paginate(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Productos;
