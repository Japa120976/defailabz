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

      const result = await response.json();
      if (result.valid) {
        localStorage.setItem('mvp_access_token', code);
        localStorage.setItem('mvp_user_data', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      throw new Error('Erro ao validar código');
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

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  checkAccess: () => {
    const token = localStorage.getItem('mvp_access_token');
    return !!token;
  },

  getUserData: () => {
    const userData = localStorage.getItem('mvp_user_data');
    return userData ? JSON.parse(userData) : null;
  },

  logout: () => {
    localStorage.removeItem('mvp_access_token');
    localStorage.removeItem('mvp_user_data');
  }
};