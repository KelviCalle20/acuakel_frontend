import React, { useState, useEffect } from "react";
import "./CategoryModal.css";

interface Categoria {
    id?: number;
    nombre: string;
    descripcion?: string;
    estado?: boolean;
    imagen_url?: string;
    usuarioCreacion?: number;
    usuarioActualizacion?: number;
}

interface Props {
    categoria?: Categoria | null;
    closeModal: () => void;
    refreshCategorias: () => void;
}

function CategoryModal({ categoria, closeModal, refreshCategorias }: Props) {
    const loggedUserId = Number(localStorage.getItem("userId")) || 1;

    const [formData, setFormData] = useState<Categoria>({
        nombre: "",
        descripcion: "",
        imagen_url: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        if (categoria) {
            setFormData({
                id: categoria.id,
                nombre: categoria.nombre || "",
                descripcion: categoria.descripcion || "",
                imagen_url: categoria.imagen_url || "",
            });
            setPreview(categoria.imagen_url || "");
        } else {
            setFormData({
                nombre: "",
                descripcion: "",
                imagen_url: "",
            });
            setPreview("");
        }
    }, [categoria]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        try {
            let imageUrl = formData.imagen_url;

            if (file) {
                const imageData = new FormData();
                imageData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: imageData,
                });

                if (!uploadRes.ok) throw new Error("Error al subir imagen");
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }

            const url = categoria?.id
                ? `/api/categories/${categoria.id}`
                : "/api/categories";

            const method = categoria?.id ? "PUT" : "POST";

            const body = JSON.stringify({
                ...formData,
                imagen_url: imageUrl,
                usuarioCreacion: categoria?.id ? undefined : loggedUserId,
                usuarioActualizacion: categoria?.id ? loggedUserId : undefined,
            });

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                alert("No se pudo guardar la categoría.");
                return;
            }

            await refreshCategorias();
            closeModal();
        } catch (err) {
            console.error("Error al guardar categoría:", err);
            alert("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="category-modal-overlay">
            <div className="category-modal">
                <h2>{categoria?.id ? "Actualizar Categoría" : "Agregar Categoría"}</h2>

                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre de la categoría"
                />

                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción (opcional)"
                    rows={3}
                />

                {/* ====================== SUBIDA DE IMAGEN ====================== */}
                <div className="row-inputs">
                    <input
                        type="text"
                        name="imagen_url"
                        value={formData.imagen_url}
                        onChange={handleChange}
                        placeholder="URL de la imagen (opcional)"
                    />
                    <label className="file-upload-label">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        Seleccionar archivo
                    </label>
                </div>

                {preview && (
                    <div className="image-preview">
                        <img src={preview} alt="Vista previa" />
                    </div>
                )}

                <div className="category-modal-actions">
                    <button onClick={closeModal} className="category-btn-cancel">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="category-btn-save">
                        {categoria?.id ? "Actualizar" : "Registrar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryModal;
