const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');
const nodemailer = require('nodemailer');
const app = express();
const bcrypt = require('bcrypt');
const port = 3001;

// Configuração do CORS para permitir requisições de múltiplas origens (caso necessário)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']  // Permite múltiplas origens
}));

app.use(express.json());

// Configuração do Nodemailer para envio de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou qualquer outro serviço de SMTP que você escolher
  auth: {
    user: 'pospos123asm@gmail.com', // e-mail da empresa
    pass: 'sbbx rhlm gmps xcsg'  // senha ou chave de app (se usar 2FA no Gmail)
  }
});

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

  // Verificar se é o administrador padrão
  if (email === 'admin@exemplo.com' && senha === 'admin123') {
    const token = jwt.sign({ userId: 1, tipo: 'admin' }, 'seu_segredo_aqui', { expiresIn: '1h' });
    return res.status(200).send({ message: 'Login bem-sucedido', token, tipo: 'admin' });
  }

  // Verificar se é um administrador real (no banco de dados)
  db.query('SELECT * FROM adm WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erro ao verificar administrador:', err);
      return res.status(500).send('Erro ao verificar administrador');
    }

    if (results.length > 0) {
      const admin = results[0];
      if (admin.senha !== senha) {
        return res.status(401).send('Senha incorreta');
      }

      const token = jwt.sign({ userId: admin.id, tipo: 'admin' }, 'seu_segredo_aqui', { expiresIn: '1h' });
      return res.status(200).send({ message: 'Login bem-sucedido', token, tipo: 'admin' });
    }

    // Verificar se é um funcionário
    db.query('SELECT * FROM funcionario WHERE email = ?', [email], (err, results) => {
      if (results.length > 0) {
        const funcionario = results[0];
        if (funcionario.senha !== senha) {
          return res.status(401).send('Senha incorreta');
        }

        const token = jwt.sign({ userId: funcionario.id, tipo: 'funcionario' }, 'seu_segredo_aqui', { expiresIn: '1h' });
        return res.status(200).send({ message: 'Login bem-sucedido', token, tipo: 'funcionario' });
      }

      // Verificar se é um usuário normal
      db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
        if (results.length === 0) {
          return res.status(404).send('Usuário não encontrado');
        }

        const user = results[0];
        if (user.senha !== senha) {
          return res.status(401).send('Senha incorreta');
        }

        const token = jwt.sign({ userId: user.id, tipo: 'usuario' }, 'seu_segredo_aqui', { expiresIn: '1h' });
        res.status(200).send({ message: 'Login bem-sucedido', token, tipo: 'usuario' });
      });
    });
  });
});



