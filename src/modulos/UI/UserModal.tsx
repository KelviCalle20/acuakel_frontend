import React, { useState } from "react";
import "./UserModal.css";

interface User {
  id?: number; // opcional, solo existe al editar
  name: string;
  email: string;
  password?: string; // solo al crear
}

interface Props {
  user?: User | null; // si es null → modo "agregar"
  closeModal: () => void;
  refreshUsers: () => void;
}

function UserModal({ user, closeModal, refreshUsers }: Props) {
  const [formData, setFormData] = useState<User>(
    user || { name: "", email: "", password: "" }
  );

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
            nombre: formData.name,
            email: formData.email,
          }),
        });
      } else {
        // Registrar nuevo usuario
        await fetch("http://localhost:4000/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formData.name,
            email: formData.email,
            password: formData.password,
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
        
        <h2>{user?.id ? "Editar Usuario" : "Adicion de Usuario"}</h2>

        <input
          type="text"
          name="nombre"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo"
        />
        {!user?.id && (
          <input
            type="password"
            name="password"
            value={formData.password || ""}
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


