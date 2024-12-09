import { useState } from 'react';
import axios from 'axios';
import styles from './EsqueciSenha.module.css'; // Crie o arquivo CSS para estilizar
import { Helmet } from 'react-helmet';

const EsqueciSenha = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      const response = await axios.post('http://localhost:3001/esqueci-minha-senha', { email });
      if (response.status === 200) {
        setMensagem('Um link para redefinir sua senha foi enviado para seu e-mail.');
      }
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      setMensagem('Erro ao enviar o link. Verifique o e-mail e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Olimpo - Recupere Sua Conta</title>
      </Helmet>
      <div className={styles.resetaContainer}>
        <h1 className={styles.h1frase}>Esqueci Minha Senha</h1>
        <p className={styles.pfrase}>Insira seu e-mail para receber um link de redefinição de senha.</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <input 
              type="email" 
              className={styles.input}
              placeholder="E-mail*" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <button className={styles.submitButton} type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        {mensagem && <p className={styles.message}>{mensagem}</p>}
      </div>
    </div>
  );
};

export default EsqueciSenha;
