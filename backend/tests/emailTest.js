const emailService = require('../services/emailService');

async function testEmail() {
  console.log('Iniciando teste de envio de email...');
  
  try {
    console.log('Tentando enviar email para: sergiohirakauva@gmail.com');
    
    const result = await emailService.sendConfirmationEmail(
      'sergiohirakauva@gmail.com',
      'DeFai Teste'
    );
    
    console.log('Email enviado com sucesso!');
    console.log('Detalhes:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Erro ao enviar email:');
    console.error('- Mensagem:', error.message);
    
    if (error.originalError) {
      console.error('- Erro original:', error.originalError);
    }
    
    if (error.code) {
      console.error('- Código de erro:', error.code);
    }
    
    console.error('- Stack trace:', error.stack);
  }
}

// Executa o teste
console.log('=== TESTE DE EMAIL ===');
testEmail().then(() => {
  console.log('Teste concluído');
}).catch(err => {
  console.error('Erro não tratado:', err);
});