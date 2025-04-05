export const adminService = {
  // Credenciais removidas para segurança
  adminUsers: [],

  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Em ambiente de desenvolvimento, use:
        // username: 'admin_test'
        // password: 'test123'
        if (credentials.username === 'admin_test' && credentials.password === 'test123') {
          resolve({ 
            success: true, 
            token: 'test_token_' + Date.now() 
          });
        } else {
          reject(new Error('Credenciais inválidas'));
        }
      }, 1000);
    });
  },

  validateToken: () => {
    const token = localStorage.getItem('admin_token');
    return !!token;
  }
};