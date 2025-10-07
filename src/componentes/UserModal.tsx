import React, { useState } from "react";
import "./UserModal.css";

interface User {
  id: number;
  nombre: string;
  email: string;
}

interface Props {
  user: User;
  closeModal: () => void;
  refreshUsers: () => void;
}

function UserModal({ user, closeModal, refreshUsers }: Props) {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      //Refresca la lista completa
      await refreshUsers();

      //Cierra el modal
      closeModal();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Usuario</h2>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
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

        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={closeModal}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;