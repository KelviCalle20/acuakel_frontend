// src/modulos/UI/PagoModal.tsx
import { useState } from "react";

// Logos de referencia (NO son QR)
import YapeLogo from "../assets/YapeLogo.jpg";
import BancoSolLogo from "../assets/BancoSolLogo.jpg";

// QRs usados realmente para pagar
import YapeQR from "../assets/Yape.jpg";
import BancoSolQR from "../assets/BancoSol.jpg";

import "./PagoModal.css";

interface PagoModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (metodo: "yape" | "banco") => void;
}

export default function PagoModal({ total, onClose, onConfirm }: PagoModalProps) {
  const [metodo, setMetodo] = useState<"" | "yape" | "banco">("");

  // QRs según método elegido
  const qrCodes: Record<"yape" | "banco", string> = {
    yape: YapeQR,
    banco: BancoSolQR,
  };

  const handleConfirm = () => {
    if (metodo !== "") {
      onConfirm(metodo);
      setMetodo(""); // reset del método después de confirmar
    } else {
      alert("Selecciona un método de pago primero");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-pago">
        <h2>Selecciona método de pago</h2>

        <div className="payment-container">

          {/* ---------------- SELECT + LOGOS ---------------- */}
          <div className="payment-select-section">
            <div className="select-wrapper">
              <label>Método:</label>
              <select
                value={metodo}
                onChange={(e) =>
                  setMetodo(e.target.value as "yape" | "banco" | "")
                }
              >
                <option value="">-- Selecciona --</option>
                <option value="yape">Yape</option>
                <option value="banco">Banco Sol</option>
              </select>
            </div>

            {/* ---------------- LOGOS DE REFERENCIA ---------------- */}
            <div className="payment-reference">
              <div className="method-images">
                <div className="logo-card">
                  <img src={YapeLogo} alt="Yape" />
                  <span>Yape</span>
                </div>

                <div className="logo-card">
                  <img src={BancoSolLogo} alt="Banco Sol" />
                  <span>Banco Sol</span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- QR SECTION ---------------- */}
          {metodo && qrCodes[metodo] && (
            <div className="qr-section">
              <h3>Escanea el QR para pagar {total.toFixed(2)} Bs</h3>

              <img
                src={qrCodes[metodo]}
                alt={`QR ${metodo}`}
                className="qr-image"
              />

              <div className="qr-buttons">
                <button onClick={handleConfirm}>Ya pagué</button>
              </div>
            </div>
          )}
        </div>

        <button className="close-btn" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
