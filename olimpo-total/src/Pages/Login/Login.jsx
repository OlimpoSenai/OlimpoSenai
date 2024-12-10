import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import axios from 'axios';
import styles from './Login.module.css'; // Usando CSS Modules
import { validarEmail, formatarEmail } from '../../util/validarEmail';  // Importe as funções
import { Helmet } from 'react-helmet';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroEmail, setErroEmail] = useState('');  // Estado para erro de email
  const [erroSenha, setErroSenha] = useState('');  // Estado para erro de senha
  const [mostrarSenha, setMostrarSenha] = useState(false);  // Estado para mostrar/esconder a senha
  const navigate = useNavigate();

  // Função que é chamada ao submeter o formulário de login
  const handleSubmitLogin = async (event) => {
    event.preventDefault();
  
    // Limpar erros anteriores
    setErroEmail('');
    setErroSenha('');
  
    // Validação do formato do e-mail
    if (!validarEmail(email)) {
      setErroEmail('E-mail inválido');
      return;
    }
  
    // Formatar o e-mail para minúsculas
    const emailFormatado = formatarEmail(email);
    const userCredentials = { email: emailFormatado, senha };
  
    try {
      const response = await axios.post('http://localhost:3001/login', userCredentials);
  
      if (response.status === 200) {
        // Armazenar o token JWT e tipo de usuário no localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('tipo', response.data.tipo);  // Armazena o tipo de usuário
  
        // Redireciona dependendo do tipo de usuário
        if (response.data.tipo === 'admin') {
          navigate('/PaginaAdm');  // Redireciona para a página de administração
        } else if (response.data.tipo === 'funcionario') {
          navigate('/FuncionarioPagina');  // Redireciona para a página do funcionário
        } else {
          navigate('/Homelog');  // Caso seja um usuário comum
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
  
      // Exibir mensagem de erro caso a autenticação falhe
      if (error.response && error.response.data) {
        if (error.response.data.error === 'Email ou senha inválidos') {
          setErroEmail('E-mail ou senha inválidos');
          setErroSenha('');
        } else if (error.response.data.error === 'Senha inválida') {
          setErroSenha('Senha incorreta');
          setErroEmail('');
        } else if (error.response.data.error === 'E-mail não encontrado') {
          setErroEmail('E-mail não encontrado');
        }
      } else {
        setErroEmail('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
        setErroSenha('');
      }
    }
  };
  
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Olimpo - Faça login</title>
      </Helmet>
      <div className={styles.formContainer}>
        <div className={styles.registerContainer}>
          <img src={OlimpoIcon} alt="OLIMPO" />
          <p>Bem-vindo(a)! Não tem conta? Crie sua conta agora mesmo.</p>
          {/* Link para a página de cadastro */}
          <button className={styles.registerButton} onClick={() => navigate('/Cadastro')}>
            Registrar
          </button>
          <button className={styles.voltarButton2} onClick={() => navigate('/Home')}>Voltar</button>
        </div>

        <div className={styles.loginContainer}>
          <h1 className={styles.h1}>Faça seu login</h1>
          <p>Logue abaixo</p>
          <form onSubmit={handleSubmitLogin}>
            <div className={styles.inputField}>
              <input 
                type="email" 
                className={styles.inputLogin} 
                placeholder="E-mail" 
                required 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <FiMail className={styles.icon} />
            </div>
            {/* Exibe erro de e-mail */}
            {erroEmail && <p className={styles.erro}>{erroEmail}</p>}

            <div className={styles.inputField}>
              <input
                className={styles.inputLogin}
                type={mostrarSenha ? "text" : "password"}  // Exibe a senha dependendo do estado
                placeholder="Senha"
                required
                onChange={(e) => setSenha(e.target.value)} 
              />
              <FaLock className={styles.icon} />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className={styles.togglePassword}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button className={styles.loginButton} type="submit">Login</button>
            <p className={styles.esqueciSenha}>
              <a 
                href="/EsqueciSenha" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.link}
              >
                Esqueci minha senha
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
