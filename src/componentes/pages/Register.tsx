import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate(); // para redirigir al login

  const handleRegister = async (e:any) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/users/register', {
        nombre,
        email,
        password,
      });
      alert(res.data.message); // mensaje de éxito
      navigate('/'); // redirige al login
    } catch (err:any) {
      console.error('Error en registro:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Error en registro');
    }
  };

  return (
    <div className='register-page'>
      <div className="wrapper">
        <form onSubmit={handleRegister}>
          <h1>Registro</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <button type="submit">Registrarse</button>

          <div className="register-link">
            <Link to="/login">Volver a login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
