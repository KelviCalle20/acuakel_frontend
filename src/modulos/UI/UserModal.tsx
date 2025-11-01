import React, { useState, useEffect } from "react";
import "./UserModal.css";

interface User {
  id?: number;
  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo: string;
  contrasena?: string;
  rol?: string;
  usuarioCreacion?: number;
  usuarioActualizacion?: number;
}

interface Props {
  user?: User | null;
  closeModal: () => void;
  refreshUsers: () => void;
}

function UserModal({ user, closeModal, refreshUsers }: Props) {
  const loggedUserId = Number(localStorage.getItem("userId")) || 1; // se usa 1 como admin inicial

  const [formData, setFormData] = useState<User>({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    contrasena: "",
    rol: "cliente",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        nombre: user.nombre || "",
        apellido_paterno: user.apellido_paterno || "",
        apellido_materno: user.apellido_materno || "",
        correo: user.correo || "",
        contrasena: "",
        rol: user.rol || "cliente",
      });
    } else {
      setFormData({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        correo: "",
        contrasena: "",
        rol: "cliente",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      let response;

      if (user && user.id) {
        // Actualizar usuario existente
        response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo: formData.correo,
            rol: formData.rol,
            usuarioActualizacion: loggedUserId,
          }),
        });
      } else {
        // Registrar nuevo usuario
        response = await fetch("http://localhost:4000/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo: formData.correo,
            contrasena: formData.contrasena,
            rol: "cliente",
            usuarioCreacion: loggedUserId,
          }),
        });
      }

      //Validar respuesta
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        alert("No se pudo guardar el usuario. Verifica los datos o el servidor.");
        return;
      }

      await refreshUsers(); // refresca la lista
      closeModal(); // cierra el modal 
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("Error al conectar con el servidor.");
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
            name="contrasena"
            value={formData.contrasena || ""}
            onChange={handleChange}
            placeholder="Contraseña"
          />
        )}

        <select
          name="rol"
          value={formData.rol || "cliente"}
          onChange={handleChange}
        >
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
          <option value="administrador">Administrador</option>
        </select>

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