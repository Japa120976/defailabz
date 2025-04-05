require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('./models/User');

const app = express();

// Configuração do transporte SMTP para o Titan Email
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465,
  secure: true,
  auth: {
    user: 'support@defailabz.tech',
    pass: process.env.TITAN_EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verificar conexão com o servidor SMTP
transporter.verify(function(error, success) {
  if (error) {
    console.error('Erro na verificação do servidor SMTP:', error);
  } else {
    console.log('Servidor SMTP está pronto para enviar mensagens');
  }
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
});

app.use(cors());
app.use(express.json());

// Rota de health check
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok' });
});

// Rota de validação de código
app.post('/api/validate', (req, res) => {
  console.log('Validação solicitada:', req.body);
  const { code } = req.body;
  const validCodes = ['TEST123', 'MVP2024', 'DEFI2024'];
  
  if (validCodes.includes(code)) {
    res.json({ valid: true });
  } else {
    res.status(400).json({ message: 'Código inválido' });
  }
});

// Rota de registro
app.post('/api/register', async (req, res) => {
  console.log('Registro solicitado:', req.body);
  try {
    const { email, name, telegram } = req.body;
    
    // Salvar no banco de dados
    const user = new User({ email, name, telegram });
    await user.save();
    console.log('Usuário salvo no banco:', user);
    
    // Enviar email de confirmação usando Titan Email
    console.log('Tentando enviar email para:', email);
    try {
      const info = await transporter.sendMail({
        from: '"DeFaiLabz" <support@defailabz.tech>',
        to: email,
        subject: 'Cadastro Recebido - DeFaiLabz MVP',
        html: `
          <h1>Olá ${name}!</h1>
          <p>Recebemos seu cadastro para o DeFaiLabz MVP.</p>
          <p>Em breve você receberá mais informações.</p>
          <br>
          <p>Atenciosamente,<br>Equipe DeFaiLabz</p>
        `
      });
      console.log('Email enviado com sucesso:', info.messageId);
      res.json({ success: true, emailSent: true });
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Mesmo com erro no email, consideramos o cadastro como sucesso
      res.json({ 
        success: true, 
        emailSent: false, 
        emailError: emailError.message 
      });
    }
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rota para testar o envio de email
app.post('/api/test-email', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email é obrigatório' 
      });
    }
    
    const info = await transporter.sendMail({
      from: '"DeFaiLabz Test" <support@defailabz.tech>',
      to: email,
      subject: 'Teste de Configuração de Email',
      html: `
        <h1>Teste de Email</h1>
        <p>Este é um email de teste para verificar a configuração do servidor SMTP.</p>
        <p>Se você está vendo esta mensagem, a configuração está funcionando corretamente!</p>
        <p>Data e hora do teste: ${new Date().toLocaleString()}</p>
      `
    });
    
    console.log('Email de teste enviado com sucesso:', info.messageId);
    
    res.json({
      success: true,
      message: 'Email de teste enviado com sucesso',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Erro no teste de email:', error);
    res.status(500).json({ 
      success: false, 
      message: `Falha no teste: ${error.message}` 
    });
  }
});

// Rota para listar usuários
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});