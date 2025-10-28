import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [correo, setEmail] = useState<string>('');
  const [contraseña, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/users/login', { correo, contraseña });
      //alert(res.data.message);
      const userName = res.data.user?.nombre || res.data.user?.nombre || '';
      if (userName) {
        localStorage.setItem('userName', userName);
      }
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || 'error en el login');
      } else {
        alert('error desconocido en el login');
      }
    }
  };

  return (
    <div className='login-page'>
      <Link to="/" className="neon-button-top">Volver al inicio</Link>
      <div className='wrapper-login'>
        <form onSubmit={handleSubmit}>
          <h1>Iniciar Sesion</h1>
          <div className='input-box'>
            <input
              type="email"
              id="correo"
              required
              value={correo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              autoComplete='off'
            />
            <label htmlFor="correo">Correo electrónico</label>
            <FaUser className='icon' />
          </div>

          <div className='input-box'>
            <input
              type="password"
              id="contraseña"
              required
              value={contraseña}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              autoComplete='off'
            />
            <label htmlFor="contraseña">Contraseña</label>
            <FaLock className='icon' />
          </div>


          <div className='remember-forgot'>
            <Link to="/reset-password">¿Olvidaste la contraseña?</Link>
          </div>


          <button type='submit'>Iniciar Sesion</button>

          <div className='register-link'>
            <Link to="/register">registrarse</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
