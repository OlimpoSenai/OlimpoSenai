import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import axios from 'axios';
import styles from './Login.module.css'; // Usando CSS Modules
import { validarEmail, formatarEmail } from '../../util/validarEmail';  // Importe as funções

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
        // Armazenar o token JWT no localStorage
        localStorage.setItem('token', response.data.token);
        // Redirecionar para a página inicial após login bem-sucedido
        navigate('/Homelog');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);

      // Exibir mensagem de erro caso a autenticação falhe
      if (error.response && error.response.data) {
        if (error.response.data.error === 'Email ou senha inválidos') {
          setErroEmail('E-mail ou senha inválidos');  // Exibe erro de e-mail e senha
          setErroSenha('');  // Reseta o erro de senha
        } else if (error.response.data.error === 'Senha inválida') {
          setErroSenha('Senha incorreta');  // Exibe erro de senha
          setErroEmail('');  // Reseta o erro de e-mail
        } else if (error.response.data.error === 'E-mail não encontrado') {
          setErroEmail('E-mail não encontrado');  // Exibe erro de e-mail
        }
      } else {
        setErroEmail('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
        setErroSenha('');  // Limpa erro de senha
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.loginContainer}>
          <img src={OlimpoIcon} alt="OLIMPO" />
          <p>Bem-vindo(a)! Não tem conta? Crie sua conta agora mesmo.</p>
          {/* Link para a página de cadastro */}
          <button className={styles.loginButton} onClick={() => navigate('/Cadastro')}>
            Registrar
          </button>
          <button className={styles.voltarButton2} onClick={() => navigate('/Home')}>Voltar</button>
        </div>

        <div className={styles.registerContainer}>
          <h1 className={styles.h1}>Faça seu login</h1>
          <form onSubmit={handleSubmitLogin}>
            <div className={styles.inputField}>
              <input
                type="email"
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
                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {/* Exibe erro de senha */}
            {erroSenha && <p className={styles.erro}>{erroSenha}</p>}

            <button className={styles.registerButton} type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
