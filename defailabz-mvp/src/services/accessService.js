// Serviço para gerenciar códigos e validações
export const accessService = {
  validateCode: async (code) => {
    try {
      const response = await fetch('http://localhost:5000/api/registration/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Código inválido');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Código inválido');
    }
  },

  submitRegistration: async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/registration/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao processar cadastro');
      }

      const result = await response.json();
      
      // Save access token
      if (result.accessCode) {
        localStorage.setItem('mvp_access_token', result.accessCode);
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  checkAccess: () => {
    const token = localStorage.getItem('mvp_access_token');
    return !!token;
  },

  logout: () => {
    localStorage.removeItem('mvp_access_token');
  }
};