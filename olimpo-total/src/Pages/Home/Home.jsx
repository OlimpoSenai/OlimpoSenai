import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import styles from './Home.module.css'; // CSS Module
import { Helmet } from 'react-helmet';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/Homelog'); // Redireciona se o usuário já estiver logado
    }
  }, [navigate]);

  return (
    <div className={styles.homeContainer}>
      <Helmet>
        <title>Olimpo - Bem vindo(a)!</title>
      </Helmet>
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <img src={OlimpoIcon} alt="OLIMPO" className={styles.logoImage} />
        </div>
        <nav>
        <ScrollLink to="section1" smooth={true} duration={500} className={styles.navLink}>
            home
          </ScrollLink>
          <ScrollLink to="section2" smooth={true} duration={500} className={styles.navLink}>
            Financeiro
          </ScrollLink>
          <ScrollLink to="section3" smooth={true} duration={500} className={styles.navLink}>
            Dúvidas
          </ScrollLink>
          <ScrollLink to="Section4" smooth={true} duration={500} className={styles.navLink}>
            Planos
          </ScrollLink>
          <ScrollLink to="Section5" smooth={true} duration={500} className={styles.navLink}>
            Produtos
          </ScrollLink>
        </nav>
      </header>

      {/* Seção de boas-vindas */}
      <section id="section1" className={styles.welcomeSection}>
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
      <section id="section2" className={styles.motivationSection}>
        <p>
          Foco, força, disciplina e resultados! A motivação está dentro de você e o ambiente para te inspirar é aqui!<br />
          O seu objetivo também é o nosso!
        </p>
        <div className={styles.images}>
          <img src="/path-to-image1.jpg" alt="Imagem Motivacional 1" className={styles.image} />
          <img src="/path-to-image2.jpg" alt="Imagem Motivacional 2" className={styles.image} />
        </div>
      </section>
      <section id="section3" className={styles.duvidasSection}>
        <p>
          section3
        </p>
      </section>

      {/* Seção de vídeo e sobre a academia */}
      <section className={styles.academiaSection}>
        <div className={styles.textAndVideo}>
          <div className={styles.textContent}>
            <h2>Sobre a Academia</h2>
            <p>
              Nossa academia oferece uma estrutura de ponta, com equipamentos modernos e profissionais qualificados para ajudá-lo a alcançar seus objetivos.
            </p>
          </div>
          <div className={styles.videoContent}>
            <video controls className={styles.video}>
              <source src="/path-to-video.mp4" type="video/mp4" />
              Seu navegador não suporta o formato de vídeo.
            </video>
          </div>
        </div>
      </section>

      {/* Seção de dúvidas */}
      <section id="Section3" className={styles.duvidasSection}>
        <h2>Bem-vindo à nossa plataforma!</h2>
        <p>Exploração das funcionalidades e conteúdos exclusivos para você.</p>
      </section>

      {/* Seção de planos */}
      <section id="Section4" className={styles.planosSection}>
        <h2>Novidades</h2>
        <p>Veja as últimas atualizações que preparamos para você!</p>
        <button className={styles.ctaButton}>Ver Mais</button>
      </section>

      {/* Seção de produtos */}
      <section id="Section5" className={styles.produtosSection}>
        <h2>Fale Conosco</h2>
        <p>Entre em contato para mais informações sobre nossos serviços.</p>
        <button className={styles.ctaButton}>Entrar em Contato</button>
      </section>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>© 2024 OLIMPO - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
