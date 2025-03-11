export const accessService = {
  validCodes: ['TEST123', 'MVP2024', 'DEFI2024'],

  validateCode: async (code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Código recebido:', code);
        console.log('Códigos válidos:', accessService.validCodes);
        
        // Normaliza o código removendo espaços e convertendo para maiúsculo
        const normalizedCode = code.trim().toUpperCase();
        const isValid = accessService.validCodes.some(
          validCode => validCode.toUpperCase() === normalizedCode
        );
        
        console.log('Código normalizado:', normalizedCode);
        console.log('É válido?', isValid);

        if (isValid) {
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