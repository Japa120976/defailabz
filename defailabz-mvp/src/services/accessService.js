import api from './api';

// Serviço para gerenciar códigos e validações
export const accessService = {
    validCodes: ['TEST123', 'MVP2024', 'DEFI2024'],
  
    validateCode: async (code) => {
      try {
        const response = await api.post('/api/validate', { code });
        return response.data;
      } catch (error) {
        throw new Error('Código inválido');
      }
    },
  
    submitRegistration: async (data) => {
      try {
        // Validações locais
        if (!data.email.includes('@')) {
          throw new Error('Email inválido');
        }
        if (data.telegram && !data.telegram.startsWith('@')) {
          throw new Error('Username Telegram deve começar com @');
        }

        // Envia para o backend
        const response = await api.post('/api/register', data);
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.message);
        }
        throw error;
      }
    },

    sendWelcome: async (email, name) => {
      try {
        const response = await api.post('/api/welcome', { email, name });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao enviar email de boas-vindas');
      }
    }
};