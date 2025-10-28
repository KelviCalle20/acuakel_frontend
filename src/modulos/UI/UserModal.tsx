import React, { useState, useEffect } from "react";
import "./UserModal.css";

interface User {
  id?: number; // opcional, solo existe al editar
  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo: string;
  contraseña?: string; // solo al crear
}

interface Props {
  user?: User | null; // si es null → modo "agregar"
  closeModal: () => void;
  refreshUsers: () => void;
}

function UserModal({ user, closeModal, refreshUsers }: Props) {
  const [formData, setFormData] = useState<User>({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    contraseña: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido_paterno: user.apellido_paterno || "",
        apellido_materno: user.apellido_materno || "",
        correo: user.correo || "",
        contraseña: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (user && user.id) {
        // Editar usuario existente
        await fetch(`http://localhost:4000/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo: formData.correo,
          }),
        });
      } else {
        // Registrar nuevo usuario
        await fetch("http://localhost:4000/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo: formData.correo,
            contraseña: formData.contraseña,
          }),
        });
      }

      await refreshUsers();
      closeModal();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{user?.id ? "Actualizar Usuario" : "Adicionar Usuario"}</h2>

        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="text"
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
          placeholder="Apellido Paterno"
        />
        <input
          type="text"
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={handleChange}
          placeholder="Apellido Materno"
        />
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="Correo"
        />

        {!user?.id && (
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña || ""}
            onChange={handleChange}
            placeholder="Contraseña"
          />
        )}

        <div className="modal-actions">
          <button onClick={handleSave} className="btn-save">
            {user?.id ? "Actualizar" : "Registrar"}
          </button>
          <button onClick={closeModal} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;







