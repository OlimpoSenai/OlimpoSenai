const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const db = require('./db');  // Usando uma única conexão com o banco de dados
const app = express();
const port = 3001;

// Configuração do CORS para permitir requisições de múltiplas origens (caso necessário)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']  // Permite múltiplas origens
}));

app.use(express.json());

// Senha específica para o administrador
const ADM_PASSWORD = 'admin123';  // Defina aqui a senha que o administrador precisa fornecer

// ---------------------------- ROTAS DE USUÁRIO ----------------------------

// Cadastrar Usuário
app.post('/inserir/usuario', (req, res) => {
  const { nome, email, cpf, senha } = req.body;
  
  if (!nome || !email || !cpf || !senha) {
    return res.status(400).send('Nome, email, CPF e senha são obrigatórios');
  }

  db.query('SELECT * FROM usuario WHERE email = ? OR cpf = ?', [email, cpf], (err, results) => {
    if (err) {
      console.error('Erro ao verificar dados existentes:', err);
      return res.status(500).send('Erro ao verificar dados');
    }

    if (results.length > 0) {
      return res.status(400).send('E-mail ou CPF já cadastrados');
    }

    db.query('INSERT INTO usuario (nome, email, cpf, senha) VALUES (?, ?, ?, ?)', 
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

// Login de Usuário
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send('E-mail e senha são obrigatórios');
  }

  db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
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

// ---------------------------- ROTAS DE FUNCIONÁRIO ----------------------------

// Cadastrar Funcionário
app.post('/inserir/funcionario', (req, res) => {
  const { nome, email, cpf, senha } = req.body;
  
  if (!nome || !email || !cpf || !senha) {
    return res.status(400).send('Nome, email, CPF e senha são obrigatórios');
  }

  db.query('INSERT INTO funcionario (nome, email, cpf, senha) VALUES (?, ?, ?, ?)', 
    [nome, email, cpf, senha], 
    (err, results) => {
      if (err) {
        console.error('Erro na inserção:', err);
        return res.status(500).send('Erro ao inserir no banco de dados');
      }
      res.status(200).send(`Funcionário inserido com sucesso!\nNome: ${nome}\nEmail: ${email}\nCPF: ${cpf}`);
    }
  );
});

// Atualizar Funcionário
app.put('/atualizar/funcionario/:id', (req, res) => {
  const { nome, email, cpf, senha } = req.body;
  const { id } = req.params;

  if (!nome || !email || !cpf || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.query('UPDATE funcionario SET nome = ?, email = ?, cpf = ?, senha = ? WHERE id = ?',
    [nome, email, cpf, senha, id], 
    (err, results) => {
      if (err) {
        console.error('Erro ao atualizar o funcionário:', err);
        return res.status(500).json({ error: 'Erro ao atualizar' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      res.send(`Funcionário atualizado com sucesso!`);
    }
  );
});

// Deletar Funcionário
app.delete('/deletar/funcionario/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM funcionario WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar funcionário:', err);
      return res.status(500).json({ error: 'Erro ao deletar' });
    }
    res.json(results);
  });
});

// Puxar Funcionário
app.get('/puxar/funcionario/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM funcionario WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao puxar dados:', err);
      return res.status(500).json({ error: 'Erro ao puxar' });
    }
    res.json(results);
  });
});

// ---------------------------- ROTAS DE ADMIN ----------------------------

// Cadastrar Admin (Somente com senha específica)
app.post('/inserir/adm', (req, res) => {
  const { nome, email, cpf, senhaAdm } = req.body;

  if (!nome || !email || !cpf || !senhaAdm) {
    return res.status(400).send('Nome, email, CPF e senhaAdm são obrigatórios');
  }

  // Verificar se a senha do admin está correta
  if (senhaAdm !== ADM_PASSWORD) {
    return res.status(403).send('Senha de administrador incorreta');
  }

  const senha = 'Xperito';  // A senha padrão do admin

  db.query('INSERT INTO adm (nome, email, cpf, senha) VALUES (?, ?, ?, ?)', 
    [nome, email, cpf, senha], 
    (err, results) => {
      if (err) {
        console.error('Erro na inserção do administrador:', err);
        return res.status(500).send('Erro ao inserir no banco de dados');
      }
      res.status(200).send(`Administrador inserido com sucesso!\nNome: ${nome}\nEmail: ${email}\nCPF: ${cpf}`);
    }
  );
});

// Atualizar Admin
app.put('/atualizar/adm/:id', (req, res) => {
  const { nome, email, cpf, senhaAdm } = req.body;
  const { id } = req.params;

  if (!nome || !email || !cpf || !senhaAdm) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  // Verificar se a senha do admin está correta
  if (senhaAdm !== ADM_PASSWORD) {
    return res.status(403).send('Senha de administrador incorreta');
  }

  db.query('UPDATE adm SET nome = ?, email = ?, cpf = ? WHERE id = ?', 
    [nome, email, cpf, id], 
    (err, results) => {
      if (err) {
        console.error('Erro ao atualizar o administrador:', err);
        return res.status(500).json({ error: 'Erro ao atualizar' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Administrador não encontrado' });
      }

      res.send(`Administrador atualizado com sucesso!`);
    }
  );
});

// Deletar Admin
app.delete('/deletar/adm/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM adm WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar administrador:', err);
      return res.status(500).json({ error: 'Erro ao deletar' });
    }
    res.json(results);
  });
});

// Puxar Admin
app.get('/puxar/adm/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM adm WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao puxar dados do administrador:', err);
      return res.status(500).json({ error: 'Erro ao puxar' });
    }
    res.json(results);
  });
});

// ---------------------------- INICIAR O SERVIDOR ----------------------------
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});





