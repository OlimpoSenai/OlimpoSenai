// Importar as dependências
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const connection = require('./db');  
const app = express();

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.use(express.json());

// Rota de Cadastro de Usuário
app.post('/inserir/usuario', (req, res) => {
  const { nome, email, cpf, senha } = req.body;

  if (!nome || !email || !cpf || !senha) {
    return res.status(400).send('Nome, email, CPF e senha são obrigatórios');
  }
  connection.query('SELECT * FROM usuario WHERE email = ? OR cpf = ?', [email, cpf], (err, results) => {
    if (err) {
      console.error('Erro ao verificar dados existentes:', err);
      return res.status(500).send('Erro ao verificar dados');
    }

    if (results.length > 0) {
      return res.status(400).send('E-mail ou CPF já cadastrados');
    }

    connection.query('INSERT INTO usuario (nome, email, cpf, senha) VALUES (?, ?, ?, ?)', 
      [nome, email, cpf, senha], 
      (err, results) => {
        if (err) {
          console.error('Erro na inserção:', err);
          return res.status(500).send('Erro ao inserir no banco de dados');
        }
        res.status(200).send('Usuário inserido com sucesso!');
      }
    );
  });
});

// Rota de Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send('E-mail e senha são obrigatórios');
  }

  connection.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return res.status(500).send('Erro ao verificar usuário');
    }

    if (results.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const user = results[0];
    if (user.senha !== senha) {
      return res.status(401).send('Senha incorreta');
    }

  
    const token = jwt.sign({ userId: user.id }, 'seu_segredo_aqui', { expiresIn: '1h' });

    res.status(200).send({
      message: 'Login bem-sucedido',
      token: token 
    });
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
