import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // reutilizamos el mismo CSS
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/users/reset-password", { email });
            setSent(true);
            setMessage("Si el correo existe, recibirás un enlace para restablecer tu contraseña.");
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
                <form onSubmit={handleReset}>
                    <h1>{sent ? "¡Correo enviado!" : "Restablecer Contraseña"}</h1>

                    {!sent && (
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
                    )}

                    {!sent && <button type="submit">Enviar enlace</button>}

                    {message && (
                        <p style={{ textAlign: "center", marginTop: "10px", color: "#fff" }}>{message}</p>
                    )}

                    <div className="register-link">
                        <Link to="/login">{sent ? "Volver al login" : "Cancelar"}</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
