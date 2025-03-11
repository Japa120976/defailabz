const { sendConfirmationEmail, scheduleAccessCodeEmail } = require('./services/emailService');

async function testEmails() {
  try {
    // Teste do email de confirmação
    await sendConfirmationEmail(
      'defailabz@gmail.com',
      'Usuário Teste'
    );
    console.log('Email de confirmação enviado com sucesso!');

    // Teste do email com código (agendado)
    scheduleAccessCodeEmail(
      'defailabz@gmail.com',
      'Usuário Teste',
      'TEST123'
    );
    console.log('Email com código agendado com sucesso!');
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testEmails();