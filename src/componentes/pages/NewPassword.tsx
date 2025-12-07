import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./NewPassword.css";

interface ResetPasswordDTO {
  correo: string;
  codigo: string;
  nuevaContrasena: string;
  confirmarContrasena: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface Props {
  correo: string;
  codigo: string;
  setCodigo: (codigo: string) => void;
}

const NewPassword: React.FC<Props> = ({ correo, codigo, setCodigo }) => {
  const [codigoInput, setCodigoInput] = useState<string>(codigo);
  const [nuevaContrasena, setNuevaContrasena] = useState<string>("");
  const [confirmarContrasena, setConfirmarContrasena] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const resetPassword = async () => {
    if (!codigoInput || !nuevaContrasena || !confirmarContrasena) {
      alert("Completa todos los campos");
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const data: ResetPasswordDTO = {
      correo,
      codigo: codigoInput,
      nuevaContrasena,
      confirmarContrasena,
    };

    try {
      const response = await axios.post<ResetPasswordResponse>(
        "/api/auth/reset-password",
        data
      );
      alert(response.data.message);

      // Limpiar campos
      setNuevaContrasena("");
      setConfirmarContrasena("");
      setCodigoInput("");
      setCodigo("");

      // Redirigir automáticamente al login
      navigate("/login");
    } catch (err) {
      const error = err as AxiosError<ResetPasswordResponse>;
      alert(error.response?.data?.message || "Error al restablecer contraseña");
    }
  };

  return (
    <div className="new-password-containers">
      <div className="new-password-wrappers">
        <h1>Crear nueva contraseña</h1>

        <div className="new-password-input-boxs">
          <input
            type="text"
            required
            value={codigoInput}
            onChange={(e) => {
              setCodigoInput(e.target.value);
              setCodigo(e.target.value);
            }}
          />
          <label>Código recibido</label>
        </div>

        <div className="new-password-input-boxs">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
          />
          <label>Nueva contraseña</label>
          {nuevaContrasena.length > 0 && (
            <span
              className="new-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}
        </div>

        <div className="new-password-input-boxs">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
          />
          <label>Confirmar contraseña</label>
          {confirmarContrasena.length > 0 && (
            <span
              className="new-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}
        </div>

        <button onClick={resetPassword}>Restablecer contraseña</button>

        <div className="new-password-info">
          <p>
            <Link to="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
