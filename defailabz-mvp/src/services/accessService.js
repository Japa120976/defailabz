// Serviço para gerenciar códigos e validações
export const accessService = {
    validCodes: ['TEST123', 'MVP2024', 'DEFI2024'],
  
    validateCode: async (code) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (accessService.validCodes.includes(code)) {
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