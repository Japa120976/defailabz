import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Verifica se a variável de ambiente está definida
console.log('Verificando configuração de email:');
console.log('- Senha definida:', !!process.env.TITAN_EMAIL_PASSWORD);
console.log('- Usuário de email:', 'support@defailabz.tech');

// Configuração do transporte SMTP para o Titan Email
const transporter = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 465,
  secure: true,
  auth: {
    user: 'support@defailabz.tech',
    // Tente remover espaços extras ou caracteres especiais da senha
    pass: process.env.TITAN_EMAIL_PASSWORD ? process.env.TITAN_EMAIL_PASSWORD.trim() : ''
  },
  debug: true,
  logger: true
});

// Verifica a conexão com o servidor SMTP ao iniciar
transporter.verify(function(error, success) {
  if (error) {
    console.error('Erro na verificação do servidor SMTP:', error);
    
    // Sugestões para resolver o problema
    if (error.code === 'EAUTH') {
      console.error('SUGESTÕES PARA RESOLVER O PROBLEMA DE AUTENTICAÇÃO:');
      console.error('1. Verifique se a senha no arquivo .env está correta');
      console.error('2. Verifique se não há espaços extras na senha');
      console.error('3. Tente fazer login manualmente no webmail para confirmar que a conta está ativa');
      console.error('4. Verifique se o Titan permite acesso via SMTP para sua conta');
    }
  } else {
    console.log('Servidor SMTP está pronto para enviar mensagens');
  }
});

// Data de envio dos códigos
const LAUNCH_DATE = new Date('2024-04-20T10:00:00');

// Resto do código permanece o mesmo...

export const sendConfirmationEmail = async (email, name) => {
  console.log(`Tentando enviar email de confirmação para: ${email}`);
  
  try {
    const info = await transporter.sendMail({
      from: '"DeFaiLabz" <support@defailabz.tech>',
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
    
    console.log('Email de confirmação enviado com sucesso:');
    console.log('- ID da mensagem:', info.messageId);
    console.log('- Resposta do servidor:', info.response);
    
    return {
      success: true,
      messageId: info.messageId,
      info: info
    };
  } catch (error) {
    console.error('Erro detalhado ao enviar email de confirmação:');
    console.error('- Mensagem:', error.message);
    console.error('- Código:', error.code);
    console.error('- Comando:', error.command);
    console.error('- Erro completo:', error);
    
    throw {
      message: 'Falha ao enviar email de confirmação',
      originalError: error.message,
      code: error.code
    };
  }
};

export const scheduleAccessCodeEmail = (email, name, accessCode) => {
  console.log(`Agendando email com código de acesso para: ${email}`);
  
  const job = schedule.scheduleJob(LAUNCH_DATE, async () => {
    console.log(`Executando envio agendado para: ${email}`);
    
    try {
      const info = await transporter.sendMail({
        from: '"DeFaiLabz" <support@defailabz.tech>',
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
      console.log('- ID da mensagem:', info.messageId);
    } catch (error) {
      console.error(`Erro ao enviar código para ${email}:`, error);
    }
  });
  
  return {
    success: true,
    scheduled: true,
    date: LAUNCH_DATE,
    email: email
  };
};

export const sendWelcomeEmail = async (email, name) => {
  console.log(`Tentando enviar email de boas-vindas para: ${email}`);
  
  try {
    const info = await transporter.sendMail({
      from: '"DeFaiLabz" <support@defailabz.tech>',
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
    
    console.log('Email de boas-vindas enviado com sucesso:');
    console.log('- ID da mensagem:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      info: info
    };
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    throw error;
  }
};

// Função para testar a configuração de email
export const testEmailConfig = async (testEmail) => {
  console.log(`Testando configuração de email com: ${testEmail}`);
  
  try {
    const info = await transporter.sendMail({
      from: '"DeFaiLabz Test" <support@defailabz.tech>',
      to: testEmail,
      subject: 'Teste de Configuração de Email',
      html: `
        <h1>Teste de Email</h1>
        <p>Este é um email de teste para verificar a configuração do servidor SMTP.</p>
        <p>Se você está vendo esta mensagem, a configuração está funcionando corretamente!</p>
        <p>Data e hora do teste: ${new Date().toLocaleString()}</p>
      `
    });
    
    console.log('Email de teste enviado com sucesso:');
    console.log('- ID da mensagem:', info.messageId);
    
    return {
      success: true,
      message: 'Email de teste enviado com sucesso',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Erro no teste de email:', error);
    
    return {
      success: false,
      message: `Falha no teste: ${error.message}`,
      error: error
    };
  }
};