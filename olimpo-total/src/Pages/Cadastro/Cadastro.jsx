import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { AiOutlineIdcard } from 'react-icons/ai';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import axios from 'axios';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmitCadastro = async (event) => {
    event.preventDefault();
    
    const userData = { nome, email, cpf, senha };

    try {
      const response = await axios.post('http://localhost:3001/inserir/usuario', userData);

      if (response.status === 200) {
        navigate('/Login');
      }
    } catch (error) {
      alert('Erro ao se cadastrar. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.loginContainer}>
          <img src={OlimpoIcon} alt="OLIMPO" />
          <p>Bem-vindo(a)! Não tem conta? Crie sua conta agora mesmo.</p>
          <button className={styles.loginButton} onClick={() => navigate('/Login')}>
            Entrar
          </button>
          <button className={styles.voltarButton} onClick={() => navigate('/Voltar')}>Voltar</button>
        </div>

        <div className={styles.registerContainer}>
          <h1 className={styles.h1}>Crie sua conta</h1>
          <form onSubmit={handleSubmitCadastro}>
            <div className={styles.inputField}>
              <input
                type="text"
                placeholder="Nome"
                required
                onChange={(e) => setNome(e.target.value)}
              />
              <FaUser className={styles.icon} />
            </div>

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
                type="text"
                placeholder="CPF"
                required
                onChange={(e) => setCpf(e.target.value)}
              />
              <AiOutlineIdcard className={styles.icon} />
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

            <button className={styles.registerButton} type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
