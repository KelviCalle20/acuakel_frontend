import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import NewPassword from "./NewPassword";
import "./ResetPassword.css";

interface ForgotPasswordDTO {
  correo: string;
}

interface ForgotPasswordResponse {
  message: string;
}

const ResetPassword: React.FC = () => {
  const [correo, setCorreo] = useState<string>("");
  const [codigoEnviado, setCodigoEnviado] = useState<boolean>(false);
  const [codigo, setCodigo] = useState<string>("");

  const enviarCodigo = async () => {
    if (!correo) {
      alert("Ingresa tu correo");
      return;
    }

    const data: ForgotPasswordDTO = { correo };

    try {
      const response = await axios.post<ForgotPasswordResponse>(
        "/api/auth/forgot-password",
        data
      );
      alert(response.data.message);
      setCodigoEnviado(true);
    } catch (err) {
      const error = err as AxiosError<ForgotPasswordResponse>;
      alert(error.response?.data?.message || "Error al enviar el código");
    }
  };

  if (codigoEnviado) {
    return (
      <div className="reset-pages">
        <div className="wrapper-resets">
          <NewPassword correo={correo} codigo={codigo} setCodigo={setCodigo} />
        </div>
      </div>
    );
  }

  return (
    <div className="reset-pages">
      <div className="wrapper-resets">
        <h1>Restablecer contraseña</h1>

        <div className="input-boxs">
          <input
            type="email"
            id="correo"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            autoComplete="off"
          />
          <label htmlFor="correo">Correo electrónico</label>
        </div>

        <button onClick={enviarCodigo}>Enviar código</button>

        <div className="info-text">
          <p>
            <Link to="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
