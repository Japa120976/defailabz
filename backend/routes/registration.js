const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const crypto = require('crypto');
const { sendConfirmationEmail, scheduleAccessCodeEmail } = require('../services/emailService');

// Rota para criar novo registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, telegram } = req.body;

    // Verifica se já existe registro com esse email ou telegram
    const existingUser = await Registration.findOne({
      $or: [{ email }, { telegram }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email ou Telegram já cadastrado'
      });
    }

    // Gera código de acesso único
    const accessCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Cria novo registro
    const registration = new Registration({
      name,
      email,
      telegram,
      accessCode,
      isVerified: false
    });

    await registration.save();

    // Envia email de confirmação e agenda envio do código
    await sendConfirmationEmail(email, name);
    scheduleAccessCodeEmail(email, name, accessCode);

    res.status(201).json({
      message: 'Cadastro realizado com sucesso! Verifique seu email.'
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      error: 'Erro ao processar cadastro'
    });
  }
});

// Rota para validar código de acesso
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;

    // Busca registro com este código de acesso
    const registration = await Registration.findOne({ 
      accessCode: code.toUpperCase() 
    });

    if (!registration) {
      return res.status(400).json({
        error: 'Código de acesso inválido'
      });
    }

    // Atualiza status de verificação
    registration.isVerified = true;
    await registration.save();

    res.json({
      valid: true,
      user: {
        name: registration.name,
        email: registration.email,
        telegram: registration.telegram
      }
    });

  } catch (error) {
    console.error('Erro na validação:', error);
    res.status(500).json({
      error: 'Erro ao processar validação'
    });
  }
});

// Rota para verificar status do registro
router.get('/status/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const registration = await Registration.findOne({ 
      accessCode: code.toUpperCase() 
    });

    if (!registration) {
      return res.status(404).json({
        error: 'Registro não encontrado'
      });
    }

    res.json({
      isVerified: registration.isVerified,
      user: {
        name: registration.name,
        email: registration.email,
        telegram: registration.telegram
      }
    });

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      error: 'Erro ao verificar status do registro'
    });
  }
});

module.exports = router;