import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importando do react-router-dom
import Cadastro from "./Pages/Cadastro/Cadastro.jsx";
import Home from './Pages/Home/Home.jsx';
import Login from "./Pages/Login/Login.jsx";
import Homelog from "./Pages/Homelog/Homelog.jsx";
import PaginaAdm from "./Pages/PaginaAdm/PaginaAdm.jsx";
import EsqueciSenha from "./Pages/EsqueciSenha/EsqueciSenha.jsx";
import ResetarSenha from "./Pages/ResetarSenha/ResetarSenha.jsx";

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
          <Route path="/Homelog" element={<Homelog />} />
          <Route path="/PaginaAdm" element={<PaginaAdm />} />
          <Route path="/EsqueciSenha" element={<EsqueciSenha />} />
          <Route path="/resetar-Senha" element={<ResetarSenha />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;