const emailService = require('../services/emailService');

async function testEmail() {
  try {
    const result = await emailService.sendConfirmationEmail(
      'defailabz@gmail.com',
      'DeFai Teste'
    );
    console.log('Email enviado com sucesso:', result);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}

testEmail();