app.post('/esqueci-minha-senha', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('E-mail é obrigatório');
  }

  db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return res.status(500).send('Erro ao verificar usuário');
    }

    if (results.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const codigoRecuperacao = Math.floor(100000 + Math.random() * 900000).toString();

    // Enviar o e-mail com o código de recuperação e link
    const link = `http://localhost:5173/resetar-senha?email=${email}&codigo=${codigoRecuperacao}`;
    const mailOptions = {
      from: 'pospos123asm@gmail.com',
      to: email,
      subject: 'Código de Recuperação de Senha',
      text: `Seu código de recuperação de senha é: ${codigoRecuperacao}\n\nClique no link abaixo para redefinir sua senha:\n\n${link}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).send('Erro ao enviar e-mail');
      }

      console.log('E-mail enviado:', info.response);

      db.query('UPDATE usuario SET codigo_recuperacao = ? WHERE email = ?', [codigoRecuperacao, email], (err, results) => {
        if (err) {
          console.error('Erro ao salvar código de recuperação:', err);
          return res.status(500).send('Erro ao salvar código de recuperação');
        }

        res.status(200).send('Código de recuperação enviado');
      });
    });
  });
});


app.post('/resetar-senha', (req, res) => {
  const { email, codigoRecuperacao, novaSenha } = req.body;

  if (!email || !codigoRecuperacao || !novaSenha) {
    return res.status(400).send('E-mail, código de recuperação e nova senha são obrigatórios');
  }

  db.query('SELECT * FROM usuario WHERE email = ? AND codigo_recuperacao = ?', [email, codigoRecuperacao], (err, results) => {
    if (err) {
      console.error('Erro ao verificar código de recuperação:', err);
      return res.status(500).send('Erro ao verificar código de recuperação');
    }

    if (results.length === 0) {
      return res.status(400).send('Código de recuperação inválido');
    }

    db.query('UPDATE usuario SET senha = ?, codigo_recuperacao = NULL WHERE email = ?', [novaSenha, email], (err, results) => {
      if (err) {
        console.error('Erro ao resetar a senha:', err);
        return res.status(500).send('Erro ao resetar a senha');
      }

      res.status(200).send('Senha resetada com sucesso');
    });
  });
});




app.get('/treinos/:usuario_id', (req, res) => {
  const usuario_id = req.params.usuario_id;

  db.query('SELECT * FROM treinos WHERE usuario_id = ?', [usuario_id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar treinos:', err);
      return res.status(500).send('Erro ao buscar treinos');
    }

    res.status(200).json(results);
  });
});

//verificar tipo de usuario
const verificarTipoUsuario = (tiposPermitidos) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Pega o token do cabeçalho

    if (!token) {
      return res.status(401).send('Token de autenticação ausente');
    }

    jwt.verify(token, 'seu_segredo_aqui', (err, decoded) => {
      if (err) {
        return res.status(403).send('Token inválido');
      }

      if (!tiposPermitidos.includes(decoded.tipo)) {
        return res.status(403).send('Acesso negado');
      }

      req.userId = decoded.userId;  // Adiciona o userId à requisição
      next();
    });
  };
};



app.post('/inserir/funcionario', (req, res) => {
  const { nome, email, cpf, senha } = req.body;
  
  if (!nome || !email || !cpf || !senha) {
    return res.status(400).send('Nome, email, CPF e senha são obrigatórios');
  }

  db.query('SELECT * FROM funcionario WHERE email = ? OR cpf = ?', [email, cpf], (err, results) => {
    if (err) {
      console.error('Erro ao verificar dados existentes:', err);
      return res.status(500).send('Erro ao verificar dados');
    }

    if (results.length > 0) {
      return res.status(400).send('E-mail ou CPF já cadastrados');
    }

    db.query('INSERT INTO funcionario (nome, email, cpf, senha) VALUES (?, ?, ?, ?)', 
      [nome, email, cpf, senha], 
      (err, results) => {
        if (err) {
          console.error('Erro na inserção:', err);
          return res.status(500).send('Erro ao inserir no banco de dados');
        }
        res.status(200).send('Funcionario inserido com sucesso!');
      }
    );
  });
});

// Deletar usuário
app.delete('/deletar/usuario/:id', verificarTipoUsuario(['admin']), (req, res) => {
  const usuarioId = req.params.id;

  // Verificar se o usuário existe
  db.query('SELECT * FROM usuario WHERE id = ?', [usuarioId], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return res.status(500).send('Erro ao verificar usuário');
    }

    if (results.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    // Deletar o usuário
    db.query('DELETE FROM usuario WHERE id = ?', [usuarioId], (err, results) => {
      if (err) {
        console.error('Erro ao deletar usuário:', err);
        return res.status(500).send('Erro ao deletar usuário');
      }

      if (results.affectedRows === 0) {
        return res.status(404).send('Usuário não encontrado');
      }

      res.status(200).send('Usuário deletado com sucesso');
    });
  });
});




app.get('/usuario/:id', (req, res) => { 
  const userId = req.params.id; 
  const query = 'SELECT * FROM usuario WHERE id = ?';
  db.query(query, [userId], (err, results) => { 
    if (err) { 
      console.error('Erro ao buscar informações do usuário:', err); 
      res.status(500).send('Erro ao buscar informações do usuário'); 
    } else if 
    (results.length === 0) { 
      res.status(404).send('Usuário não encontrado'); 
    } else { res.json(results[0]); } }); });


    app.get('/listar/usuarios', verificarTipoUsuario(['admin']), (req, res) => {
      const query = 'SELECT id, nome, email, cpf FROM usuario';  // Seleciona apenas as colunas que você quer exibir
      db.query(query, (err, results) => {
        if (err) {
          console.error('Erro ao buscar usuários:', err);
          return res.status(500).send('Erro ao buscar usuários');
        }
        res.status(200).json(results);
      });
    });

    // Rota para listar todos os funcionários
app.get('/listar/funcionarios', verificarTipoUsuario(['admin']), (req, res) => {
  const query = 'SELECT id, nome, email, cpf FROM funcionario';  // Seleciona apenas as colunas que você quer exibir
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar funcionários:', err);
      return res.status(500).send('Erro ao buscar funcionários');
    }
    res.status(200).json(results);
  });
});

app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).send('Erro ao buscar usuários');
    }
    res.status(200).json(results);
  });
});

app.get('/funcionarios', (req, res) => {
  db.query('SELECT * FROM funcionario', (err, results) => {
    if (err) {
      console.error('Erro ao buscar funcionarios:', err);
      return res.status(500).send('Erro ao buscar funcionarios');
    }
    res.status(200).json(results);
  });
});

// Editar usuário
app.put('/editar/usuario/:id', verificarTipoUsuario(['admin', 'funcionario']), (req, res) => {
  const usuarioId = req.params.id;
  const { nome, email, cpf } = req.body;

  // Verificar se o usuário existe
  db.query('SELECT * FROM usuario WHERE id = ?', [usuarioId], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return res.status(500).send('Erro ao verificar usuário');
    }

    if (results.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    // Verificar se já existe outro usuário com o mesmo email ou CPF
    db.query('SELECT * FROM usuario WHERE (email = ? OR cpf = ?) AND id != ?', [email, cpf, usuarioId], (err, results) => {
      if (err) {
        console.error('Erro ao verificar email ou CPF:', err);
        return res.status(500).send('Erro ao verificar email ou CPF');
      }

      if (results.length > 0) {
        return res.status(400).send('Já existe um usuário com esse email ou CPF');
      }

      // Atualizar os dados do usuário
      const query = 'UPDATE usuario SET nome = ?, email = ?, cpf = ? WHERE id = ?';
      db.query(query, [nome, email, cpf, usuarioId], (err, results) => {
        if (err) {
          console.error('Erro ao editar usuário:', err);
          return res.status(500).send('Erro ao editar usuário');
        }

        res.status(200).send('Usuário editado com sucesso');
      });
    });
  });
});



// Deletar funcionário
app.delete('/deletar/funcionario/:id', verificarTipoUsuario(['admin']), (req, res) => {
  const funcionarioId = req.params.id;

  // Verificar se o funcionário existe
  db.query('SELECT * FROM funcionario WHERE id = ?', [funcionarioId], (err, results) => {
    if (err) {
      console.error('Erro ao verificar funcionário:', err);
      return res.status(500).send('Erro ao verificar funcionário');
    }

    if (results.length === 0) {
      return res.status(404).send('Funcionário não encontrado');
    }

    // Deletar o funcionário
    db.query('DELETE FROM funcionario WHERE id = ?', [funcionarioId], (err, results) => {
      if (err) {
        console.error('Erro ao deletar funcionário:', err);
        return res.status(500).send('Erro ao deletar funcionário');
      }

      if (results.affectedRows === 0) {
        return res.status(404).send('Funcionário não encontrado');
      }

      res.status(200).send('Funcionário deletado com sucesso');
    });
  });
});



// Rota para editar funcionário (Apenas admin)
app.put('/editar/funcionario/:id', verificarTipoUsuario(['admin']), (req, res) => {
  const funcionarioId = req.params.id;  // Aqui está a correção para pegar o id do parâmetro de URL
  const { nome, email, cpf } = req.body;

  console.log('Dados recebidos para atualização:', req.body);

  if (!nome && !email && !cpf) {
    return res.status(400).send('Pelo menos um campo deve ser fornecido para atualização');
  }

  db.query('SELECT * FROM funcionario WHERE (email = ? OR cpf = ?) AND id != ?', [email, cpf, funcionarioId], (err, results) => {
    if (err) {
      console.error('Erro ao verificar dados existentes:', err);
      return res.status(500).send('Erro ao verificar dados');
    }

    if (results.length > 0) {
      return res.status(400).send('E-mail ou CPF já cadastrados por outro funcionário');
    }

    let query = 'UPDATE funcionario SET ';
    const params = [];

    if (nome) {
      query += 'nome = ?, ';
      params.push(nome);
    }
    if (email) {
      query += 'email = ?, ';
      params.push(email);
    }
    if (cpf) {
      query += 'cpf = ?, ';
      params.push(cpf);
    }

    query = query.slice(0, -2); // Remove a última vírgula
    query += ' WHERE id = ?';
    params.push(funcionarioId);  // Aqui é onde o id do funcionário é inserido

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Erro ao atualizar funcionário:', err);
        return res.status(500).send('Erro ao atualizar funcionário');
      }

      if (results.affectedRows === 0) {
        return res.status(404).send('Funcionário não encontrado');
      }

      res.status(200).send('Funcionário atualizado com sucesso');
    });
  });
});



// Rota para buscar usuário pelo nome
app.get('/buscar/usuario', verificarTipoUsuario(['funcionario', 'admin']), (req, res) => {
  const termo = req.query.termo;

  if (!termo) {
    return res.status(400).send('O parâmetro "termo" é obrigatório');
  }

  const query = `
    SELECT id, nome, email, cpf 
    FROM usuario 
    WHERE nome LIKE ? OR cpf LIKE ? OR email LIKE ?
  `;
  const valores = [`%${termo}%`, `%${termo}%`, `%${termo}%`];

  db.query(query, valores, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).send('Erro ao buscar usuários');
    }

    res.status(200).json(results);
  });
});





app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
