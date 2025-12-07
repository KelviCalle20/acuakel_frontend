import { useState, useEffect } from "react";
import { FaShoppingBasket, FaTimes } from "react-icons/fa";
import "./descriptModal.css";

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

interface Props {
    producto: Producto;
    relacionados: Producto[];
    cerrar: () => void;
    agregarAlCarrito: (producto: Producto) => void;
    abrirModal: (producto: Producto) => void;
    stock: number; // Stock actual del producto
}

export default function DescriptModal({
    producto,
    relacionados,
    cerrar,
    agregarAlCarrito,
    abrirModal,
    stock
}: Props) {
    const [stockActual, setStockActual] = useState(stock);

    useEffect(() => {
        setStockActual(stock);
    }, [stock]);

    const handleAgregar = () => {
        if (stockActual === 0) return;
        agregarAlCarrito(producto);
        setStockActual((prev) => prev - 1);
    };

    return (
        <div className="modal-overlay" onClick={cerrar}>
            <div className="modal-product" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={cerrar}>
                    <FaTimes />
                </button>

                <div className="modal-body">
                    <div className="modal-img-container">
                        <img
                            src={producto.imagen_url || "https://via.placeholder.com/150"}
                            alt={producto.nombre}
                            className="modal-img"
                        />
                        {stockActual === 0 && (
                            <div className="badge-agotado-modal">AGOTADO</div>
                        )}
                    </div>

                    <div className="modal-info">
                        <h2>{producto.nombre}</h2>
                        <p className="modal-desc">{producto.descripcion}</p>
                        <p className="modal-price">{producto.precio} Bs</p>
                        <p className="modal-stock">Stock: {stockActual}</p>

                        <button
                            className="modal-cart-btn"
                            onClick={handleAgregar}
                            disabled={stockActual === 0}
                        >
                            <FaShoppingBasket />
                            Agregar al carrito
                        </button>
                    </div>
                </div>

                <h3 className="modal-related-title">Productos relacionados</h3>

                <div className="modal-related-grid">
                    {relacionados.map((rel) => (
                        <div
                            key={rel.id}
                            className="modal-related-card"
                            onClick={() => abrirModal(rel)}
                        >
                            <img
                                src={rel.imagen_url || "https://via.placeholder.com/150"}
                                alt={rel.nombre}
                            />
                            {rel.stock === 0 && (
                                <div className="badge-agotado-modal-small">AGOTADO</div>
                            )}
                            <p>{rel.nombre}</p>
                            <span>{rel.precio} Bs</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
