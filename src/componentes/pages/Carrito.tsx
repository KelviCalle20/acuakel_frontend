import { useState, useEffect } from "react";
import "./Carrito.css";

interface ProductoCarrito {
  detalle_id: number;
  producto_id: number;
  nombre: string;
  precio: number | string; // puede venir como string desde la DB
  imagen_url: string;
  cantidad: number;
  subtotal: number | string; // puede venir como string desde la DB
}

export default function Carrito() {
  const [items, setItems] = useState<ProductoCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usuarioId = Number(localStorage.getItem("userId")) || 1;

  // Función para obtener el carrito
  const fetchCarrito = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`http://localhost:4000/api/carrito/${usuarioId}`);
      if (!res.ok) throw new Error("Error al cargar el carrito");

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Datos del carrito inválidos");
      }

      setItems(data);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Ocurrió un error desconocido");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  // Eliminar un item del carrito
  const removeItem = async (detalleId: number) => {
    if (!confirm("¿Eliminar este producto del carrito?")) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/carrito/remove/${detalleId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("No se pudo eliminar el producto");

      fetchCarrito();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
      else alert("Error desconocido al eliminar el producto");
    }
  };

  // Vaciar todo el carrito
  const clearCart = async () => {
    if (!confirm("¿Vaciar todo el carrito?")) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/carrito/clear/${usuarioId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("No se pudo vaciar el carrito");

      fetchCarrito();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
      else alert("Error desconocido al vaciar el carrito");
    }
  };

  // Calcular total de manera segura
  const total = items.reduce(
    (sum, item) => sum + Number(item.subtotal || 0),
    0
  );

  return (
    <div className="cart-page">
      <h1>Tu carrito de compra</h1>

      {loading && <p>Cargando carrito...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && items.length === 0 && (
        <p>No hay productos en el carrito.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="cart-container">
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-item" key={item.detalle_id}>
                <img src={item.imagen_url} alt={item.nombre} />
                <div className="cart-info">
                  <h3>{item.nombre}</h3>
                  <p>
                    Precio: {Number(item.precio)?.toFixed(2) || "0.00"} Bs
                  </p>
                  <p>Cantidad: {item.cantidad || 0}</p>
                  <p>
                    Subtotal: {Number(item.subtotal)?.toFixed(2) || "0.00"} Bs
                  </p>
                  <button
                    className="btn-remove"
                    onClick={() => removeItem(item.detalle_id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total estimado</h3>
            <p>{total.toFixed(2)} Bs</p>
            <button className="btn-pay">Pagar</button>
            <button className="btn-clear" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

