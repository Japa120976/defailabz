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
    },
    
    validateProject: (url) => {
      console.log('Validando projeto no accessService:', url);
      return {
        valid: true,
        message: 'Projeto válido para análise'
      };
    },
    
    extractProjectInfo: (url) => {
      let tipo = 'desconhecido';
      let id = url;
      
      if (url.includes('github.com')) {
        tipo = 'github';
        const partes = url.split('github.com/');
        if (partes.length > 1) {
          id = partes[1];
        }
      } else if (url.startsWith('0x') && url.length === 42) {
        tipo = 'contrato';
      } else if (url.startsWith('@') || url.includes('t.me/')) {
        tipo = 'telegram';
        id = url.replace('@', '');
        if (url.includes('t.me/')) {
          const partes = url.split('t.me/');
          if (partes.length > 1) {
            id = partes[1];
          }
        }
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        tipo = 'twitter';
        const regex = /(?:twitter\.com|x\.com)\/([^\/\?]+)/;
        const match = url.match(regex);
        if (match && match[1]) {
          id = match[1];
        }
      }
      
      return {
        tipo: tipo,
        id: id,
        url: url,
        technicalAnalysis: {
          codeQuality: 5,
          smartContractSecurity: 5,
          decentralization: 5,
          technicalFindings: []
        }
      };
    }
};

// Exportando o objeto accessService como exportação padrão
export default accessService;