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

interface Role {
  id: number;
  nombre: string;
}

interface Props {
  user?: User | null;
  closeModal: () => void;
  refreshUsers: () => void;
}

function UserModal({ user, closeModal, refreshUsers }: Props) {
  const loggedUserId = Number(localStorage.getItem("userId")) || 1;
  const token = localStorage.getItem("token");

  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<User>({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    contrasena: "",
    rol: "",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return console.error("Error al cargar roles");
        const data = await res.json();
        setRoles(data);
      } catch (error) {
        console.error("Error al traer roles:", error);
      }
    };
    fetchRoles();
  }, [token]);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        nombre: user.nombre || "",
        apellido_paterno: user.apellido_paterno || "",
        apellido_materno: user.apellido_materno || "",
        correo: user.correo || "",
        contrasena: "",
        rol: user.rol || "",
      });
    } else {
      setFormData({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        correo: "",
        contrasena: "",
        rol: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      let response;
      let userId: number;

      if (user && user.id) {
        // Actualizar usuario
        response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo: formData.correo,
            usuarioActualizacion: loggedUserId, // id de quien actualiza
          }),
        });
        if (!response.ok) throw new Error("No se pudo actualizar usuario");
        const data = await response.json();
        userId = data.user.id;
      } else {
        // Registrar usuario
        response = await fetch("/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            apellido_paterno: formData.apellido_paterno,
            apellido_materno: formData.apellido_materno,
            correo: formData.correo,
            contrasena: formData.contrasena,
            usuarioCreacion: loggedUserId, // id de quien crea
          }),
        });
        if (!response.ok) throw new Error("No se pudo registrar usuario");
        const data = await response.json();
        userId = data.user.id;
      }

      // Asignar rol con loggedUserId
      if (formData.rol) {
        const rolSeleccionado = roles.find(r => r.nombre === formData.rol);
        if (rolSeleccionado) {
          const rolResp = await fetch(
            `/api/role_user/${userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ 
                rolId: rolSeleccionado.id,
                loggedUserId: loggedUserId // enviamos id de quien asigna
              }),
            }
          );
          if (!rolResp.ok) throw new Error("No se pudo asignar el rol");
        }
      }

      await refreshUsers();
      closeModal();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("Error al guardar usuario o asignar rol");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-user">
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
          value={formData.rol || ""}
          onChange={handleChange}
        >
          <option value="">Seleccione un rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.nombre}>
              {r.nombre}
            </option>
          ))}
        </select>

        <div className="modal-actions">
          <button onClick={closeModal} className="btn-cancel">Cancelar</button>
          <button onClick={handleSave} className="btn-save">
            {user?.id ? "Actualizar" : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;