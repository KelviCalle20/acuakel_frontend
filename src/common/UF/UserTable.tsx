import { useState, useEffect } from "react";
import { FaSearch, FaUserPlus, FaSignOutAlt, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserModal from "../../modulos/UI/UserModal";
import "./UserTable.css";

interface User {
  id: number;
  name: string;
  ap: string;  // nuevo
  am: string;  // nuevo
  email: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  //Obtener usuarios
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users");
      if (!res.ok) throw new Error("Error al obtener los usuarios");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error(err);
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //Búsqueda automática
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.ap.toLowerCase().includes(searchTerm.toLowerCase()) ||  // búsqueda por apellidos
        u.am.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const openModal = (user?: User) => {
    setSelectedUser(user || { id: 0, name: "", ap: "", am: "", email: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  //Botón salir (Navbar)
  const handleExit = () => {
    navigate("/");
  };

  return (
    <div className="user-table-page">
      {/* NAVBAR */}
      <nav className="navbar2">
        <div className="navbar-left">
          <h2>Gestión de Usuarios</h2>
        </div>

        <div className="navbar-right">
          <button className="exit-button" onClick={handleExit}>
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </nav>

      {/* Contenedor principal */}
      <div className="user-table-container">
        {/* Encabezado con búsqueda y agregar */}
        <div className="table-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>

          <button className="add-button" onClick={() => openModal()}>
            <FaUserPlus />
          </button>
        </div>

        {/* Tabla */}
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido Paterno</th>  {/* nuevo */}
              <th>Apellido Materno</th>  {/* nuevo */}
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.ap}</td>  {/* nuevo */}
                  <td>{user.am}</td>  {/* nuevo */}
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => openModal(user)}
                    >
                      <FaPen />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No se encontraron usuarios</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal */}
        {isModalOpen && (
          <UserModal
            user={selectedUser!}
            closeModal={closeModal}
            refreshUsers={fetchUsers}
          />
        )}
      </div>
    </div>
  );
}





