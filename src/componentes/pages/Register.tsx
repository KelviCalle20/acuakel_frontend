import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const [name, setNombre] = useState<string>('');
  const [ap, setAp] = useState<string>(''); // nuevo campo
  const [am, setAm] = useState<string>(''); // nuevo campo
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // nuevo campo
  const navigate = useNavigate(); // para redirigir al login

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/users/register', {
        name,
        ap,
        am,
        email,
        password,
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
      <div className="wrapper">
        <form onSubmit={handleRegister}>
          <h1>Registro</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Nombre"
              required
              value={name}
              onChange={(e) => setNombre(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Apellido Paterno"
              required
              value={ap}
              onChange={(e) => setAp(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Apellido Materno"
              required
              value={am}
              onChange={(e) => setAm(e.target.value)}
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

          <div className="input-box">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

