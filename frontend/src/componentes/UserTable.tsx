import { useState, useEffect } from "react";
import UserModal from "./userModal";
import "./UserTable.css";

interface User {
  id: number;
  nombre: string;
  email: string;
}

function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  //Función reutilizable para cargar usuarios
  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  //Abrir modal de edición
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  //Eliminar usuario
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await fetch(`http://localhost:4000/api/users/${id}`, { method: "DELETE" });
        await loadUsers(); //vuelve a cargar los usuarios actualizados
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
      }
    }
  };

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleEdit(u)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => handleDelete(u.id)} className="btn-delete">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && selectedUser && (
        <UserModal
          user={selectedUser}
          closeModal={() => setModalOpen(false)}
          refreshUsers={loadUsers} //ahora usa la misma función
        />
      )}
    </div>
  );
}

export default UserTable;