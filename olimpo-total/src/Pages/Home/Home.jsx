import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import styles from './Home.module.css'; // CSS Module
import { Helmet } from 'react-helmet';
import colemanicon from  "../../assets/coleman.png";
import forcaicon from "../../assets/forca.png";
import bombadoicon from "../../assets/bombado.png"

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
          <img src={colemanicon} alt="Imagem Motivacional 1" className={styles.image} />
          <img src={forcaicon} alt="Imagem Motivacional 2" className={styles.image} />
        </div>
      </section>

      {/* Seção de vídeo e sobre a academia */}
      <section id="section3" className={styles.academiaSection}>
        <div className='bigbox'>
          <div className= 'left'>
            <p>video</p>
            <video width="500" height="250" controls >
            <source src="..Videos/video1.mp4" type="video/mp4"/>
            </video>
          </div>
          <div className='right'>
          </div>
        </div>
      </section>
      

      {/* Seção de dúvidas */}
      <section id="Section4" className={styles.duvidasSection} bigbox>
      <p className={styles.pfrase}>MAIS QUE UMA ACADEMIA!</p>

        <h1>Um centro de treinamento com as melhores máquinas e a maior diversidade do Brasil. Junto dos melhores especialistas e dos profissionais mais capacitados.  Agora vc pode viver a filosofia Bodybuilder e mudar a sua vida, seja performance ou qualidade de vida! Aqui vc é tratado como um campeão, pois entendemos que a sua meta é a nossa meta.  Aberta para todas as pessoas - Do iniciante ao avançado e do jovem a melhor idade. </h1>
        </section>

      {/* Seção de planos */}
      <section id="Section4" className={styles.planosSection}>
        <h2>Novidades</h2>
        <p>Veja as últimas atualizações que preparamos para você!</p>
        <button className={styles.ctaButton}>Ver Mais</button>
      </section>

      {/* Seção de produtos */}
      <section id="Section5" className={styles.produtosSection}>
        <div>
      <img src={bombadoicon} alt="bombado" className={styles.image} />
      </div>
      </section>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>© 2024 OLIMPO - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
