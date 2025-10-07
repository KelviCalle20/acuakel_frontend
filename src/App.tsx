import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/pages/Login';
import Register from './componentes/pages/Register';
import Home from './componentes/pages/Home';
import UsersPage from './componentes/pages/UsersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Usuarios" element={<UsersPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router> 
  );
}
//mejoras adicionadas
export default App;
