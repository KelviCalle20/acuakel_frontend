import React, { useState, useEffect } from "react";
import "./ProductModal.css";

interface Producto {
    id?: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    categoria_id?: number;
    estado?: boolean;
    imagen_url?: string;
    usuarioCreacion?: number;
    usuarioActualizacion?: number;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface Props {
    producto?: Producto | null;
    closeModal: () => void;
    refreshProductos: () => void;
}

function ProductModal({ producto, closeModal, refreshProductos }: Props) {
    const loggedUserId = Number(localStorage.getItem("userId")) || 1;
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [formData, setFormData] = useState<Producto>({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        categoria_id: undefined,
        imagen_url: "",
    });

    // Cargar datos al editar
    useEffect(() => {
        if (producto) {
            setFormData({
                id: producto.id,
                nombre: producto.nombre || "",
                descripcion: producto.descripcion || "",
                precio: producto.precio || 0,
                stock: producto.stock || 0,
                categoria_id: producto.categoria_id,
                imagen_url: producto.imagen_url || "",
            });
        } else {
            setFormData({
                nombre: "",
                descripcion: "",
                precio: 0,
                stock: 0,
                categoria_id: undefined,
                imagen_url: "",
            });
        }
    }, [producto]);

    // Cargar categorías
    useEffect(() => {
        fetch("http://localhost:4000/api/categories")
            .then((res) => res.json())
            .then((data) => setCategorias(data))
            .catch((err) => console.error("Error al cargar categorías:", err));
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "precio" || name === "stock" ? Number(value) : value,
        });
    };

    const handleSave = async () => {
        try {
            const url = producto && producto.id
                ? `http://localhost:4000/api/products/${producto.id}`
                : "http://localhost:4000/api/products";

            const method = producto && producto.id ? "PUT" : "POST";

            const body = JSON.stringify({
                ...formData,
                usuarioCreacion: producto?.id ? undefined : loggedUserId,
                usuarioActualizacion: producto?.id ? loggedUserId : undefined,
            });

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                alert("No se pudo guardar el producto.");
                return;
            }

            await refreshProductos();
            closeModal();
        } catch (err) {
            console.error("Error al guardar producto:", err);
            alert("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="product-modal-overlay">
            <div className="product-modal">
                <h2>{producto?.id ? "Actualizar Producto" : "Agregar Producto"}</h2>

                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre del producto"
                />

                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción"
                    rows={3}
                />

                <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder="Precio"
                    min="0"
                    step="0.01"
                />

                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock disponible"
                    min="0"
                />

                <select
                    name="categoria_id"
                    value={formData.categoria_id || ""}
                    onChange={handleChange}
                >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>

                <div className="product-modal-actions">
                    <button onClick={handleSave} className="product-btn-save">
                        {producto?.id ? "Actualizar" : "Registrar"}
                    </button>
                    <button onClick={closeModal} className="product-btn-cancel">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;
