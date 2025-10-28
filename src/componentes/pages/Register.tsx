import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const [nombre, setNombre] = useState<string>('');
  const [apellido_paterno, setAp] = useState<string>(''); // nuevo campo
  const [apellido_materno, setAm] = useState<string>(''); // nuevo campo
  const [correo, setEmail] = useState<string>('');
  const [contraseña, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // nuevo campo
  const navigate = useNavigate(); // para redirigir al login

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (contraseña !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/users/register', {
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contraseña,
      });
      alert(res.data.message); // mensaje de éxito
      navigate('/login'); // redirige al login
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error en registro:', err.response?.data || err.message);
        alert(err.response?.data?.error || 'Error en registro');
      } else {
        console.error('Error desconocido:', err);
        alert('Error desconocido en registro');
      }
    }
  };

  return (
    <div className='register-page'>
      <div className="wrapper-register">
        <form onSubmit={handleRegister}>
          <h1>Registro</h1>

          <div className="input-box">
            <input
              type="text"
              id="nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete='off'
            />
            <label htmlFor="nombre">Nombre</label>
            <FaUser className="icon" />
          </div>

          <div className='apellidos-container'>
            <div className="input-box">
              <input
                type="text"
                id="apellido_paterno"
                required
                value={apellido_paterno}
                onChange={(e) => setAp(e.target.value)}
                autoComplete='off'
              />
              <label htmlFor="apellido_paterno">Apellido Paterno</label>
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="text"
                id="apellido_materno"
                required
                value={apellido_materno}
                onChange={(e) => setAm(e.target.value)}
                autoComplete='off'
              />
              <label htmlFor="apellido_materno">Apellido Materno</label>
              <FaUser className="icon" />
            </div>
          </div>

          <div className="input-box">
            <input
              type="email"
              id="correo"
              required
              value={correo}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='off'
            />
            <label htmlFor="correo">Correo electrónico</label>
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              id="contraseña"
              required
              value={contraseña}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='off'
            />
            <label htmlFor="contraseña">Contraseña</label>
            <FaLock className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete='off'
            />
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
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

