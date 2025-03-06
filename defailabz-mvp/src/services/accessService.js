// Serviço para gerenciar códigos e validações
export const accessService = {
  validCodes: [], // Códigos movidos para variáveis de ambiente

  validateCode: async (code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulação de validação
        if (code === 'YOUR_CODE_HERE') { // Placeholder para teste
          resolve({ valid: true });
        } else {
          reject(new Error('Código inválido'));
        }
      }, 1000);
    });
  },

  submitRegistration: async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulando validações
        if (!data.email.includes('@')) {
          reject(new Error('Email inválido'));
          return;
        }
        if (data.telegram && !data.telegram.startsWith('@')) {
          reject(new Error('Username Telegram deve começar com @'));
          return;
        }
        resolve({ success: true });
      }, 1500);
    });
  }
};