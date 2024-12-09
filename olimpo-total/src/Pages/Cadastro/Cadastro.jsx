import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineIdcard } from 'react-icons/ai';
import OlimpoIcon from "../../assets/OlimpoIcon.png";
import axios from 'axios';
import { formatarCpf, validarCpf } from '../../util/validarCpf';  // CPF
import { formatarEmail, validarEmail } from '../../util/validarEmail';  // E-mail
import styles from './Cadastro.module.css';
import { Helmet } from 'react-helmet';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroCpf, setErroCpf] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroBackend, setErroBackend] = useState('');
  const navigate = useNavigate();

  const handleCpfChange = (e) => {
    const cpfInput = e.target.value;
    const cpfSemFormatacao = cpfInput.replace(/[^\d]/g, '');
    const cpfFormatado = formatarCpf(cpfSemFormatacao);
    setCpf(cpfFormatado);
    setErroCpf('');
  };

  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    const emailFormatado = formatarEmail(emailInput);
    setEmail(emailFormatado);
    setErroEmail('');
  };

  const handleSubmitCadastro = async (e) => {
    e.preventDefault();

    if (!validarCpf(cpf)) {
      setErroCpf('CPF inválido');
      return;
    }

    if (!validarEmail(email)) {
      setErroEmail('E-mail inválido');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/inserir/usuario', { nome, email, cpf, senha });
      if (response.status === 200) {
        navigate('/Login');
      }
    } catch (error) {
      console.error('Erro no cadastro:', error); // Adicionando o console.log para capturar o erro completo
      if (error.response) {
        if (error.response.data) {
          const erroMsg = error.response.data;
          if (erroMsg.includes("E-mail")) {
            setErroEmail("E-mail já cadastrado");
          }
          if (erroMsg.includes("CPF")) {
            setErroCpf("CPF já cadastrado");
          }
        } else {
          setErroBackend('Erro ao se cadastrar. Tente novamente.');
        }
      } else {
        setErroBackend('Erro ao se conectar com o servidor. Tente novamente.');
      }
    }
  }

  return (
    <div className={styles.container}>
       <Helmet>
        <title>Olimpo - cadastre-se</title>
      </Helmet>
      <div className={styles.formContainer}>
        <div className={styles.loginContainer}>
          <img src={OlimpoIcon} alt="OLIMPO" />
          <p>Bem-vindo(a)! Já tem conta? Entre na sua conta agora mesmo.</p>
          <button className={styles.loginButton} onClick={() => navigate('/Login')}>Entrar</button>
          <button className={styles.voltarButton} onClick={() => navigate('/Home')}>Voltar</button>
        </div>

        <div className={styles.registerContainer}>
          <h1>Crie sua conta</h1>
          <p>Cadastre abaixo</p>
          <form onSubmit={handleSubmitCadastro}>
            <div className={styles.inputField}>
              <input type="text" className={styles.inputCadastro} placeholder="Nome Completo*" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <FaUser className={styles.icon} />
            </div>

            <div className={styles.inputField}>
              <input 
                type="email" 
                className={styles.inputCadastro}
                placeholder="E-mail*" 
                value={email} 
                onChange={handleEmailChange} 
                required 
              />
              <FiMail className={styles.icon} />
            </div>
            {erroEmail && <p className={styles.erro}>{erroEmail}</p>} {/* Exibir erro de e-mail */}

            <div className={styles.inputField}>
              <input 
                type="text" 
                className={styles.inputCadastro}
                placeholder="CPF*" 
                value={cpf} 
                onChange={handleCpfChange} 
                required 
              />
              <AiOutlineIdcard className={styles.icon} />
            </div>
            {erroCpf && <p className={styles.erro}>{erroCpf}</p>} {/* Exibir erro de CPF */}

            <div className={styles.inputField}>
              <input 
                type={mostrarSenha ? 'text' : 'password'} 
                className={styles.inputCadastro}
                placeholder="Senha*" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                required 
              />
              <FaLock className={styles.icon} />
              <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className={styles.mostrarPassword}>
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button className={styles.registerButton} type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
