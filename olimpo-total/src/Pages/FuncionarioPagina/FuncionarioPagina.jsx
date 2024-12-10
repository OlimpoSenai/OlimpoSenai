import React, { useState } from 'react';
import axios from 'axios';
import styles from './FuncionarioPagina.module.css'; // Importando o CSS Module

const FuncionarioPagina = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [pesquisa, setPesquisa] = useState('');

  // Função para buscar usuários (nome, CPF, email)
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:3001/buscar/usuario?termo=${pesquisa}`, // API recebe o termo genérico
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUsuarios(response.data); // Armazena os resultados da busca
    } catch (error) {
      alert('Erro ao buscar usuário');
    }
  };

  // Função para selecionar o usuário e preencher o ID
  const handleSelectUsuario = (id) => {
    setUsuarioId(id);
    setPesquisa('');
    setUsuarios([]); // Limpa os resultados de busca
  };

  // Função para criar o treino
  const handleCreateTreino = async (e) => {
    e.preventDefault();

    if (!usuarioId) {
      alert('Selecione um usuário antes de criar o treino');
      return;
    }

    if (!nome || !descricao) {
      alert('Por favor, preencha todos os campos do treino');
      return;
    }

    try {
      // Chama a API para criar o treino
      await axios.post(
        'http://localhost:3001/criar/treino',
        { nome, descricao, usuarioId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      
      // Limpa os campos após o treino ser criado com sucesso
      setNome('');
      setDescricao('');
      setUsuarioId('');
      alert('Treino criado com sucesso');
    } catch (error) {
      console.error('Erro ao criar treino:', error); // Log detalhado no console
      if (error.response) {
        // Se houver uma resposta de erro do servidor
        alert(`Erro: ${error.response.data.message || 'Erro desconhecido'}`);
      } else {
        // Se não houver resposta, provavelmente um erro de rede
        alert('Erro de rede: Não foi possível se comunicar com o servidor');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Criar Treino</h1>
      <form onSubmit={handleCreateTreino} className={styles.form}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do treino"
          className={styles.inputField}
          required
        />
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição do treino"
          className={styles.textareaField}
          required
        />
        
        {/* Campo de pesquisa */}
        <input
          type="text"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          placeholder="Pesquisar por nome, CPF ou email"
          className={styles.inputField}
        />
        <button type="button" onClick={handleSearch} className={styles.button}>
          Pesquisar
        </button>

        {/* Resultados da pesquisa */}
        {usuarios.length > 0 && (
          <ul className={styles.searchResults}>
            {usuarios.map((usuario) => (
              <li
                key={usuario.id}
                onClick={() => handleSelectUsuario(usuario.id)}
                className={styles.searchResultItem}
              >
                {usuario.nome} - {usuario.email} - {usuario.cpf}
              </li>
            ))}
          </ul>
        )}

        {/* Exibe o ID do usuário selecionado */}
        {usuarioId && <p className={styles.selectedUser}>ID do Usuário Selecionado: {usuarioId}</p>}

        <button type="submit" className={styles.button}>
          Criar Treino
        </button>
      </form>
    </div>
  );
};

export default FuncionarioPagina;
