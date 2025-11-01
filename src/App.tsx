import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/pages/Login';
import Register from './componentes/pages/Register';
import Home from './componentes/pages/Home';
import UsersPage from './common/UF/UsersPage';
import ProductPage from './common/UF/ProductPage';
import ResetPassword from "./componentes/pages/ResetPassword";
import NewPassword from "./componentes/pages/NewPassword";
import Cart from './componentes/pages/Cart';
import Productos from './componentes/pages/Productos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Usuarios" element={<UsersPage />} />
        <Route path="/bandeja-productos" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router> 
  );
}
//mejoras adicionadas
export default App;
