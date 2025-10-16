import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useParams, Link } from "react-router-dom";

const NewPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4000/api/users/reset-password/${token}`, { password });
      setMessage("Contraseña restablecida correctamente. Puedes iniciar sesión.");
    } catch (err: unknown) {
      let msg = "Error desconocido";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.error || err.message || msg;
      }
      setMessage(msg);
    }
  };

  return (
    <div className="login-page">
      <div className="wrapper-login">
        <form onSubmit={handleSubmit}>
          <h1>Nueva Contraseña</h1>

          <div className="input-box">
            <input
              type="password"
              placeholder="Nueva contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Guardar</button>

          {message && (
            <p style={{ textAlign: "center", marginTop: "10px", color: "#fff" }}>{message}</p>
          )}

          <div className="register-link">
            <Link to="/login">Volver al login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;

