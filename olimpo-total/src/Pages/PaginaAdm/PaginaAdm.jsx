import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './PaginaAdm.module.css'; // Ajuste o caminho para o seu arquivo de estilos, se necessário

const PaginaAdm = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [editarUsuario, setEditarUsuario] = useState(null);
  const [editarFuncionario, setEditarFuncionario] = useState(null); // Novo estado para editar funcionário
  const [novoFuncionario, setNovoFuncionario] = useState({ nome: '', email: '', cpf: '', senha: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3001/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert('Erro ao carregar usuários');
      }
    };

    const fetchFuncionarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/funcionarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFuncionarios(response.data);
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        alert('Erro ao carregar funcionários');
      }
    };

    fetchUsuarios();
    fetchFuncionarios();
  }, [navigate]);

  const handleCreateFuncionario = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/inserir/funcionario', novoFuncionario, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setNovoFuncionario({ nome: '', email: '', cpf: '', senha: '' });
        alert('Funcionário criado com sucesso');
        setFuncionarios((prevFuncionarios) => [...prevFuncionarios, response.data]);
      }
    } catch (error) {
      alert('Erro ao criar funcionário');
    }
  };

  const handleDeleteUsuario = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3001/deletar/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== id));
        alert('Usuário deletado com sucesso');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      if (error.response?.status === 404) {
        alert('Usuário não encontrado');
      } else {
        alert('Erro ao deletar usuário: ' + errorMessage);
      }
    }
  };

  const handleDeleteFuncionario = async (id) => { // Deleção de funcionário
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3001/deletar/funcionario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setFuncionarios((prevFuncionarios) => prevFuncionarios.filter((funcionario) => funcionario.id !== id));
        alert('Funcionário deletado com sucesso');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert('Erro ao deletar funcionário: ' + errorMessage);
    }
  };

  const handleEditUsuario = (usuario) => {
    setEditarUsuario({ ...usuario });
  };

  const handleEditFuncionario = (funcionario) => { // Edição de funcionário
    setEditarFuncionario({ ...funcionario });
  };

  const handleUpdateUsuario = async (e) => {
    e.preventDefault();
    
    const updatedUsuario = {
      nome: editarUsuario.nome,
      email: editarUsuario.email,
      cpf: editarUsuario.cpf,
    };
    
    try {
      const response = await axios.put(
        `http://localhost:3001/editar/usuario/${editarUsuario.id}`,
        updatedUsuario,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      
      if (response.status === 200) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((u) =>
            u.id === editarUsuario.id ? { ...u, ...updatedUsuario } : u
          )
        );
        setEditarUsuario(null);
        alert('Usuário atualizado com sucesso');
      } else {
        alert('Erro ao atualizar usuário');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateFuncionario = async (e) => { // Atualização de funcionário
    e.preventDefault();

    const updatedFuncionario = {
      nome: editarFuncionario.nome,
      email: editarFuncionario.email,
      cpf: editarFuncionario.cpf,
    };

    try {
      const response = await axios.put(
        `http://localhost:3001/editar/funcionario/${editarFuncionario.id}`,  // Aqui é onde o id do funcionário é passado para a URL
        updatedFuncionario,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.status === 200) {
        setFuncionarios((prevFuncionarios) =>
          prevFuncionarios.map((f) =>
            f.id === editarFuncionario.id ? { ...f, ...updatedFuncionario } : f
          )
        );
        setEditarFuncionario(null);
        alert('Funcionário atualizado com sucesso');
      } else {
        alert('Erro ao atualizar funcionário');
      }
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      alert('Erro ao atualizar funcionário: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Admin - Gerenciamento</h1>

      <section className={styles.createFuncionarioSection}>
        <h2>Criar Funcionário</h2>
        <form onSubmit={handleCreateFuncionario}>
          <input
            type="text"
            placeholder="Nome"
            value={novoFuncionario.nome}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={novoFuncionario.email}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="CPF"
            value={novoFuncionario.cpf}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cpf: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={novoFuncionario.senha}
            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, senha: e.target.value })}
            required
          />
          <button type="submit">Criar Funcionário</button>
        </form>
      </section>

      <section className={styles.usuariosSection}>
        <h2>Usuários</h2>
        {usuarios.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.cpf}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEditUsuario(usuario)}>Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteUsuario(usuario.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum usuário encontrado.</p>
        )}
      </section>

      {editarUsuario && (
        <section className={styles.editarUsuarioSection}>
          <h2>Editar Usuário</h2>
          <form onSubmit={handleUpdateUsuario}>
            <input
              type="text"
              placeholder="Nome"
              value={editarUsuario.nome}
              onChange={(e) => setEditarUsuario({ ...editarUsuario, nome: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={editarUsuario.email}
              onChange={(e) => setEditarUsuario({ ...editarUsuario, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="CPF"
              value={editarUsuario.cpf}
              onChange={(e) => setEditarUsuario({ ...editarUsuario, cpf: e.target.value })}
              required
            />
            <button type="submit">Atualizar Usuário</button>
          </form>
        </section>
      )}

      <section className={styles.funcionariosSection}>
        <h2>Funcionários</h2>
        {funcionarios.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.email}</td>
                  <td>{funcionario.cpf}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEditFuncionario(funcionario)}>Editar</button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteFuncionario(funcionario.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum funcionário encontrado.</p>
        )}
      </section>

      {editarFuncionario && (
        <section className={styles.editarFuncionarioSection}>
          <h2>Editar Funcionário</h2>
          <form onSubmit={handleUpdateFuncionario}>
            <input
              type="text"
              placeholder="Nome"
              value={editarFuncionario.nome}
              onChange={(e) => setEditarFuncionario({ ...editarFuncionario, nome: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={editarFuncionario.email}
              onChange={(e) => setEditarFuncionario({ ...editarFuncionario, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="CPF"
              value={editarFuncionario.cpf}
              onChange={(e) => setEditarFuncionario({ ...editarFuncionario, cpf: e.target.value })}
              required
            />
            <button type="submit">Atualizar Funcionário</button>
          </form>
        </section>
      )}
    </div>
  );
};

export default PaginaAdm;
