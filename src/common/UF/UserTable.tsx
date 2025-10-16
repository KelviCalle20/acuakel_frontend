import { useState, useEffect } from "react";
import { FaSearch, FaUserPlus, FaSignOutAlt, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserModal from "../../modulos/UI/UserModal";
import "./UserTable.css";

interface User {
  id: number;
  name: string;
  ap: string;
  am: string;
  email: string;
  state: boolean;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.ap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.am.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const openModal = (user?: User) => {
    setSelectedUser(
      user || { id: 0, name: "", ap: "", am: "", email: "", state: true }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div className="user-table-page">
      <nav className="navbar-tray">
        <div className="navbar-left">
          <h2>Gestión de Usuarios</h2>
        </div>
        <div className="navbar-right">
          <button className="exit-button" onClick={handleExit}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      <div className="user-table-container">
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

        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.ap}</td>
                  <td>{user.am}</td>
                  <td>{user.email}</td>
                  <td
                    className={user.state ? "estado-activo" : "estado-inactivo"}
                  >
                    {user.state ? "ACTIVO" : "INACTIVO"}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => openModal(user)}
                    >
                      <FaPen />
                    </button>

                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={user.state}
                        onChange={async (e) => {
                          try {
                            await fetch(
                              `http://localhost:4000/api/users/${user.id}/status`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ state: e.target.checked }),
                              }
                            );
                            fetchUsers();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No se encontraron usuarios</td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && selectedUser && (
          <UserModal
            user={selectedUser}
            closeModal={closeModal}
            refreshUsers={fetchUsers}
          />
        )}
      </div>
    </div>
  );
}

