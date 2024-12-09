const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');
const nodemailer = require('nodemailer');
const app = express();
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
const ADM_NAME = 'admin234'
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




// Inicializar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
