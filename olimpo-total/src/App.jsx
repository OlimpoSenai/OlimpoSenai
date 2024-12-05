import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importando do react-router-dom
import Cadastro from "./Pages/Cadastro/Cadastro.jsx";
import Home from './Pages/Home/Home.jsx';
import Login from "./Pages/Login/Login.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Definindo as rotas */}
          <Route path="/" element={<Home />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;