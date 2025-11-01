import { useState, useEffect } from "react";
import { FaSearch, FaUserPlus, FaSignOutAlt, FaPen, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserModal from "../../modulos/UI/UserModal";
import "./UserTable.css";

interface User {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  estado: boolean;
  rol?: string;           
  usuarioCreacion?: number;
  usuarioActualizacion?: number;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setBandejaOpen] = useState(false);
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
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.apellido_paterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.apellido_materno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const openModal = (user?: User) => {
    setSelectedUser(
      user || { id: 0, nombre: "", apellido_paterno: "", apellido_materno: "", correo: "", estado: true }
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
          <FaBars className="bandeja-toggle" onClick={() => setBandejaOpen(!menuOpen)} />
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
            <FaUserPlus /> agregar
          </button>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.nombre}</td>
                  <td>{user.apellido_paterno}</td>
                  <td>{user.apellido_materno}</td>
                  <td>{user.correo}</td>
                  <td>{user.rol}</td>
                  <td
                    className={user.estado ? "estado-activo" : "estado-inactivo"}
                  >
                    {user.estado ? "ACTIVO" : "INACTIVO"}
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
                        checked={user.estado}
                        onChange={async (e) => {
                          try {
                            await fetch(
                              `http://localhost:4000/api/users/${user.id}/status`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ estado: e.target.checked }),
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
      <div className={`sidebar-bandeja ${menuOpen ? "active" : ""}`}>
        <div className="close-areaBandeja">
          <FaTimes className="close-iconBandeja" onClick={() => setBandejaOpen(false)} />
        </div>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Tienda</a></li>
          <li><a href="#">Aprender sobre acuarismo</a></li>
          <li><a href="#">Testimonios</a></li>
          <li><a href="#">Más</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>
      {menuOpen && <div className="overlay-two" onClick={() => setBandejaOpen(false)} />}
    </div>
  );
}

