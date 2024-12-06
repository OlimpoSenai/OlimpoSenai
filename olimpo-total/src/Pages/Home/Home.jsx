import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importando Link e useNavigate
import { Link as ScrollLink } from 'react-scroll'; // Importando Link do react-scroll
import OlimpoIcon from "../../assets/OlimpoIcon.png"; // Caminho para a imagem importada
import styles from './Home.module.css'; // Importação do CSS Module

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Homelog'); // Se o usuário já estiver logado, redireciona para a página Homelog
    }
  }, [navigate]);

  return (
    <div className={styles.homeContainer}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <img src={OlimpoIcon} alt="OLIMPO" className={styles.logoImage} />
        </div>
        <nav>
          <ScrollLink to="financeiro" smooth={true} duration={500} className={styles.navLink}>
            Financeiro
          </ScrollLink>
          <ScrollLink to="duvidas" smooth={true} duration={500} className={styles.navLink}>
            Dúvidas
          </ScrollLink>
          <ScrollLink to="planos" smooth={true} duration={500} className={styles.navLink}>
            Planos
          </ScrollLink>
          <ScrollLink to="produtos" smooth={true} duration={500} className={styles.navLink}>
            Produtos
          </ScrollLink>
        </nav>
      </header>

      {/* Seção de boas-vindas */}
      <section className={styles.welcomeSection}>
        <h1>BEM-VINDOS AO OLIMPO!</h1>
        <div className={styles.buttons}>
          <Link to="/Login">
            <button className={styles.btn}>Logar</button>
          </Link>
          <Link to="/Cadastro">
            <button className={styles.btn}>Cadastrar</button>
          </Link>
        </div>
      </section>

      {/* Motivação */}
      <section id="financeiro" className={styles.motivationSection}>
        <p>
          Foco, força, disciplina e resultados! A motivação está dentro de você e o ambiente para te inspirar é aqui!<br />
          O seu objetivo também é o nosso!
        </p>
        <div className={styles.images}>
          <img src="/path-to-image1.jpg" alt="Imagem 1" className={styles.image} />
          <img src="/path-to-image2.jpg" alt="Imagem 2" className={styles.image} />
        </div>
      </section>

      {/* Depoimento ou mensagem */}
      <section className={styles.testimonySection}>
        <blockquote>
          "Na OLIMPO, cada treino é uma jornada de disciplina e superação, onde a motivação é a chave para você conquistar o impossível."
        </blockquote>
      </section>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>© 2024 OLIMPO - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
