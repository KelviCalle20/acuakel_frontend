import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Login from './componentes/pages/Login';
import Register from './componentes/pages/Register';
import Home from './componentes/pages/Home';
import UsersPage from './common/UF/UsersPage';
import ProductPage from './common/UF/ProductPage';
import ResetPassword from "./componentes/pages/ResetPassword";
import NewPassword from "./componentes/pages/NewPassword";
import Productos from './componentes/pages/Productos';
import Carrito from './componentes/pages/Carrito';
import Admin from './componentes/pages/administrador/Admin';
import AudioPlayer from "./componentes/AudioPlayer";
import Estadisticas from "./componentes/pages/administrador/Estadisticas";
import ProtectedRoute from './common/componentes/ProtectedRoute';

type MediaType = {
  video: string;
  audio: string;
};

type ConditionalAudioPlayerProps = {
  audioEnabled: boolean;
  media: MediaType | null;
};

function AppTitle() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      document.title = "AcuaKel-Admin";
    } else {
      document.title = "AcuaKel";
    }
  }, [location]);

  return null;
}

function ConditionalAudioPlayer({ audioEnabled, media }: ConditionalAudioPlayerProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) return null;

  return <AudioPlayer audioUrl={audioEnabled ? media?.audio || null : null} />;
}

export default function App() {
  const [media, setMedia] = useState<MediaType | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/media")
      .then(res => res.json())
      .then(data => setMedia(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const enableAudio = () => setAudioEnabled(true);
    window.addEventListener("click", enableAudio, { once: true });
    return () => window.removeEventListener("click", enableAudio);
  }, []);

  return (
    <Router>
      <AppTitle />
      <ConditionalAudioPlayer audioEnabled={audioEnabled} media={media} />

      <Routes>
        <Route path="/" element={<Home media={media} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />

        {/* ADMIN */}
        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["Administrador"]}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="bandeja-usuarios" replace />} />
          <Route path="bandeja-usuarios" element={<UsersPage />} />
          <Route path="bandeja-productos" element={<ProductPage />} />
          <Route path="estadisticas" element={<Estadisticas />} />
        </Route>
      </Routes>
    </Router>
  );
}
