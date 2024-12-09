import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from './ResetarSenha.module.css';

const ResetarSenha = () => {
  const [email, setEmail] = useState('');
  const [codigoRecuperacao, setCodigoRecuperacao] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    const emailParam = query.get('email');
    const codigoParam = query.get('codigo');
    if (emailParam) setEmail(emailParam);
    if (codigoParam) setCodigoRecuperacao(codigoParam);
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/resetar-senha', {
        email,
        codigoRecuperacao,
        novaSenha
      });

      if (response.status === 200) {
        setMensagem('Senha resetada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      setMensagem('Erro ao resetar senha. Verifique as informações e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.resetaContainer}>
      <h2 className={styles.h2frase}>Redefinir Senha</h2>
      <form onSubmit={handleResetPassword}>
        <div className={styles.formGroup}>
          <label className={styles.label}>E-mail:</label>
          <input type="email" className={styles.inputField} value={email} onChange={(e) => setEmail(e.target.value)} disabled />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Código de Recuperação:</label>
          <input type="text" className={styles.inputField} value={codigoRecuperacao} onChange={(e) => setCodigoRecuperacao(e.target.value)} disabled />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nova Senha:</label>
          <input type="password" className={styles.inputField} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
        </div>
        <button type="submit" className={styles.resetabutton} disabled={loading}>Resetar Senha</button>
      </form>
      {mensagem && <p className={styles.message}>{mensagem}</p>}
        </div>
    </div>
  );
};

export default ResetarSenha;
