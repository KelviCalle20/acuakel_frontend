import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/pages/Login';
import Register from './componentes/pages/Register';
import Home from './componentes/pages/Home';
import UsersPage from './common/UF/UsersPage';
import ResetPassword from "./componentes/pages/ResetPassword";
import NewPassword from "./componentes/pages/NewPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Usuarios" element={<UsersPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router> 
  );
}
//mejoras adicionadas
export default App;
