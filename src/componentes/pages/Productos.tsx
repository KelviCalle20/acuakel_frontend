import { useEffect, useState } from "react";
import { FaEye, FaHeart, FaExchangeAlt, FaStar, FaShoppingBasket, FaSearch, FaHome } from "react-icons/fa";
import "./Productos.css";
import { useNavigate } from "react-router-dom";


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
  const [currentPage, setCurrentPage] = useState(1);
  const productosPerPage = 10; // límite por página
  const usuarioId = 1; // Cambia esto según tu sistema de login
  const navigate = useNavigate();


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
    setCurrentPage(1);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * productosPerPage;
  const indexOfFirst = indexOfLast - productosPerPage;
  const currentProductos = productosFiltrados.slice(indexOfFirst, indexOfLast);
  const totalPages =
    Math.ceil(productosFiltrados.length / productosPerPage) || 1;

  const paginate = (page: number) => setCurrentPage(page);

  //Añadir producto al carrito
  const agregarAlCarrito = async (productoId: number) => {
    try {
      const res = await fetch("http://localhost:4000/api/carrito/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioId,
          producto_id: productoId,
          cantidad: 1,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      alert(" Producto agregado al carrito");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      alert(" No se pudo agregar al carrito");
    }
  };

  return (
    <div className="page-products">
      <main className="main-content">
        <section className="container top-products">
          <h1 className="heading-1">Tienda de Productos</h1>

          {/* Buscador + Botón Home */}
          <div
            className="search-container"
            style={{ display: "flex", alignItems: "center" }}
          >
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
              }}
            >
              <FaHome style={{ marginRight: "5px" }} /> Home
            </button>

          </div>

          {/* Grid de Productos */}
          <div className="container-product">
            {currentProductos.length > 0 ? (
              currentProductos.map((producto) => (
                <div key={producto.id} className="card-products">
                  <div className="container-img">
                    <img
                      src={
                        producto.imagen_url || "https://via.placeholder.com/150"
                      }
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
                      className="add-carts"
                      onClick={() => agregarAlCarrito(producto.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <FaShoppingBasket />
                    </span>
                    <p className="prices">{producto.precio} Bs</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products">No hay productos disponibles.</p>
            )}
          </div>

          {/* Paginación */}
          <div
            className="product-pagination-container"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
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
