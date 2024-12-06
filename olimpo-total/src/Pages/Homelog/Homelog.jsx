import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import styles from './Homelog.module.css'; // Importação do CSS Module

const Homelog = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifique se o token está presente no localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Redireciona para a página de login se o token não for encontrado
      navigate('/Login');
    }
  }, [navigate]);

  // Função para deslogar o usuário
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    navigate('/Login'); // Redireciona para a página de login
  };

  return (
    <div className={styles.homeContainer}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <img src={OlimpoIcon} alt="OLIMPO" className={styles.logoImage} />
        </div>
        <nav>
          {/* Links da navegação */}
        </nav>
      </header>

      {/* Seção de boas-vindas */}
      <section className={styles.welcomeSection}>
        <h1>BEM-VINDOS AO OLIMPO!</h1>
        {/* Botão de logout */}
        <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
      </section>

      {/* Restante do conteúdo */}
    </div>
  );
};

export default Homelog;
