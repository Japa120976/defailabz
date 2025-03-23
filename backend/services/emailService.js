import { Resend } from 'resend';
import schedule from 'node-schedule';

const resend = new Resend(process.env.REACT_APP_RESEND_API_KEY);

// Data de envio dos códigos
const LAUNCH_DATE = new Date('2024-03-20T10:00:00');

export const sendConfirmationEmail = async (email, name) => {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
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
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};

export const scheduleAccessCodeEmail = (email, name, accessCode) => {
  schedule.scheduleJob(LAUNCH_DATE, async () => {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
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

export const sendWelcomeEmail = async (email, name) => {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Bem-vindo ao DeFaiLabz MVP',
      html: `
        <h1>Bem-vindo, ${name}!</h1>
        <p>É um prazer ter você conosco no DeFaiLabz MVP.</p>
        <p>Aqui você terá acesso a:</p>
        <ul>
          <li>Análises técnicas avançadas</li>
          <li>Indicadores customizados</li>
          <li>Carteira virtual para simulações</li>
          <li>Suporte da nossa equipe</li>
        </ul>
        <p>Comece a explorar agora mesmo!</p>
        <br>
        <p>Atenciosamente,<br>Equipe DeFaiLabz</p>
      `
    });
    return data;
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    throw error;
  }
};