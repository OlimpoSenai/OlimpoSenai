import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Navegação após login
import { FaLock } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import axios from 'axios';  // Importando o axios
import styles from './Login.module.css'; // Usando CSS Modules

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Função que é chamada ao submeter o formulário de login
  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    const userCredentials = { email, senha };

    try {
      const response = await axios.post('http://localhost:3001/login', userCredentials);

      if (response.status === 200) {
        // Armazenar o token JWT no localStorage
        localStorage.setItem('token', response.data.token);

        // Redirecionar para a página inicial após login bem-sucedido
        navigate('/Home');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
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

            <div className={styles.inputField}>
              <input
                type="password"
                placeholder="Senha"
                required
                onChange={(e) => setSenha(e.target.value)}
              />
              <FaLock className={styles.icon} />
            </div>

            <button className={styles.registerButton} type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
