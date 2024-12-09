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
    navigate('/Home'); // Redireciona para a página de login
  };

  return (
    <div className={styles.homeContainer}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <img src={OlimpoIcon} alt="OLIMPO" className={styles.logoImage} />
        </div>
        <nav>
        <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
        </nav>
      </header>

      <section className={styles.treinosSection}>
        <p>
          Foco, força, disciplina e resultados! A motivação está dentro de você e o ambiente para te inspirar é aqui!<br />
          O seu objetivo também é o nosso!
        </p>
        <div>
        </div>
      </section>

      {/* Vídeo sobre a Academia */}
      <section className={styles.videoSection} bigbox>
        <div className={styles.text}>
          <h2>Sobre a Academia</h2>
          <p>
            A nossa academia oferece um espaço moderno e bem equipado para que você alcance seus objetivos fitness. Contamos com professores especializados, equipamentos de última geração e uma variedade de atividades para todos os níveis de condicionamento físico.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 OLIMPO - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Homelog;
