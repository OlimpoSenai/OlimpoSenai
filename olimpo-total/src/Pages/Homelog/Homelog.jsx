import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import styles from './Homelog.module.css'; // Importando o CSS Module
import axios from 'axios';

const Homelog = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [treinos, setTreinos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Login');
    } else {
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      buscarUsuario(userId);
      buscarTreinos(userId);
    }
  }, [navigate]);

  const buscarUsuario = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/usuario/${userId}`);
      setUsuario(response.data);
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
    }
  };

  const buscarTreinos = async (usuarioId) => {
    try {
      const response = await axios.get(`http://localhost:3001/treinos/${usuarioId}`);
      setTreinos(response.data);
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Home');
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <img src={OlimpoIcon} alt="OLIMPO" className={styles.logoImage} />
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
      </header>

      <section className={styles.profileSection}>
        {usuario ? (
          <div className={styles.userDetails}>
            <h2>Olá, {usuario.nome}!</h2>
            <p>Bem-vindo ao seu painel de treinos.</p>
          </div>
        ) : (
          <p>Carregando informações...</p>
        )}
      </section>

      <section className={styles.treinoSection}>
        <h3>Seus Treinos</h3>
        {treinos.length > 0 ? (
          <ul className={styles.treinoList}>
            {treinos.map((treino) => (
              <li key={treino.id} className={styles.treinoItem}>
                <div className={styles.treinoHeader}>
                  <h4>{treino.nome}</h4>
                  <span>{treino.tipo}</span>
                </div>
                <p>{treino.descricao}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noTreinos}>Você ainda não tem treinos atribuídos.</p>
        )}
      </section>

      <footer className={styles.footer}>
        <p>© 2024 OLIMPO - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Homelog;
