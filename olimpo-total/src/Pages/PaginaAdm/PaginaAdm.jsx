import React from 'react';
import { Link } from 'react-router-dom'; // Importando Link
import { Link as ScrollLink } from 'react-scroll'; // Importando Link do react-scroll
import OlimpoIcon from "../../assets/OlimpoIcon.png"; // Caminho para a imagem importada
import styles from './PaginaAdm.module.css'; // Importação do CSS Module

const PaginaAdm = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <img src={OlimpoIcon} alt="OLIMPO" className={styles.logoImage} />
          <p>Pagina de ADM</p>
        </div>
        <nav>
        <Link to="/Home">
            <button className={styles.btn}>voltar</button>
          </Link>
        </nav>
      </header>

      {/* Seção de boas-vindas */}
      <section className={styles.welcomeSection}>
        <h1>PAGINA DE ADM!</h1>
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

export default PaginaAdm;
