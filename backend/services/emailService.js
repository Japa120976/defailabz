require('dotenv').config();
const { Resend } = require('resend');
const schedule = require('node-schedule');

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY não encontrada no arquivo .env');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Data de envio dos códigos
const LAUNCH_DATE = new Date('2024-03-20T10:00:00');

const sendConfirmationEmail = async (email, name) => {
  try {
    const data = await resend.emails.send({
      from: 'noreply@defailabz.tech',
      to: email,
      subject: 'Cadastro Recebido - DeFaiLabz MVP',
      html: `
        <h1>Olá ${name}!</h1>
        <p>Recebemos seu cadastro para o DeFaiLabz MVP.</p>
        <p>Seu código de acesso será enviado automaticamente no dia ${LAUNCH_DATE.toLocaleDateString()} às ${LAUNCH_DATE.toLocaleTimeString()}.</p>
        <p>Fique atento à sua caixa de entrada!</p>
        <br>
        <p>Atenciosamente,<br>Equipe DeFaiLabz</p>
      `
    });
    return data;
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    throw error;
  }
};

const scheduleAccessCodeEmail = (email, name, accessCode) => {
  schedule.scheduleJob(LAUNCH_DATE, async () => {
    try {
      await resend.emails.send({
        from: 'noreply@defailabz.tech',
        to: email,
        subject: 'Seu Código de Acesso - DeFaiLabz MVP',
        html: `
          <h1>Olá ${name}!</h1>
          <p>O momento chegou!</p>
          <p>Seu código de acesso para o DeFaiLabz MVP é:</p>
          <h2 style="color: #4CAF50; font-size: 24px; padding: 10px; background: #f0f0f0; text-align: center;">${accessCode}</h2>
          <p>Use este código para acessar a plataforma.</p>
          <br>
          <p>Atenciosamente,<br>Equipe DeFaiLabz</p>
        `
      });
      console.log(`Código enviado com sucesso para ${email}`);
    } catch (error) {
      console.error(`Erro ao enviar código para ${email}:`, error);
    }
  });
};

module.exports = { sendConfirmationEmail, scheduleAccessCodeEmail };