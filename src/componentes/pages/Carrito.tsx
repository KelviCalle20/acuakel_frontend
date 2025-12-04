import { useState, useEffect } from "react";
import PagoModal from "../../modulos/UI/PagoModal";
import "./Carrito.css";

interface ProductoCarrito {
  detalle_id: number;
  producto_id: number;
  nombre: string;
  precio: number | string;
  imagen_url: string;
  cantidad: number;
  subtotal: number | string;
}

export default function Carrito() {
  const [items, setItems] = useState<ProductoCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPago, setShowPago] = useState(false);

  const token = localStorage.getItem("token"); // ✅ JWT

  // ✅ OBTENER CARRITO DEL USUARIO LOGUEADO (SIN usuarioId en la URL)
  const fetchCarrito = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`http://localhost:4000/api/carrito`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al cargar el carrito");

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Datos del carrito inválidos");

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

  // ✅ ELIMINAR PRODUCTO
  const removeItem = async (detalleId: number) => {
    if (!confirm("¿Eliminar este producto del carrito?")) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/carrito/remove/${detalleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("No se pudo eliminar el producto");

      fetchCarrito();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
      else alert("Error desconocido al eliminar el producto");
    }
  };

  // ✅ VACIAR CARRITO
  const clearCart = async () => {
    if (!confirm("¿Vaciar todo el carrito?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/carrito/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo vaciar el carrito");

      fetchCarrito();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
      else alert("Error desconocido al vaciar el carrito");
    }
  };

  // ✅ TOTAL
  const total = items.reduce(
    (sum, item) => sum + Number(item.subtotal || 0),
    0
  );

  // ✅ CONFIRMAR PAGO
  const handlePagoConfirm = async (metodo: "yape" | "banco") => {
    try {
      const detalles = items.map(item => ({
        productoId: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: Number(item.precio),
      }));

      const res = await fetch(`http://localhost:4000/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          total,
          detalles,
          metodo,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error al crear pedido");
      }

      const data = await res.json();
      alert(data.mensaje || `Pago confirmado con ${metodo}`);
      setShowPago(false);
      fetchCarrito();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) alert(err.message);
      else alert("Error desconocido al registrar el pedido");
    }
  };

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
                <img src={item.imagen_url || ""} alt={item.nombre} />
                <div className="cart-info">
                  <h3>{item.nombre}</h3>
                  <p>Precio: {Number(item.precio).toFixed(2)} Bs</p>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Subtotal: {Number(item.subtotal).toFixed(2)} Bs</p>
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
            <button className="btn-pay" onClick={() => setShowPago(true)}>Pagar</button>
            <button className="btn-clear" onClick={clearCart}>Vaciar carrito</button>
          </div>
        </div>
      )}

      {showPago && (
        <PagoModal
          total={total}
          onClose={() => setShowPago(false)}
          onConfirm={handlePagoConfirm}
        />
      )}
    </div>
  );
}
