require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

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
    
    // Enviar email de confirmação
    console.log('Tentando enviar email para:', email);
    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
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
    console.log('Resposta do envio de email:', emailResponse);

    res.json({ success: true });
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ message: error.message });
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