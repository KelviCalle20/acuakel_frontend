import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/pages/Login';
import Register from './componentes/pages/Register';
import Home from './componentes/pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router> 
  );
}
//mejoras adicionadas
export default App;
