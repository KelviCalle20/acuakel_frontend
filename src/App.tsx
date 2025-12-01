import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

function AppTitle() {
  const location = useLocation();

  useEffect(() => {
    // Cambia el título según la ruta
    if (location.pathname.startsWith("/admin")) {
      document.title = "AcuaKel-Admin";
    } else {
      document.title = "AcuaKel";
    }
  }, [location]);

  return null;
}
export default function App() {

  const [media, setMedia] = useState<{ video: string; audio: string } | null>(null);
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
      <AudioPlayer audioUrl={audioEnabled ? media?.audio || null : null} />
      <Routes>
        <Route path="/" element={<Home media={media}/>} />
        {/*<Route path="/Usuarios" element={<UsersPage />} />*/}
        {/*<Route path="/bandeja-productos" element={<ProductPage />} />*/}
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route path="/register" element={<Register />} />
        {/* ADMIN */}
        <Route path="/admin" element={<Admin />}>
          <Route path="bandeja-usuarios" element={<UsersPage />} />
          <Route path="bandeja-productos" element={<ProductPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
//mejoras adicionadas
