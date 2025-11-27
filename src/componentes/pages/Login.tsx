import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Login.css";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [correo, setEmail] = useState<string>('');
  const [contrasena, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/users/login', { correo, contrasena });

      const { nombre, rol, token, id } = res.data.user;

      localStorage.setItem('userName', nombre);
      localStorage.setItem('userRole', rol);       // Guardamos el rol
      localStorage.setItem('userId', id.toString());
      localStorage.setItem('token', token);

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

          {/* CORREO */}
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

          {/* CONTRASEÑA */}
          <div className='input-box'>
            <input
              type={showPassword ? "text" : "password"}
              id="contrasena"
              required
              value={contrasena}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              autoComplete='off'
            />
            <label htmlFor="contrasena">Contraseña</label>
            <FaLock className='icon' />

            {/*ÍCONO SOLO APARECE SI SE ESTÁ ESCRIBIENDO */}
            {contrasena.length > 0 && (
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
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